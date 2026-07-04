import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  sessionId: z.string().min(1),
  event: z.enum(["visit", "click", "section"]),
  // for visit
  referrer: z.string().optional().default(""),
  userAgent: z.string().optional().default(""),
  // for click
  elementType: z.string().optional().default(""),
  elementLabel: z.string().optional().default(""),
  section: z.string().optional().default(""),
  // for section
  sectionId: z.string().optional().default(""),
  durationMs: z.number().int().nonnegative().optional().default(0),
});

// POST /api/track — receive analytics events (visit, click, section view)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    const { sessionId, event } = parsed.data;

    if (event === "visit") {
      // Upsert visit — increment pageViews if session already exists
      await db.visit.upsert({
        where: { sessionId },
        create: {
          sessionId,
          referrer: parsed.data.referrer,
          userAgent: parsed.data.userAgent,
          pageViews: 1,
        },
        update: {
          lastSeen: new Date(),
          pageViews: { increment: 1 },
        },
      });
    } else if (event === "click") {
      await db.clickEvent.create({
        data: {
          sessionId,
          elementType: parsed.data.elementType,
          elementLabel: parsed.data.elementLabel,
          section: parsed.data.section,
        },
      });
    } else if (event === "section") {
      await db.sectionView.create({
        data: {
          sessionId,
          sectionId: parsed.data.sectionId,
          durationMs: parsed.data.durationMs,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/track error:", error);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
