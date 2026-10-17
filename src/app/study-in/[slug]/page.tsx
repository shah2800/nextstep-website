import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

async function getCountry(slug: string) {
  try {
    return await db.country.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const countries = await db.country.findMany({
      where: { hidden: false },
      select: { slug: true },
    });
    return countries.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCountry(slug);
  if (!c) return { title: "Study Destination | NextStep International" };
  return {
    title: `Study in ${c.name} from Pakistan 2026 — Fees, Universities, Visa | NextStep International`,
    description: `${c.shortDesc} Tuition ${c.tuitionRange}, living ${c.livingCost}. Intakes: ${c.intakeMonths}. Complete guide for Pakistani students.`,
    alternates: { canonical: `https://www.nextstepinternationals.com/study-in/${c.slug}` },
    openGraph: {
      title: `Study in ${c.name} from Pakistan — Complete 2026 Guide`,
      description: c.shortDesc,
    },
  };
}

function Fact({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <div className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const c = await getCountry(slug);
  if (!c || c.hidden) notFound();

  const faqs = [
    { q: `How much does it cost to study in ${c.name} from Pakistan?`, a: `Tuition in ${c.name} is typically ${c.tuitionRange}, and living costs are around ${c.livingCost}.` },
    { q: `What are the intake months for ${c.name}?`, a: `Main intakes: ${c.intakeMonths}.` },
    { q: `Can Pakistani students work while studying in ${c.name}?`, a: c.workRights },
    { q: `Are scholarships available in ${c.name}?`, a: c.scholarships },
    { q: `What is the student visa process for ${c.name}?`, a: c.visaProcess },
  ].filter((f) => f.a && f.a.length > 3);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Hero */}
      <section className="hero-mesh bg-brand px-4 pb-12 pt-8 text-white">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="text-sm text-white/80 hover:text-white">← NextStep International</Link>
          <div className="mt-6 flex items-center gap-4">
            <span className="text-6xl">{c.flagEmoji}</span>
            <div>
              <h1 className="text-2xl font-extrabold sm:text-4xl">Study in {c.name} from Pakistan</h1>
              <p className="mt-1 text-sm text-white/85 sm:text-base">{c.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-base leading-relaxed text-foreground">{c.shortDesc}</p>

        {/* Key facts */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Fact label="Tuition" value={c.tuitionRange} />
          <Fact label="Living cost" value={c.livingCost} />
          <Fact label="Intakes" value={c.intakeMonths} />
          <Fact label="Capital" value={c.capital} />
          <Fact label="Language" value={c.language} />
          <Fact label="Currency" value={c.currency} />
        </div>

        {c.longDesc && <Section title={`Why ${c.name}?`}>{c.longDesc}</Section>}
        {c.topUniversities && <Section title="Top universities">{c.topUniversities}</Section>}
        {c.popularCourses && <Section title="Popular courses">{c.popularCourses}</Section>}
        {c.scholarships && <Section title="Scholarships">{c.scholarships}</Section>}
        {c.visaProcess && <Section title="Student visa process">{c.visaProcess}</Section>}
        {c.workRights && <Section title="Work rights">{c.workRights}</Section>}

        {/* FAQ (visible, matches JSON-LD for AEO) */}
        {faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-foreground">Frequently asked questions</h2>
            <div className="mt-3 space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="rounded-xl border border-border bg-card p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-foreground">{f.q}</summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Cross-links + CTA */}
        {c.slug === "china" && (
          <Link href="/china-mbbs" className="mt-8 block rounded-xl border-2 border-gold/60 bg-gold/10 p-4 text-sm font-semibold text-foreground hover:bg-gold/20">
            🇨🇳 Compare 29 Chinese MBBS universities — fees &amp; packages 2026 →
          </Link>
        )}
        <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-brand p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold">Ready to apply to {c.name}?</p>
            <p className="text-sm text-white/80">Free counseling — we handle admission to visa.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/?apply=true" className="rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-gold-foreground">Apply Now</Link>
            <a href="https://wa.me/995511113670" className="rounded-lg border border-white/40 px-5 py-2.5 text-sm font-bold">WhatsApp</a>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          More guides: <Link className="underline" href="/blog">Study-abroad blog</Link> ·{" "}
          <Link className="underline" href="/china-mbbs">MBBS in China 2026</Link>
        </p>
      </div>
    </main>
  );
}
