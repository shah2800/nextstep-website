import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Valid email required"),
});

// POST /api/newsletter - subscribe to newsletter
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid email" },
        { status: 400 }
      );
    }

    // Check existing to avoid duplicate errors
    const existing = await db.newsletter.findUnique({
      where: { email: parsed.data.email },
    });

    if (existing) {
      return NextResponse.json(
        { success: true, message: "You're already subscribed!" },
        { status: 200 }
      );
    }

    await db.newsletter.create({ data: parsed.data });

    return NextResponse.json(
      { success: true, message: "Subscribed successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
