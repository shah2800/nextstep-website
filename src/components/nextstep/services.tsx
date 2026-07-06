"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Compass,
  FileCheck,
  Plane,
  GraduationCap,
  Wallet,
  Home,
  type LucideIcon,
} from "lucide-react";
import { defaultContent } from "@/lib/content";

const iconMap: Record<string, LucideIcon> = {
  Compass,
  FileCheck,
  Plane,
  GraduationCap,
  Wallet,
  Home,
};

type Service = {
  icon: string;
  title: string;
  description: string;
};

export function Services() {
  const [services, setServices] = useState<Service[]>(defaultContent.services);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.content?.services) setServices(d.content.services);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="services" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
            What we do
          </span>
          <h2 className="mt-3 headline-tight text-3xl font-extrabold text-foreground sm:text-4xl">
            End-to-end support from course selection to visa
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            A single consultancy handling every step of your study-abroad
            journey — so you can focus on your studies while we handle the
            paperwork.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon] ?? Compass;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                className="card-premium group relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-brand/30"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>
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
