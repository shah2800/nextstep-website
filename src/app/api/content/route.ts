import { NextResponse } from "next/server";
import { loadContent } from "@/lib/content";

// GET /api/content — public site content (merged defaults + DB overrides)
export async function GET() {
  try {
    const content = await loadContent();
    return NextResponse.json({ content });
  } catch (error) {
    console.error("GET /api/content error:", error);
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }
}
