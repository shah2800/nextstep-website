import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/leads?type=guidance|bookings|newsletter|all
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "all";

    const [guidance, bookings, newsletter] = await Promise.all([
      db.guidanceRequest.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
      db.bookingSession.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
      db.newsletter.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    ]);

    if (type === "guidance") {
      return NextResponse.json({ leads: guidance, count: guidance.length });
    }
    if (type === "bookings") {
      return NextResponse.json({ leads: bookings, count: bookings.length });
    }
    if (type === "newsletter") {
      return NextResponse.json({ leads: newsletter, count: newsletter.length });
    }

    return NextResponse.json({
      guidance,
      bookings,
      newsletter,
      counts: {
        guidance: guidance.length,
        bookings: bookings.length,
        newsletter: newsletter.length,
        newGuidance: guidance.filter((g) => g.status === "new").length,
        pendingBookings: bookings.filter((b) => b.status === "pending").length,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/leads error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

// PUT /api/admin/leads — update lead status
// Body: { model: "guidance"|"bookings", id, status }
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { model, id, status } = body as {
      model: "guidance" | "bookings";
      id: string;
      status: string;
    };
    if (!model || !id || !status) {
      return NextResponse.json({ error: "model, id, status required" }, { status: 400 });
    }
    if (model === "guidance") {
      const updated = await db.guidanceRequest.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json({ success: true, lead: updated });
    }
    if (model === "bookings") {
      const updated = await db.bookingSession.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json({ success: true, lead: updated });
    }
    return NextResponse.json({ error: "Invalid model" }, { status: 400 });
  } catch (error) {
    console.error("PUT /api/admin/leads error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

// DELETE /api/admin/leads?id=<id>&model=<guidance|bookings|newsletter>
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const model = searchParams.get("model");
    if (!id || !model) {
      return NextResponse.json({ error: "id and model required" }, { status: 400 });
    }
    if (model === "guidance") {
      await db.guidanceRequest.delete({ where: { id } });
    } else if (model === "bookings") {
      await db.bookingSession.delete({ where: { id } });
    } else if (model === "newsletter") {
      await db.newsletter.delete({ where: { id } });
    } else {
      return NextResponse.json({ error: "Invalid model" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/leads error:", error);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
