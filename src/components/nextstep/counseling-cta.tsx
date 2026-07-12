"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "./site-content-provider";

export function CounselingCta({
  onGetGuidance,
  onBookSession,
}: {
  onGetGuidance: () => void;
  onBookSession: () => void;
}) {
  const c = useSiteContent();


  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative h-64 overflow-hidden lg:h-full"
          >
            <Image
              src={c.counselingImage}
              alt="NextStep counselor advising a student"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={80}
              loading="lazy"
              className="object-cover"
              // CMS images on R2 are served straight from Cloudflare's CDN —
              // skipping Vercel's optimizer avoids its free-plan quota (402s)
              unoptimized={c.counselingImage.startsWith("http")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand/40 to-transparent lg:bg-gradient-to-r" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-7 sm:p-10"
          >
            <span className="inline-block rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-foreground">
              {c.counselingBadge}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {c.counselingTitle}
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              {c.counselingSubtitle}
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-foreground">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <MapPin className="h-4 w-4" />
                </span>
                {c.footerAddress}
              </div>
              <a
                href={`tel:${c.footerPhone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-brand"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Phone className="h-4 w-4" />
                </span>
                {c.footerPhone}
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                onClick={onGetGuidance}
                size="lg"
                className="bg-brand text-white hover:bg-brand/90"
              >
                {c.counselingCta1}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button onClick={onBookSession} size="lg" variant="outline">
                {c.counselingCta2}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
