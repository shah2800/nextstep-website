"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  CalendarClock,
  Compass,
  FileCheck,
  GraduationCap,
  Home,
  LayoutDashboard,
  Loader2,
  Lock,
  MousePointerClick,
  Pencil,
  Plane,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Users,
  Wallet,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

/* ----------------------------------------------------------------------------
 * Types
 * -------------------------------------------------------------------------- */

type Country = {
  id?: string;
  slug: string;
  name: string;
  flagEmoji: string;
  tagline: string;
  shortDesc: string;
  longDesc: string;
  capital: string;
  currency: string;
  language: string;
  tuitionRange: string;
  livingCost: string;
  visaProcess: string;
  topUniversities: string;
  popularCourses: string;
  intakeMonths: string;
  scholarships: string;
  workRights: string;
  gradient: string;
  accentColor: string;
  featured: boolean;
  order: number;
};

type Service = {
  icon: string;
  title: string;
  description: string;
};

type CompareFactor = {
  icon: string;
  title: string;
  description: string;
  points: string[];
};

type SiteContent = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroTrust1: string;
  heroTrust2: string;
  heroImage: string;
  services: Service[];
  compareFactors: CompareFactor[];
};

type AnalyticsData = {
  stats: {
    totalVisitors: number;
    visitorsToday: number;
    visitorsThisWeek: number;
    totalClicks: number;
    clicksToday: number;
    totalSectionViews: number;
    avgDurationMs: number;
    guidanceCount: number;
    bookingCount: number;
    newsletterCount: number;
    countryCount: number;
  };
  topClicks: { type: string; label: string; count: number }[];
  topSections: { section: string; totalMs: number; views: number; avgMs: number }[];
  dailyVisitors: { date: string; count: number }[];
  recentClicks: { type: string; label: string; section: string; time: string }[];
};

/* ----------------------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------------------- */

function formatDuration(ms: number) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

function formatRelativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}

const SERVICE_ICONS = [
  { value: "Compass", label: "Compass", Icon: Compass },
  { value: "FileCheck", label: "FileCheck", Icon: FileCheck },
  { value: "Plane", label: "Plane", Icon: Plane },
  { value: "GraduationCap", label: "GraduationCap", Icon: GraduationCap },
  { value: "Wallet", label: "Wallet", Icon: Wallet },
  { value: "Home", label: "Home", Icon: Home },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Compass,
  FileCheck,
  Plane,
  GraduationCap,
  Wallet,
  Home,
};

const ADMIN_PASSWORD = "nextstep-admin";

const GRADIENT_PRESETS = [
  "from-[#1e3a8a] via-[#2563eb] to-[#3b82f6]",
  "from-[#0f766e] via-[#0d9488] to-[#14b8a6]",
  "from-[#7c2d12] via-[#b45309] to-[#f59e0b]",
  "from-[#4c1d95] via-[#6d28d9] to-[#8b5cf6]",
  "from-[#831843] via-[#be185d] to-[#ec4899]",
  "from-[#064e3b] via-[#047857] to-[#10b981]",
];

const emptyCountry: Country = {
  slug: "",
  name: "",
  flagEmoji: "",
  tagline: "",
  shortDesc: "",
  longDesc: "",
  capital: "",
  currency: "",
  language: "",
  tuitionRange: "",
  livingCost: "",
  visaProcess: "",
  topUniversities: "",
  popularCourses: "",
  intakeMonths: "",
  scholarships: "",
  workRights: "",
  gradient: GRADIENT_PRESETS[0],
  accentColor: "#1e3a8a",
  featured: false,
  order: 0,
};

/* ----------------------------------------------------------------------------
 * Main component
 * -------------------------------------------------------------------------- */

export function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [authed, setAuthed] = useState(false);

  // Lock body scroll while the overlay is mounted.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} onClose={onClose} />;
  }

  return <Dashboard onClose={onClose} />;
}

