// One-shot: seed the first batch of SEO blog posts (same topics/prompt as the
// daily agent) into local SQLite AND Turso. Run: node scripts/seed-blog.mjs
import { createClient } from "@libsql/client";
import fs from "fs";
import crypto from "crypto";

const env = fs.readFileSync(".env", "utf8");
const GROQ_KEY = env.match(/GROQ_API_KEY=(.+)/)[1].trim();
const local = createClient({ url: "file:./db/custom.db" });
const remote = createClient({
  url: env.match(/TURSO_DATABASE_URL=(.+)/)[1].trim(),
  authToken: env.match(/TURSO_AUTH_TOKEN=(.+)/)[1].trim(),
});

const TOPICS = [
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

async function generate(topic, attempt = 1) {
  const prompt = `Write an SEO blog article for NextStep International, a study-abroad consultancy in Lahore, Pakistan (website: nextstepinternationals.com, WhatsApp +92 314 2638901).

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
  if (res.status === 429 && attempt <= 5) {
    const wait = 20000 * attempt;
    console.log(`  rate-limited, waiting ${wait / 1000}s...`);
    await new Promise((r) => setTimeout(r, wait));
    return generate(topic, attempt + 1);
  }
  if (!res.ok) throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 150)}`);
  const data = await res.json();
  const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
  if (!parsed.content || parsed.content.length < 800) throw new Error("too short");
  return parsed;
}

const INSERT = `INSERT OR IGNORE INTO BlogPost (id, slug, title, excerpt, content, category, tags, metaTitle, metaDescription, coverEmoji, source, published, createdAt, updatedAt)
VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, ?, 'manual', 1, ?, ?)`;

let ok = 0;
for (const t of TOPICS) {
  const existsL = await local.execute({ sql: "SELECT 1 FROM BlogPost WHERE slug = ?", args: [t.slug] });
  if (existsL.rows.length) { console.log(`skip (exists): ${t.slug}`); ok++; continue; }
  try {
    console.log(`writing: ${t.slug}`);
    const art = await generate(t);
    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 25);
    const now = Date.now();
    const args = [
      id, t.slug, t.title,
      String(art.excerpt || "").slice(0, 300),
      String(art.content),
      t.category,
      String(art.tags || ""),
      String(art.metaDescription || "").slice(0, 170),
      String(art.coverEmoji || "🎓").slice(0, 4),
      now, now,
    ];
    await local.execute({ sql: INSERT, args });
    await remote.execute({ sql: INSERT, args });
    ok++;
    console.log(`  ✓ published (${String(art.content).length} chars)`);
    await new Promise((r) => setTimeout(r, 8000)); // stay under Groq rate limits
  } catch (e) {
    console.log(`  ✗ FAILED ${t.slug}: ${e.message}`);
  }
}
const n = await remote.execute("SELECT COUNT(*) n FROM BlogPost");
console.log(`DONE: ${ok}/${TOPICS.length} ok · Turso now has ${n.rows[0].n} posts`);
