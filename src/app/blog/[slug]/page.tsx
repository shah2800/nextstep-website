import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { db } from "@/lib/db";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  try {
    return await db.blogPost.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p || !p.published) return { title: "Blog | NextStep International" };
  return {
    title: p.metaTitle || `${p.title} | NextStep International`,
    description: p.metaDescription || p.excerpt,
    alternates: { canonical: `https://www.nextstepinternationals.com/blog/${p.slug}` },
    openGraph: { title: p.title, description: p.excerpt, type: "article" },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p || !p.published) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.excerpt,
    datePublished: p.createdAt.toISOString(),
    dateModified: p.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "NextStep International" },
    publisher: { "@type": "Organization", name: "NextStep International", url: "https://www.nextstepinternationals.com" },
    mainEntityOfPage: `https://www.nextstepinternationals.com/blog/${p.slug}`,
  };

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero-mesh bg-brand px-4 pb-10 pt-8 text-white">
        <div className="mx-auto max-w-3xl">
          <Link href="/blog" className="text-sm text-white/80 hover:text-white">← All articles</Link>
          <div className="mt-4 text-4xl">{p.coverEmoji || "🎓"}</div>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">{p.title}</h1>
          <p className="mt-2 text-xs text-white/70">
            {p.category} · Updated {new Date(p.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </section>

      <article className="prose-blog mx-auto max-w-3xl px-4 py-8">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h2 className="mt-8 text-xl font-bold text-foreground">{children}</h2>,
            h2: ({ children }) => <h2 className="mt-8 text-xl font-bold text-foreground">{children}</h2>,
            h3: ({ children }) => <h3 className="mt-6 text-lg font-bold text-foreground">{children}</h3>,
            p: ({ children }) => <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{children}</p>,
            ul: ({ children }) => <ul className="mt-3 list-disc space-y-1.5 pl-6 text-[15px] text-muted-foreground">{children}</ul>,
            ol: ({ children }) => <ol className="mt-3 list-decimal space-y-1.5 pl-6 text-[15px] text-muted-foreground">{children}</ol>,
            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
            a: ({ href, children }) => <a href={href} className="font-medium text-brand underline">{children}</a>,
            table: ({ children }) => <div className="mt-4 overflow-x-auto"><table className="w-full border-collapse text-sm">{children}</table></div>,
            th: ({ children }) => <th className="border border-border bg-secondary px-3 py-2 text-left font-semibold text-foreground">{children}</th>,
            td: ({ children }) => <td className="border border-border px-3 py-2 text-muted-foreground">{children}</td>,
          }}
        >
          {p.content}
        </ReactMarkdown>

        <div className="mt-10 flex flex-col gap-3 rounded-2xl bg-brand p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold">Want a personalized plan?</p>
            <p className="text-sm text-white/80">Free counseling with NextStep — admission to visa.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/?apply=true" className="rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-gold-foreground">Apply Now</Link>
            <a href="https://wa.me/995511113670" className="rounded-lg border border-white/40 px-5 py-2.5 text-sm font-bold">WhatsApp</a>
          </div>
        </div>
      </article>
    </main>
  );
}
