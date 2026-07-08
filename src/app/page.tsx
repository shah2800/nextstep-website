"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { Header } from "@/components/nextstep/header";
import { Hero } from "@/components/nextstep/hero";
import { Stats } from "@/components/nextstep/stats";
import { Countries } from "@/components/nextstep/countries";
import { CompareFactors } from "@/components/nextstep/compare-factors";
import { Services } from "@/components/nextstep/services";
import { CounselingCta } from "@/components/nextstep/counseling-cta";
import { AssistantSection } from "@/components/nextstep/assistant-section";
import { Newsletter } from "@/components/nextstep/newsletter";
import { Footer } from "@/components/nextstep/footer";
import { GuidanceFormDialog } from "@/components/nextstep/guidance-form-dialog";
import { BookSessionDialog } from "@/components/nextstep/book-session-dialog";
import { AiAssistant } from "@/components/nextstep/ai-assistant";
import { MorphingBanner } from "@/components/nextstep/morphing-banner";
import { useAnalytics } from "@/hooks/use-analytics";

// Lazy-load heavy below-the-fold components so they don't block first paint.
// Recharts (~400KB) only loads when AI Tools scrolls into view.
// Admin/Apply/Track only load when accessed.
const AiTools = lazy(() =>
  import("@/components/nextstep/ai-tools").then((m) => ({ default: m.AiTools }))
);
const AdminDashboard = lazy(() =>
  import("@/components/nextstep/admin-dashboard").then((m) => ({
    default: m.AdminDashboard,
  }))
);
const ApplyPage = lazy(() =>
  import("@/components/nextstep/apply-page").then((m) => ({
    default: m.ApplyPage,
  }))
);
const TrackPage = lazy(() =>
  import("@/components/nextstep/track-page").then((m) => ({
    default: m.TrackPage,
  }))
);

// Minimal loading fallback for lazy sections
function SectionFallback() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />
    </div>
  );
}

type View = "home" | "apply" | "track" | "admin";

export default function Home() {
  const [guidanceOpen, setGuidanceOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [view, setView] = useState<View>("home");

  // Track analytics on the public site
  useAnalytics();

  // Read URL params to determine which view to show
  useEffect(() => {
    const checkView = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "true") setView("admin");
      else if (params.get("apply") === "true") setView("apply");
      else if (params.get("track") === "true") setView("track");
      else setView("home");
    };
    checkView();
    window.addEventListener("popstate", checkView);
    window.addEventListener("pushstate", checkView);
    return () => {
      window.removeEventListener("popstate", checkView);
      window.removeEventListener("pushstate", checkView);
    };
  }, []);

  const closeOverlay = (param: string) => {
    const url = new URL(window.location.href);
    url.searchParams.delete(param);
    window.history.replaceState({}, "", url.toString());
    setView("home");
  };

  // Overlay views (lazy-loaded)
  if (view === "admin") {
    return (
      <Suspense fallback={<SectionFallback />}>
        <AdminDashboard onClose={() => closeOverlay("admin")} />
      </Suspense>
    );
  }
  if (view === "apply") {
    return (
      <Suspense fallback={<SectionFallback />}>
        <ApplyPage onClose={() => closeOverlay("apply")} />
      </Suspense>
    );
  }
  if (view === "track") {
    return (
      <Suspense fallback={<SectionFallback />}>
        <TrackPage onClose={() => closeOverlay("track")} />
      </Suspense>
    );
  }

  return (
    <div className="flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-clip bg-background">
      <MorphingBanner />
      <Header onBookSession={() => setBookingOpen(true)} />

      <main className="flex-1">
        <Hero
          onGetGuidance={() => setGuidanceOpen(true)}
          onBookSession={() => setBookingOpen(true)}
        />
        <Stats />
        <Countries />
        <CompareFactors />
        <Services />
        {/* AI Tools is heavy (Recharts) — lazy load with Suspense */}
        <Suspense fallback={<SectionFallback />}>
          <AiTools />
        </Suspense>
        <CounselingCta
          onGetGuidance={() => setGuidanceOpen(true)}
          onBookSession={() => setBookingOpen(true)}
        />
        <AssistantSection />
        <Newsletter />
      </main>

      <Footer
        onGetGuidance={() => setGuidanceOpen(true)}
        onBookSession={() => setBookingOpen(true)}
      />

      {/* Modals & floating widgets */}
      <GuidanceFormDialog open={guidanceOpen} onOpenChange={setGuidanceOpen} />
      <BookSessionDialog open={bookingOpen} onOpenChange={setBookingOpen} />
      <AiAssistant />
    </div>
  );
}
