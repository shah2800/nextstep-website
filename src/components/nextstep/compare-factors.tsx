"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Wallet,
  FileCheck,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { defaultContent } from "@/lib/content";

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Wallet,
  FileCheck,
};

type Factor = {
  icon: string;
  title: string;
  description: string;
  points: string[];
};

export function CompareFactors() {
  const [factors, setFactors] = useState<Factor[]>(
    defaultContent.compareFactors
  );

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.content?.compareFactors) setFactors(d.content.compareFactors);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="compare" className="scroll-mt-20 bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
            Before you shortlist
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Compare the factors that affect your application
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Rankings alone don&apos;t tell you whether a destination is
            suitable. Review these practical points with your counselor before
            paying application or test fees.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {factors.map((f, i) => {
            const Icon = iconMap[f.icon] ?? FileCheck;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/10 transition-transform group-hover:scale-150" />
                <div className="relative">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white shadow-md">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {f.description}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {f.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2 text-sm text-foreground/90"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
