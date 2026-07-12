"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  BadgeCheck,
  BarChart3,
  Building2,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Compass,
  Eye,
  EyeOff,
  FileCheck,
  FileText,
  Globe2,
  GraduationCap,
  Home,
  Inbox,
  LayoutDashboard,
  Loader2,
  Lock,
  UploadCloud,
  Mail,
  MapPin,
  MessageCircle,
  MousePointerClick,
  Pencil,
  Phone,
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
  hidden: boolean;
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

type Stat = {
  label: string;
  value: string;
  icon: string;
};

type SiteContent = {
  // Hero
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroTrust1: string;
  heroTrust2: string;
  heroImage: string;
  // Counseling CTA
  counselingBadge: string;
  counselingTitle: string;
  counselingSubtitle: string;
  counselingCta1: string;
  counselingCta2: string;
  counselingImage: string;
  // AI Assistant
  assistantBadge: string;
  assistantTitle: string;
  assistantSubtitle: string;
  assistantCta: string;
  // Newsletter
  newsletterTitle: string;
  newsletterSubtitle: string;
  // Footer
  footerAddress: string;
  footerPhone: string;
  footerEmail: string;
  footerWhatsapp: string;
  footerBrand: string;
  // Lists
  stats: Stat[];
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

type GuidanceLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  graduationYear: string;
  preferredCourse: string;
  budget: string;
  englishTest: string;
  preferredCountries: string;
  message: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
};

type BookingLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  mode: string;
  service: string;
  message: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
};

type NewsletterLead = {
  id: string;
  email: string;
  createdAt: string;
};

type LeadsData = {
  guidance: GuidanceLead[];
  bookings: BookingLead[];
  newsletter: NewsletterLead[];
  counts: {
    guidance: number;
    bookings: number;
    newsletter: number;
    newGuidance: number;
    pendingBookings: number;
  };
};

type LeadModel = "guidance" | "bookings" | "newsletter";

/* ---- Applications ---- */

type ApplicationStatus =
  | "submitted"
  | "review"
  | "accepted"
  | "rejected"
  | "enrolled";

type MilestoneStatus = "pending" | "active" | "done" | "issue";

type ApplicationMilestone = {
  id: string;
  label: string;
  note: string;
  status: MilestoneStatus;
  order: number;
};

type Application = {
  id: string;
  registrationId: string;
  fullName: string;
  fatherName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  cityAddress: string;
  passportNumber: string;
  passportExpiry: string;
  countryInterest: string;
  courseInterest: string;
  universityInterest: string;
  matricGrade: string;
  fscGrade: string;
  ieltsScore: string;
  documents: string;
  status: ApplicationStatus;
  headline: string;
  createdAt: string;
  milestones: ApplicationMilestone[];
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

function formatLeadDate(iso: string) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
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

const STAT_ICONS = [
  { value: "Users", label: "Users", Icon: Users },
  { value: "Building2", label: "Building2", Icon: Building2 },
  { value: "Globe2", label: "Globe2", Icon: Globe2 },
  { value: "BadgeCheck", label: "BadgeCheck", Icon: BadgeCheck },
];

const STAT_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Building2,
  Globe2,
  BadgeCheck,
};

const GUIDANCE_STATUS_STYLES: Record<GuidanceLead["status"], string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  contacted: "bg-amber-100 text-amber-800 border-amber-200",
  closed: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const BOOKING_STATUS_STYLES: Record<BookingLead["status"], string> = {
  pending: "bg-slate-100 text-slate-700 border-slate-200",
  confirmed: "bg-amber-100 text-amber-800 border-amber-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200",
};

const APPLICATION_STATUS_STYLES: Record<ApplicationStatus, string> = {
  submitted: "bg-blue-100 text-blue-700 border-blue-200",
  review: "bg-amber-100 text-amber-800 border-amber-200",
  accepted: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
  enrolled: "bg-violet-100 text-violet-700 border-violet-200",
};

const MILESTONE_STATUS_STYLES: Record<MilestoneStatus, string> = {
  pending: "bg-slate-100 text-slate-700 border-slate-200",
  active: "bg-amber-100 text-amber-800 border-amber-200",
  done: "bg-emerald-100 text-emerald-700 border-emerald-200",
  issue: "bg-rose-100 text-rose-700 border-rose-200",
};

const MILESTONE_STATUS_DOT: Record<MilestoneStatus, string> = {
  pending: "bg-slate-400",
  active: "bg-amber-500",
  done: "bg-emerald-500",
  issue: "bg-rose-500",
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
  hidden: false,
};

const defaultStats: Stat[] = [
  { label: "Students Placed", value: "12,000+", icon: "Users" },
  { label: "Partner Universities", value: "850+", icon: "Building2" },
  { label: "Study Destinations", value: "16", icon: "Globe2" },
  { label: "Visa Success Rate", value: "96%", icon: "BadgeCheck" },
];

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
      </Card>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Dashboard shell (header + tabs)
 * -------------------------------------------------------------------------- */

