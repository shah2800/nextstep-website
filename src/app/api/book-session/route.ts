import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(6, "Phone number required"),
  preferredDate: z.string().min(1, "Preferred date required"),
  preferredTime: z.string().min(1, "Preferred time required"),
  mode: z.enum(["online", "in-person"], {
    message: "Mode must be online or in-person",
  }),
  service: z.string().min(1, "Service required"),
  message: z.string().optional().default(""),
});

// POST /api/book-session - book a counseling session
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

    const record = await db.bookingSession.create({
      data: parsed.data,
    });

    return NextResponse.json(
      { success: true, id: record.id, message: "Session booking received" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/book-session error:", error);
    return NextResponse.json(
      { error: "Failed to book session" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const bookings = await db.bookingSession.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ bookings, count: bookings.length });
  } catch (error) {
    console.error("GET /api/book-session error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
