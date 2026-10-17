"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  GraduationCap,
  Home,
  Languages,
  Wallet,
  BadgeCheck,
  MessageCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  chinaUniversities,
  type ChinaUniversity,
} from "@/lib/china-universities";

// ponytail: no per-university photos available — cards use a branded monogram
// header. Swap to real campus images later by adding an `image` field to
// ChinaUniversity and rendering it in CardHeader.

const FILTERS = ["All", "MBBS", "Clinical Medicine", "No HSK"] as const;
type Filter = (typeof FILTERS)[number];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w) && !["of", "the"].includes(w.toLowerCase()))
    .slice(0, 3)
    .map((w) => w[0])
    .join("");
}

function waLink(uni: string): string {
  return `https://wa.me/995511113670?text=${encodeURIComponent(
    `Assalam o Alaikum, I want details about MBBS admission at ${uni} (China 2026 intake).`
  )}`;
}

function UniversityCard({ u }: { u: ChinaUniversity }) {
  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl border-border shadow-sm transition-shadow hover:shadow-lg">
      {/* Monogram header */}
      <div className="relative flex h-28 items-center justify-between bg-gradient-to-br from-brand via-brand to-[#8B0000] px-5">
        <div>
          <span className="text-3xl font-black tracking-wide text-white/95">
            {initials(u.name)}
          </span>
          <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-white/60">
            China · 2026 intake
          </div>
        </div>
        <span className="text-4xl">🇨🇳</span>
        <Badge className="absolute bottom-3 right-4 bg-gold text-gold-foreground hover:bg-gold">
          {u.program}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-snug text-foreground">
          {u.name}
        </h3>

        {/* Package */}
        <div className="mt-3 flex items-baseline gap-2 rounded-xl bg-secondary px-4 py-3">
          <Wallet className="h-4 w-4 shrink-0 self-center text-gold" />
          <span className="text-lg font-extrabold text-brand">
            {u.packageYuan}
          </span>
          {u.packageUsd && (
            <span className="text-sm font-medium text-muted-foreground">
              · {u.packageUsd}
            </span>
          )}
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Package
          </span>
        </div>

        {/* Fee details */}
        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-center justify-between gap-2">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="h-4 w-4 text-brand/60" />
              1st year tuition
            </dt>
            <dd className="font-semibold text-foreground">{u.tuitionYear1}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="h-4 w-4 text-brand/60" />
              2nd–5th year tuition
            </dt>
            <dd className="font-semibold text-foreground">
              {u.tuitionYear2to5}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Home className="h-4 w-4 text-brand/60" />
              Accommodation / yr
            </dt>
            <dd className="font-semibold text-foreground">{u.accommodation}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Languages className="h-4 w-4 text-brand/60" />
              HSK (Chinese)
            </dt>
            <dd
              className={`font-semibold ${
                u.hsk === "Not required" ? "text-emerald-600" : "text-foreground"
              }`}
            >
              {u.hsk}
            </dd>
          </div>
        </dl>

        {/* CTAs */}
        <div className="mt-5 flex gap-2 pt-1">
          <a
            href={waLink(u.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              variant="outline"
              className="w-full border-[#25D366]/40 text-[#128C7E] hover:bg-[#25D366]/10"
            >
              <MessageCircle className="mr-1.5 h-4 w-4" />
              Ask on WhatsApp
            </Button>
          </a>
          <Link href="/?apply=true" className="flex-1">
            <Button className="w-full bg-brand text-white hover:bg-brand/90">
              <BadgeCheck className="mr-1.5 h-4 w-4" />
              Apply Now
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export function ChinaUniversitiesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chinaUniversities.filter((u) => {
      if (filter === "MBBS" && u.program !== "MBBS") return false;
      if (filter === "Clinical Medicine" && u.program !== "Clinical Medicine")
        return false;
      if (filter === "No HSK" && u.hsk !== "Not required") return false;
      if (q && !u.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, filter]);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="hero-mesh relative overflow-hidden bg-brand px-4 pb-12 pt-8 text-white">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/80 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <span className="text-5xl">🇨🇳</span>
            <div>
              <h1 className="text-2xl font-extrabold sm:text-4xl">
                MBBS in China — Universities &amp; Costs 2026
              </h1>
              <p className="mt-1 text-sm text-white/80 sm:text-base">
                {chinaUniversities.length} partner universities · packages,
                tuition, hostel &amp; HSK requirements for Pakistani students
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search university…"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  filter === f
                    ? "bg-brand text-white"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/70"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground sm:ml-auto">
            {filtered.length} of {chinaUniversities.length} universities
          </span>
        </div>
      </section>

      {/* Cards */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No universities match your search.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((u) => (
              <UniversityCard key={u.name} u={u} />
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Fees are set by universities and may change · figures in ¥ (RMB) per
          year · verify final costs with a NextStep counselor before applying.
        </p>
      </section>
    </main>
  );
}
