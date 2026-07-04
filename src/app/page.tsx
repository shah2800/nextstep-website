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
import { MorphingBanner } from "@/components/nextstep/morphing-banner";
import { useAnalytics } from "@/hooks/use-analytics";

export default function Home() {
  const [guidanceOpen, setGuidanceOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  // Track analytics on the public site
  useAnalytics();

  // Check for ?admin=true on mount and on URL changes
  useEffect(() => {
    const checkAdmin = () => {
      const params = new URLSearchParams(window.location.search);
      setAdminMode(params.get("admin") === "true");
    };
    checkAdmin();
    window.addEventListener("popstate", checkAdmin);
    window.addEventListener("pushstate", checkAdmin);
    return () => {
      window.removeEventListener("popstate", checkAdmin);
      window.removeEventListener("pushstate", checkAdmin);
    };
  }, []);

  // Admin mode: render the dashboard overlay
  if (adminMode) {
    return <AdminDashboard onClose={() => {
      setAdminMode(false);
      const url = new URL(window.location.href);
      url.searchParams.delete("admin");
      window.history.replaceState({}, "", url.toString());
    }} />;
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
