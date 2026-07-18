// Adds Uzbekistan (Bukhara State University + Bukhara State Medical Institute)
// to local SQLite AND Turso. Idempotent: updates the row if the slug exists.
import { createClient } from "@libsql/client";
import fs from "fs";
import crypto from "crypto";

const env = fs.readFileSync(".env", "utf8");
const local = createClient({ url: "file:./db/custom.db" });
const remote = createClient({
  url: env.match(/TURSO_DATABASE_URL=(.+)/)[1].trim(),
  authToken: env.match(/TURSO_AUTH_TOKEN=(.+)/)[1].trim(),
});

const longDesc = `Uzbekistan has become one of the most affordable English-medium study destinations for Pakistani students, with admissions open for 2026 at Bukhara State University and Bukhara State Medical Institute (named after Ibn-e-Sina).

PROGRAMS — BUKHARA STATE UNIVERSITY (English medium)
• BS — 4 years — $3,000
• MS — 2 years — $3,200
• PhD — 3 to 5 years — $3,000–$4,000

ELIGIBILITY
• BS (BBA etc.): minimum 60% in FSc / A-Level / HSSC
• MS (MBA / MS): minimum 60% in Bachelor's degree
• PhD: 2 conferences and 2 published articles

PROGRAM — BUKHARA STATE MEDICAL INSTITUTE (Ibn-e-Sina)
• MD / MBBS — 5 + 1 years

FIRST-SEMESTER PACKAGE — $3,500 USD
Includes: first-semester tuition fee, first-semester hostel accommodation, visa assistance, medical checkup (first time only), insurance (first time only), complete admission support, administrative fee, Panafil / ID card, bank account setup and legal support. The medical institute package also covers the university development fund and airport-to-university transfer.

FROM THE SECOND SEMESTER ONWARDS
• Tuition fee: $600–$1,000 per semester (varies by course)
• Administrative charges: $250
• Hostel: $300–$500 per semester
• Police registration: $140 (as per government policy)
• Visa extension: $200

All figures are in USD as quoted by our partner universities. Our counselor confirms the exact, current amounts and the PKR equivalent at today's rate before you apply.`;

const row = {
  slug: "uzbekistan",
  name: "Uzbekistan",
  flagEmoji: "🇺🇿",
  tagline: "Affordable English-medium degrees & MBBS pathway",
  shortDesc:
    "English-medium BS, MS, PhD and MD/MBBS programs at Bukhara State University and Bukhara State Medical Institute, with an all-inclusive $3,500 first-semester package.",
  longDesc,
  capital: "Tashkent",
  currency: "UZS (Uzbekistani Som)",
  language: "Uzbek / Russian — programs taught in English",
  tuitionRange: "$3,000 – $4,000 / year",
  livingCost: "Hostel $300 – $500 / semester",
  visaProcess:
    "Visa assistance is included in the first-semester package. After arrival, police registration (approx. $140, per government policy) and annual visa extension (approx. $200) are required. Our team handles the paperwork end to end.",
  topUniversities:
    "Bukhara State University — BS (4 years) $3,000, MS (2 years) $3,200, PhD (3–5 years) $3,000–$4,000. Bukhara State Medical Institute, named after Ibn-e-Sina — MD/MBBS, 5 + 1 years.",
  popularCourses:
    "MD / MBBS, BBA, MBA, MS, PhD — all English medium",
  intakeMonths: "Admissions open for 2026",
  scholarships:
    "Scholarship availability varies by program and intake — speak to a NextStep counselor for the current options.",
  workRights:
    "Student work regulations vary — confirm the current rules with a NextStep counselor before making plans.",
  // Uzbek flag: blue / white / green
  gradient: "from-[#0099B5] via-[#ffffff] to-[#1EB53A]",
  accentColor: "#0099B5",
  featured: 1,
  order: 17,
  hidden: 0,
};

const cols = Object.keys(row);
const now = Date.now();

async function upsert(db, label) {
  const existing = await db.execute({ sql: "SELECT id FROM Country WHERE slug = ?", args: ["uzbekistan"] });
  if (existing.rows.length) {
    const sets = cols.filter((c) => c !== "slug").map((c) => `"${c}" = ?`).join(", ");
    await db.execute({
      sql: `UPDATE Country SET ${sets}, updatedAt = ? WHERE slug = ?`,
      args: [...cols.filter((c) => c !== "slug").map((c) => row[c]), now, "uzbekistan"],
    });
    console.log(`${label}: updated existing Uzbekistan row`);
  } else {
    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 25);
    await db.execute({
      sql: `INSERT INTO Country (id, ${cols.map((c) => `"${c}"`).join(", ")}, createdAt, updatedAt)
            VALUES (?, ${cols.map(() => "?").join(", ")}, ?, ?)`,
      args: [id, ...cols.map((c) => row[c]), now, now],
    });
    console.log(`${label}: inserted Uzbekistan`);
  }
}

await upsert(local, "local");
await upsert(remote, "turso");

const check = await remote.execute("SELECT name, slug, hidden FROM Country WHERE slug='uzbekistan'");
console.log("verify:", JSON.stringify(check.rows[0]));
const total = await remote.execute("SELECT COUNT(*) n FROM Country WHERE hidden=0");
console.log("visible countries now:", total.rows[0].n);
