import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { countries as countryData } from "@/lib/countries";
import { z } from "zod";

const schema = z.object({
  sessionId: z.string().min(1, "Session ID required"),
  message: z.string().min(1, "Message required").max(2000, "Message too long"),
});

// System prompt that turns the LLM into a NextStep International study-abroad counselor
function buildSystemPrompt(): string {
  const countryList = countryData
    .map(
      (c) =>
        `- ${c.name} (${c.flagEmoji}): ${c.tagline}. Tuition ${c.tuitionRange}; Living ${c.livingCost}; Intakes ${c.intakeMonths}; Work rights: ${c.workRights}. Top unis: ${c.topUniversities}.`
    )
    .join("\n");

  return `You are "NextStep Assistant", an expert higher-education counselor at NextStep International in Lahore, Pakistan. You help Pakistani students choose study-abroad destinations, courses, and plan their applications.

Your knowledge covers these destinations:
${countryList}

Guidelines:
- Be warm, concise, and practical. Keep answers under 220 words unless the student asks for detail.
- Always factor in the student's academic background, budget (PKR or USD), preferred course, and English-test status.
- Recommend 2-3 suitable destinations and explain WHY in one line each.
- Mention realistic visa and scholarship considerations when relevant.
- Encourage the student to submit the "Get My Options Reviewed" form or book a session for a personalized roadmap.
- Never invent specific deadlines, fees, or visa rules beyond what's in the knowledge above. If unsure, advise checking with a counselor.
- Use friendly Urdu-English mix phrases occasionally (e.g., "Insha'Allah", "bohot acha") only if the student uses Urdu, otherwise stick to clear English.
- Do not give medical, legal, or financial investment advice.`;
}

// POST /api/ai-assistant - chat with the NextStep AI counselor
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

    const { sessionId, message } = parsed.data;

    // Load conversation history from DB (keep last 10 messages for context)
    const dbHistory = await db.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    // Persist the new user message
    await db.chatMessage.create({
      data: { sessionId, role: "user", content: message },
    });

    // Build messages array for the LLM
    const messages: { role: "system" | "assistant" | "user"; content: string }[] = [
      { role: "system", content: buildSystemPrompt() },
      ...dbHistory.slice(-10).map((m) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as
          | "assistant"
          | "user",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    // Groq (OpenAI-compatible) — same provider that powers the WhatsApp AI bot.
    // Baked fallback for zero-config deploy; override via GROQ_API_KEY env var.
    const groqKey = process.env.GROQ_API_KEY || "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";

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages,
          max_tokens: 600,
          temperature: 0.6,
        }),
      }
    );

    if (!groqRes.ok) {
      const errBody = await groqRes.text();
      throw new Error(`Groq API ${groqRes.status}: ${errBody.slice(0, 200)}`);
    }

    const completion = await groqRes.json();
    const reply: string =
      completion.choices?.[0]?.message?.content ??
      "I'm sorry, I couldn't generate a response right now. Please try again.";

    // Persist assistant reply
    await db.chatMessage.create({
      data: { sessionId, role: "assistant", content: reply },
    });

    return NextResponse.json({
      success: true,
      reply,
      sessionId,
    });
  } catch (error) {
    console.error("POST /api/ai-assistant error:", error);
    const msg =
      error instanceof Error ? error.message : "AI assistant unavailable";
    return NextResponse.json(
      { error: "AI assistant temporarily unavailable", detail: msg },
      { status: 500 }
    );
  }
}

// GET /api/ai-assistant?sessionId=... - fetch chat history
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId required" },
        { status: 400 }
      );
    }
    const messages = await db.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: 50,
    });
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("GET /api/ai-assistant error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
