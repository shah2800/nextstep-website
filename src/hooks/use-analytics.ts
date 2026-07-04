"use client";

import { useEffect, useRef } from "react";

/**
 * useAnalytics — lightweight client-side analytics tracker.
 * Records: visit (page load), clicks on [data-track] elements, and
 * section view durations via IntersectionObserver on [id] sections.
 *
 * Uses a sessionId stored in localStorage so returning visitors are
 * recognized across reloads.
 */
export function useAnalytics() {
  const sessionTimers = useRef<Record<string, number>>({});

  useEffect(() => {
    // Only track on the public site (not in admin mode)
    if (typeof window === "undefined") return;
    if (window.location.search.includes("admin=true")) return;

    // Get or create sessionId
    let sessionId = localStorage.getItem("nextstep-session");
    if (!sessionId) {
      sessionId = `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem("nextstep-session", sessionId);
    }

    // 1. Record visit
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        event: "visit",
        referrer: document.referrer || "",
        userAgent: navigator.userAgent.slice(0, 200),
      }),
      keepalive: true,
    }).catch(() => {});

    // 2. Click tracking on [data-track] elements
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("[data-track]");
      if (!target) return;
      const elementType = target.getAttribute("data-track") || "unknown";
      const elementLabel =
        target.getAttribute("data-label") ||
        target.textContent?.trim().slice(0, 60) ||
        "";
      const section =
        target.closest("section")?.id ||
        target.closest("[id]")?.id ||
        "unknown";
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          event: "click",
          elementType,
          elementLabel,
          section,
        }),
        keepalive: true,
      }).catch(() => {});
    };
    document.addEventListener("click", onClick, true);

    // 3. Section view duration via IntersectionObserver
    const sectionEls = Array.from(
      document.querySelectorAll("section[id], [id][data-track-section]")
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).id;
          if (!id) return;
          if (entry.isIntersecting) {
            sessionTimers.current[id] = Date.now();
          } else if (sessionTimers.current[id]) {
            const duration = Date.now() - sessionTimers.current[id];
            if (duration > 1000) {
              // only record if viewed >1s
              fetch("/api/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  sessionId,
                  event: "section",
                  sectionId: id,
                  durationMs: duration,
                }),
                keepalive: true,
              }).catch(() => {});
            }
            delete sessionTimers.current[id];
          }
        });
      },
      { threshold: 0.3 }
    );
    sectionEls.forEach((el) => observer.observe(el));

    // 4. On unload, flush any open section timers
    const flush = () => {
      Object.entries(sessionTimers.current).forEach(([id, start]) => {
        const duration = Date.now() - start;
        if (duration > 1000 && typeof navigator !== "undefined" && navigator.sendBeacon) {
          navigator.sendBeacon(
            "/api/track",
            JSON.stringify({
              sessionId,
              event: "section",
              sectionId: id,
                durationMs: duration,
              })
            );
        }
      });
    };
    window.addEventListener("beforeunload", flush);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("beforeunload", flush);
      observer.disconnect();
    };
  }, []);
}
