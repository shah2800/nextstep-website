"use client";

import { motion } from "framer-motion";
import { useSiteContent } from "./site-content-provider";
import { Bot, Sparkles, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
export function AssistantSection({
  onOpenAssistant,
}: {
  onOpenAssistant?: () => void;
}) {
  const c = useSiteContent();

  const handleOpen = () => {
    if (onOpenAssistant) onOpenAssistant();
    window.dispatchEvent(new CustomEvent("open-nextstep-assistant"));
  };
  return (
    <section
      id="assistant"
      className="relative scroll-mt-20 overflow-hidden [contain:paint] bg-brand py-16 text-white sm:py-20"
    >
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            {c.assistantBadge}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {c.assistantTitle}
          </h2>
          <p className="mt-4 max-w-lg text-base text-white/85">
            {c.assistantSubtitle}
          </p>

          <ul className="mt-6 space-y-3">
            {[
              {
                icon: Zap,
                title: "Instant answers",
                desc: "No waiting for office hours — get guidance in seconds.",
              },
              {
                icon: Sparkles,
                title: "Personalized to your profile",
                desc: "Considers qualification, budget, and English test status.",
              },
              {
                icon: Lock,
                title: "Private & secure",
                desc: "Conversations are stored only to maintain context.",
              },
            ].map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <f.icon className="h-4.5 w-4.5 text-gold" />
                </span>
                <div>
                  <div className="text-sm font-semibold">{f.title}</div>
                  <div className="text-sm text-white/75">{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>

          <Button
            onClick={handleOpen}
            size="lg"
            className="mt-8 bg-gold text-gold-foreground hover:bg-gold/90 shadow-lg"
          >
            <Bot className="mr-2 h-5 w-5" />
            {c.assistantCta}
          </Button>
        </motion.div>

        {/* Mock chat preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="rounded-2xl border border-white/15 bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white">
                <Bot className="h-4 w-4" />
              </span>
              <div>
                <div className="text-sm font-bold text-foreground">
                  NextStep Assistant
                </div>
                <div className="text-[11px] text-muted-foreground">
                  AI counselor · online
                </div>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-brand px-3 py-2 text-sm text-white">
                  I have FSc Pre-Engg, IELTS 6.5, budget $15k/yr. Best options?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-secondary px-3 py-2 text-sm text-foreground">
                  Based on your profile, consider:{" "}
                  <span className="font-semibold">
                    🇩🇪 Germany (tuition-free public unis)
                  </span>
                  ,{" "}
                  <span className="font-semibold">
                    🇭🇺 Hungary (Stipendium Hungaricum)
                  </span>
                  , and{" "}
                  <span className="font-semibold">
                    🇲🇾 Malaysia (affordable branch campuses)
                  </span>
                  . Want scholarship details for any?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-brand px-3 py-2 text-sm text-white">
                  Tell me about Hungary scholarship
                </div>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand/60 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand/60 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand/60" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
