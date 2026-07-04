"use client";

import { useState } from "react";
import { FileScan, PenLine, Calculator, Sparkles, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentAnalyzer } from "./document-analyzer";
import { SopReviewer } from "./sop-reviewer";
import { CostCalculator } from "./cost-calculator";
import { ProfileScreener } from "./profile-screener";

export function AiTools() {
  const [tab, setTab] = useState("screener");

  return (
    <section id="ai-tools" className="scroll-mt-20 bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Smart Tools
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            AI-powered tools to fast-track your application
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Get instant match scores, upload your transcript for university
            matches, review your SOP with AI, and budget your journey — all in
            one place.
          </p>
        </div>

        {/* Tabs */}
        <div className="mx-auto mt-10 max-w-5xl">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="screener" className="gap-1.5 text-xs sm:text-sm">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Profile </span>Screener
              </TabsTrigger>
              <TabsTrigger value="analyzer" className="gap-1.5 text-xs sm:text-sm">
                <FileScan className="h-4 w-4" />
                <span className="hidden sm:inline">Document </span>Analyzer
              </TabsTrigger>
              <TabsTrigger value="sop" className="gap-1.5 text-xs sm:text-sm">
                <PenLine className="h-4 w-4" />
                <span className="hidden sm:inline">SOP </span>Reviewer
              </TabsTrigger>
              <TabsTrigger value="cost" className="gap-1.5 text-xs sm:text-sm">
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">Cost </span>Calculator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="screener" className="mt-6">
              <ProfileScreener />
            </TabsContent>
            <TabsContent value="analyzer" className="mt-6">
              <DocumentAnalyzer />
            </TabsContent>
            <TabsContent value="sop" className="mt-6">
              <SopReviewer />
            </TabsContent>
            <TabsContent value="cost" className="mt-6">
              <CostCalculator />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
