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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { CheckCircle2, Loader2, CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  "Career Counseling",
  "University Admissions",
  "Visa Processing",
  "IELTS / PTE Preparation",
  "Scholarship Guidance",
  "Pre-Departure Briefing",
];

const timeSlots = [
  "10:00 AM",
  "11:30 AM",
  "01:00 PM",
  "03:00 PM",
  "04:30 PM",
  "06:00 PM",
];

export function BookSessionDialog({
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
    preferredDate: "",
    preferredTime: "",
    mode: "online",
    service: "",
    message: "",
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/book-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Booking failed");
      setDone(true);
      toast.success("Session booked!", {
        description: "We'll confirm your slot via WhatsApp shortly.",
      });
    } catch (e) {
      toast.error("Could not book", {
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
      preferredDate: "",
      preferredTime: "",
      mode: "online",
      service: "",
      message: "",
    });
    onOpenChange(false);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && reset()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto custom-scroll sm:max-w-xl">
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
              Session requested!
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Thank you, {form.name || "student"}. We&apos;ve received your
              request for{" "}
              <span className="font-semibold text-foreground">
                {form.service || "a counseling session"}
              </span>{" "}
              on{" "}
              <span className="font-semibold text-foreground">
                {form.preferredDate}
              </span>{" "}
              at{" "}
              <span className="font-semibold text-foreground">
                {form.preferredTime}
              </span>
              . Our team will confirm via WhatsApp.
            </p>
            <Button onClick={reset} className="mt-6 bg-brand text-white hover:bg-brand/90">
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <CalendarCheck className="h-6 w-6 text-brand" />
                Book a Counseling Session
              </DialogTitle>
              <DialogDescription>
                Pick a slot that suits you. Sessions run 30-45 minutes, online
                or in-person at our Lahore office.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" required>
                  <Input
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Ahmed Khan"
                  />
                </Field>
                <Field label="Phone / WhatsApp" required>
                  <Input
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+92 3XX XXXXXXX"
                  />
                </Field>
              </div>
              <Field label="Email" required>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Service Required" required>
                <Select
                  value={form.service}
                  onValueChange={(v) => set("service", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Preferred Date" required>
                  <Input
                    type="date"
                    min={today}
                    value={form.preferredDate}
                    onChange={(e) => set("preferredDate", e.target.value)}
                  />
                </Field>
                <Field label="Preferred Time" required>
                  <Select
                    value={form.preferredTime}
                    onValueChange={(v) => set("preferredTime", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field label="Session Mode" required>
                <RadioGroup
                  value={form.mode}
                  onValueChange={(v) => set("mode", v)}
                  className="flex gap-4"
                >
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium has-[:checked]:border-brand has-[:checked]:bg-brand/5 has-[:checked]:text-brand">
                    <RadioGroupItem value="online" />
                    Online (Zoom)
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium has-[:checked]:border-brand has-[:checked]:bg-brand/5 has-[:checked]:text-brand">
                    <RadioGroupItem value="in-person" />
                    In-Person (Lahore)
                  </label>
                </RadioGroup>
              </Field>

              <Field label="Notes (optional)">
                <Textarea
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="Any specific questions or topics you'd like to discuss…"
                  rows={3}
                />
              </Field>
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
                    Booking…
                  </>
                ) : (
                  "Confirm Booking"
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
