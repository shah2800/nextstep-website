import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(6, "Phone number required"),
  qualification: z.string().min(1, "Required"),
  graduationYear: z.string().min(1, "Required"),
  preferredCourse: z.string().min(1, "Required"),
  budget: z.string().min(1, "Required"),
  englishTest: z.string().min(1, "Required"),
  preferredCountries: z.string().optional().default(""),
  message: z.string().optional().default(""),
});

// POST /api/guidance - submit destination guidance request
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

    const record = await db.guidanceRequest.create({
      data: parsed.data,
    });

    return NextResponse.json(
      { success: true, id: record.id, message: "Guidance request received" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/guidance error:", error);
    return NextResponse.json(
      { error: "Failed to submit guidance request" },
      { status: 500 }
    );
  }
}

// GET /api/guidance - list requests (admin view)
export async function GET() {
  try {
    const requests = await db.guidanceRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ requests, count: requests.length });
  } catch (error) {
    console.error("GET /api/guidance error:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
