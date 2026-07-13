import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { chinaUniversities } from "@/lib/china-universities";
import { universitySlug } from "@/lib/slug";

const BASE = "https://www.nextstepinternationals.com";

export const revalidate = 3600; // refresh hourly so new agent posts get indexed

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/china-mbbs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];

  let countryPages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const countries = await db.country.findMany({
      where: { hidden: false },
      select: { slug: true, updatedAt: true },
    });
    countryPages = countries.map((c) => ({
      url: `${BASE}/study-in/${c.slug}`,
      lastModified: c.updatedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

    const posts = await db.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
      take: 5000,
    });
    blogPages = posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.updatedAt ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB unavailable — still emit static + university URLs
  }

  const universityPages: MetadataRoute.Sitemap = chinaUniversities.map((u) => ({
    url: `${BASE}/universities/${universitySlug(u.name)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...countryPages, ...universityPages, ...blogPages];
}
