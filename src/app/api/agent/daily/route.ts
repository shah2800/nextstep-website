import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const maxDuration = 300; // Groq generation can take a while

/**
 * Daily SEO agent — runs from Vercel Cron (see vercel.json).
 * 1. Picks the next uncovered topic (countries × student intents + evergreen).
 * 2. Writes a full SEO/AEO-optimized article with Groq and publishes it.
 * 3. Self-checks key pages and reports status.
 * Secured with CRON_SECRET (Vercel sends "Authorization: Bearer <CRON_SECRET>").
 */

const GROQ_KEY = process.env.GROQ_API_KEY || "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";
const CRON_SECRET = process.env.CRON_SECRET || "nsi-agent-7k3m9p2qx-secret";

const EVERGREEN_TOPICS: { slug: string; title: string; category: string }[] = [
  { slug: "scholarships-for-pakistani-students", title: "Scholarships for Pakistani Students in 2026: Complete Guide", category: "Scholarships" },
  { slug: "mbbs-in-georgia-complete-guide", title: "MBBS in Georgia for Pakistani Students: Fees, Universities & Admission 2026", category: "MBBS" },
  { slug: "student-life-in-georgia", title: "Student Life in Georgia: What Pakistani Students Should Expect", category: "Student Life" },
  { slug: "study-in-azerbaijan-guide", title: "Study in Azerbaijan from Pakistan: Fees, Universities & Visa 2026", category: "Country Guides" },
  { slug: "study-in-kazakhstan-guide", title: "Study in Kazakhstan from Pakistan: MBBS, Fees & Admission 2026", category: "Country Guides" },
  { slug: "study-in-russia-guide", title: "Study in Russia from Pakistan: MBBS Fees, Universities & Visa 2026", category: "Country Guides" },
  { slug: "study-in-turkey-guide", title: "Study in Turkey from Pakistan: Universities, Fees & Scholarships 2026", category: "Country Guides" },
  { slug: "student-visa-guide-for-pakistani-students", title: "Student Visa Guide for Pakistani Students: Step-by-Step Process 2026", category: "Visa" },
  { slug: "study-abroad-from-pakistan-complete-guide", title: "How to Study Abroad from Pakistan in 2026: The Complete Roadmap", category: "Guides" },
  { slug: "how-to-choose-a-study-abroad-consultant", title: "How to Choose a Study Abroad Consultant in Pakistan (Red Flags to Avoid)", category: "Guides" },
  { slug: "mbbs-in-china-vs-georgia", title: "MBBS in China vs Georgia: Which Is Better for Pakistani Students in 2026?", category: "MBBS" },
  { slug: "ielts-free-study-destinations", title: "Study Abroad Without IELTS: Best Destinations for Pakistani Students 2026", category: "Guides" },
  { slug: "cheapest-countries-to-study-mbbs", title: "10 Cheapest Countries to Study MBBS for Pakistani Students in 2026", category: "MBBS" },
  { slug: "study-abroad-on-a-budget-pakistan", title: "Study Abroad on a Budget: Options Under $3,000/Year for Pakistani Students", category: "Guides" },
  { slug: "september-2026-intake-deadlines", title: "September 2026 Intake: Deadlines Pakistani Students Must Not Miss", category: "Deadlines" },
];

const INTENTS = [
  { key: "fees", title: (c: string) => `Cost of Studying in ${c} from Pakistan: Fees & Living Expenses 2026`, category: "Fees" },
  { key: "visa", title: (c: string) => `${c} Student Visa for Pakistani Students: Requirements & Process 2026`, category: "Visa" },
  { key: "scholarships", title: (c: string) => `Scholarships in ${c} for Pakistani Students 2026`, category: "Scholarships" },
  { key: "universities", title: (c: string) => `Top Universities in ${c} for Pakistani Students 2026`, category: "Universities" },
];

