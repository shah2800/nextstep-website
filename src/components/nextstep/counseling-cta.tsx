"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CounselingCta({
  onGetGuidance,
  onBookSession,
}: {
  onGetGuidance: () => void;
  onBookSession: () => void;
}) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative h-64 lg:h-full"
          >
            <Image
              src="/images/counseling.png"
              alt="NextStep counselor advising a student"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand/40 to-transparent lg:bg-gradient-to-r" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-7 sm:p-10"
          >
            <span className="inline-block rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-foreground">
              Free initial guidance
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Unsure which destination fits your profile?
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Share your qualification, graduation year, preferred course,
              budget, and English test status. A NextStep counselor will help you
              identify realistic countries and next steps — at no cost.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-foreground">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <MapPin className="h-4 w-4" />
                </span>
                Office #31/2, Upper Ground, Mall of Lahore, 172 Tufail Road,
                Cantt Lahore
              </div>
              <a
                href="tel:+923142638901"
                className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-brand"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Phone className="h-4 w-4" />
                </span>
                +92 314 2638901
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                onClick={onGetGuidance}
                size="lg"
                className="bg-brand text-white hover:bg-brand/90"
              >
                Request Destination Guidance
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={onBookSession}
                size="lg"
                variant="outline"
              >
                Book a Session
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
