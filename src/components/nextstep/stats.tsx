"use client";

import { motion } from "framer-motion";
import { Users, Building2, Globe2, BadgeCheck, type LucideIcon } from "lucide-react";
import { stats } from "@/lib/countries";
import { useCountUp } from "@/hooks/use-count-up";

const iconMap: Record<string, LucideIcon> = {
  Users,
  Building2,
  Globe2,
  BadgeCheck,
};

function formatNumber(n: number) {
  return n.toLocaleString("en-US");
}

function StatCard({ stat, index }: { stat: typeof stats[number]; index: number }) {
  const Icon = iconMap[stat.icon] ?? BadgeCheck;
  const { ref, value } = useCountUp(stat.target);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-secondary"
    >
      <motion.span
        whileHover={{ rotate: 8, scale: 1.08 }}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white"
      >
        <Icon className="h-5 w-5" />
      </motion.span>
      <div className="leading-tight">
        <div className="text-2xl font-extrabold text-foreground sm:text-3xl tabular-nums">
          <span ref={ref}>
            {formatNumber(value)}
            {stat.suffix}
          </span>
        </div>
        <div className="text-xs font-medium text-muted-foreground sm:text-sm">
          {stat.label}
        </div>
      </div>
    </motion.div>
  );
}

export function Stats() {
  return (
    <section className="relative -mt-6 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg sm:gap-4 sm:p-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <StatCard key={s.label} stat={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
