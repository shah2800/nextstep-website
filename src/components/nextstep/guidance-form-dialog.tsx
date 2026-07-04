"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { motion } from "framer-motion";

export function GuidanceFormDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    graduationYear: "",
    preferredCourse: "",
    budget: "",
    englishTest: "",
    preferredCountries: "",
    message: "",
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setDone(true);
      toast.success("Guidance request received!", {
        description: "A NextStep counselor will contact you within 24 hours.",
      });
    } catch (e) {
      toast.error("Could not submit", {
        description: e instanceof Error ? e.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setDone(false);
    setForm({
      name: "",
      email: "",
      phone: "",
      qualification: "",
      graduationYear: "",
      preferredCourse: "",
      budget: "",
      englishTest: "",
      preferredCountries: "",
      message: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && reset()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto custom-scroll sm:max-w-2xl">
        {done ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </motion.div>
            <h3 className="mt-4 text-2xl font-bold text-foreground">
              Request received!
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Thank you, {form.name || "student"}. A NextStep counselor will review
              your profile and reach out within 24 hours to schedule your free
              guidance session.
            </p>
            <Button onClick={reset} className="mt-6 bg-brand text-white hover:bg-brand/90">
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Get My Options Reviewed
              </DialogTitle>
              <DialogDescription>
                Share your profile and a NextStep counselor will identify realistic
                destinations and next steps — free of charge.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2 sm:grid-cols-2">
              <Field label="Full Name" required>
                <Input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Ahmed Khan"
                />
              </Field>
              <Field label="Email" required>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Phone / WhatsApp" required>
                <Input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+92 3XX XXXXXXX"
                />
              </Field>
              <Field label="Latest Qualification" required>
                <Select
                  value={form.qualification}
                  onValueChange={(v) => set("qualification", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matric">Matric / O-Level</SelectItem>
                    <SelectItem value="intermediate">
                      Intermediate / A-Level
                    </SelectItem>
                    <SelectItem value="bachelors">
                      Bachelor&apos;s (2-4 years)
                    </SelectItem>
                    <SelectItem value="masters">Master&apos;s</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Graduation Year" required>
                <Select
                  value={form.graduationYear}
                  onValueChange={(v) => set("graduationYear", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 8 }, (_, i) => 2025 - i).map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                    <SelectItem value="earlier">Before 2018</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Preferred Course" required>
                <Input
                  value={form.preferredCourse}
                  onChange={(e) => set("preferredCourse", e.target.value)}
                  placeholder="e.g. MSc Computer Science"
                />
              </Field>
              <Field label="Budget (per year)" required>
                <Select
                  value={form.budget}
                  onValueChange={(v) => set("budget", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-5k">Under $5,000</SelectItem>
                    <SelectItem value="5k-10k">$5,000 – $10,000</SelectItem>
                    <SelectItem value="10k-20k">$10,000 – $20,000</SelectItem>
                    <SelectItem value="20k-35k">$20,000 – $35,000</SelectItem>
                    <SelectItem value="35k-plus">$35,000+</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="English Test Status" required>
                <Select
                  value={form.englishTest}
                  onValueChange={(v) => set("englishTest", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-taken">Not taken yet</SelectItem>
                    <SelectItem value="preparing">Currently preparing</SelectItem>
                    <SelectItem value="ielts">IELTS done</SelectItem>
                    <SelectItem value="pte">PTE done</SelectItem>
                    <SelectItem value="duolingo">Duolingo done</SelectItem>
                    <SelectItem value="waiver">Applying for waiver</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Preferred Destinations (optional)">
                  <Input
                    value={form.preferredCountries}
                    onChange={(e) => set("preferredCountries", e.target.value)}
                    placeholder="e.g. UK, Canada, Germany"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Anything else we should know? (optional)">
                  <Textarea
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="Share your career goals, constraints, or questions…"
                    rows={3}
                  />
                </Field>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={submit}
                disabled={submitting}
                className="bg-brand text-white hover:bg-brand/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