/* ----------------------------------------------------------------------------
 * Login gate
 * -------------------------------------------------------------------------- */

function LoginScreen({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Brief delay for UX feedback only.
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        onSuccess();
      } else {
        setError(true);
        setSubmitting(false);
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-brand px-4">
      <div className="hero-mesh absolute inset-0 opacity-60" />
      <div className="dot-grid absolute inset-0 opacity-30" />
      <Button
        onClick={onClose}
        variant="ghost"
        className="absolute right-4 top-4 z-10 text-white/80 hover:bg-white/10 hover:text-white"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Back to Site
      </Button>

      <Card className="relative z-10 w-full max-w-md border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-lg">
            <ShieldCheck className="h-7 w-7" />
          </span>
          <h1 className="text-2xl font-extrabold text-brand">NextStep Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your password to access the dashboard
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-pw" className="text-brand">
              Admin Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-pw"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="••••••••••"
                className="pl-9"
                autoFocus
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive">
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand text-white hover:bg-brand/90"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying…
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Enter Dashboard
              </>
            )}
          </Button>
        </form>

        <p className="mt-5 rounded-md bg-secondary px-3 py-2 text-center text-xs text-muted-foreground">
          Demo password: <code className="font-mono font-semibold text-brand">nextstep-admin</code>
        </p>
      </Card>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Dashboard shell (header + tabs)
 * -------------------------------------------------------------------------- */

