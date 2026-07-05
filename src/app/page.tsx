"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/nextstep/header";
import { Hero } from "@/components/nextstep/hero";
import { Stats } from "@/components/nextstep/stats";
import { Countries } from "@/components/nextstep/countries";
import { CompareFactors } from "@/components/nextstep/compare-factors";
import { Services } from "@/components/nextstep/services";
import { AiTools } from "@/components/nextstep/ai-tools";
import { CounselingCta } from "@/components/nextstep/counseling-cta";
import { AssistantSection } from "@/components/nextstep/assistant-section";
import { Newsletter } from "@/components/nextstep/newsletter";
import { Footer } from "@/components/nextstep/footer";
import { GuidanceFormDialog } from "@/components/nextstep/guidance-form-dialog";
import { BookSessionDialog } from "@/components/nextstep/book-session-dialog";
import { AiAssistant } from "@/components/nextstep/ai-assistant";
import { AdminDashboard } from "@/components/nextstep/admin-dashboard";
import { ApplyPage } from "@/components/nextstep/apply-page";
import { TrackPage } from "@/components/nextstep/track-page";
import { MorphingBanner } from "@/components/nextstep/morphing-banner";
import { useAnalytics } from "@/hooks/use-analytics";

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

  // Overlay views
  if (view === "admin") {
    return <AdminDashboard onClose={() => closeOverlay("admin")} />;
  }
  if (view === "apply") {
    return <ApplyPage onClose={() => closeOverlay("apply")} />;
  }
  if (view === "track") {
    return <TrackPage onClose={() => closeOverlay("track")} />;
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
        <AiTools />
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
