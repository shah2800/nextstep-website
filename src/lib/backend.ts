// Hybrid bridge to the existing (old) CRM backend on Render.
// The old Express+MongoDB server is the "brain": it owns leads/applications,
// register-ID tracking, the WhatsApp AI bot, email + document automation.
// The new Next.js site proxies apply + track through here so those flows keep
// working — and the form token stays server-side (never exposed to the browser).

export const OLD_API_BASE = (
  process.env.OLD_API_BASE || "https://ai-consultancy-2dk0.onrender.com"
).replace(/\/+$/, "");

// Must match WEBSITE_FORM_SECRET in the old backend's Render environment.
export const WEBSITE_FORM_SECRET =
  process.env.WEBSITE_FORM_SECRET || "NSI-WEB-FORM-SECURE-KEY-7k3m9p2qx";

/**
 * Fetch with a timeout. The old backend runs on Render's free tier and can take
 * ~60s to wake from sleep, so callers use generous timeouts + a retry.
 */
async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** POST JSON to an old-backend path, retrying to absorb Render cold starts. */
export async function backendPostJson(
  path: string,
  body: unknown,
  { retries = 2, timeoutMs = 90000 } = {}
): Promise<Response> {
  const url = OLD_API_BASE + path;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(
        url,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        timeoutMs
      );
      // Retry only on gateway/cold-start style failures.
      if (res.status >= 502 && res.status <= 504 && attempt < retries) {
        await new Promise((r) => setTimeout(r, (attempt + 1) * 3000));
        continue;
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, (attempt + 1) * 3000));
        continue;
      }
    }
  }
  throw lastErr ?? new Error("Backend request failed");
}

/** GET an old-backend path with a timeout + retry. */
export async function backendGet(
  path: string,
  { retries = 2, timeoutMs = 90000 } = {}
): Promise<Response> {
  const url = OLD_API_BASE + path;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, { method: "GET" }, timeoutMs);
      if (res.status >= 502 && res.status <= 504 && attempt < retries) {
        await new Promise((r) => setTimeout(r, (attempt + 1) * 3000));
        continue;
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, (attempt + 1) * 3000));
        continue;
      }
    }
  }
  throw lastErr ?? new Error("Backend request failed");
}
