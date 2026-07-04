"use client";

import { useState } from "react";
import {
  GraduationCap,
  Globe2,
  Wallet,
  Loader2,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Match = {
  slug: string;
  name: string;
  flagEmoji: string;
  score: number;
  reasons: string[];
  warnings: string[];
  tuition: string;
  tagline: string;
};

function scoreColor(score: number) {
  if (score >= 80) return { bar: "bg-green-500", text: "text-green-600", label: "Excellent" };
  if (score >= 65) return { bar: "bg-amber-500", text: "text-amber-600", label: "Good" };
  if (score >= 50) return { bar: "bg-orange-500", text: "text-orange-600", label: "Possible" };
  return { bar: "bg-red-500", text: "text-red-600", label: "Weak" };
}

export function ProfileScreener() {
  const [qualification, setQualification] = useState("intermediate");
  const [ielts, setIelts] = useState(6.5);
  const [budget, setBudget] = useState(15000);
  const [preferredCourse, setPreferredCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Match[] | null>(null);

  const screen = async () => {
    if (loading) return;
    setLoading(true);
    setMatches(null);
    try {
      const res = await fetch("/api/profile-screener", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qualification, ielts, budget, preferredCourse }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed");
      setMatches(data.matches);
      toast.success(`${data.matches.length} destinations matched!`);
    } catch (e) {
      toast.error("Screening failed", {
        description: e instanceof Error ? e.message : "Try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Input form */}
      <Card className="lg:col-span-2">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" />
            <h3 className="text-lg font-bold text-foreground">Your Profile</h3>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Highest Qualification</Label>
            <Select value={qualification} onValueChange={setQualification}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matric">Matric / O-Level</SelectItem>
                <SelectItem value="intermediate">Intermediate / FSc / A-Level</SelectItem>
                <SelectItem value="bachelor">Bachelor&apos;s Degree</SelectItem>
                <SelectItem value="master">Master&apos;s Degree</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">IELTS Band Score</Label>
              <Badge variant="secondary" className="tabular-nums">
                {ielts.toFixed(1)}
              </Badge>
            </div>
            <Slider
              value={[ielts]}
              onValueChange={(v) => setIelts(v[0])}
              min={4}
              max={9}
              step={0.5}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>4.0</span><span>9.0</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Annual Budget (USD)</Label>
              <Badge variant="secondary" className="tabular-nums">
                ${budget.toLocaleString()}/yr
              </Badge>
            </div>
            <Slider
              value={[budget]}
              onValueChange={(v) => setBudget(v[0])}
              min={2000}
              max={50000}
              step={1000}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>$2k</span><span>$50k</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Preferred Course (optional)</Label>
            <Input
              value={preferredCourse}
              onChange={(e) => setPreferredCourse(e.target.value)}
              placeholder="e.g. Computer Science, MBA, Mechanical Engg"
            />
          </div>

          <Button
            onClick={screen}
            disabled={loading}
            className="w-full bg-brand text-white hover:bg-brand/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Screening…
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Get My Match Scores
              </>
            )}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            Instant results · No signup · Cross-references 16 destinations
          </p>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="lg:col-span-3">
        <CardContent className="p-6">
          {!matches && !loading && (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center text-muted-foreground">
              <Globe2 className="h-12 w-12 text-border" />
              <p className="mt-3 text-sm">
                Enter your profile on the left and get instant match scores for
                all 16 destinations — powered by an algorithm cross-referencing
                your budget, IELTS, and qualification.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex min-h-[400px] flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-brand" />
              <p className="mt-4 text-sm font-medium">Computing match scores…</p>
            </div>
          )}

          {matches && !loading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">
                  Your Match Scores
                </h3>
                <Badge variant="secondary">{matches.length} destinations</Badge>
              </div>
              <div className="custom-scroll max-h-[500px] space-y-3 overflow-y-auto pr-1">
                {matches.map((m, i) => {
                  const c = scoreColor(m.score);
                  return (
                    <div
                      key={m.slug}
                      className={`rounded-xl border p-4 ${
                        i === 0
                          ? "border-brand/40 bg-brand/5"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{m.flagEmoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-bold text-foreground">
                                {m.name}
                              </span>
                              {i === 0 && (
                                <Badge className="ml-2 bg-gold text-gold-foreground">
                                  Top Match
                                </Badge>
                              )}
                            </div>
                            <span className={`text-2xl font-extrabold tabular-nums ${c.text}`}>
                              {m.score}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{m.tagline}</p>

                          {/* Score bar */}
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                              className={`h-full rounded-full ${c.bar}`}
                              style={{ width: `${m.score}%` }}
                            />
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>Tuition: {m.tuition}</span>
                            <span className={`font-semibold ${c.text}`}>{c.label}</span>
                          </div>

                          {/* Reasons */}
                          {m.reasons.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {m.reasons.map((r, j) => (
                                <li key={j} className="flex items-start gap-1.5 text-xs text-foreground/80">
                                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-green-600" />
                                  {r}
                                </li>
                              ))}
                            </ul>
                          )}
                          {/* Warnings */}
                          {m.warnings.length > 0 && (
                            <ul className="mt-1 space-y-1">
                              {m.warnings.map((w, j) => (
                                <li key={j} className="flex items-start gap-1.5 text-xs text-amber-700">
                                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                                  {w}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
