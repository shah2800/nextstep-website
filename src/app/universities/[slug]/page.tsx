import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { chinaUniversities } from "@/lib/china-universities";
import { universitySlug } from "@/lib/slug";

type Props = { params: Promise<{ slug: string }> };

function getUni(slug: string) {
  return chinaUniversities.find((u) => universitySlug(u.name) === slug) || null;
}

export function generateStaticParams() {
  return chinaUniversities.map((u) => ({ slug: universitySlug(u.name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const u = getUni(slug);
  if (!u) return { title: "University | NextStep International" };
  return {
    title: `${u.name} — MBBS Fees 2026 for Pakistani Students | NextStep International`,
    description: `${u.name} ${u.program} 2026: package ${u.packageYuan}${u.packageUsd ? ` (${u.packageUsd})` : ""}, 1st-year tuition ${u.tuitionYear1}, hostel ${u.accommodation}/yr, HSK: ${u.hsk}. Apply from Pakistan with NextStep.`,
    alternates: { canonical: `https://www.nextstepinternationals.com/universities/${slug}` },
  };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border py-3 text-sm last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  );
}

export default async function UniversityPage({ params }: Props) {
  const { slug } = await params;
  const u = getUni(slug);
  if (!u) notFound();

  const faqs = [
    { q: `What is the total package for ${u.name}?`, a: `The 2026 package is ${u.packageYuan}${u.packageUsd ? ` (${u.packageUsd})` : ""}. Our consultant confirms the final breakdown before you apply.` },
    { q: `What is the yearly tuition fee at ${u.name}?`, a: `First-year tuition is ${u.tuitionYear1} and years 2–5 are ${u.tuitionYear2to5} per year (¥ RMB).` },
    { q: `Is HSK (Chinese language) required for ${u.name}?`, a: u.hsk === "Not required" ? "No — HSK is not required for admission." : `Yes — requirement: ${u.hsk}.` },
    { q: `How much is accommodation at ${u.name}?`, a: `University hostel costs around ${u.accommodation} per year.` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const wa = `https://wa.me/995511113670?text=${encodeURIComponent(`Assalam o Alaikum, I want details about MBBS admission at ${u.name} (China 2026 intake).`)}`;

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero-mesh bg-brand px-4 pb-10 pt-8 text-white">
        <div className="mx-auto max-w-3xl">
          <Link href="/china-mbbs" className="text-sm text-white/80 hover:text-white">← All China MBBS universities</Link>
          <h1 className="mt-5 text-2xl font-extrabold sm:text-3xl">🇨🇳 {u.name}</h1>
          <p className="mt-1 text-sm text-white/85">{u.program} · 2026 intake · Pakistani students welcome</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">2026 Package</div>
          <div className="mt-1 text-2xl font-extrabold text-brand">
            {u.packageYuan}
            {u.packageUsd && <span className="ml-2 text-base font-semibold text-muted-foreground">· {u.packageUsd}</span>}
          </div>
          <dl className="mt-4">
            <Row label="Program" value={u.program} />
            <Row label="1st year tuition" value={u.tuitionYear1} />
            <Row label="2nd–5th year tuition (per year)" value={u.tuitionYear2to5} />
            <Row label="Accommodation (per year)" value={u.accommodation} />
            <Row label="HSK (Chinese) requirement" value={u.hsk} />
          </dl>
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-foreground">Frequently asked questions</h2>
          <div className="mt-3 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="rounded-xl border border-border bg-card p-4">
                <summary className="cursor-pointer text-sm font-semibold text-foreground">{f.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-brand p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold">Apply to {u.name}</p>
            <p className="text-sm text-white/80">Free counseling · documents · admission · visa — one place.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/?apply=true" className="rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-gold-foreground">Apply Now</Link>
            <a href={wa} className="rounded-lg border border-white/40 px-5 py-2.5 text-sm font-bold">WhatsApp</a>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Compare all options: <Link className="underline" href="/china-mbbs">China MBBS universities &amp; costs 2026</Link> ·{" "}
          <Link className="underline" href="/study-in/china">Study in China guide</Link>
        </p>
      </div>
    </main>
  );
}
