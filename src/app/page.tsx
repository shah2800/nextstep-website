"use client";

import { useState } from "react";
import { Header } from "@/components/fes/header";
import { Hero } from "@/components/fes/hero";
import { Stats } from "@/components/fes/stats";
import { Countries } from "@/components/fes/countries";
import { CompareFactors } from "@/components/fes/compare-factors";
import { Services } from "@/components/fes/services";
import { CounselingCta } from "@/components/fes/counseling-cta";
import { AssistantSection } from "@/components/fes/assistant-section";
import { Newsletter } from "@/components/fes/newsletter";
import { Footer } from "@/components/fes/footer";
import { GuidanceFormDialog } from "@/components/fes/guidance-form-dialog";
import { BookSessionDialog } from "@/components/fes/book-session-dialog";
import { AiAssistant } from "@/components/fes/ai-assistant";

export default function Home() {
  const [guidanceOpen, setGuidanceOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
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