function Dashboard({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState("leads");

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
            <TabsList className="grid w-full min-w-[860px] grid-cols-7 sm:min-w-0">
              <TabsTrigger value="leads" className="gap-1.5">
                <Inbox className="h-4 w-4" />
                <span className="hidden sm:inline">Leads</span>
                <span className="sm:hidden">Leads</span>
              </TabsTrigger>
              <TabsTrigger value="applications" className="gap-1.5">
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Applications</span>
                <span className="sm:hidden">Apps</span>
              </TabsTrigger>
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

          <TabsContent value="leads" className="mt-6">
            <LeadsTab />
          </TabsContent>
          <TabsContent value="applications" className="mt-6">
            <ApplicationsTab />
          </TabsContent>
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
 * Tab 1: Leads
 * -------------------------------------------------------------------------- */

function LeadsTab() {
  const [data, setData] = useState<LeadsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sub, setSub] = useState<"guidance" | "bookings" | "newsletter">("guidance");
  const [viewGuidance, setViewGuidance] = useState<GuidanceLead | null>(null);
  const [viewBooking, setViewBooking] = useState<BookingLead | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<
    | { id: string; model: LeadModel; label: string }
    | null
  >(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch("/api/admin/leads", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load leads");
      const json = (await res.json()) as LeadsData;
      setData(json);
    } catch {
      toast.error("Could not load leads. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateStatus = async (
    model: "guidance" | "bookings",
    id: string,
    status: string,
  ) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, id, status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Update failed");
      }
      toast.success(`Status updated to "${status}".`);
      await fetchLeads(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteLead = async (model: LeadModel, id: string, label: string) => {
    try {
      const res = await fetch(
        `/api/admin/leads?id=${encodeURIComponent(id)}&model=${model}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Delete failed");
      }
      toast.success(`${label} deleted.`);
      setConfirmDelete(null);
      await fetchLeads(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete lead.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-12 rounded-2xl" />
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  if (!data) return null;

  const counts = data.counts;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-brand">Leads &amp; Subscribers</h2>
          <p className="text-sm text-muted-foreground">
            Review guidance requests, counseling bookings, and newsletter subscribers.
          </p>
        </div>
        <Button variant="outline" onClick={() => fetchLeads(true)} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard
          icon={FileCheck}
          label="Guidance Requests"
          value={counts.guidance}
          hint={`${counts.newGuidance} new`}
          accent="text-blue-600"
        />
        <SummaryCard
          icon={CalendarClock}
          label="Bookings"
          value={counts.bookings}
          hint={`${counts.pendingBookings} pending`}
          accent="text-amber-600"
        />
        <SummaryCard
          icon={Mail}
          label="Newsletter Subs"
          value={counts.newsletter}
          hint="Email subscribers"
          accent="text-emerald-600"
        />
        <SummaryCard
          icon={Inbox}
          label="Total Leads"
          value={counts.guidance + counts.bookings + counts.newsletter}
          hint="All inbound contacts"
          accent="text-brand"
        />
      </div>

      {/* Sub-tabs */}
      <Tabs value={sub} onValueChange={(v) => setSub(v as typeof sub)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guidance" className="gap-1.5">
            <FileCheck className="h-4 w-4" />
            Guidance
            <Badge variant="secondary" className="ml-1">
              {counts.guidance}
              {counts.newGuidance > 0 && (
                <span className="ml-1 text-blue-600">+{counts.newGuidance} new</span>
              )}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="bookings" className="gap-1.5">
            <CalendarDays className="h-4 w-4" />
            Bookings
            <Badge variant="secondary" className="ml-1">
              {counts.bookings}
              {counts.pendingBookings > 0 && (
                <span className="ml-1 text-amber-700">+{counts.pendingBookings}</span>
              )}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="newsletter" className="gap-1.5">
            <Mail className="h-4 w-4" />
            Newsletter
            <Badge variant="secondary" className="ml-1">
              {counts.newsletter}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Guidance requests */}
        <TabsContent value="guidance" className="mt-4">
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="max-h-[55vh] overflow-y-auto custom-scroll">
              {data.guidance.length === 0 ? (
                <EmptyState text="No guidance requests yet." />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-card">
                      <TableRow>
                        <TableHead className="min-w-[160px]">Name</TableHead>
                        <TableHead className="min-w-[200px]">Email</TableHead>
                        <TableHead className="min-w-[140px]">Phone</TableHead>
                        <TableHead className="min-w-[160px]">Qualification</TableHead>
                        <TableHead className="min-w-[160px]">Course</TableHead>
                        <TableHead className="min-w-[120px]">Budget</TableHead>
                        <TableHead className="min-w-[140px]">English Test</TableHead>
                        <TableHead className="min-w-[150px]">Status</TableHead>
                        <TableHead className="min-w-[140px]">Created</TableHead>
                        <TableHead className="w-24 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.guidance.map((g) => (
                        <TableRow key={g.id} className="cursor-pointer hover:bg-secondary/40">
                          <TableCell
                            className="font-semibold text-brand"
                            onClick={() => setViewGuidance(g)}
                          >
                            {g.name || "—"}
                          </TableCell>
                          <TableCell className="text-sm">
                            <a
                              href={`mailto:${g.email}`}
                              className="text-foreground hover:text-brand hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {g.email || "—"}
                            </a>
                          </TableCell>
                          <TableCell className="text-sm">
                            <a
                              href={`tel:${g.phone}`}
                              className="text-foreground hover:text-brand hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {g.phone || "—"}
                            </a>
                          </TableCell>
                          <TableCell className="text-sm" onClick={() => setViewGuidance(g)}>
                            {g.qualification || "—"}
                          </TableCell>
                          <TableCell className="text-sm" onClick={() => setViewGuidance(g)}>
                            {g.preferredCourse || "—"}
                          </TableCell>
                          <TableCell className="text-sm" onClick={() => setViewGuidance(g)}>
                            {g.budget || "—"}
                          </TableCell>
                          <TableCell className="text-sm" onClick={() => setViewGuidance(g)}>
                            {g.englishTest || "—"}
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Select
                              value={g.status}
                              onValueChange={(v) => updateStatus("guidance", g.id, v)}
                              disabled={updatingId === g.id}
                            >
                              <SelectTrigger
                                className={`h-8 w-32 border bg-background text-xs font-semibold ${GUIDANCE_STATUS_STYLES[g.status]}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground" onClick={() => setViewGuidance(g)}>
                            {formatLeadDate(g.createdAt)}
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setViewGuidance(g)}
                                aria-label={`View ${g.name}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setConfirmDelete({
                                    id: g.id,
                                    model: "guidance",
                                    label: g.name || g.email,
                                  })
                                }
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                aria-label={`Delete ${g.name}`}
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
          </div>
        </TabsContent>

        {/* Bookings */}
        <TabsContent value="bookings" className="mt-4">
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="max-h-[55vh] overflow-y-auto custom-scroll">
              {data.bookings.length === 0 ? (
                <EmptyState text="No bookings yet." />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-card">
                      <TableRow>
                        <TableHead className="min-w-[160px]">Name</TableHead>
                        <TableHead className="min-w-[200px]">Email</TableHead>
                        <TableHead className="min-w-[140px]">Phone</TableHead>
                        <TableHead className="min-w-[140px]">Date</TableHead>
                        <TableHead className="min-w-[110px]">Time</TableHead>
                        <TableHead className="min-w-[120px]">Mode</TableHead>
                        <TableHead className="min-w-[180px]">Service</TableHead>
                        <TableHead className="min-w-[150px]">Status</TableHead>
                        <TableHead className="min-w-[140px]">Created</TableHead>
                        <TableHead className="w-24 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.bookings.map((b) => (
                        <TableRow key={b.id} className="cursor-pointer hover:bg-secondary/40">
                          <TableCell
                            className="font-semibold text-brand"
                            onClick={() => setViewBooking(b)}
                          >
                            {b.name || "—"}
                          </TableCell>
                          <TableCell className="text-sm">
                            <a
                              href={`mailto:${b.email}`}
                              className="text-foreground hover:text-brand hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {b.email || "—"}
                            </a>
                          </TableCell>
                          <TableCell className="text-sm">
                            <a
                              href={`tel:${b.phone}`}
                              className="text-foreground hover:text-brand hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {b.phone || "—"}
                            </a>
                          </TableCell>
                          <TableCell className="text-sm" onClick={() => setViewBooking(b)}>
                            {b.preferredDate || "—"}
                          </TableCell>
                          <TableCell className="text-sm" onClick={() => setViewBooking(b)}>
                            {b.preferredTime || "—"}
                          </TableCell>
                          <TableCell onClick={() => setViewBooking(b)}>
                            <Badge variant="outline" className="text-[10px] uppercase">
                              {b.mode || "—"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm" onClick={() => setViewBooking(b)}>
                            {b.service || "—"}
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Select
                              value={b.status}
                              onValueChange={(v) => updateStatus("bookings", b.id, v)}
                              disabled={updatingId === b.id}
                            >
                              <SelectTrigger
                                className={`h-8 w-32 border bg-background text-xs font-semibold ${BOOKING_STATUS_STYLES[b.status]}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground" onClick={() => setViewBooking(b)}>
                            {formatLeadDate(b.createdAt)}
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setViewBooking(b)}
                                aria-label={`View ${b.name}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setConfirmDelete({
                                    id: b.id,
                                    model: "bookings",
                                    label: b.name || b.email,
                                  })
                                }
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                aria-label={`Delete ${b.name}`}
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
          </div>
        </TabsContent>

        {/* Newsletter */}
        <TabsContent value="newsletter" className="mt-4">
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="max-h-[55vh] overflow-y-auto custom-scroll">
              {data.newsletter.length === 0 ? (
                <EmptyState text="No newsletter subscribers yet." />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-card">
                      <TableRow>
                        <TableHead className="min-w-[300px]">Email</TableHead>
                        <TableHead className="min-w-[180px]">Subscribed</TableHead>
                        <TableHead className="w-20 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.newsletter.map((n) => (
                        <TableRow key={n.id}>
                          <TableCell>
                            <a
                              href={`mailto:${n.email}`}
                              className="font-medium text-foreground hover:text-brand hover:underline"
                            >
                              {n.email}
                            </a>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {formatLeadDate(n.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setConfirmDelete({
                                  id: n.id,
                                  model: "newsletter",
                                  label: n.email,
                                })
                              }
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              aria-label={`Unsubscribe ${n.email}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Guidance detail dialog */}
      <Dialog
        open={!!viewGuidance}
        onOpenChange={(o) => !o && setViewGuidance(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto custom-scroll">
          <DialogHeader>
            <DialogTitle className="text-brand">
              Guidance Request · {viewGuidance?.name}
            </DialogTitle>
            <DialogDescription>
              Submitted {viewGuidance ? formatLeadDate(viewGuidance.createdAt) : ""}
            </DialogDescription>
          </DialogHeader>
          {viewGuidance && (
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailField label="Email" value={viewGuidance.email} />
              <DetailField label="Phone" value={viewGuidance.phone} />
              <DetailField label="Qualification" value={viewGuidance.qualification} />
              <DetailField label="Graduation Year" value={viewGuidance.graduationYear} />
              <DetailField label="Preferred Course" value={viewGuidance.preferredCourse} />
              <DetailField label="Budget" value={viewGuidance.budget} />
              <DetailField label="English Test" value={viewGuidance.englishTest} />
              <DetailField label="Preferred Countries" value={viewGuidance.preferredCountries} />
              <div className="sm:col-span-2">
                <DetailField label="Message" value={viewGuidance.message} multiline />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-brand">
                  Status
                </Label>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${GUIDANCE_STATUS_STYLES[viewGuidance.status]}`}
                  >
                    {viewGuidance.status}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewGuidance(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking detail dialog */}
      <Dialog
        open={!!viewBooking}
        onOpenChange={(o) => !o && setViewBooking(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto custom-scroll">
          <DialogHeader>
            <DialogTitle className="text-brand">
              Booking · {viewBooking?.name}
            </DialogTitle>
            <DialogDescription>
              Submitted {viewBooking ? formatLeadDate(viewBooking.createdAt) : ""}
            </DialogDescription>
          </DialogHeader>
          {viewBooking && (
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailField label="Email" value={viewBooking.email} />
              <DetailField label="Phone" value={viewBooking.phone} />
              <DetailField label="Preferred Date" value={viewBooking.preferredDate} />
              <DetailField label="Preferred Time" value={viewBooking.preferredTime} />
              <DetailField label="Mode" value={viewBooking.mode} />
              <DetailField label="Service" value={viewBooking.service} />
              <div className="sm:col-span-2">
                <DetailField label="Message" value={viewBooking.message} multiline />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-brand">
                  Status
                </Label>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${BOOKING_STATUS_STYLES[viewBooking.status]}`}
                  >
                    {viewBooking.status}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewBooking(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand">Delete lead?</DialogTitle>
            <DialogDescription>
              This will permanently remove{" "}
              <span className="font-semibold text-foreground">
                {confirmDelete?.label}
              </span>{" "}
              ({confirmDelete?.model}). This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                confirmDelete &&
                deleteLead(confirmDelete.model, confirmDelete.id, confirmDelete.label)
              }
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

function SummaryCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  hint: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/5">
          <Icon className={`h-4.5 w-4.5 ${accent}`} />
        </span>
      </div>
      <div className="text-3xl font-extrabold tracking-tight text-brand">
        {value.toLocaleString()}
      </div>
      <div className="mt-1 text-sm font-medium text-foreground">{label}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function DetailField({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-semibold uppercase tracking-wide text-brand">
        {label}
      </Label>
      {multiline ? (
        <div className="whitespace-pre-wrap rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm text-foreground">
          {value || "—"}
        </div>
      ) : (
        <div className="truncate rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm font-medium text-foreground">
          {value || "—"}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Tab 2: Applications
 * -------------------------------------------------------------------------- */

function ApplicationsTab() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewApp, setViewApp] = useState<Application | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Application | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [headlineDraft, setHeadlineDraft] = useState("");
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const lastSyncedAppId = useRef<string | null>(null);

  const fetchApps = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch("/api/admin/applications", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load applications");
      const json = (await res.json()) as { applications: Application[] };
      setApplications(json.applications ?? []);
    } catch {
      toast.error("Could not load applications. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  // Sync editable drafts whenever a different application is opened.
  useEffect(() => {
    if (!viewApp) {
      lastSyncedAppId.current = null;
      return;
    }
    if (viewApp.id === lastSyncedAppId.current) return;
    lastSyncedAppId.current = viewApp.id;
    setHeadlineDraft(viewApp.headline);
    const notes: Record<string, string> = {};
    viewApp.milestones.forEach((m) => {
      notes[m.id] = m.note;
    });
    setNoteDrafts(notes);
  }, [viewApp]);

  const applyPatchLocally = (
    applicationId: string,
    patch: {
      headline?: string;
      status?: ApplicationStatus;
      milestoneId?: string;
      milestoneStatus?: MilestoneStatus;
      milestoneNote?: string;
    },
  ) => {
    const mutate = (a: Application): Application => {
      if (a.id !== applicationId) return a;
      const next: Application = {
        ...a,
        milestones: a.milestones.map((m) => ({ ...m })),
      };
      if (patch.headline !== undefined) next.headline = patch.headline;
      if (patch.status !== undefined) next.status = patch.status;
      if (patch.milestoneId) {
        next.milestones = next.milestones.map((m) =>
          m.id === patch.milestoneId
            ? {
                ...m,
                ...(patch.milestoneStatus !== undefined
                  ? { status: patch.milestoneStatus }
                  : {}),
                ...(patch.milestoneNote !== undefined
                  ? { note: patch.milestoneNote }
                  : {}),
              }
            : m,
        );
      }
      return next;
    };
    setApplications((prev) => prev.map(mutate));
    setViewApp((prev) => (prev ? mutate(prev) : prev));
  };

  const patchApplication = async (
    applicationId: string,
    payload: {
      headline?: string;
      status?: ApplicationStatus;
      milestoneId?: string;
      milestoneStatus?: MilestoneStatus;
      milestoneNote?: string;
    },
    successMsg: string,
  ) => {
    setUpdatingId(applicationId);
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, ...payload }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Update failed");
      }
      applyPatchLocally(applicationId, payload);
      toast.success(successMsg);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update application.");
      fetchApps(true);
    } finally {
      setUpdatingId(null);
    }
  };

  const saveHeadline = () => {
    if (!viewApp) return;
    if (headlineDraft === viewApp.headline) return;
    patchApplication(
      viewApp.id,
      { headline: headlineDraft },
      "Status headline updated.",
    );
  };

  const saveMilestoneNote = (milestoneId: string) => {
    if (!viewApp) return;
    const milestone = viewApp.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;
    const draft = noteDrafts[milestoneId] ?? "";
    if (draft === milestone.note) return;
    patchApplication(
      viewApp.id,
      { milestoneId, milestoneNote: draft },
      `Note saved for "${milestone.label}".`,
    );
  };

  const deleteApplication = async (app: Application) => {
    try {
      const res = await fetch(
        `/api/admin/applications?id=${encodeURIComponent(app.id)}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Delete failed");
      }
      toast.success(`Application ${app.registrationId} deleted.`);
      setConfirmDelete(null);
      if (viewApp?.id === app.id) setViewApp(null);
      await fetchApps(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete application.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  const counts = {
    total: applications.length,
    submitted: applications.filter((a) => a.status === "submitted").length,
    review: applications.filter((a) => a.status === "review").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-brand">Student Applications</h2>
          <p className="text-sm text-muted-foreground">
            Review submitted applications and update milestone statuses that students see on the public Track page.
          </p>
        </div>
        <Button variant="outline" onClick={() => fetchApps(true)} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard
          icon={ClipboardList}
          label="Total Applications"
          value={counts.total}
          hint="All submissions"
          accent="text-brand"
        />
        <SummaryCard
          icon={Inbox}
          label="New"
          value={counts.submitted}
          hint="Status: submitted"
          accent="text-blue-600"
        />
        <SummaryCard
          icon={CalendarClock}
          label="In Review"
          value={counts.review}
          hint="Status: review"
          accent="text-amber-600"
        />
        <SummaryCard
          icon={BadgeCheck}
          label="Accepted"
          value={counts.accepted}
          hint="Status: accepted"
          accent="text-emerald-600"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="max-h-[55vh] overflow-y-auto custom-scroll">
          {applications.length === 0 ? (
            <EmptyState text="No applications submitted yet." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-card">
                  <TableRow>
                    <TableHead className="min-w-[150px]">Registration ID</TableHead>
                    <TableHead className="min-w-[160px]">Name</TableHead>
                    <TableHead className="min-w-[140px]">Phone</TableHead>
                    <TableHead className="min-w-[200px]">Email</TableHead>
                    <TableHead className="min-w-[130px]">Country</TableHead>
                    <TableHead className="min-w-[150px]">Course</TableHead>
                    <TableHead className="min-w-[150px]">Status</TableHead>
                    <TableHead className="min-w-[140px]">Created</TableHead>
                    <TableHead className="w-24 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((a) => (
                    <TableRow key={a.id} className="cursor-pointer hover:bg-secondary/40">
                      <TableCell
                        className="font-mono text-xs font-semibold text-brand"
                        onClick={() => setViewApp(a)}
                      >
                        {a.registrationId}
                      </TableCell>
                      <TableCell
                        className="font-semibold text-brand"
                        onClick={() => setViewApp(a)}
                      >
                        {a.fullName || "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        <a
                          href={`tel:${a.phone}`}
                          className="text-foreground hover:text-brand hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {a.phone || "—"}
                        </a>
                      </TableCell>
                      <TableCell className="text-sm">
                        <a
                          href={`mailto:${a.email}`}
                          className="text-foreground hover:text-brand hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {a.email || "—"}
                        </a>
                      </TableCell>
                      <TableCell className="text-sm" onClick={() => setViewApp(a)}>
                        {a.countryInterest || "—"}
                      </TableCell>
                      <TableCell className="text-sm" onClick={() => setViewApp(a)}>
                        {a.courseInterest || "—"}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={a.status}
                          onValueChange={(v) =>
                            patchApplication(
                              a.id,
                              { status: v as ApplicationStatus },
                              `Status updated to "${v}".`,
                            )
                          }
                          disabled={updatingId === a.id}
                        >
                          <SelectTrigger
                            className={`h-8 w-32 border bg-background text-xs font-semibold ${APPLICATION_STATUS_STYLES[a.status]}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="review">In Review</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="enrolled">Enrolled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground" onClick={() => setViewApp(a)}>
                        {formatLeadDate(a.createdAt)}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setViewApp(a)}
                            aria-label={`View details for ${a.fullName}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirmDelete(a)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            aria-label={`Delete ${a.fullName}`}
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
      </div>

      {/* Detail dialog */}
      <Dialog open={!!viewApp} onOpenChange={(o) => !o && setViewApp(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto custom-scroll">
          <DialogHeader>
            <DialogTitle className="flex flex-wrap items-center gap-2 text-brand">
              <span>Application · {viewApp?.fullName}</span>
              {viewApp && (
                <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground">
                  {viewApp.registrationId}
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Submitted {viewApp ? formatLeadDate(viewApp.createdAt) : ""}
            </DialogDescription>
          </DialogHeader>

          {viewApp && (
            <div className="space-y-5">
              {/* Student profile */}
              <section className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wide text-brand">
                  Student Profile
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailField label="Full Name" value={viewApp.fullName} />
                  <DetailField label="Father's Name" value={viewApp.fatherName} />
                  <DetailField label="Date of Birth" value={viewApp.dob} />
                  <DetailField label="Gender" value={viewApp.gender} />
                  <DetailField label="Phone" value={viewApp.phone} />
                  <DetailField label="Email" value={viewApp.email} />
                  <DetailField label="City / Address" value={viewApp.cityAddress} />
                  <DetailField label="Passport Number" value={viewApp.passportNumber} />
                  <DetailField label="Passport Expiry" value={viewApp.passportExpiry} />
                </div>
              </section>

              {/* Academic & preferences */}
              <section className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wide text-brand">
                  Academic &amp; Preferences
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailField label="Country of Interest" value={viewApp.countryInterest} />
                  <DetailField label="Course of Interest" value={viewApp.courseInterest} />
                  <DetailField label="University Preference" value={viewApp.universityInterest} />
                  <DetailField label="Matric Grade" value={viewApp.matricGrade} />
                  <DetailField label="FSc Grade" value={viewApp.fscGrade} />
                  <DetailField label="IELTS Score" value={viewApp.ieltsScore} />
                </div>
              </section>

              {/* Documents submitted */}
              <section className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wide text-brand">
                  Documents Submitted
                </h4>
                {(() => {
                  let docs: Array<{ name: string; type: string }> = [];
                  try {
                    if (viewApp.documents) {
                      const parsed = JSON.parse(viewApp.documents);
                      docs = Array.isArray(parsed) ? parsed : [];
                    }
                  } catch {
                    docs = [];
                  }
                  if (docs.length === 0) {
                    return (
                      <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          No documents were uploaded with this application.
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Ask the student to send their documents (transcript,
                          passport, photo, CNIC) via WhatsApp.
                        </p>
                        <a
                          href={`https://wa.me/${viewApp.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hello ${viewApp.fullName}, please send your documents (Matric certificate, FSc transcript, passport copy, passport-size photo, CNIC) for your application ${viewApp.registrationId}. Thank you!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="sm"
                            className="mt-3 bg-green-500 text-white hover:bg-green-600"
                          >
                            <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                            Request Documents on WhatsApp
                          </Button>
                        </a>
                      </div>
                    );
                  }
                  return (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {docs.map((d, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                        >
                          <FileText className="h-8 w-8 shrink-0 text-brand" />
                          <div className="flex-1 min-w-0">
                            <div className="truncate text-sm font-semibold text-foreground">
                              {d.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {d.type}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </section>

              {/* Status + headline editor */}
              <section className="space-y-3 rounded-2xl border border-border bg-secondary/30 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wide text-brand">
                  Status &amp; Student-Facing Headline
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-brand">
                      Overall Status
                    </Label>
                    <Select
                      value={viewApp.status}
                      onValueChange={(v) =>
                        patchApplication(
                          viewApp.id,
                          { status: v as ApplicationStatus },
                          `Status updated to "${v}".`,
                        )
                      }
                      disabled={updatingId === viewApp.id}
                    >
                      <SelectTrigger
                        className={`w-full border bg-background text-xs font-semibold ${APPLICATION_STATUS_STYLES[viewApp.status]}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="review">In Review</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="enrolled">Enrolled</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Drives the badge shown on the Track page.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="app-headline"
                      className="text-xs font-semibold uppercase tracking-wide text-brand"
                    >
                      Headline Message
                    </Label>
                    <Textarea
                      id="app-headline"
                      value={headlineDraft}
                      onChange={(e) => setHeadlineDraft(e.target.value)}
                      onBlur={saveHeadline}
                      rows={3}
                      className="resize-none bg-background text-sm"
                      placeholder="Shown to the student on the Track page…"
                    />
                    <p className="text-xs text-muted-foreground">
                      Saves automatically when you click away.
                    </p>
                  </div>
                </div>
              </section>

              {/* Milestone timeline */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-brand">
                    Milestone Timeline
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    Visible to student on Track page
                  </span>
                </div>

                {viewApp.milestones.length === 0 ? (
                  <EmptyState text="No milestones defined for this application." />
                ) : (
                  <ol className="space-y-3">
                    {[...viewApp.milestones]
                      .sort((x, y) => x.order - y.order)
                      .map((m, idx, arr) => (
                        <li key={m.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <span
                              className={`mt-1.5 h-4 w-4 rounded-full border-2 border-background ${MILESTONE_STATUS_DOT[m.status]}`}
                              aria-hidden
                            />
                            {idx < arr.length - 1 && (
                              <span className="mt-1 w-px flex-1 bg-border" aria-hidden />
                            )}
                          </div>
                          <div className="flex-1 rounded-xl border border-border bg-card p-3 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-sm font-bold text-brand">
                                {m.label}
                              </span>
                              <Select
                                value={m.status}
                                onValueChange={(v) =>
                                  patchApplication(
                                    viewApp.id,
                                    {
                                      milestoneId: m.id,
                                      milestoneStatus: v as MilestoneStatus,
                                    },
                                    `"${m.label}" marked as "${v}".`,
                                  )
                                }
                                disabled={updatingId === viewApp.id}
                              >
                                <SelectTrigger
                                  className={`h-8 w-32 border bg-background text-xs font-semibold ${MILESTONE_STATUS_STYLES[m.status]}`}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="done">Done</SelectItem>
                                  <SelectItem value="issue">Issue</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="mt-2 space-y-1">
                              <Label
                                htmlFor={`note-${m.id}`}
                                className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                              >
                                Note
                              </Label>
                              <Input
                                id={`note-${m.id}`}
                                value={noteDrafts[m.id] ?? ""}
                                onChange={(e) =>
                                  setNoteDrafts((prev) => ({
                                    ...prev,
                                    [m.id]: e.target.value,
                                  }))
                                }
                                onBlur={() => saveMilestoneNote(m.id)}
                                placeholder="Add a short note for the student…"
                                className="h-8 bg-background text-sm"
                              />
                            </div>
                          </div>
                        </li>
                      ))}
                  </ol>
                )}
              </section>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewApp(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand">Delete application?</DialogTitle>
            <DialogDescription>
              This will permanently delete the application from{" "}
              <span className="font-semibold text-foreground">
                {confirmDelete?.fullName}
              </span>{" "}
              (ID{" "}
              <span className="font-mono font-semibold text-foreground">
                {confirmDelete?.registrationId}
              </span>
              ) and all of its milestones. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDelete && deleteApplication(confirmDelete)}
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

/* ----------------------------------------------------------------------------
 * Tab 3: Analytics
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
 * Tab 4: Countries (CRUD)
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

  // Quick toggle: featured (Popular label)
  const toggleFeatured = async (c: Country) => {
    if (!c.id) return;
    // Optimistic update
    setCountries((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, featured: !x.featured } : x))
    );
    try {
      const res = await fetch("/api/admin/countries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, featured: !c.featured }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`${c.name} ${c.featured ? "removed from" : "marked as"} Popular`);
    } catch {
      toast.error("Could not update. Reverting.");
      setCountries((prev) =>
        prev.map((x) => (x.id === c.id ? { ...x, featured: c.featured } : x))
      );
    }
  };

  // Quick toggle: hidden (show/hide on public site)
  const toggleHidden = async (c: Country) => {
    if (!c.id) return;
    setCountries((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, hidden: !x.hidden } : x))
    );
    try {
      const res = await fetch("/api/admin/countries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, hidden: !c.hidden }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`${c.name} ${c.hidden ? "shown" : "hidden"} on the site`);
    } catch {
      toast.error("Could not update. Reverting.");
      setCountries((prev) =>
        prev.map((x) => (x.id === c.id ? { ...x, hidden: c.hidden } : x))
      );
    }
  };

  // Reorder: swap order with adjacent country
  const moveCountry = async (c: Country, direction: "up" | "down") => {
    if (!c.id) return;
    const sorted = [...countries].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((x) => x.id === c.id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const swapWith = sorted[swapIdx];
    if (!swapWith.id) return;
    // Optimistic: swap order values locally
    setCountries((prev) =>
      prev.map((x) => {
        if (x.id === c.id) return { ...x, order: swapWith.order };
        if (x.id === swapWith.id) return { ...x, order: c.order };
        return x;
      })
    );
    try {
      // Update both countries
      await Promise.all([
        fetch("/api/admin/countries", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: c.id, order: swapWith.order }),
        }),
        fetch("/api/admin/countries", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: swapWith.id, order: c.order }),
        }),
      ]);
      toast.success(`${c.name} moved ${direction}`);
    } catch {
      toast.error("Could not reorder. Refreshing.");
      await fetchCountries();
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
                  <TableHead className="min-w-[140px]">Name / Slug</TableHead>
                  <TableHead className="min-w-[180px]">Tagline</TableHead>
                  <TableHead className="w-24 text-center">Popular</TableHead>
                  <TableHead className="w-20 text-center">Visible</TableHead>
                  <TableHead className="w-20 text-center">Order</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...countries]
                  .sort((a, b) => a.order - b.order)
                  .map((c) => (
                  <TableRow
                    key={c.id ?? c.slug}
                    className={c.hidden ? "opacity-40" : ""}
                  >
                    <TableCell>
                      <span className="text-2xl">{c.flagEmoji}</span>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-brand">{c.name}</div>
                      <div className="font-mono text-xs text-muted-foreground">/{c.slug}</div>
                      {c.hidden && (
                        <span className="mt-0.5 inline-block rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                          Hidden
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <span className="line-clamp-2 text-sm text-foreground">
                        {c.tagline}
                      </span>
                    </TableCell>
                    {/* Popular toggle */}
                    <TableCell className="text-center">
                      <button
                        onClick={() => toggleFeatured(c)}
                        className="rounded-md p-1.5 transition hover:bg-secondary"
                        aria-label={`Toggle Popular for ${c.name}`}
                      >
                        <Star
                          className={`h-5 w-5 transition ${c.featured ? "fill-gold text-gold" : "text-muted-foreground hover:text-gold"}`}
                        />
                      </button>
                    </TableCell>
                    {/* Visible/Hidden toggle */}
                    <TableCell className="text-center">
                      <button
                        onClick={() => toggleHidden(c)}
                        className="rounded-md p-1.5 transition hover:bg-secondary"
                        aria-label={`Toggle visibility for ${c.name}`}
                      >
                        {c.hidden ? (
                          <EyeOff className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Eye className="h-5 w-5 text-brand" />
                        )}
                      </button>
                    </TableCell>
                    {/* Order + move up/down */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => moveCountry(c, "up")}
                          className="rounded p-0.5 text-muted-foreground transition hover:bg-secondary hover:text-brand"
                          aria-label={`Move ${c.name} up`}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <span className="w-5 text-xs font-bold tabular-nums">{c.order}</span>
                        <button
                          onClick={() => moveCountry(c, "down")}
                          className="rounded p-0.5 text-muted-foreground transition hover:bg-secondary hover:text-brand"
                          aria-label={`Move ${c.name} down`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEdit(c)}
                          className="h-8 px-3 text-xs font-semibold"
                          aria-label={`Edit ${c.name}`}
                        >
                          <Pencil className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfirmDelete(c)}
                          className="h-8 px-3 text-xs font-semibold text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Delete ${c.name}`}
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" />
                          Delete
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
                  (shown with a gold star + "Popular" label)
                </span>
              </span>
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-secondary/50 px-3 py-2.5">
              <Checkbox
                checked={form.hidden}
                onCheckedChange={(v) => onField("hidden", v === true)}
              />
              <span className="text-sm font-medium">
                Hide from public site{" "}
                <span className="text-muted-foreground">
                  (country stays in admin but won't appear on the website)
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
 * Tab 5: Content (Stats + Hero + Counseling + Assistant + Newsletter + Footer)
 * -------------------------------------------------------------------------- */

type ContentField = {
  key: string;
  label: string;
  multiline?: boolean;
  hint?: string;
  image?: boolean;
};

const HERO_FIELDS: ContentField[] = [
  { key: "heroBadge", label: "Hero Badge", hint: "Small pill above the title" },
  { key: "heroTitle", label: "Hero Title", multiline: true },
  { key: "heroSubtitle", label: "Hero Subtitle", multiline: true },
  { key: "heroPrimaryCta", label: "Primary CTA Button" },
  { key: "heroSecondaryCta", label: "Secondary CTA Button" },
  { key: "heroTrust1", label: "Trust Badge #1" },
  { key: "heroTrust2", label: "Trust Badge #2" },
  { key: "heroImage", label: "Hero Image", hint: "Upload an image or paste a URL", image: true },
];

const COUNSELING_FIELDS: ContentField[] = [
  { key: "counselingBadge", label: "Badge", hint: "Small pill above the title" },
  { key: "counselingTitle", label: "Title", multiline: true },
  { key: "counselingSubtitle", label: "Subtitle", multiline: true },
  { key: "counselingCta1", label: "Primary CTA Button" },
  { key: "counselingCta2", label: "Secondary CTA Button" },
  { key: "counselingImage", label: "Counseling Image", hint: "Upload an image or paste a URL", image: true },
];

const ASSISTANT_FIELDS: ContentField[] = [
  { key: "assistantBadge", label: "Badge", hint: "Small pill above the title" },
  { key: "assistantTitle", label: "Title" },
  { key: "assistantSubtitle", label: "Subtitle", multiline: true },
  { key: "assistantCta", label: "CTA Button" },
];

const NEWSLETTER_FIELDS: ContentField[] = [
  { key: "newsletterTitle", label: "Title" },
  { key: "newsletterSubtitle", label: "Subtitle", multiline: true },
];

const FOOTER_FIELDS: ContentField[] = [
  { key: "footerBrand", label: "Brand Name" },
  { key: "footerAddress", label: "Address", multiline: true },
  { key: "footerPhone", label: "Phone" },
  { key: "footerEmail", label: "Email" },
  { key: "footerWhatsapp", label: "WhatsApp", hint: "Digits only, e.g. 923142638901" },
];

const FIELD_LABELS: Record<string, string> = [
  ...HERO_FIELDS,
  ...COUNSELING_FIELDS,
  ...ASSISTANT_FIELDS,
  ...NEWSLETTER_FIELDS,
  ...FOOTER_FIELDS,
].reduce<Record<string, string>>((acc, f) => {
  acc[f.key] = f.label;
  return acc;
}, {});

function ContentTab() {
  const { content, loading } = useSiteContent();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Stats editor state
  const [statsDraft, setStatsDraft] = useState<Stat[]>(defaultStats);
  const [savingStats, setSavingStats] = useState(false);

  useEffect(() => {
    if (content) {
      const allFields = [
        ...HERO_FIELDS,
        ...COUNSELING_FIELDS,
        ...ASSISTANT_FIELDS,
        ...NEWSLETTER_FIELDS,
        ...FOOTER_FIELDS,
      ];
      const next: Record<string, string> = {};
      for (const f of allFields) {
        const v = (content as unknown as Record<string, string>)[f.key];
        next[f.key] = typeof v === "string" ? v : "";
      }
      setDrafts(next);
      setStatsDraft(
        Array.isArray(content.stats) && content.stats.length > 0
          ? content.stats.map((s) => ({ ...s }))
          : defaultStats.map((s) => ({ ...s })),
      );
    }
  }, [content]);

  const save = async (key: string) => {
    const value = drafts[key] ?? "";
    setSavingKey(key);
    try {
      await saveContentKey(key, value);
      toast.success(`${FIELD_LABELS[key] ?? key} saved.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSavingKey(null);
    }
  };

  const saveStats = async () => {
    setSavingStats(true);
    try {
      await saveContentKey("stats", statsDraft);
      toast.success("Stats saved.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSavingStats(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-brand">Marketing Content</h2>
        <p className="text-sm text-muted-foreground">
          Edit every text block on the homepage — stats, hero, counseling, AI assistant,
          newsletter, and footer. Each field saves independently.
        </p>
      </div>

      {/* Stats editor */}
      <SectionCard title="Stats Strip" icon={BarChart3}>
        <p className="mb-3 text-xs text-muted-foreground">
          The four counters shown below the hero. Use a short, punchy value (e.g. 12,000+ or 96%).
        </p>
        <div className="space-y-3">
          {statsDraft.map((s, i) => {
            const Ico = STAT_ICON_MAP[s.icon] ?? Users;
            return (
              <div
                key={i}
                className="grid items-end gap-3 rounded-lg border border-border bg-secondary/30 p-3 sm:grid-cols-[1fr_1fr_180px]"
              >
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-brand">
                    Label
                  </Label>
                  <Input
                    value={s.label}
                    onChange={(e) =>
                      setStatsDraft((arr) =>
                        arr.map((row, idx) => (idx === i ? { ...row, label: e.target.value } : row)),
                      )
                    }
                    placeholder="Students Placed"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-brand">
                    Value
                  </Label>
                  <Input
                    value={s.value}
                    onChange={(e) =>
                      setStatsDraft((arr) =>
                        arr.map((row, idx) => (idx === i ? { ...row, value: e.target.value } : row)),
                      )
                    }
                    placeholder="12,000+"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-brand">
                    Icon
                  </Label>
                  <Select
                    value={s.icon}
                    onValueChange={(v) =>
                      setStatsDraft((arr) =>
                        arr.map((row, idx) => (idx === i ? { ...row, icon: v } : row)),
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <span className="flex items-center gap-2">
                        <Ico className="h-4 w-4" />
                        <SelectValue />
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {STAT_ICONS.map(({ value, label, Icon: I }) => (
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
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={saveStats}
            disabled={savingStats}
            className="bg-brand text-white hover:bg-brand/90"
          >
            {savingStats ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-4 w-4" />
            )}
            Save Stats
          </Button>
        </div>
      </SectionCard>

      {/* Hero */}
      <SectionCard title="Hero Section" icon={Sparkles}>
        <div className="grid gap-4 sm:grid-cols-2">
          {HERO_FIELDS.map((f) => (
            <FieldCard
              key={f.key}
              field={f}
              value={drafts[f.key] ?? ""}
              onChange={(v) => setDrafts((d) => ({ ...d, [f.key]: v }))}
              onSave={() => save(f.key)}
              saving={savingKey === f.key}
              previewImage={f.key === "heroImage" ? drafts[f.key] : undefined}
            />
          ))}
        </div>
      </SectionCard>

      {/* Counseling CTA */}
      <SectionCard title="Counseling CTA Section" icon={MessageCircle}>
        <div className="grid gap-4 sm:grid-cols-2">
          {COUNSELING_FIELDS.map((f) => (
            <FieldCard
              key={f.key}
              field={f}
              value={drafts[f.key] ?? ""}
              onChange={(v) => setDrafts((d) => ({ ...d, [f.key]: v }))}
              onSave={() => save(f.key)}
              saving={savingKey === f.key}
              previewImage={f.key === "counselingImage" ? drafts[f.key] : undefined}
            />
          ))}
        </div>
      </SectionCard>

      {/* AI Assistant */}
      <SectionCard title="AI Assistant Section" icon={Sparkles}>
        <div className="grid gap-4 sm:grid-cols-2">
          {ASSISTANT_FIELDS.map((f) => (
            <FieldCard
              key={f.key}
              field={f}
              value={drafts[f.key] ?? ""}
              onChange={(v) => setDrafts((d) => ({ ...d, [f.key]: v }))}
              onSave={() => save(f.key)}
              saving={savingKey === f.key}
            />
          ))}
        </div>
      </SectionCard>

      {/* Newsletter */}
      <SectionCard title="Newsletter Section" icon={Mail}>
        <div className="grid gap-4 sm:grid-cols-2">
          {NEWSLETTER_FIELDS.map((f) => (
            <FieldCard
              key={f.key}
              field={f}
              value={drafts[f.key] ?? ""}
              onChange={(v) => setDrafts((d) => ({ ...d, [f.key]: v }))}
              onSave={() => save(f.key)}
              saving={savingKey === f.key}
            />
          ))}
        </div>
      </SectionCard>

      {/* Footer / Contact */}
      <SectionCard title="Footer / Contact" icon={MapPin}>
        <div className="grid gap-4 sm:grid-cols-2">
          {FOOTER_FIELDS.map((f) => (
            <FieldCard
              key={f.key}
              field={f}
              value={drafts[f.key] ?? ""}
              onChange={(v) => setDrafts((d) => ({ ...d, [f.key]: v }))}
              onSave={() => save(f.key)}
              saving={savingKey === f.key}
              iconPrefix={
                f.key === "footerPhone"
                  ? Phone
                  : f.key === "footerEmail"
                    ? Mail
                    : f.key === "footerWhatsapp"
                      ? MessageCircle
                      : f.key === "footerAddress"
                        ? MapPin
                        : undefined
              }
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function FieldCard({
  field,
  value,
  onChange,
  onSave,
  saving,
  previewImage,
  iconPrefix: IconPrefix,
}: {
  field: ContentField;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  saving: boolean;
  previewImage?: string;
  iconPrefix?: React.ComponentType<{ className?: string }>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
      toast.success("Image uploaded — click Save to apply.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card
      className={`rounded-2xl border-border p-5 shadow-sm ${
        field.multiline ? "sm:col-span-2" : ""
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-brand">
          {field.label}
        </Label>
        {previewImage && (
          <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded border border-border">
            <img
              src={previewImage}
              alt="preview"
              className="h-full w-full object-cover"
            />
          </span>
        )}
      </div>
      {field.multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={field.key === "heroSubtitle" || field.key === "counselingSubtitle" || field.key === "assistantSubtitle" || field.key === "newsletterSubtitle" ? 3 : 2}
          className="resize-y"
        />
      ) : (
        <div className="relative">
          {IconPrefix && (
            <IconPrefix className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          )}
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={IconPrefix ? "pl-9" : ""}
          />
        </div>
      )}
      {field.hint && <p className="mt-1 text-xs text-muted-foreground">{field.hint}</p>}

      {field.image && value && (
        <div className="mt-3 overflow-hidden rounded-lg border border-border bg-secondary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="h-32 w-full object-cover" />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        {field.image ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-1.5 h-4 w-4" />
              )}
              {uploading ? "Uploading…" : "Upload image"}
            </Button>
          </>
        ) : (
          <span />
        )}
        <Button
          size="sm"
          onClick={onSave}
          disabled={saving}
          className="bg-brand text-white hover:bg-brand/90"
        >
          {saving ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-1.5 h-4 w-4" />
          )}
          Save
        </Button>
      </div>
    </Card>
  );
}

/* ----------------------------------------------------------------------------
 * Tab 6: Services editor
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
 * Tab 7: Compare Factors editor
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
