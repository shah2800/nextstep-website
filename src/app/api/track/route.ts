import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/track?registrationId=NSI-2026-001
// Returns the application + milestones for the public track page
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const registrationId = (searchParams.get("registrationId") || "")
      .trim()
      .toUpperCase();

    if (!registrationId) {
      return NextResponse.json(
        { error: "Please enter your Register ID (e.g. NSI-2026-001)." },
        { status: 400 }
      );
    }

    const application = await db.application.findUnique({
      where: { registrationId },
      include: {
        milestones: { orderBy: { order: "asc" } },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      registrationId: application.registrationId,
      fullName: application.fullName,
      countryInterest: application.countryInterest,
      courseInterest: application.courseInterest,
      status: application.status,
      headline: application.headline,
      stageUpdatedAt: application.updatedAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
      milestones: application.milestones.map((m) => ({
        label: m.label,
        note: m.note,
        status: m.status,
      })),
    });
  } catch (error) {
    console.error("GET /api/track error:", error);
    return NextResponse.json(
      { error: "Failed to fetch application status" },
      { status: 500 }
    );
  }
}