async function pickTopic(): Promise<{ slug: string; title: string; category: string } | null> {
  const existing = new Set(
    (await db.blogPost.findMany({ select: { slug: true } })).map((p) => p.slug)
  );
  for (const t of EVERGREEN_TOPICS) {
    if (!existing.has(t.slug)) return t;
  }
  const countries = await db.country.findMany({
    where: { hidden: false },
    select: { name: true, slug: true },
    orderBy: { order: "asc" },
  });
  for (const c of countries) {
    for (const intent of INTENTS) {
      const slug = `${intent.key}-${c.slug}-pakistani-students`;
      if (!existing.has(slug)) {
        return { slug, title: intent.title(c.name), category: intent.category };
      }
    }
  }
  return null; // full matrix covered
}

async function generateArticle(topic: { slug: string; title: string; category: string }) {
  const prompt = `Write an SEO blog article for NextStep International, a study-abroad consultancy in Lahore, Pakistan (website: nextstepinternationals.com, WhatsApp +995 511 11 36 70).

TITLE: ${topic.title}

Requirements:
- 900-1300 words of genuinely useful, specific content for Pakistani students (mention PKR context, FSc/Matric equivalence, PMC recognition where relevant).
- Markdown format. Structure: short intro (2-3 sentences, answer the query immediately — this is for AI search engines too), then 5-7 H2 sections (##), include one comparison table where natural, end with an H2 "FAQs" section containing 4 question-answer pairs (questions as bold text).
- Include 2-3 internal links naturally: [MBBS in China universities & fees](https://www.nextstepinternationals.com/china-mbbs), [apply online](https://www.nextstepinternationals.com/?apply=true), [more guides](https://www.nextstepinternationals.com/blog).
- Never invent specific scholarship names, exact visa fees, or guaranteed outcomes. Use realistic ranges and say "our counselor confirms exact figures".
- Tone: expert, clear, helpful. No fluff, no "in today's world".

Return ONLY valid JSON (no markdown fences):
{"excerpt": "1-2 sentence summary (max 160 chars)", "metaDescription": "SEO meta description (max 155 chars)", "tags": "comma,separated,tags", "coverEmoji": "one emoji", "content": "the full markdown article WITHOUT repeating the title"}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
  if (!parsed.content || parsed.content.length < 800) throw new Error("Generated article too short");
  return parsed;
}

async function selfCheck() {
  const base = "https://www.nextstepinternationals.com";
  const targets = ["/", "/china-mbbs", "/blog", "/sitemap.xml"];
  const results: Record<string, number> = {};
  for (const t of targets) {
    try {
      const r = await fetch(`${base}${t}`, { method: "GET", cache: "no-store" });
      results[t] = r.status;
    } catch {
      results[t] = 0;
    }
  }
  return results;
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const key = new URL(req.url).searchParams.get("key") || "";
  if (auth !== `Bearer ${CRON_SECRET}` && key !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const report: Record<string, unknown> = { ranAt: new Date().toISOString() };

  try {
    const topic = await pickTopic();
    if (!topic) {
      report.post = "all topics covered — nothing to write";
    } else {
      const art = await generateArticle(topic);
      await db.blogPost.create({
        data: {
          slug: topic.slug,
          title: topic.title,
          category: topic.category,
          excerpt: String(art.excerpt || "").slice(0, 300),
          metaDescription: String(art.metaDescription || "").slice(0, 170),
          tags: String(art.tags || ""),
          coverEmoji: String(art.coverEmoji || "🎓").slice(0, 4),
          content: String(art.content),
          source: "agent",
          published: true,
        },
      });
      report.post = `published /blog/${topic.slug}`;
    }
  } catch (e) {
    report.postError = e instanceof Error ? e.message : "generation failed";
  }

  try {
    report.selfCheck = await selfCheck();
  } catch {
    report.selfCheck = "failed";
  }

  console.log("[daily-agent]", JSON.stringify(report));
  return NextResponse.json(report);
}
