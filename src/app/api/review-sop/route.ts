import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  sop: z.string().min(50, "Please paste at least 50 characters of your SOP").max(8000, "SOP is too long (max 8000 characters)"),
  targetCountry: z.string().optional().default(""),
  targetCourse: z.string().optional().default(""),
});

// POST /api/review-sop
// Uses the LLM to review a Statement of Purpose and return structured
// feedback with a score and line-by-line suggestions.
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

    const { sop, targetCountry, targetCourse } = parsed.data;

    const context = [
      targetCountry && `Target country: ${targetCountry}`,
      targetCourse && `Target course: ${targetCourse}`,
    ]
      .filter(Boolean)
      .join(" | ");

    const systemPrompt = `You are a senior admissions officer and SOP reviewer at a top international university, with 15+ years of experience evaluating Statements of Purpose from Pakistani students applying to study abroad${context ? ` (${context})` : ""}.

You review SOPs and return STRICT JSON (no markdown, no extra text) with this structure:

{
  "overallScore": <number 0-100>,
  "scores": {
    "structure": <0-100>,
    "clarity": <0-100>,
    "motivation": <0-100>,
    "fit": <0-100>,
    "language": <0-100>
  },
  "verdict": "<one of: Excellent | Strong | Good | Needs Improvement | Weak>",
  "strengths": ["2-4 specific strengths"],
  "weaknesses": ["2-4 specific weaknesses"],
  "suggestions": [
    { "quote": "<exact phrase or sentence from the SOP>", "issue": "<what is wrong>", "fix": "<concrete suggested rewrite>" }
  ],
  "quickTips": ["3-5 actionable tips to improve this SOP"],
  "redFlags": ["any clichés, red flags, or common mistakes detected, or empty array if none"]
}

Scoring guide:
- 90-100: Excellent — ready to submit
- 75-89: Strong — minor edits needed
- 60-74: Good — several revisions recommended
- 40-59: Needs Improvement — significant rework
- 0-39: Weak — rewrite recommended

Be honest but constructive. For each suggestion, quote the exact text from the SOP so the student can find it. Return only valid JSON, nothing else.`;

    const ZAIModule = await import("z-ai-web-dev-sdk");
    const ZAI = ZAIModule.default;
    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Please review this Statement of Purpose:\n\n${sop}`,
        },
      ],
      thinking: { type: "disabled" },
    });

    const content =
      completion.choices?.[0]?.message?.content ??
      '{"error":"No response from model"}';

    // Parse the JSON response (strip markdown fences if present)
    let cleaned = content.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }

    let review;
    try {
      review = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({
        success: true,
        review: { overallScore: 0, verdict: "Parse Error", raw: content },
      });
    }

    if (review.error) {
      return NextResponse.json({ success: false, error: review.error });
    }

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("POST /api/review-sop error:", error);
    const msg = error instanceof Error ? error.message : "SOP review failed";
    return NextResponse.json(
      { error: "SOP review failed", detail: msg },
      { status: 500 }
    );
  }
}
