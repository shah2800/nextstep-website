"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  Globe2,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultContent } from "@/lib/content";

const iconMap: Record<string, LucideIcon> = {
  Users,
  Building2,
  Globe2,
  BadgeCheck,
};

type Stat = { label: string; value: string; icon: string };

export function Stats() {
  const [stats, setStats] = useState<Stat[]>(defaultContent.stats);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.content?.stats) setStats(d.content.stats);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="stats-section relative -mt-6 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg sm:gap-4 sm:p-6 lg:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = iconMap[s.icon] ?? BadgeCheck;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-secondary"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <div className="text-2xl font-extrabold text-foreground sm:text-3xl">
                    {s.value}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground sm:text-sm">
                    {s.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
