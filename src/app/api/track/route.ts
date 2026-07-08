import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/backend";

// GET /api/track?registrationId=NSI-2026-001
// Proxies to the existing CRM backend, which owns the register-ID + milestone
// data. The old backend returns the exact shape the track page renders, so we
// relay it verbatim.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const registrationId = (searchParams.get("registrationId") || "").trim().toUpperCase();

  if (!registrationId) {
    return NextResponse.json(
      { error: "Please enter your Register ID (e.g. NSI-2026-001)." },
      { status: 400 }
    );
  }

  try {
    const res = await backendGet(
      `/public/website/track?registrationId=${encodeURIComponent(registrationId)}`
    );
    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text || "Unexpected response from server" };
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("GET /api/track proxy error:", error);
    return NextResponse.json(
      { error: "Could not reach the server. Please try again in a moment." },
      { status: 502 }
    );
  }
}
