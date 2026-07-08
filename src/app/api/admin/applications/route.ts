import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/applications — list all applications with milestones
export async function GET() {
  try {
    const applications = await db.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { milestones: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json({ applications });
  } catch (error) {
    console.error("GET /api/admin/applications error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// PUT /api/admin/applications — update application status or a milestone
// Body: { applicationId, headline?, status?, milestoneId?, milestoneStatus?, milestoneNote? }
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      applicationId,
      headline,
      status,
      milestoneId,
      milestoneStatus,
      milestoneNote,
    } = body as {
      applicationId: string;
      headline?: string;
      status?: string;
      milestoneId?: string;
      milestoneStatus?: string;
      milestoneNote?: string;
    };

    if (!applicationId) {
      return NextResponse.json({ error: "applicationId required" }, { status: 400 });
    }

    // Update application-level fields
    if (headline || status) {
      await db.application.update({
        where: { id: applicationId },
        data: {
          ...(headline !== undefined ? { headline } : {}),
          ...(status !== undefined ? { status } : {}),
        },
      });
    }

    // Update a milestone
    if (milestoneId) {
      await db.applicationMilestone.update({
        where: { id: milestoneId },
        data: {
          ...(milestoneStatus !== undefined ? { status: milestoneStatus } : {}),
          ...(milestoneNote !== undefined ? { note: milestoneNote } : {}),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/admin/applications error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE /api/admin/applications?id=<id>
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    await db.application.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/applications error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