function Dashboard({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState("analytics");

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-background">
      {/* Header */}
      <header className="bg-brand sticky top-0 z-20 border-b border-white/10 shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-gold">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="leading-none">
              <h1 className="text-lg font-extrabold tracking-tight text-white">
                NextStep Admin
              </h1>
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/60">
                Content &amp; Analytics Console
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="secondary"
            className="bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Back to Site</span>
            <span className="sm:hidden">Exit</span>
          </Button>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="overflow-x-auto pb-1">
            <TabsList className="grid w-full min-w-[640px] grid-cols-5 sm:min-w-0">
              <TabsTrigger value="analytics" className="gap-1.5">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="countries" className="gap-1.5">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Countries</span>
                <span className="sm:hidden">Countries</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Content</span>
                <span className="sm:hidden">Content</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="gap-1.5">
                <Compass className="h-4 w-4" />
                <span className="hidden sm:inline">Services</span>
                <span className="sm:hidden">Services</span>
              </TabsTrigger>
              <TabsTrigger value="compare" className="gap-1.5">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Compare Factors</span>
                <span className="sm:hidden">Compare</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsTab />
          </TabsContent>
          <TabsContent value="countries" className="mt-6">
            <CountriesTab />
          </TabsContent>
          <TabsContent value="content" className="mt-6">
            <ContentTab />
          </TabsContent>
          <TabsContent value="services" className="mt-6">
            <ServicesTab />
          </TabsContent>
          <TabsContent value="compare" className="mt-6">
            <CompareFactorsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Shared loading + section helpers
 * -------------------------------------------------------------------------- */

function Spinner({ className }: { className?: string }) {
  return <Loader2 className={`h-5 w-5 animate-spin ${className ?? ""}`} />;
}

function SectionCard({
  title,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border-border p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand">
          <Icon className="h-4 w-4 text-gold" />
          {title}
        </h3>
        {action}
      </div>
      {children}
    </Card>
  );
}

/* ----------------------------------------------------------------------------
 * Tab 1: Analytics
 * -------------------------------------------------------------------------- */

function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load analytics");
      const json = (await res.json()) as AnalyticsData;
      setData(json);
    } catch {
      toast.error("Could not load analytics. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!data) return null;

  const stats = data.stats;
  const statCards: {
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    hint?: string;
  }[] = [
    {
      label: "Total Visitors",
      value: stats.totalVisitors.toLocaleString(),
      icon: Users,
      hint: `${stats.visitorsThisWeek.toLocaleString()} this week`,
    },
    {
      label: "Visitors Today",
      value: stats.visitorsToday.toLocaleString(),
      icon: CalendarClock,
      hint: "Unique new sessions",
    },
    {
      label: "Total Clicks",
      value: stats.totalClicks.toLocaleString(),
      icon: MousePointerClick,
      hint: `${stats.totalSectionViews.toLocaleString()} section views`,
    },
    {
      label: "Clicks Today",
      value: stats.clicksToday.toLocaleString(),
      icon: MousePointerClick,
      hint: "Interactions in last 24h",
    },
    {
      label: "Avg Session Duration",
      value: formatDuration(stats.avgDurationMs),
      icon: CalendarClock,
      hint: "Per unique session",
    },
    {
      label: "Guidance Requests",
      value: stats.guidanceCount.toLocaleString(),
      icon: FileCheck,
      hint: "Form submissions",
    },
    {
      label: "Bookings",
      value: stats.bookingCount.toLocaleString(),
      icon: CalendarClock,
      hint: "Counseling sessions",
    },
    {
      label: "Newsletter Subs",
      value: stats.newsletterCount.toLocaleString(),
      icon: Sparkles,
      hint: "Email subscribers",
    },
  ];

  const maxClick = Math.max(1, ...data.topClicks.map((c) => c.count));

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-brand">Overview</h2>
          <p className="text-sm text-muted-foreground">
            Real-time visitor and engagement metrics across the NextStep site.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchAnalytics(true)}
          disabled={refreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/5 text-brand">
                  <Icon className="h-4.5 w-4.5" />
                </span>
              </div>
              <div className="text-3xl font-extrabold tracking-tight text-brand">
                {s.value}
              </div>
              <div className="mt-1 text-sm font-medium text-foreground">
                {s.label}
              </div>
              {s.hint && (
                <div className="mt-0.5 text-xs text-muted-foreground">{s.hint}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts + lists */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Visitors (last 7 days)" icon={BarChart3}>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.dailyVisitors}
                margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="oklch(0.91 0.01 240)"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d: string) => d.slice(5)}
                  tick={{ fontSize: 11, fill: "oklch(0.5 0.02 256)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "oklch(0.5 0.02 256)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  cursor={{ fill: "oklch(0.96 0.01 240)" }}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid oklch(0.91 0.01 240)",
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Visitors"
                  fill="oklch(0.28 0.06 256)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Top Clicked Elements" icon={MousePointerClick}>
          {data.topClicks.length === 0 ? (
            <EmptyState text="No clicks recorded yet." />
          ) : (
            <ul className="space-y-2.5">
              {data.topClicks.map((c, i) => (
                <li key={`${c.type}-${c.label}-${i}`}>
                  <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <Badge variant="outline" className="shrink-0 text-[10px] uppercase">
                        {c.type}
                      </Badge>
                      <span className="truncate font-medium text-foreground">
                        {c.label}
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold text-brand">{c.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{ width: `${(c.count / maxClick) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Top Sections by Time" icon={BarChart3}>
          {data.topSections.length === 0 ? (
            <EmptyState text="No section engagement recorded yet." />
          ) : (
            <ul className="divide-y divide-border">
              {data.topSections.map((s, i) => (
                <li key={s.section + i} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-foreground">
                      {s.section}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {s.views} view{s.views === 1 ? "" : "s"} · avg {formatDuration(s.avgMs)}
                    </div>
                  </div>
                  <Badge className="shrink-0 bg-brand/10 text-brand hover:bg-brand/15">
                    {formatDuration(s.totalMs)}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Recent Activity" icon={CalendarClock}>
          {data.recentClicks.length === 0 ? (
            <EmptyState text="No recent clicks." />
          ) : (
            <ul className="max-h-80 space-y-2 overflow-y-auto pr-1 custom-scroll">
              {data.recentClicks.map((c, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card/50 px-3 py-2"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand/5 text-brand">
                    <MousePointerClick className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {c.type}
                      </Badge>
                      <span className="truncate text-sm font-medium text-foreground">
                        {c.label}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {c.section} · {formatRelativeTime(c.time)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
      {text}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Tab 2: Countries (CRUD)
 * -------------------------------------------------------------------------- */

function CountriesTab() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Country | null>(null);
  const [form, setForm] = useState<Country>(emptyCountry);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Country | null>(null);

  const fetchCountries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/countries", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed");
      const json = (await res.json()) as { countries: Country[] };
      setCountries(json.countries);
    } catch {
      toast.error("Could not load countries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyCountry, order: countries.length });
    setDialogOpen(true);
  };

  const openEdit = (c: Country) => {
    setEditing(c);
    setForm({ ...c });
    setDialogOpen(true);
  };

  const updateField = <K extends keyof Country>(key: K, value: Country[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submitCountry = async () => {
    if (!form.slug || !form.name || !form.flagEmoji) {
      toast.error("Slug, name and flag emoji are required.");
      return;
    }
    setSaving(true);
    try {
      const isEdit = !!editing && !!editing.id;
      const body = isEdit ? { id: editing!.id, ...form } : form;
      const res = await fetch("/api/admin/countries", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Save failed");
      }
      toast.success(isEdit ? "Country updated." : "Country created.");
      setDialogOpen(false);
      await fetchCountries();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCountry = async (c: Country) => {
    if (!c.id) return;
    try {
      const res = await fetch(`/api/admin/countries?id=${encodeURIComponent(c.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success(`${c.name} deleted.`);
      setConfirmDelete(null);
      await fetchCountries();
    } catch {
      toast.error("Could not delete country.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-brand">Destinations</h2>
          <p className="text-sm text-muted-foreground">
            Manage the {countries.length} country guides shown on the site.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchCountries} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={openAdd} className="bg-brand text-white hover:bg-brand/90">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Country
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : countries.length === 0 ? (
          <EmptyState text="No countries yet. Click “Add Country” to create one." />
        ) : (
          <div className="max-h-[60vh] overflow-y-auto custom-scroll">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow>
                  <TableHead className="w-10">Flag</TableHead>
                  <TableHead className="min-w-[160px]">Name / Slug</TableHead>
                  <TableHead className="min-w-[220px]">Tagline</TableHead>
                  <TableHead className="w-20 text-center">Featured</TableHead>
                  <TableHead className="w-16 text-center">Order</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {countries.map((c) => (
                  <TableRow key={c.id ?? c.slug}>
                    <TableCell>
                      <span className="text-2xl">{c.flagEmoji}</span>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-brand">{c.name}</div>
                      <div className="font-mono text-xs text-muted-foreground">/{c.slug}</div>
                    </TableCell>
                    <TableCell className="max-w-[260px]">
                      <span className="line-clamp-2 text-sm text-foreground">
                        {c.tagline}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {c.featured ? (
                        <Star className="mx-auto h-4 w-4 fill-gold text-gold" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-sm font-medium">
                      {c.order}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(c)}
                          aria-label={`Edit ${c.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setConfirmDelete(c)}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Delete ${c.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Country form dialog */}
      <CountryFormDialog
        open={dialogOpen}
        editing={editing}
        form={form}
        saving={saving}
        onField={updateField}
        onClose={() => setDialogOpen(false)}
        onSubmit={submitCountry}
      />

      {/* Delete confirm dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand">Delete country?</DialogTitle>
            <DialogDescription>
              This will permanently remove{" "}
              <span className="font-semibold text-foreground">
                {confirmDelete?.flagEmoji} {confirmDelete?.name}
              </span>
              . This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDelete && deleteCountry(confirmDelete)}
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CountryFormDialog({
  open,
  editing,
  form,
  saving,
  onField,
  onClose,
  onSubmit,
}: {
  open: boolean;
  editing: Country | null;
  form: Country;
  saving: boolean;
  onField: <K extends keyof Country>(key: K, value: Country[K]) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto custom-scroll">
        <DialogHeader>
          <DialogTitle className="text-brand">
            {editing ? "Edit Destination" : "Add New Destination"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? `Updating ${editing.name}.`
              : "Fill in the fields below to publish a new country guide."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug" hint="URL identifier (e.g. uk, germany)">
            <Input
              value={form.slug}
              onChange={(e) => onField("slug", e.target.value)}
              placeholder="uk"
            />
          </Field>
          <Field label="Name">
            <Input
              value={form.name}
              onChange={(e) => onField("name", e.target.value)}
              placeholder="United Kingdom"
            />
          </Field>
          <Field label="Flag Emoji">
            <Input
              value={form.flagEmoji}
              onChange={(e) => onField("flagEmoji", e.target.value)}
              placeholder="🇬🇧"
              className="text-xl"
            />
          </Field>
          <Field label="Tagline">
            <Input
              value={form.tagline}
              onChange={(e) => onField("tagline", e.target.value)}
              placeholder="World-leading universities, global recognition"
            />
          </Field>
          <Field label="Capital" className="sm:col-span-1">
            <Input
              value={form.capital}
              onChange={(e) => onField("capital", e.target.value)}
              placeholder="London"
            />
          </Field>
          <Field label="Currency">
            <Input
              value={form.currency}
              onChange={(e) => onField("currency", e.target.value)}
              placeholder="GBP (£)"
            />
          </Field>
          <Field label="Language">
            <Input
              value={form.language}
              onChange={(e) => onField("language", e.target.value)}
              placeholder="English"
            />
          </Field>
          <Field label="Tuition Range">
            <Input
              value={form.tuitionRange}
              onChange={(e) => onField("tuitionRange", e.target.value)}
              placeholder="£10,000 – £30,000 / year"
            />
          </Field>
          <Field label="Living Cost">
            <Input
              value={form.livingCost}
              onChange={(e) => onField("livingCost", e.target.value)}
              placeholder="£900 – £1,300 / month"
            />
          </Field>
          <Field label="Intake Months">
            <Input
              value={form.intakeMonths}
              onChange={(e) => onField("intakeMonths", e.target.value)}
              placeholder="September, January"
            />
          </Field>
          <Field label="Short Description" className="sm:col-span-2">
            <Textarea
              value={form.shortDesc}
              onChange={(e) => onField("shortDesc", e.target.value)}
              placeholder="One-line summary shown on the country card."
              rows={2}
            />
          </Field>
          <Field label="Long Description" className="sm:col-span-2">
            <Textarea
              value={form.longDesc}
              onChange={(e) => onField("longDesc", e.target.value)}
              placeholder="Detailed overview shown on the country detail page."
              rows={4}
            />
          </Field>
          <Field label="Visa Process" className="sm:col-span-2">
            <Textarea
              value={form.visaProcess}
              onChange={(e) => onField("visaProcess", e.target.value)}
              placeholder="Step-by-step student visa guidance."
              rows={3}
            />
          </Field>
          <Field label="Top Universities" className="sm:col-span-2">
            <Textarea
              value={form.topUniversities}
              onChange={(e) => onField("topUniversities", e.target.value)}
              placeholder="Comma-separated list (e.g. Oxford, Cambridge, Imperial)."
              rows={2}
            />
          </Field>
          <Field label="Popular Courses" className="sm:col-span-2">
            <Textarea
              value={form.popularCourses}
              onChange={(e) => onField("popularCourses", e.target.value)}
              placeholder="Comma-separated list."
              rows={2}
            />
          </Field>
          <Field label="Scholarships" className="sm:col-span-2">
            <Textarea
              value={form.scholarships}
              onChange={(e) => onField("scholarships", e.target.value)}
              placeholder="Available scholarships & funding notes."
              rows={3}
            />
          </Field>
          <Field label="Work Rights" className="sm:col-span-2">
            <Textarea
              value={form.workRights}
              onChange={(e) => onField("workRights", e.target.value)}
              placeholder="Post-study work, part-time rules, etc."
              rows={2}
            />
          </Field>

          <Field label="Accent Color">
            <div className="flex items-center gap-2">
              <Input
                value={form.accentColor}
                onChange={(e) => onField("accentColor", e.target.value)}
                placeholder="#1e3a8a"
              />
              <span
                className="h-9 w-9 shrink-0 rounded-md border border-border"
                style={{ backgroundColor: form.accentColor }}
              />
            </div>
          </Field>
          <Field label="Order">
            <Input
              type="number"
              value={form.order}
              onChange={(e) => onField("order", Number(e.target.value))}
              placeholder="0"
            />
          </Field>

          <Field label="Gradient" className="sm:col-span-2">
            <Select
              value={form.gradient}
              onValueChange={(v) => onField("gradient", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick a gradient" />
              </SelectTrigger>
              <SelectContent>
                {GRADIENT_PRESETS.map((g) => (
                  <SelectItem key={g} value={g}>
                    <span className="flex items-center gap-2">
                      <span
                        className={`inline-block h-4 w-8 rounded bg-gradient-to-r ${g}`}
                      />
                      <span className="font-mono text-xs">{g}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-secondary/50 px-3 py-2.5">
              <Checkbox
                checked={form.featured}
                onCheckedChange={(v) => onField("featured", v === true)}
              />
              <span className="text-sm font-medium">
                Featured destination{" "}
                <span className="text-muted-foreground">
                  (shown with a gold star)
                </span>
              </span>
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={saving} className="bg-brand text-white hover:bg-brand/90">
            {saving ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-4 w-4" />
                {editing ? "Save Changes" : "Create Country"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-xs font-semibold uppercase tracking-wide text-brand">
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Shared content hook (used by Content / Services / Compare tabs)
 * -------------------------------------------------------------------------- */

function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed");
      const json = (await res.json()) as { content: SiteContent };
      setContent(json.content);
    } catch {
      toast.error("Could not load site content.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { content, loading, setContent, reload: fetchContent };
}

async function saveContentKey(
  key: string,
  value: string | object,
) {
  const res = await fetch("/api/admin/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Save failed");
  }
  return res.json();
}

/* ----------------------------------------------------------------------------
 * Tab 3: Content (Hero + text)
 * -------------------------------------------------------------------------- */

function ContentTab() {
  const { content, loading } = useSiteContent();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    if (content) {
      setDrafts({
        heroBadge: content.heroBadge,
        heroTitle: content.heroTitle,
        heroSubtitle: content.heroSubtitle,
        heroPrimaryCta: content.heroPrimaryCta,
        heroSecondaryCta: content.heroSecondaryCta,
        heroTrust1: content.heroTrust1,
        heroTrust2: content.heroTrust2,
        heroImage: content.heroImage,
      });
    }
  }, [content]);

  const heroFields: {
    key: keyof typeof HERO_LABELS;
    label: string;
    multiline?: boolean;
    hint?: string;
  }[] = [
    { key: "heroBadge", label: "Hero Badge", hint: "Small pill above the title" },
    { key: "heroTitle", label: "Hero Title", multiline: true },
    { key: "heroSubtitle", label: "Hero Subtitle", multiline: true },
    { key: "heroPrimaryCta", label: "Primary CTA Button" },
    { key: "heroSecondaryCta", label: "Secondary CTA Button" },
    { key: "heroTrust1", label: "Trust Badge #1" },
    { key: "heroTrust2", label: "Trust Badge #2" },
    { key: "heroImage", label: "Hero Image URL", hint: "Path or absolute URL" },
  ];

  const save = async (key: string) => {
    const value = drafts[key] ?? "";
    setSavingKey(key);
    try {
      await saveContentKey(key, value);
      toast.success(`${HERO_LABELS[key as keyof typeof HERO_LABELS]} saved.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-brand">Hero &amp; Marketing Content</h2>
        <p className="text-sm text-muted-foreground">
          Edit the homepage hero copy and trust badges. Each field saves independently.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {heroFields.map((f) => (
          <Card
            key={f.key}
            className={`rounded-2xl border-border p-5 shadow-sm ${
              f.multiline ? "sm:col-span-2" : ""
            }`}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-brand">
                {f.label}
              </Label>
              {f.key === "heroImage" && content.heroImage && (
                <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded border border-border">
                  <img
                    src={content.heroImage}
                    alt="hero preview"
                    className="h-full w-full object-cover"
                  />
                </span>
              )}
            </div>
            {f.multiline ? (
              <Textarea
                value={drafts[f.key] ?? ""}
                onChange={(e) =>
                  setDrafts((d) => ({ ...d, [f.key]: e.target.value }))
                }
                rows={f.key === "heroTitle" ? 2 : 3}
                className="resize-y"
              />
            ) : (
              <Input
                value={drafts[f.key] ?? ""}
                onChange={(e) =>
                  setDrafts((d) => ({ ...d, [f.key]: e.target.value }))
                }
              />
            )}
            {f.hint && (
              <p className="mt-1 text-xs text-muted-foreground">{f.hint}</p>
            )}
            <div className="mt-3 flex justify-end">
              <Button
                size="sm"
                onClick={() => save(f.key)}
                disabled={savingKey === f.key}
                className="bg-brand text-white hover:bg-brand/90"
              >
                {savingKey === f.key ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-1.5 h-4 w-4" />
                )}
                Save
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const HERO_LABELS = {
  heroBadge: "Hero Badge",
  heroTitle: "Hero Title",
  heroSubtitle: "Hero Subtitle",
  heroPrimaryCta: "Primary CTA",
  heroSecondaryCta: "Secondary CTA",
  heroTrust1: "Trust Badge #1",
  heroTrust2: "Trust Badge #2",
  heroImage: "Hero Image",
};

/* ----------------------------------------------------------------------------
 * Tab 4: Services editor
 * -------------------------------------------------------------------------- */

function ServicesTab() {
  const { content, loading, setContent } = useSiteContent();
  const [services, setServices] = useState<Service[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (content?.services) {
      setServices(content.services.map((s) => ({ ...s })));
    }
  }, [content]);

  const update = (i: number, patch: Partial<Service>) =>
    setServices((arr) => arr.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const remove = (i: number) =>
    setServices((arr) => arr.filter((_, idx) => idx !== i));

  const add = () =>
    setServices((arr) => [
      ...arr,
      { icon: "Compass", title: "New Service", description: "" },
    ]);

  const move = (i: number, dir: -1 | 1) => {
    setServices((arr) => {
      const next = [...arr];
      const j = i + dir;
      if (j < 0 || j >= next.length) return arr;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      await saveContentKey("services", services);
      setContent((c) => (c ? { ...c, services } : c));
      toast.success("Services saved.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-brand">Services</h2>
          <p className="text-sm text-muted-foreground">
            Edit the service cards shown in the “Our Services” section.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={add}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Service
          </Button>
          <Button
            onClick={saveAll}
            disabled={saving}
            className="bg-brand text-white hover:bg-brand/90"
          >
            {saving ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-4 w-4" />
            )}
            Save Services
          </Button>
        </div>
      </div>

      {services.length === 0 ? (
        <EmptyState text="No services yet. Click “Add Service” to begin." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((s, i) => {
            const Icon = ICON_MAP[s.icon] ?? Compass;
            return (
              <Card key={i} className="rounded-2xl border-border p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Service #{i + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Move up"
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => move(i, 1)}
                      disabled={i === services.length - 1}
                      aria-label="Move down"
                    >
                      ↓
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => remove(i)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Remove"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-brand">
                      Icon
                    </Label>
                    <Select value={s.icon} onValueChange={(v) => update(i, { icon: v })}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_ICONS.map(({ value, label, Icon: I }) => (
                          <SelectItem key={value} value={value}>
                            <span className="flex items-center gap-2">
                              <I className="h-4 w-4" />
                              {label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-brand">
                      Title
                    </Label>
                    <Input
                      value={s.title}
                      onChange={(e) => update(i, { title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-brand">
                      Description
                    </Label>
                    <Textarea
                      value={s.description}
                      onChange={(e) => update(i, { description: e.target.value })}
                      rows={3}
                      className="resize-y"
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Tab 5: Compare Factors editor
 * -------------------------------------------------------------------------- */

function CompareFactorsTab() {
  const { content, loading, setContent } = useSiteContent();
  const [factors, setFactors] = useState<CompareFactor[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (content?.compareFactors) {
      setFactors(content.compareFactors.map((f) => ({ ...f, points: [...f.points] })));
    }
  }, [content]);

  const update = (i: number, patch: Partial<CompareFactor>) =>
    setFactors((arr) => arr.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));

  const remove = (i: number) =>
    setFactors((arr) => arr.filter((_, idx) => idx !== i));

  const add = () =>
    setFactors((arr) => [
      ...arr,
      {
        icon: "GraduationCap",
        title: "New Factor",
        description: "",
        points: ["First point"],
      },
    ]);

  const move = (i: number, dir: -1 | 1) =>
    setFactors((arr) => {
      const next = [...arr];
      const j = i + dir;
      if (j < 0 || j >= next.length) return arr;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const saveAll = async () => {
    setSaving(true);
    try {
      await saveContentKey("compareFactors", factors);
      setContent((c) => (c ? { ...c, compareFactors: factors } : c));
      toast.success("Compare factors saved.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-brand">Compare Factors</h2>
          <p className="text-sm text-muted-foreground">
            Edit the comparison criteria shown on the homepage comparison grid.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={add}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Factor
          </Button>
          <Button
            onClick={saveAll}
            disabled={saving}
            className="bg-brand text-white hover:bg-brand/90"
          >
            {saving ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-4 w-4" />
            )}
            Save Compare Factors
          </Button>
        </div>
      </div>

      {factors.length === 0 ? (
        <EmptyState text="No factors yet. Click “Add Factor” to begin." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {factors.map((f, i) => {
            const Icon = ICON_MAP[f.icon] ?? GraduationCap;
            return (
              <Card key={i} className="rounded-2xl border-border p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Factor #{i + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Move up"
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => move(i, 1)}
                      disabled={i === factors.length - 1}
                      aria-label="Move down"
                    >
                      ↓
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => remove(i)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Remove"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-brand">
                      Icon
                    </Label>
                    <Select value={f.icon} onValueChange={(v) => update(i, { icon: v })}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_ICONS.map(({ value, label, Icon: I }) => (
                          <SelectItem key={value} value={value}>
                            <span className="flex items-center gap-2">
                              <I className="h-4 w-4" />
                              {label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-brand">
                      Title
                    </Label>
                    <Input
                      value={f.title}
                      onChange={(e) => update(i, { title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-brand">
                      Description
                    </Label>
                    <Textarea
                      value={f.description}
                      onChange={(e) => update(i, { description: e.target.value })}
                      rows={2}
                      className="resize-y"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-brand">
                      Points{" "}
                      <span className="font-normal text-muted-foreground">
                        (one per line)
                      </span>
                    </Label>
                    <Textarea
                      value={f.points.join("\n")}
                      onChange={(e) =>
                        update(i, {
                          points: e.target.value.split("\n").filter((p) => p !== ""),
                        })
                      }
                      rows={4}
                      className="resize-y font-mono text-xs"
                      placeholder={"Entry requirements & equivalency\nIntake availability"}
                    />
                    <p className="text-xs text-muted-foreground">
                      {f.points.length} point{f.points.length === 1 ? "" : "s"} ·{" "}
                      {f.points.length} bullet{f.points.length === 1 ? "" : "s"} will render.
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
