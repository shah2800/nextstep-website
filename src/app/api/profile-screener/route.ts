import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { countries } from "@/lib/countries";

const schema = z.object({
  qualification: z.enum(["matric", "intermediate", "bachelor", "master"]),
  ielts: z.number().min(0).max(9),
  budget: z.number().min(0), // annual budget in USD
  preferredCourse: z.string().optional().default(""),
});

type Scored = {
  slug: string;
  name: string;
  flagEmoji: string;
  score: number;
  reasons: string[];
  warnings: string[];
  tuition: string;
  tagline: string;
};

// Parse the lower bound of a tuition range string like "£12,000 – £25,000 / year"
// or "€0 – €1,500 / year" → returns a number in USD (rough conversion)
const FX: Record<string, number> = {
  "£": 1.27, // GBP→USD
  "€": 1.08, // EUR→USD
  "A$": 0.66, "C$": 0.74, "NZ$": 0.6, "S$": 0.74,
  "RM": 0.21, "₺": 0.031, "₫": 0.00004, "₹": 0.012,
  "Rp": 0.000064, "₨": 0.0036, "AED": 0.27,
  $: 1, // USD
};

function parseTuitionLow(range: string): number {
  // Match currency prefixes like "£", "A$", "C$", "$", "€", "RM", "AED", "₺"
  const match = range.match(/([A-Z]{0,2}\$|£|€|₺|₫|₹|₨|RM|Rp|AED)\s*([\d,]+)/i);
  if (!match) return 8000; // fallback
  const sym = match[1].trim();
  const num = parseFloat(match[2].replace(/,/g, ""));
  const fx = FX[sym] ?? 1;
  return num * fx;
}

// POST /api/profile-screener — compute match scores for all countries
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
    const { qualification, ielts, budget, preferredCourse } = parsed.data;

    const results: Scored[] = countries.map((c) => {
      const tuitionLowUsd = parseTuitionLow(c.tuitionRange);
      const reasons: string[] = [];
      const warnings: string[] = [];
      let score = 50; // baseline

      // Budget fit (40% weight) — how close is budget to tuition low
      if (budget >= tuitionLowUsd) {
        score += 30;
        reasons.push(
          `Your $${budget.toLocaleString()}/yr budget covers the ${c.tuitionRange.split("/")[0].trim()} tuition`
        );
        if (budget >= tuitionLowUsd * 1.5) {
          score += 5;
          reasons.push("Comfortable financial headroom for living costs");
        }
      } else if (budget >= tuitionLowUsd * 0.7) {
        score += 15;
        warnings.push(
          `Budget is tight — ${c.tuitionRange.split("/")[0].trim()} tuition may need scholarships`
        );
      } else {
        score -= 15;
        warnings.push("Budget likely insufficient without full scholarship");
      }

      // IELTS fit (30% weight) — most countries need 6.0-6.5
      if (ielts >= 6.5) {
        score += 20;
        reasons.push(`IELTS ${ielts} meets standard entry requirements`);
      } else if (ielts >= 6.0) {
        score += 12;
        warnings.push(`IELTS ${ielts} borderline — some top unis want 6.5+`);
      } else if (ielts >= 5.5) {
        score += 3;
        warnings.push(`IELTS ${ielts} low — pathway/foundation programs recommended`);
      } else {
        score -= 10;
        warnings.push("IELTS below 5.5 — English prep needed before applying");
      }

      // Qualification fit (20% weight)
      const qualMap: Record<string, string[]> = {
        matric: ["malaysia", "turkiye", "indonesia", "sri-lanka", "vietnam"],
        intermediate: ["united-kingdom", "australia", "canada", "malaysia", "uae", "turkiye", "new-zealand", "ireland"],
        bachelor: ["united-kingdom", "germany", "united-states", "canada", "australia", "ireland", "netherlands", "singapore", "new-zealand", "hungary"],
        master: ["united-kingdom", "germany", "united-states", "canada", "australia", "ireland", "netherlands", "singapore"],
      };
      const goodFor = qualMap[qualification] ?? [];
      if (goodFor.includes(c.slug)) {
        score += 15;
        if (qualification === "bachelor" && c.slug === "united-kingdom") {
          reasons.push("1-year UK master's pathway after bachelor's");
        }
        if (qualification === "intermediate" && c.slug === "canada") {
          reasons.push("Canada accepts FSc/A-Level for undergraduate diplomas + PGWP");
        }
        if (qualification === "bachelor" && c.slug === "germany") {
          reasons.push("German public unis accept bachelor's for master's — often tuition-free");
        }
      }

      // Course keyword boost (10% weight)
      if (preferredCourse) {
        const course = preferredCourse.toLowerCase();
        const courses = c.popularCourses.toLowerCase();
        const tags: Record<string, string[]> = {
          "computer": ["computer", "data", "it", "software", "cyber"],
          "engineer": ["engineer", "mechanical", "automotive", "aerospace", "industrial"],
          "mba": ["mba", "business", "management", "finance"],
          "medic": ["medic", "dentist", "pharmacy", "health", "nursing"],
          "law": ["law", "legal"],
        };
        const matchedTag = Object.keys(tags).find((k) => course.includes(k));
        if (matchedTag && tags[matchedTag].some((t) => courses.includes(t))) {
          score += 10;
          reasons.push(`Strong ${matchedTag} programs available`);
        }
      }

      // Special bonuses
      if (c.slug === "germany" && budget < 8000) {
        score += 8;
        reasons.push("Tuition-free public universities — ideal for tight budgets");
      }
      if (c.slug === "hungary" && ielts >= 6.0) {
        score += 8;
        reasons.push("Stipendium Hungaricum full scholarship available for Pakistan");
      }
      if (c.slug === "malaysia" && budget < 10000) {
        score += 6;
        reasons.push("Affordable UK/Australian branch campuses at half the cost");
      }

      score = Math.max(0, Math.min(99, Math.round(score)));

      return {
        slug: c.slug,
        name: c.name,
        flagEmoji: c.flagEmoji,
        score,
        reasons: reasons.slice(0, 3),
        warnings: warnings.slice(0, 2),
        tuition: c.tuitionRange,
        tagline: c.tagline,
      };
    });

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      success: true,
      matches: results,
      topMatch: results[0] ?? null,
      profile: { qualification, ielts, budget, preferredCourse },
    });
  } catch (error) {
    console.error("POST /api/profile-screener error:", error);
    return NextResponse.json(
      { error: "Screening failed" },
      { status: 500 }
    );
  }
}
