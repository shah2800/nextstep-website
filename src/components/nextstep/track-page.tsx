"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Search,
  Loader2,
  AlertCircle,
  MessageCircle,
  Globe2,
  BookOpen,
  Clock,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Milestone = {
  label: string;
  note: string;
  status: "done" | "active" | "issue" | "pending";
};

type TrackResult = {
  registrationId: string;
  fullName: string;
  countryInterest: string;
  courseInterest: string;
  status: string;
  headline: string;
  stageUpdatedAt: string;
  updatedAt: string;
  milestones: Milestone[];
};

const milestoneConfig = {
  done: { emoji: "✅", badge: "Completed", badgeClass: "bg-green-100 text-green-700", bgClass: "bg-green-50 border-green-200" },
  active: { emoji: "⏳", badge: "In Progress", badgeClass: "bg-amber-100 text-amber-700", bgClass: "bg-amber-50 border-amber-200" },
  issue: { emoji: "⚠️", badge: "Action Needed", badgeClass: "bg-red-100 text-red-700", bgClass: "bg-red-50 border-red-200" },
  pending: { emoji: "⬜", badge: "Pending", badgeClass: "bg-secondary text-muted-foreground", bgClass: "bg-card border-border" },
};

function formatDate(d: string) {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime())
    ? "—"
    : dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function TrackPage({ onClose }: { onClose: () => void }) {
  const [rid, setRid] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    const id = rid.trim().toUpperCase();
    if (!id) {
      setError("Please enter your Register ID (e.g. NSI-2026-001).");
      return;
    }
    setLoading(true);
    setError(null);
    setNotFound(false);
    setResult(null);
    try {
      const res = await fetch(`/api/track?registrationId=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (res.status === 404) {
        setNotFound(true);
      } else if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const doneCount = result?.milestones.filter((m) => m.status === "done").length ?? 0;
  const progressPct = result && result.milestones.length
    ? Math.round((doneCount / result.milestones.length) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <span className="text-lg font-extrabold text-brand">NextStep Track</span>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Site
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="hero-mesh px-4 py-10 text-center text-white">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
          Live Tracking
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Track Your Application
        </h1>
        <div className="mx-auto mt-3 h-0.5 w-16 rounded bg-gold" />
        <p className="mx-auto mt-4 max-w-md text-sm text-white/85">
          Enter your Register ID to see real-time status updates and milestones
          for your university journey.
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Search */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Your Register ID
          </Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={rid}
              onChange={(e) => {
                setRid(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="e.g. NSI-2026-001"
              className="uppercase"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
            />
            <Button onClick={search} disabled={loading} className="bg-brand hover:bg-brand/90 sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching…
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Check Status
                </>
              )}
            </Button>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5" />
            Your Register ID was sent to your WhatsApp after submitting the application form.
          </p>
          {error && (
            <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        {/* Not found */}
        {notFound && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-2xl border border-border bg-card p-8 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-3xl">
              🔍
            </div>
            <h3 className="mt-4 text-xl font-bold text-foreground">Application Not Found</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              We couldn&apos;t find an application with ID{" "}
              <strong className="text-foreground">{rid.toUpperCase()}</strong>. Please
              double-check your Register ID or contact us on WhatsApp.
            </p>
            <a
              href="https://wa.me/995511113670?text=Assalam%20o%20Alaikum%2C%20I%20need%20help%20finding%20my%20application"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="mt-4 bg-green-500 hover:bg-green-600">
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat on WhatsApp
              </Button>
            </a>
          </motion.div>
        )}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            {/* Header */}
            <div className="border-b border-border bg-secondary/20 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-bold text-foreground">{result.fullName}</div>
                  <div className="font-mono text-sm text-brand">{result.registrationId}</div>
                </div>
              </div>
              {(result.countryInterest || result.courseInterest) && (
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {result.countryInterest && (
                    <span className="inline-flex items-center gap-1">
                      <Globe2 className="h-3.5 w-3.5" />
                      {result.countryInterest}
                    </span>
                  )}
                  {result.courseInterest && (
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {result.courseInterest}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Progress bar */}
            {result.milestones.length > 0 && (
              <div className="border-b border-border p-5">
                <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wide">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="text-brand">{progressPct}% complete</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-brand to-gold"
                  />
                </div>
              </div>
            )}

            {/* Milestones */}
            {result.milestones.length > 0 && (
              <div className="p-5">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Application Milestones
                </h4>
                <div className="space-y-2">
                  {result.milestones.map((m, i) => {
                    const cfg = milestoneConfig[m.status];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-3 rounded-lg border p-3 ${cfg.bgClass}`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg">
                          {cfg.emoji}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-foreground">{m.label}</div>
                          {m.note && <div className="text-xs text-muted-foreground">{m.note}</div>}
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${cfg.badgeClass}`}>
                          {cfg.badge}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-secondary/20 p-5">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Last updated: {formatDate(result.stageUpdatedAt)}
                </div>
                {result.headline && (
                  <div className="mt-1 text-xs italic text-foreground/80">{result.headline}</div>
                )}
              </div>
              <a
                href={`https://wa.me/995511113670?text=Assalam%20o%20Alaikum%2C%20I%20have%20a%20question%20about%20my%20application%20${result.registrationId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-green-500 hover:bg-green-600">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </motion.div>
        )}

        {/* Info cards (shown before search) */}
        {!result && !notFound && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-xl">🔍</div>
              <h4 className="mt-2 text-sm font-bold text-foreground">Real-time Updates</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Your application status updates automatically as our team processes each stage.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-xl">💬</div>
              <h4 className="mt-2 text-sm font-bold text-foreground">Need Help?</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Our advisors are available on WhatsApp to answer any questions about your application.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Label({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <span className={className}>{children}</span>;
}
