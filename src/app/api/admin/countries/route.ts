import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  flagEmoji: z.string().min(1),
  tagline: z.string().min(1),
  shortDesc: z.string().min(1),
  longDesc: z.string().min(1),
  capital: z.string().min(1),
  currency: z.string().min(1),
  language: z.string().min(1),
  tuitionRange: z.string().min(1),
  livingCost: z.string().min(1),
  visaProcess: z.string().min(1),
  topUniversities: z.string().min(1),
  popularCourses: z.string().min(1),
  intakeMonths: z.string().min(1),
  scholarships: z.string().min(1),
  workRights: z.string().min(1),
  gradient: z.string().default("from-[#1e3a8a] via-[#2563eb] to-[#3b82f6]"),
  accentColor: z.string().default("#1e3a8a"),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

// GET /api/admin/countries — list all countries (admin view)
export async function GET() {
  try {
    const countries = await db.country.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ countries });
  } catch (error) {
    console.error("GET /api/admin/countries error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST /api/admin/countries — create a new country
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    const country = await db.country.create({ data: parsed.data });
    return NextResponse.json({ success: true, country }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/countries error:", error);
    return NextResponse.json(
      { error: "Failed to create country" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/countries — update a country (expects id in body)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body as { id: string } & Record<string, unknown>;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const country = await db.country.update({
      where: { id },
      data: data as never,
    });
    return NextResponse.json({ success: true, country });
  } catch (error) {
    console.error("PUT /api/admin/countries error:", error);
    return NextResponse.json(
      { error: "Failed to update country" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/countries — delete a country (expects id in query or body)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      const body = await req.json().catch(() => ({}));
      const bid = (body as { id?: string }).id;
      if (!bid) {
        return NextResponse.json({ error: "id is required" }, { status: 400 });
      }
      await db.country.delete({ where: { id: bid } });
      return NextResponse.json({ success: true });
    }
    await db.country.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/countries error:", error);
    return NextResponse.json(
      { error: "Failed to delete country" },
      { status: 500 }
    );
  }
}
