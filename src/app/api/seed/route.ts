import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { countries as countryData } from "@/lib/countries";

// POST /api/seed - (re)seed countries table
export async function POST() {
  try {
    await db.country.deleteMany({});
    await db.country.createMany({
      data: countryData.map((c) => ({
        slug: c.slug,
        name: c.name,
        flagEmoji: c.flagEmoji,
        tagline: c.tagline,
        shortDesc: c.shortDesc,
        longDesc: c.longDesc,
        capital: c.capital,
        currency: c.currency,
        language: c.language,
        tuitionRange: c.tuitionRange,
        livingCost: c.livingCost,
        visaProcess: c.visaProcess,
        topUniversities: c.topUniversities,
        popularCourses: c.popularCourses,
        intakeMonths: c.intakeMonths,
        scholarships: c.scholarships,
        workRights: c.workRights,
        gradient: c.gradient,
        accentColor: c.accentColor,
        featured: c.featured,
        order: c.order,
      })),
    });
    const count = await db.country.count();
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
