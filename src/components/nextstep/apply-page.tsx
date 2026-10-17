"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  User,
  BookOpen,
  FileText,
  UploadCloud,
  AlertCircle,
  MessageCircle,
  Search,
  Clock,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const COUNTRIES = [
  "United Kingdom", "Australia", "United States", "Canada", "Germany",
  "Ireland", "Netherlands", "UAE", "Malaysia", "Türkiye", "Hungary",
  "New Zealand", "Singapore", "Indonesia", "Georgia", "China",
  "Not sure yet — advise me", "Other",
];

const COURSES = [
  "MBBS / Medicine", "MD", "BDS (Dentistry)", "Pharmacy",
  "Engineering", "Computer Science / IT", "Business / MBA",
  "Law", "Nursing", "Other",
];

type FormState = {
  fullName: string;
  phone: string;
  countryInterest: string;
  courseInterest: string;
  universityInterest: string;
  matricGrade: string;
  fscGrade: string;
  otherDegree: string;
  ieltsScore: string;
  fatherName: string;
  gender: string;
  dob: string;
  email: string;
  cityAddress: string;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiry: string;
};

export function ApplyPage({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null); // registrationId on success
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Set<string>>(new Set());
  const [form, setForm] = useState<FormState>({
    fullName: "", phone: "", countryInterest: "", courseInterest: "",
    universityInterest: "", matricGrade: "", fscGrade: "", otherDegree: "",
    ieltsScore: "", fatherName: "", gender: "", dob: "", email: "",
    cityAddress: "", passportNumber: "", passportIssueDate: "", passportExpiry: "",
  });

  const set = (k: keyof FormState, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setError(null);
    // Clear the field error as soon as the user types/selects
    setFieldErrors((prev) => {
      if (!prev.has(k)) return prev;
      const next = new Set(prev);
      next.delete(k);
      return next;
    });
  };

  const steps = [
    { n: 1, label: "Start", icon: User },
    { n: 2, label: "Program", icon: BookOpen },
    { n: 3, label: "Details", icon: FileText },
    { n: 4, label: "Documents", icon: UploadCloud },
  ];

  // Map field keys → human labels for the error message
  const fieldLabels: Record<string, string> = {
    fullName: "Full Name",
    phone: "WhatsApp Number",
    countryInterest: "Destination Country",
    courseInterest: "Program",
    fatherName: "Father's Name",
    gender: "Gender",
    dob: "Date of Birth",
    email: "Email",
    passportNumber: "Passport Number",
    passportExpiry: "Passport Expiry",
  };

  const validateStep = (n: number): string[] => {
    const missing: string[] = [];
    if (n === 1) {
      if (!form.fullName.trim()) missing.push("fullName");
      if (!form.phone.trim()) missing.push("phone");
      if (!form.countryInterest) missing.push("countryInterest");
    } else if (n === 2) {
      if (!form.courseInterest) missing.push("courseInterest");
    } else if (n === 3) {
      if (!form.fatherName.trim()) missing.push("fatherName");
      if (!form.gender) missing.push("gender");
      if (!form.dob) missing.push("dob");
      if (!form.email.trim()) missing.push("email");
      if (!form.passportNumber.trim()) missing.push("passportNumber");
      if (!form.passportExpiry) missing.push("passportExpiry");
    }
    return missing;
  };

  const nextStep = () => {
    const missing = validateStep(step);
    if (missing.length) {
      setFieldErrors(new Set(missing));
      const labels = missing.map((k) => fieldLabels[k] || k);
      setError(
        `Step ${step}: Please fill in the required field${missing.length > 1 ? "s" : ""}: ${labels.join(", ")}`
      );
      // Scroll the first invalid field into view so the user sees the red border
      setTimeout(() => {
        const firstKey = missing[0];
        const el = document.querySelector(`[data-field="${firstKey}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        (el as HTMLElement | null)?.focus?.();
      }, 50);
      return;
    }
    setFieldErrors(new Set());
    setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => {
    setFieldErrors(new Set());
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
  };

  const submit = async () => {
    const missing = validateStep(3);
    if (missing.length) {
      setFieldErrors(new Set(missing));
      const labels = missing.map((k) => fieldLabels[k] || k);
      setError(
        `Step 3: Please fill in the required field${missing.length > 1 ? "s" : ""}: ${labels.join(", ")}`
      );
      setStep(3);
      setTimeout(() => {
        const firstKey = missing[0];
        const el = document.querySelector(`[data-field="${firstKey}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        (el as HTMLElement | null)?.focus?.();
      }, 50);
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      // Collect uploaded file names so the admin can see what was submitted
      const fileInputs = document.querySelectorAll<HTMLInputElement>('input[type="file"]');
      const docs: Array<{ name: string; type: string }> = [];
      fileInputs.forEach((inp) => {
        if (inp.files && inp.files.length > 0) {
          const label = inp.closest(".space-y-1.5")?.querySelector("label")?.textContent?.replace("*", "").trim() || "Document";
          docs.push({ name: inp.files[0].name, type: label });
        }
      });
      const payload = { ...form, documents: JSON.stringify(docs) };
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setDone(data.registrationId);
      toast.success("Application submitted!", {
        description: `Your Register ID is ${data.registrationId}`,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
      toast.error("Submission failed", { description: e instanceof Error ? e.message : "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <span className="text-lg font-extrabold text-brand">NextStep Apply</span>
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
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Start Your Application
        </h1>
        <div className="mx-auto mt-3 h-0.5 w-16 rounded bg-gold" />
        <p className="mx-auto mt-4 max-w-md text-sm text-white/85">
          Fill in your details below. Our admissions team will review and contact
          you on WhatsApp within 24 hours.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {[
            { icon: Clock, text: "24-hour response" },
            { icon: ShieldCheck, text: "100% free consultation" },
            { icon: Phone, text: "WhatsApp support" },
          ].map((b) => (
            <span
              key={b.text}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur"
            >
              <b.icon className="h-3.5 w-3.5 text-gold" />
              {b.text}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Progress steps */}
        {!done && (
          <div className="mb-8 flex items-center">
            {steps.map((s, i) => {
              const isDone = step > s.n;
              const isActive = step === s.n;
              return (
                <div key={s.n} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex w-full items-center">
                    {i > 0 && (
                      <div className={`h-0.5 flex-1 ${step > s.n - 1 ? "bg-gold" : "bg-border"}`} />
                    )}
                    <button
                      onClick={() => s.n < step && setStep(s.n)}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
                        isDone
                          ? "border-gold bg-gold text-white"
                          : isActive
                            ? "border-brand bg-brand text-white shadow-md"
                            : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {isDone ? <Check className="h-4 w-4" /> : s.n}
                    </button>
                    {i < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 ${step > s.n ? "bg-gold" : "bg-border"}`} />
                    )}
                  </div>
                  <span className={`text-xs font-semibold ${isActive ? "text-brand" : isDone ? "text-gold" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Error banner */}
        {error && !done && (
          <div
            data-error-banner
            className="mb-5 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive shadow-sm"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-border bg-card p-8 text-center shadow-lg"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand shadow-xl"
              >
                <Check className="h-10 w-10 text-white" />
              </motion.div>
              <h2 className="mt-6 text-3xl font-extrabold text-foreground">
                Application Received!
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Our admissions team will review your documents and reach out on{" "}
                <strong className="text-foreground">WhatsApp within 24 hours</strong>.
              </p>

              <div className="mx-auto mt-6 max-w-md rounded-xl border border-border bg-secondary/40 p-5 text-left">
                <p className="text-sm text-foreground/80">
                  Your <strong className="text-brand">Registration ID</strong> is:
                </p>
                <p className="mt-2 text-center text-3xl font-extrabold tracking-wider text-brand">
                  {done}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Save this ID — use it on the{" "}
                  <button
                    onClick={() => {
                      window.location.href = "/?track=true";
                    }}
                    className="font-semibold text-brand underline"
                  >
                    Track Application
                  </button>{" "}
                  page to check your status anytime.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  onClick={() => {
                    window.location.href = "/?track=true";
                  }}
                  variant="outline"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Track Application
                </Button>
                <a
                  href={`https://wa.me/995511113670?text=Assalam%20o%20Alaikum%2C%20I%20just%20submitted%20my%20application.%20My%20Registration%20ID%20is%20${done}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-green-500 hover:bg-green-600">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat on WhatsApp
                  </Button>
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="overflow-hidden">
                {/* Step 1: Start */}
                {step === 1 && (
                  <StepCard icon={User} title="Let's get started" sub="Takes about 20 seconds">
                    <p className="mb-4 rounded-lg bg-secondary/50 p-3 text-sm text-muted-foreground">
                      Just three quick things to begin — no documents needed yet.
                    </p>
                    <Field label="Full Name" required fieldKey="fullName" error={fieldErrors.has("fullName")}>
                      <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="As on passport" className={fieldErrors.has("fullName") ? "border-destructive ring-2 ring-destructive/20" : ""} />
                    </Field>
                    <Field label="WhatsApp Number" required fieldKey="phone" error={fieldErrors.has("phone")}>
                      <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+92 300 0000000" className={fieldErrors.has("phone") ? "border-destructive ring-2 ring-destructive/20" : ""} />
                      <p className="mt-1 text-xs text-muted-foreground">This is where our team will message you within 24 hours.</p>
                    </Field>
                    <Field label="Where do you want to study?" required fieldKey="countryInterest" error={fieldErrors.has("countryInterest")}>
                      <Select value={form.countryInterest} onValueChange={(v) => set("countryInterest", v)}>
                        <SelectTrigger className={fieldErrors.has("countryInterest") ? "border-destructive ring-2 ring-destructive/20" : ""}><SelectValue placeholder="Select country" /></SelectTrigger>
                        <SelectContent className="max-h-60">
                          {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                  </StepCard>
                )}

                {/* Step 2: Program */}
                {step === 2 && (
                  <StepCard icon={BookOpen} title="Your study plan" sub="What you want to study">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Course / Program" required fieldKey="courseInterest" error={fieldErrors.has("courseInterest")}>
                        <Select value={form.courseInterest} onValueChange={(v) => set("courseInterest", v)}>
                          <SelectTrigger className={fieldErrors.has("courseInterest") ? "border-destructive ring-2 ring-destructive/20" : ""}><SelectValue placeholder="Select program" /></SelectTrigger>
                          <SelectContent>
                            {COURSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="University Preference">
                        <Input value={form.universityInterest} onChange={(e) => set("universityInterest", e.target.value)} placeholder="e.g. University of Edinburgh, or Not decided" />
                      </Field>
                      <Field label="Matric Marks / Grade">
                        <Input value={form.matricGrade} onChange={(e) => set("matricGrade", e.target.value)} placeholder="e.g. 850/1100" />
                      </Field>
                      <Field label="FSc Marks / Grade">
                        <Input value={form.fscGrade} onChange={(e) => set("fscGrade", e.target.value)} placeholder="e.g. 900/1100" />
                      </Field>
                      <Field label="Other Degree">
                        <Input value={form.otherDegree} onChange={(e) => set("otherDegree", e.target.value)} placeholder="e.g. BSc Computer Science" />
                      </Field>
                      <Field label="IELTS Score">
                        <Input value={form.ieltsScore} onChange={(e) => set("ieltsScore", e.target.value)} placeholder="e.g. 6.5 (or leave blank)" />
                      </Field>
                    </div>
                  </StepCard>
                )}

                {/* Step 3: Personal & passport */}
                {step === 3 && (
                  <StepCard icon={FileText} title="Personal & passport details" sub="Needed to prepare your admission file">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Father's Name" required fieldKey="fatherName" error={fieldErrors.has("fatherName")}>
                        <Input value={form.fatherName} onChange={(e) => set("fatherName", e.target.value)} placeholder="As on documents" className={fieldErrors.has("fatherName") ? "border-destructive ring-2 ring-destructive/20" : ""} />
                      </Field>
                      <Field label="Gender" required fieldKey="gender" error={fieldErrors.has("gender")}>
                        <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
                          <SelectTrigger className={fieldErrors.has("gender") ? "border-destructive ring-2 ring-destructive/20" : ""}><SelectValue placeholder="Select gender" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Date of Birth" required fieldKey="dob" error={fieldErrors.has("dob")}>
                        <Input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} max={new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString().slice(0, 10)} className={fieldErrors.has("dob") ? "border-destructive ring-2 ring-destructive/20" : ""} />
                      </Field>
                      <Field label="Email Address" required fieldKey="email" error={fieldErrors.has("email")}>
                        <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@gmail.com" className={fieldErrors.has("email") ? "border-destructive ring-2 ring-destructive/20" : ""} />
                      </Field>
                      <div className="sm:col-span-2">
                        <Field label="City / Address">
                          <Input value={form.cityAddress} onChange={(e) => set("cityAddress", e.target.value)} placeholder="e.g. Lahore, Pakistan" />
                        </Field>
                      </div>
                      <div className="sm:col-span-2">
                        <Field label="Passport Number" required fieldKey="passportNumber" error={fieldErrors.has("passportNumber")}>
                          <Input
                            value={form.passportNumber}
                            onChange={(e) => set("passportNumber", e.target.value.toUpperCase())}
                            placeholder="AB1234567"
                            className={`uppercase ${fieldErrors.has("passportNumber") ? "border-destructive ring-2 ring-destructive/20" : ""}`}
                            maxLength={20}
                          />
                          <p className="mt-1 text-xs text-muted-foreground">CAPITAL letters and numbers only — e.g. AB1234567</p>
                        </Field>
                      </div>
                      <Field label="Passport Issue Date">
                        <Input type="date" value={form.passportIssueDate} onChange={(e) => set("passportIssueDate", e.target.value)} />
                      </Field>
                      <Field label="Passport Expiry Date" required fieldKey="passportExpiry" error={fieldErrors.has("passportExpiry")}>
                        <Input type="date" value={form.passportExpiry} onChange={(e) => set("passportExpiry", e.target.value)} className={fieldErrors.has("passportExpiry") ? "border-destructive ring-2 ring-destructive/20" : ""} />
                      </Field>
                    </div>
                  </StepCard>
                )}

                {/* Step 4: Documents */}
                {step === 4 && (
                  <StepCard icon={UploadCloud} title="Document Uploads" sub="Optional — you can also send documents via WhatsApp">
                    <p className="mb-4 rounded-lg bg-secondary/50 p-3 text-sm text-muted-foreground">
                      Upload your documents now, or skip this step and send them on WhatsApp later.
                      We accept PDF and image files.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {["Matric Certificate", "FSc Certificate / Transcript", "Passport Copy (photo page)", "Passport Size Photo (white bg)", "CNIC Copy", "Other Document (optional)"].map((label, i) => (
                        <div key={i}>
                          <Label className="text-xs font-medium">{label}</Label>
                          <Input type="file" accept="application/pdf,image/*" className="mt-1.5 cursor-pointer p-2 text-xs" />
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-center text-xs text-muted-foreground">
                      Documents are optional at this stage. You can email or WhatsApp them later.
                    </p>
                  </StepCard>
                )}

                {/* Navigation */}
                {!done && (
                  <div className="flex items-center justify-between gap-3 border-t border-border bg-secondary/30 p-4">
                    {step > 1 ? (
                      <Button variant="outline" onClick={prevStep} disabled={submitting}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs font-semibold text-muted-foreground">
                      Step {step} of 4
                    </span>
                    {step < 4 ? (
                      <Button onClick={nextStep} className="bg-brand hover:bg-brand/90">
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button onClick={submit} disabled={submitting} className="bg-brand hover:bg-brand/90">
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting…
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Submit Application
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By submitting, you agree that our team may contact you via WhatsApp.
        </p>
      </div>
    </div>
  );
}

function StepCard({
  icon: Icon,
  title,
  sub,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex items-center gap-3 border-b border-border bg-secondary/20 p-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-brand">{title}</h3>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </div>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </>
  );
}

function Field({
  label,
  required,
  fieldKey,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  fieldKey?: string;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5" data-field={fieldKey}>
      <Label className={`text-xs font-medium ${error ? "text-destructive" : ""}`}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
