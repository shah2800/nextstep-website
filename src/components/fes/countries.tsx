"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CountryDetailDialog } from "./country-detail-dialog";
import type { CountryData } from "@/lib/countries";

type CountryRow = CountryData & { id: string };

export function Countries() {
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
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
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
                  <Skeleton className="h-36 w-full rounded-none" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-9 w-full" />
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
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Header banner */}
                  <div
                    className={`relative h-32 bg-gradient-to-br ${c.gradient}`}
                  >
                    <div className="absolute inset-0 dot-grid opacity-25" />
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
