import { NextRequest, NextResponse } from "next/server";
import { backendPostJson, WEBSITE_FORM_SECRET } from "@/lib/backend";

// POST /api/apply — forward the application to the existing CRM backend.
// The old backend creates the lead, generates the register ID, fires the
// email + document automation, and feeds the WhatsApp AI bot. We inject the
// form token server-side so it is never exposed to the browser.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown> | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const res = await backendPostJson("/public/website/apply-json", {
      ...body,
      _formToken: WEBSITE_FORM_SECRET,
    });

    // Relay the old backend's JSON + status verbatim (it returns registrationId).
    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text || "Unexpected response from server" };
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("POST /api/apply proxy error:", error);
    return NextResponse.json(
      {
        error:
          "Could not submit right now. Please try again in a moment, or WhatsApp +92 314 2638901.",
      },
      { status: 502 }
    );
  }
}
