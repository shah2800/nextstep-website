"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Coins,
  Languages,
  GraduationCap,
  Calendar,
  Award,
  Briefcase,
  FileCheck,
  Building2,
  BookOpen,
  X,
} from "lucide-react";
import type { CountryData } from "@/lib/countries";

type CountryRow = CountryData & { id: string };

export function CountryDetailDialog({
  country,
  onClose,
}: {
  country: CountryRow | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!country} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-hidden p-0 sm:max-w-3xl">
        {country && (
          <>
            {/* Banner */}
            <div
              className={`relative h-44 bg-gradient-to-br ${country.gradient} sm:h-52`}
            >
              <div className="absolute inset-0 dot-grid opacity-30" />
              <button
                onClick={onClose}
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-brand shadow-md transition hover:bg-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <div className="flex items-center gap-3">
                  <span className="text-5xl drop-shadow-md">
                    {country.flagEmoji}
                  </span>
                  <div>
                    <DialogTitle className="text-2xl font-extrabold drop-shadow-md sm:text-3xl">
                      {country.name}
                    </DialogTitle>
                    <p className="text-sm text-white/90">{country.tagline}</p>
                  </div>
                </div>
              </div>
            </div>

            <ScrollArea className="custom-scroll max-h-[calc(92vh-13rem)]">
              <div className="space-y-6 p-5 sm:p-7">
                {/* Quick facts grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <FactCard
                    icon={<MapPin className="h-4 w-4" />}
                    label="Capital"
                    value={country.capital}
                  />
                  <FactCard
                    icon={<Coins className="h-4 w-4" />}
                    label="Currency"
                    value={country.currency}
                  />
                  <FactCard
                    icon={<Languages className="h-4 w-4" />}
                    label="Language"
                    value={country.language}
                  />
                  <FactCard
                    icon={<Calendar className="h-4 w-4" />}
                    label="Intakes"
                    value={country.intakeMonths.split("(")[0].trim()}
                  />
                </div>

                {/* Overview */}
                <section>
                  <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-foreground">
                    <BookOpen className="h-4 w-4 text-brand" />
                    Overview
                  </h3>
                  <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                    {country.longDesc}
                  </DialogDescription>
                </section>

                {/* Tuition & living */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoTile
                    icon={<GraduationCap className="h-4 w-4" />}
                    label="Tuition Range"
                    value={country.tuitionRange}
                  />
                  <InfoTile
                    icon={<Coins className="h-4 w-4" />}
                    label="Estimated Living Cost"
                    value={country.livingCost}
                  />
                </div>

                {/* Top universities */}
                <section>
                  <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-foreground">
                    <Building2 className="h-4 w-4 text-brand" />
                    Top Universities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {country.topUniversities
                      .split(",")
                      .map((u) => u.trim())
                      .filter(Boolean)
                      .map((u) => (
                        <Badge
                          key={u}
                          variant="secondary"
                          className="font-normal"
                        >
                          {u}
                        </Badge>
                      ))}
                  </div>
                </section>

                {/* Popular courses */}
                <section>
                  <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-foreground">
                    <BookOpen className="h-4 w-4 text-brand" />
                    Popular Courses
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {country.popularCourses
                      .split(",")
                      .map((c) => c.trim())
                      .filter(Boolean)
                      .map((c) => (
                        <Badge
                          key={c}
                          className="bg-brand/10 font-normal text-brand"
                        >
                          {c}
                        </Badge>
                      ))}
                  </div>
                </section>

                {/* Visa process */}
                <section className="rounded-xl border border-border bg-secondary/40 p-4">
                  <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-foreground">
                    <FileCheck className="h-4 w-4 text-brand" />
                    Visa Process
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {country.visaProcess}
                  </p>
                </section>

                {/* Scholarships & work rights */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <section className="rounded-xl border border-border p-4">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                      <Award className="h-4 w-4 text-gold" />
                      Scholarships
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {country.scholarships}
                    </p>
                  </section>
                  <section className="rounded-xl border border-border p-4">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                      <Briefcase className="h-4 w-4 text-gold" />
                      Work Rights
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {country.workRights}
                    </p>
                  </section>
                </div>

                {/* China MBBS universities link */}
                {country.slug === "china" && (
                  <a
                    href="/china-mbbs"
                    className="flex items-center justify-between gap-3 rounded-xl border-2 border-gold/60 bg-gold/10 p-4 transition hover:bg-gold/20"
                  >
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        🇨🇳 MBBS Universities &amp; Costs 2026
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Compare 29 partner universities — packages, tuition,
                        hostel &amp; HSK requirements
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-gold-foreground">
                      View all →
                    </span>
                  </a>
                )}

                {/* CTA */}
                <div className="flex flex-col gap-2 rounded-xl bg-brand p-4 text-white sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      Ready to apply to {country.name}?
                    </p>
                    <p className="text-xs text-white/80">
                      Get a free personalized roadmap from a NextStep counselor.
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    className="bg-gold text-gold-foreground hover:bg-gold/90"
                    onClick={onClose}
                  >
                    Request Guidance
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function FactCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-1 flex items-center gap-1.5 text-brand">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
