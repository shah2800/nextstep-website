"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles, Globe2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCountryParam } from "@/hooks/use-country-param";
import { countries } from "@/lib/countries";

export function Hero({
  onGetGuidance,
  onBookSession,
}: {
  onGetGuidance: () => void;
  onBookSession: () => void;
}) {
  const countrySlug = useCountryParam();
  const morphCountry = countrySlug
    ? countries.find((c) => c.slug === countrySlug)
    : null;

  return (
    <section className="relative overflow-hidden [contain:paint] hero-mesh text-white">
      <div className="absolute inset-0 dot-grid opacity-40" />
      {/* Floating decorative shapes */}
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-24">
        {/* Left text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            {morphCountry
              ? `${morphCountry.flagEmoji} Specialized in ${morphCountry.name}`
              : "Trusted by 12,000+ Pakistani students"}
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {morphCountry ? (
              <>
                Study in{" "}
                <span className="bg-gradient-to-r from-gold to-amber-200 bg-clip-text text-transparent">
                  {morphCountry.name}
                </span>{" "}
                {morphCountry.flagEmoji}
              </>
            ) : (
              <>
                Study destinations{" "}
                <span className="bg-gradient-to-r from-gold to-amber-200 bg-clip-text text-transparent">
                  matched to your goals
                </span>{" "}
                and budget
              </>
            )}
          </h1>

          <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">
            {morphCountry
              ? `${morphCountry.shortDesc} Tuition from ${morphCountry.tuitionRange.split(" – ")[0]}. ${morphCountry.workRights.split(";")[0]}.`
              : "Compare country guides covering universities, admissions, tuition, living costs, scholarships, and visa considerations for students applying from Pakistan — all in one place."}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              onClick={onGetGuidance}
              size="lg"
              data-track="cta"
              data-label="Get My Options Reviewed"
              className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-lg"
            >
              Get My Options Reviewed
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={onBookSession}
              size="lg"
              variant="outline"
              data-track="cta"
              data-label="Book a Session"
              className="border-white/40 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              Book a Session
            </Button>
          </div>

          {/* Trust row */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/80">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold" />
              Direct University Partnerships · 850+ Institutions
            </span>
            <span className="inline-flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-gold" />
              15+ Years of Trusted Guidance
            </span>
          </div>
        </motion.div>

        {/* Right image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
            <Image
              src="/images/hero-students.png"
              alt="International students on a university campus"
              width={1344}
              height={768}
              priority
              fetchPriority="high"
              sizes="(max-width: 640px) 100vw, 50vw"
              quality={80}
              className="h-[300px] w-full object-cover sm:h-[420px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand/60 via-transparent to-transparent" />
          </div>

          {/* Floating stat cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute -left-3 bottom-6 rounded-2xl border border-white/20 bg-white/95 p-3 shadow-xl backdrop-blur sm:-left-6"
          >
            <div className="text-2xl font-extrabold text-brand">96%</div>
            <div className="text-[11px] font-medium text-muted-foreground">
              Visa success rate
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="absolute -right-2 top-6 rounded-2xl border border-white/20 bg-white/95 p-3 shadow-xl backdrop-blur sm:-right-4"
          >
            <div className="text-2xl font-extrabold text-brand">850+</div>
            <div className="text-[11px] font-medium text-muted-foreground">
              Partner universities
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="relative">
        <svg
          viewBox="0 0 1440 80"
          className="block w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="var(--background)"
            d="M0,32 C240,80 480,80 720,56 C960,32 1200,32 1440,16 L1440,80 L0,80 Z"
          />
        </svg>
      </div>
    </section>
  );
}
