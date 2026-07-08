"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin } from "lucide-react";
import { countries } from "@/lib/countries";
import { useCountryParam } from "@/hooks/use-country-param";

/**
 * MorphingBanner — shows a personalized banner when the visitor arrives via
 * ?country=<slug> (e.g. from a retargeting ad). The banner highlights the
 * matching country and its key stats, making the site feel specialized for
 * the visitor's dream destination.
 */
export function MorphingBanner() {
  const countrySlug = useCountryParam();
  const [dismissed, setDismissed] = useState(false);

  const country = countrySlug
    ? countries.find((c) => c.slug === countrySlug)
    : null;

  if (!country || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative z-30 bg-gradient-to-r ${country.gradient} text-white shadow-lg`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <span className="text-3xl drop-shadow-md">{country.flagEmoji}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm font-bold">
              <MapPin className="h-4 w-4" />
              Specialized in {country.name}
            </div>
            <p className="text-xs text-white/90">
              {country.tagline} · Tuition from {country.tuitionRange.split(" – ")[0]} · {country.workRights.split(";")[0]}
            </p>
          </div>
          <a
            href="#destinations"
            className="hidden rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold backdrop-blur transition hover:bg-white/30 sm:inline-block"
          >
            View {country.name} guide →
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="rounded-full p-1 text-white/80 transition hover:bg-white/20 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
