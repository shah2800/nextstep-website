import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";

export const revalidate = 1800; // new agent posts appear within 30 min

export const metadata: Metadata = {
  title: "Study Abroad Blog — Guides, Fees & Scholarships | NextStep International",
  description:
    "Fresh guides for Pakistani students: country comparisons, MBBS fees, scholarships, visa processes and admission deadlines — updated regularly.",
  alternates: { canonical: "https://www.nextstepinternationals.com/blog" },
};

export default async function BlogIndex() {
  let posts: { slug: string; title: string; excerpt: string; category: string; coverEmoji: string; createdAt: Date }[] = [];
  try {
    posts = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: { slug: true, title: true, excerpt: true, category: true, coverEmoji: true, createdAt: true },
      take: 500,
    });
  } catch {
    // render empty state
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="hero-mesh bg-brand px-4 pb-10 pt-8 text-white">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="text-sm text-white/80 hover:text-white">← NextStep International</Link>
          <h1 className="mt-5 text-2xl font-extrabold sm:text-4xl">Study Abroad Blog</h1>
          <p className="mt-1 text-sm text-white/85">
            Guides, fees, scholarships &amp; visa updates for students — refreshed regularly.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {posts.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">New guides are being published — check back shortly.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{p.coverEmoji || "🎓"}</span>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    {p.category}
                  </span>
                </div>
                <h2 className="mt-3 text-base font-bold leading-snug text-foreground group-hover:text-brand">{p.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  {new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
