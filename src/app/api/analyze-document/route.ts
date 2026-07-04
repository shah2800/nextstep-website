import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { countries } from "@/lib/countries";

const schema = z.object({
  image: z.string().min(1, "Image data is required"),
  mimeType: z.string().default("image/png"),
});

// POST /api/analyze-document
// Uses the VLM (Vision Language Model) to read a transcript / mark sheet /
// degree photo, extract the student's academic profile, and match them to
// suitable study destinations.
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

    const { image, mimeType } = parsed.data;

    // Build the data URL for the VLM
    const dataUrl = image.startsWith("data:")
      ? image
      : `data:${mimeType};base64,${image}`;

    const prompt = `You are an expert academic transcript analyzer for Pakistani students applying to study abroad. Analyze the document image and extract the following information as STRICT JSON (no markdown, no extra text):

{
  "qualification": "Highest qualification detected (e.g. 'Intermediate / FSc', 'Bachelor of Science', 'O-Level', 'Matric')",
  "institution": "Name of the school/college/university if visible",
  "majorOrGroup": "Subject group or major (e.g. 'Pre-Engineering', 'Computer Science', 'Pre-Medical')",
  "graduationYear": "Year of graduation if visible, else 'Not visible'",
  "gradeOrGPA": "Overall grade / GPA / percentage if visible",
  "keySubjects": ["List 3-6 key subjects visible"],
  "englishLevel": "Estimate English proficiency level based on subjects/grades if English is visible, else 'Unknown'",
  "summary": "One-sentence summary of the student's academic profile",
  "confidence": "high | medium | low — how confident you are in the extraction"
}

If the document is unclear or not a transcript, return:
{"error": "Could not read a clear academic document. Please upload a clearer photo of your transcript, mark sheet, or degree."}`;

    const ZAIModule = await import("z-ai-web-dev-sdk");
    const ZAI = ZAIModule.default;
    const zai = await ZAI.create();

    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      thinking: { type: "disabled" },
    });

    const content =
      response.choices?.[0]?.message?.content ??
      '{"error":"No response from vision model"}';

    // Parse the JSON from the LLM response (strip any markdown fences)
    let cleaned = content.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }

    let extracted;
    try {
      extracted = JSON.parse(cleaned);
    } catch {
      // If JSON parse fails, return the raw content as a fallback
      return NextResponse.json({
        success: true,
        extracted: { summary: content, confidence: "low" },
        matches: [],
      });
    }

    // If the VLM reported an error reading the document, pass it through
    if (extracted.error) {
      return NextResponse.json({ success: false, error: extracted.error });
    }

    // Match destinations based on extracted profile
    const matches = matchDestinations(extracted);

    return NextResponse.json({
      success: true,
      extracted,
      matches,
    });
  } catch (error) {
    console.error("POST /api/analyze-document error:", error);
    const msg =
      error instanceof Error ? error.message : "Document analysis failed";
    return NextResponse.json(
      { error: "Document analysis failed", detail: msg },
      { status: 500 }
    );
  }
}

// Simple heuristic matching based on the extracted profile
function matchDestinations(profile: {
  qualification?: string;
  majorOrGroup?: string;
  gradeOrGPA?: string;
  englishLevel?: string;
}): Array<{ slug: string; name: string; flagEmoji: string; reason: string }> {
  const qual = (profile.qualification || "").toLowerCase();
  const major = (profile.majorOrGroup || "").toLowerCase();
  const grade = (profile.gradeOrGPA || "").toLowerCase();

  const isBachelor = qual.includes("bachelor") || qual.includes("bsc") || qual.includes("b.sc");
  const isIntermediate = qual.includes("inter") || qual.includes("fsc") || qual.includes("a-level") || qual.includes("fa ");
  const strongGrades = grade.includes("a") || grade.includes("distinction") || grade.includes("first") || grade.match(/8[0-9]/) || grade.match(/9[0-9]/) || grade.includes("3.");

  const matches: Array<{ slug: string; name: string; flagEmoji: string; reason: string }> = [];

  // UK — accepts many qualifications, strong for bachelor's pathway
  const uk = countries.find((c) => c.slug === "united-kingdom");
  if (uk) {
    matches.push({
      slug: uk.slug,
      name: uk.name,
      flagEmoji: uk.flagEmoji,
      reason: isBachelor
        ? "Bachelor's degree holders can pursue 1-year UK master's with the 2-year Graduate Route work visa."
        : "UK accepts intermediate/FSc/A-Level qualifications with foundation pathways to top universities.",
    });
  }

  // Germany — great for engineering, tuition-free
  const germany = countries.find((c) => c.slug === "germany");
  if (germany && (major.includes("engineer") || major.includes("computer") || major.includes("mechanical") || isBachelor)) {
    matches.push({
      slug: germany.slug,
      name: germany.name,
      flagEmoji: germany.flagEmoji,
      reason: "Tuition-free public universities + strong engineering programs. APS certificate required for Pakistani applicants.",
    });
  }

  // Canada — clear PR pathway, accepts intermediate
  const canada = countries.find((c) => c.slug === "canada");
  if (canada) {
    matches.push({
      slug: canada.slug,
      name: canada.name,
      flagEmoji: canada.flagEmoji,
      reason: isIntermediate
        ? "Eligible for undergraduate diplomas/degrees with up to 3-year PGWP and clear PR pathway."
        : "Post-graduation work permit up to 3 years + Express Entry PR pathway for graduates.",
    });
  }

  // Hungary — Stipendium Hungaricum, great for strong grades / medicine
  const hungary = countries.find((c) => c.slug === "hungary");
  if (hungary && (strongGrades || major.includes("medic") || major.includes("dentist"))) {
    matches.push({
      slug: hungary.slug,
      name: hungary.name,
      flagEmoji: hungary.flagEmoji,
      reason: "Stipendium Hungaricum (full scholarship) reserved quota for Pakistan — ideal for strong academic profiles and medical/dental programs.",
    });
  }

  // Malaysia / Sri Lanka — affordable, good for intermediate students
  const malaysia = countries.find((c) => c.slug === "malaysia");
  if (malaysia && isIntermediate) {
    matches.push({
      slug: malaysia.slug,
      name: malaysia.name,
      flagEmoji: malaysia.flagEmoji,
      reason: "Affordable branch campuses (UK/Australian degrees at half the cost) — great entry point for intermediate students.",
    });
  }

  // Australia — strong for bachelor's and postgrad
  const australia = countries.find((c) => c.slug === "australia");
  if (australia && isBachelor) {
    matches.push({
      slug: australia.slug,
      name: australia.name,
      flagEmoji: australia.flagEmoji,
      reason: "2-4 year Temporary Graduate visa after studies; globally recognized qualifications and strong post-study work options.",
    });
  }

  return matches.slice(0, 5);
}
