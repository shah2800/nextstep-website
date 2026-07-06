import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  fatherName: z.string().default(""),
  dob: z.string().default(""),
  gender: z.string().default(""),
  phone: z.string().min(6, "WhatsApp number is required"),
  email: z.string().email("Valid email is required"),
  cityAddress: z.string().default(""),
  passportNumber: z.string().default(""),
  passportIssueDate: z.string().default(""),
  passportExpiry: z.string().default(""),
  matricGrade: z.string().default(""),
  fscGrade: z.string().default(""),
  otherDegree: z.string().default(""),
  ieltsScore: z.string().default(""),
  countryInterest: z.string().min(1, "Country is required"),
  universityInterest: z.string().default(""),
  courseInterest: z.string().default(""),
  documents: z.string().default(""),
});

// Default milestone template created for every new application
const DEFAULT_MILESTONES = [
  { label: "Application Received", note: "Your application has been submitted successfully.", status: "done", order: 0 },
  { label: "Document Review", note: "Our team is verifying your documents.", status: "active", order: 1 },
  { label: "University Shortlisting", note: "Pending — we'll shortlist universities that fit your profile.", status: "pending", order: 2 },
  { label: "Application Submitted to University", note: "Pending", status: "pending", order: 3 },
  { label: "Offer Letter Received", note: "Pending", status: "pending", order: 4 },
  { label: "Visa Application Filed", note: "Pending", status: "pending", order: 5 },
  { label: "Visa Approved", note: "Pending", status: "pending", order: 6 },
  { label: "Pre-Departure Briefing", note: "Pending", status: "pending", order: 7 },
];

// Generate a registration ID like NSI-2026-001
async function generateRegistrationId(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await db.application.count();
  const seq = String(count + 1).padStart(3, "0");
  let id = `NSI-${year}-${seq}`;
  // Ensure uniqueness
  let attempt = 0;
  while (await db.application.findUnique({ where: { registrationId: id } })) {
    attempt++;
    id = `NSI-${year}-${String(count + 1 + attempt).padStart(3, "0")}`;
  }
  return id;
}

// POST /api/apply — submit a new application
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

    const registrationId = await generateRegistrationId();

    const application = await db.application.create({
      data: {
        ...parsed.data,
        registrationId,
      },
    });

    // Create default milestones
    await db.applicationMilestone.createMany({
      data: DEFAULT_MILESTONES.map((m) => ({
        ...m,
        applicationId: application.id,
      })),
    });

    return NextResponse.json(
      {
        success: true,
        registrationId,
        id: application.id,
        message: "Application submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/apply error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

// GET /api/apply — list all applications (admin view)
export async function GET() {
  try {
    const applications = await db.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { milestones: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json({ applications, count: applications.length });
  } catch (error) {
    console.error("GET /api/apply error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
