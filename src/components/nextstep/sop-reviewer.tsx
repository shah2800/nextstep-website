"use client";

import { useState } from "react";
import {
  PenLine,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Flag,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { countries } from "@/lib/countries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Review = {
  overallScore?: number;
  scores?: Record<string, number>;
  verdict?: string;
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: Array<{ quote: string; issue: string; fix: string }>;
  quickTips?: string[];
  redFlags?: string[];
};

const scoreLabels: Record<string, string> = {
  structure: "Structure",
  clarity: "Clarity",
  motivation: "Motivation",
  fit: "Course Fit",
  language: "Language",
};

function scoreColor(score: number) {
  if (score >= 75) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

function verdictColor(verdict: string) {
  const v = verdict.toLowerCase();
  if (v.includes("excellent") || v.includes("strong")) return "bg-green-100 text-green-700";
  if (v.includes("good")) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export function SopReviewer() {
  const [sop, setSop] = useState("");
  const [targetCountry, setTargetCountry] = useState("");
  const [targetCourse, setTargetCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<Review | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reviewSop = async () => {
    if (sop.length < 50 || loading) return;
    setLoading(true);
    setError(null);
    setReview(null);
    try {
      const res = await fetch("/api/review-sop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sop, targetCountry, targetCourse }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Review failed");
      }
      setReview(data.review);
      toast.success("SOP reviewed!", {
        description: `Score: ${data.review.overallScore ?? 0}/100`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Please try again";
      setError(msg);
      toast.error("Review failed", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input column */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Target Country (optional)</Label>
              <Select value={targetCountry} onValueChange={setTargetCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {countries.map((c) => (
                    <SelectItem key={c.slug} value={c.name}>
                      {c.flagEmoji} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Target Course (optional)</Label>
              <Input
                value={targetCourse}
                onChange={(e) => setTargetCourse(e.target.value)}
                placeholder="e.g. MSc Computer Science"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Your Statement of Purpose</Label>
            <Textarea
              value={sop}
              onChange={(e) => setSop(e.target.value)}
              placeholder="Paste your SOP here… Share your academic background, motivation for the course, career goals, and why you chose this university and country."
              rows={12}
              className="resize-y text-sm leading-relaxed"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{sop.length} characters</span>
              <span>Min 50 · Max 8000</span>
            </div>
          </div>

          <Button
            onClick={reviewSop}
            disabled={sop.length < 50 || loading}
            className="w-full bg-brand text-white hover:bg-brand/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reviewing your SOP…
              </>
            ) : (
              <>
                <PenLine className="mr-2 h-4 w-4" />
                Review My SOP with AI
              </>
            )}
          </Button>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results column */}
      <Card>
        <CardContent className="p-6">
          {!review && !loading && (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center text-muted-foreground">
              <PenLine className="h-12 w-12 text-border" />
              <p className="mt-3 text-sm">
                Your AI-powered SOP review — score, strengths, weaknesses, and
                line-by-line suggestions — will appear here.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <Loader2 className="h-10 w-10 animate-spin text-brand" />
              <p className="mt-4 text-sm font-medium text-foreground">
                Reviewing your SOP…
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Scoring structure, clarity, motivation, fit, and language.
              </p>
            </div>
          )}

          {review && !loading && (
            <div className="space-y-5">
              {/* Overall score */}
              <div className="flex items-center justify-between rounded-2xl bg-brand p-5 text-white">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-white/80">
                    Overall Score
                  </div>
                  <div className="text-4xl font-extrabold tabular-nums">
                    {review.overallScore ?? 0}
                    <span className="text-xl text-white/70">/100</span>
                  </div>
                </div>
                {review.verdict && (
                  <Badge className={`${verdictColor(review.verdict)} border-0 text-sm font-bold`}>
                    {review.verdict}
                  </Badge>
                )}
              </div>

              {/* Category scores */}
              {review.scores && (
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(review.scores).map(([key, val]) => (
                    <div
                      key={key}
                      className="rounded-lg border border-border bg-secondary/30 p-2 text-center"
                    >
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {scoreLabels[key] ?? key}
                      </div>
                      <div className={`text-lg font-bold tabular-nums ${scoreColor(val)}`}>
                        {val}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Strengths */}
              {review.strengths && review.strengths.length > 0 && (
                <Section
                  icon={<ThumbsUp className="h-4 w-4 text-green-600" />}
                  title="Strengths"
                >
                  <ul className="space-y-1.5">
                    {review.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Weaknesses */}
              {review.weaknesses && review.weaknesses.length > 0 && (
                <Section
                  icon={<ThumbsDown className="h-4 w-4 text-red-600" />}
                  title="Weaknesses"
                >
                  <ul className="space-y-1.5">
                    {review.weaknesses.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Suggestions with quotes */}
              {review.suggestions && review.suggestions.length > 0 && (
                <Section
                  icon={<Lightbulb className="h-4 w-4 text-gold" />}
                  title="Line-by-Line Suggestions"
                >
                  <div className="space-y-3">
                    {review.suggestions.map((s, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-border bg-secondary/30 p-3"
                      >
                        <div className="flex items-start gap-2">
                          <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <p className="flex-1 text-sm italic text-foreground/80">
                            &ldquo;{s.quote}&rdquo;
                          </p>
                        </div>
                        <div className="mt-2 pl-5 text-xs">
                          <span className="font-semibold text-red-600">Issue: </span>
                          <span className="text-muted-foreground">{s.issue}</span>
                        </div>
                        <div className="mt-1 pl-5 text-xs">
                          <span className="font-semibold text-green-600">Fix: </span>
                          <span className="text-foreground/90">{s.fix}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Red flags */}
              {review.redFlags && review.redFlags.length > 0 && (
                <Section
                  icon={<Flag className="h-4 w-4 text-red-600" />}
                  title="Red Flags"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {review.redFlags.map((f, i) => (
                      <Badge key={i} variant="outline" className="border-red-300 text-red-700">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </Section>
              )}

              {/* Quick tips */}
              {review.quickTips && review.quickTips.length > 0 && (
                <Section
                  icon={<CheckCircle2 className="h-4 w-4 text-brand" />}
                  title="Quick Tips"
                >
                  <ul className="space-y-1.5">
                    {review.quickTips.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">
                          {i + 1}
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
        {icon}
        {title}
      </h4>
      {children}
    </div>
  );
}
