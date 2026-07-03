"use client";

import { useState } from "react";
import { Mail, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const subscribe = async () => {
    if (loading || !email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setDone(true);
      toast.success("Subscribed!", {
        description: data.message ?? "You'll hear from us soon.",
      });
      setEmail("");
    } catch (e) {
      toast.error("Could not subscribe", {
        description: e instanceof Error ? e.message : "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-brand/10" />
          <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-md">
              <Mail className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                Get study-abroad updates in your inbox
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                New scholarships, intake deadlines, and visa changes — once a
                week, no spam.
              </p>
            </div>
            <div className="flex w-full max-w-md items-center gap-2 md:w-auto">
              {done ? (
                <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  You&apos;re subscribed!
                </div>
              ) : (
                <>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && subscribe()}
                    placeholder="you@example.com"
                    className="flex-1"
                  />
                  <Button
                    onClick={subscribe}
                    disabled={loading || !email}
                    className="bg-brand text-white hover:bg-brand/90"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
