"use client";

import { useState } from "react";

/**
 * useCountryParam — reads the ?country= URL parameter and returns the
 * matching country slug (e.g. "australia") or null. Used to "morph" the
 * landing page: the hero, banner, and highlighted country card adapt to
 * the visitor's interest (e.g. arriving from a retargeting ad).
 *
 * Example: /?country=australia → returns "australia"
 */
export function useCountryParam(): string | null {
  // Lazy init — runs once on first client render. Safe for SSR since
  // typeof window check returns null on the server.
  const [country] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const params = new URLSearchParams(window.location.search);
      const c = params.get("country");
      return c ? c.toLowerCase() : null;
    } catch {
      return null;
    }
  });

  return country;
}
