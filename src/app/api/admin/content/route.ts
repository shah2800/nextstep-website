import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { defaultContent } from "@/lib/content";

const JSON_KEYS = ["stats", "services", "compareFactors"];

// GET /api/admin/content — return all content (defaults merged with DB)
export async function GET() {
  try {
    const rows = await db.siteContent.findMany();
    const stored: Record<string, unknown> = {};
    for (const row of rows) {
      if (JSON_KEYS.includes(row.key)) {
        try {
          stored[row.key] = JSON.parse(row.value);
        } catch {
          stored[row.key] = row.value;
        }
      } else {
        stored[row.key] = row.value;
      }
    }
    return NextResponse.json({ content: { ...defaultContent, ...stored } });
  } catch (error) {
    console.error("GET /api/admin/content error:", error);
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }
}

// PUT /api/admin/content — update a single content key
// Body: { key: string, value: string | object }
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, value } = body as { key: string; value: unknown };
    if (!key) {
      return NextResponse.json({ error: "key is required" }, { status: 400 });
    }

    const stored =
      typeof value === "string" ? value : JSON.stringify(value);

    await db.siteContent.upsert({
      where: { key },
      create: { key, value: stored },
      update: { value: stored },
    });

    revalidatePath("/");

    return NextResponse.json({ success: true, key });
  } catch (error) {
    console.error("PUT /api/admin/content error:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}

// POST /api/admin/content/reset — reset a single key to default
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key } = body as { key: string };
    if (!key) {
      return NextResponse.json({ error: "key is required" }, { status: 400 });
    }
    await db.siteContent.delete({ where: { key } }).catch(() => {});
    
    revalidatePath("/");
    
    return NextResponse.json({ success: true, key, reset: true });
  } catch (error) {
    console.error("POST /api/admin/content error:", error);
    return NextResponse.json({ error: "Failed to reset content" }, { status: 500 });
  }
}
