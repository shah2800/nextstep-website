"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CountryDetailDialog } from "./country-detail-dialog";
import { useCountryParam } from "@/hooks/use-country-param";
import type { CountryData } from "@/lib/countries";

type CountryRow = CountryData & { id: string };

/** Card banner painted in each country's real flag colors (fallback: DB gradient). */
const FLAG_BANNERS: Record<string, string> = {
  china: "linear-gradient(135deg, #DE2910 0%, #B81D08 75%, #8f1503 100%)",
  georgia: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 45%, #FF0000 130%)",
  turkiye: "linear-gradient(135deg, #E30A17 0%, #C00812 70%, #96060e 100%)",
  "united-kingdom": "linear-gradient(135deg, #012169 0%, #1a3a8f 55%, #C8102E 130%)",
  "united-states": "linear-gradient(135deg, #3C3B6E 0%, #4a4987 50%, #B22234 130%)",
  canada: "linear-gradient(90deg, #D80621 0%, #D80621 28%, #f2f2f2 50%, #D80621 72%, #D80621 100%)",
  germany: "linear-gradient(180deg, #1a1a1a 0%, #1a1a1a 34%, #DD0000 34%, #DD0000 67%, #FFCE00 67%, #FFCE00 100%)",
  australia: "linear-gradient(135deg, #00247D 0%, #012169 60%, #C8102E 140%)",
  hungary: "linear-gradient(180deg, #CE2939 0%, #CE2939 34%, #f2f2f2 34%, #f2f2f2 67%, #477050 67%, #477050 100%)",
  russia: "linear-gradient(180deg, #f2f2f2 0%, #f2f2f2 34%, #0039A6 34%, #0039A6 67%, #D52B1E 67%, #D52B1E 100%)",
  azerbaijan: "linear-gradient(180deg, #00B5E2 0%, #00B5E2 34%, #EF3340 34%, #EF3340 67%, #509E2F 67%, #509E2F 100%)",
  kazakhstan: "linear-gradient(135deg, #00AFCA 0%, #0097b0 70%, #FEC50C 140%)",
  malaysia: "linear-gradient(135deg, #010066 0%, #1a1a8c 55%, #CC0001 130%)",
  indonesia: "linear-gradient(180deg, #CE1126 0%, #CE1126 50%, #f2f2f2 50%, #f2f2f2 100%)",
  ireland: "linear-gradient(90deg, #169B62 0%, #169B62 34%, #f2f2f2 50%, #FF883E 67%, #FF883E 100%)",
  netherlands: "linear-gradient(180deg, #AE1C28 0%, #AE1C28 34%, #f2f2f2 34%, #f2f2f2 67%, #21468B 67%, #21468B 100%)",
  singapore: "linear-gradient(180deg, #EF3340 0%, #EF3340 50%, #f2f2f2 50%, #f2f2f2 100%)",
  uae: "linear-gradient(90deg, #FF0000 0%, #FF0000 25%, #00732F 25%, #00732F 50%, #f2f2f2 50%, #f2f2f2 75%, #1a1a1a 75%, #1a1a1a 100%)",
  "new-zealand": "linear-gradient(135deg, #00247D 0%, #012169 60%, #C8102E 140%)",
};

export function Countries() {
  const morphSlug = useCountryParam();
  const [countries, setCountries] = useState<CountryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const [active, setActive] = useState<CountryRow | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/countries", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled && data.countries) {
          setCountries(data.countries);
        }
      } catch (e) {
        console.error("Failed to load countries", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = countries.filter((c) => {
    const matchesQuery =
      !query ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.tagline.toLowerCase().includes(query.toLowerCase()) ||
      c.popularCourses.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "all" || c.featured;
    return matchesQuery && matchesFilter;
  });

  return (
    <section id="destinations" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-3">
            <GlobeIcon /> Country Guides
          </Badge>
          <h2 className="headline-tight text-3xl font-extrabold text-foreground sm:text-4xl">
            Country guides for planning your application
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Open a destination to review its study environment, university
            options, admission expectations, estimated costs, and practical
            information before making a shortlist.
          </p>
        </div>

        {/* Search + filter */}
        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by country, course or tagline…"
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-brand text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("featured")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === "featured"
                  ? "bg-brand text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Popular
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="skeleton h-36 w-full" />
                  <div className="space-y-3 p-5">
                    <div className="skeleton h-5 w-2/3 rounded" />
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-4 w-5/6 rounded" />
                    <div className="flex gap-2 pt-2">
                      <div className="skeleton h-6 w-16 rounded-full" />
                      <div className="skeleton h-6 w-20 rounded-full" />
                    </div>
                    <div className="skeleton h-9 w-full rounded-lg" />
                  </div>
                </div>
              ))
            : filtered.map((c, i) => (
                <motion.button
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                  onClick={() => setActive(c)}
                  data-track="country-card"
                  data-label={c.name}
                  className={`card-premium group relative overflow-hidden rounded-2xl border bg-card text-left shadow-sm ${
                    morphSlug && c.slug === morphSlug
                      ? "border-gold ring-2 ring-gold/50 ring-offset-2"
                      : "border-border"
                  }`}
                >
                  {/* Header banner — painted in the country's flag colors */}
                  <div
                    className={`relative h-32 ${FLAG_BANNERS[c.slug] ? "" : `bg-gradient-to-br ${c.gradient}`}`}
                    style={FLAG_BANNERS[c.slug] ? { background: FLAG_BANNERS[c.slug] } : undefined}
                  >
                    <div className="absolute inset-0 dot-grid opacity-25" />
                    {/* dark fade so the name stays readable on light flag colors */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
                    <div className="absolute left-4 top-4 text-4xl drop-shadow-md">
                      {c.flagEmoji}
                    </div>
                    {c.featured && (
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                        <Star className="h-3 w-3 fill-gold text-gold" />
                        Popular
                      </span>
                    )}
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-lg font-bold text-white drop-shadow-md">
                        {c.name}
                      </h3>
                      <p className="text-xs text-white/85 line-clamp-1">
                        {c.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {c.shortDesc}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="font-normal">
                        {c.currency.split(" ")[0]}
                      </Badge>
                      <Badge variant="secondary" className="font-normal">
                        {c.intakeMonths.split(" ")[0]} intake
                      </Badge>
                      <Badge variant="secondary" className="font-normal">
                        {c.language.split(" ")[0]}
                      </Badge>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-xs font-medium text-muted-foreground">
                        Tuition from{" "}
                        <span className="font-semibold text-foreground">
                          {c.tuitionRange.split(" – ")[0]}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand transition-transform group-hover:translate-x-1">
                        View guide
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
            <p className="text-muted-foreground">
              No destinations match{" "}
              <span className="font-semibold text-foreground">"{query}"</span>.
              Try another search term.
            </p>
          </div>
        )}
      </div>

      {/* Detail dialog */}
      <CountryDetailDialog
        country={active}
        onClose={() => setActive(null)}
      />
    </section>
  );
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="mr-1 h-3.5 w-3.5"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
    </svg>
  );
}
