import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { countries as countryData } from "@/lib/countries";

// GET /api/countries - list all countries (from DB, seeded if empty)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const country = await db.country.findUnique({ where: { slug } });
      if (!country) {
        return NextResponse.json(
          { error: "Country not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ country });
    }

    let countries = await db.country.findMany({
      where: { hidden: false },
      orderBy: [{ featured: "desc" }, { order: "asc" }],
    });

    // Auto-seed if empty
    if (countries.length === 0) {
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
      countries = await db.country.findMany({ orderBy: { order: "asc" } });
    }

    return NextResponse.json({ countries });
  } catch (error) {
    console.error("GET /api/countries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 500 }
    );
  }
}
