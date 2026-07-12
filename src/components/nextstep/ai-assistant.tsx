"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Sparkles, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Which country is best for an MS in CS under $20k/year?",
  "I have a BSc in Mechanical Engg and IELTS 6.5 — options?",
  "Compare UK vs Canada for post-study work rights",
  "Cheapest European country for an MBA taught in English?",
];

const WHATSAPP_URL =
  "https://wa.me/923142638901?text=Assalam%20o%20Alaikum%2C%20I%20want%20to%20know%20about%20study%20abroad%20programs";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate a session id once
  useEffect(() => {
    const existing = sessionStorage.getItem("nextstep-chat-session");
    if (existing) {
      setSessionId(existing);
    } else {
      const id = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem("nextstep-chat-session", id);
      setSessionId(id);
    }
  }, []);

  // Allow external "open assistant" triggers (e.g. from the marketing section)
  useEffect(() => {
    const handler = () => {
      setMenuOpen(false);
      setOpen(true);
    };
    window.addEventListener("open-nextstep-assistant", handler);
    return () => window.removeEventListener("open-nextstep-assistant", handler);
  }, []);

  // Load history when opening for the first time
  useEffect(() => {
    if (open && sessionId && messages.length === 0) {
      (async () => {
        try {
          const res = await fetch(
            `/api/ai-assistant?sessionId=${encodeURIComponent(sessionId)}`
          );
          const data = await res.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(
              data.messages
                .filter((m: { role: string; content: string }) => m.role !== "system")
                .map((m: { role: string; content: string }) => ({
                  role: (m.role === "assistant" ? "assistant" : "user") as
                    | "user"
                    | "assistant",
                  content: m.content,
                }))
            );
          } else {
            setMessages([
              {
                role: "assistant",
                content:
                  "Assalam-o-Alaikum! 👋 I'm the NextStep Assistant. I can help you shortlist study destinations, courses, and plan your application from Pakistan. What's your highest qualification and preferred course?",
              },
            ]);
          }
        } catch {
          setMessages([
            {
              role: "assistant",
              content:
                "Hi! I'm the NextStep Assistant. Tell me your qualification, preferred course, and budget — I'll suggest suitable destinations.",
            },
          ]);
        }
      })();
    }
  }, [open, sessionId, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading || !sessionId) return;
    setInput("");
    const next = [...messages, { role: "user", content } as Msg];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setMessages((p) => [...p, { role: "assistant", content: data.reply }]);
    } catch (e) {
      toast.error("Assistant unavailable", {
        description:
          e instanceof Error ? e.message : "Please try again in a moment.",
      });
      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again, or submit the guidance form and a counselor will reach out.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    sessionStorage.removeItem("nextstep-chat-session");
    const id = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem("nextstep-chat-session", id);
    setSessionId(id);
    setMessages([
      {
        role: "assistant",
        content:
          "Fresh start! 👋 Tell me your qualification, preferred course, and budget.",
      },
    ]);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 15 }}
        onClick={() => {
          if (open) {
            setOpen(false);
          } else {
            setMenuOpen((v) => !v);
          }
        }}
        className="fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-2xl transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
        style={{
          right: "max(1rem, env(safe-area-inset-right))",
          bottom: "max(1rem, env(safe-area-inset-bottom))",
        }}
        aria-label="Open chat options"
      >
        <AnimatePresence mode="wait">
          {open || menuOpen ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Bot className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && !menuOpen && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-gold" />
          </span>
        )}
      </motion.button>

      {/* Chooser: WhatsApp or AI Assistant (speed-dial above the button) */}
      <AnimatePresence>
        {menuOpen && !open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.9 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="fixed bottom-24 z-50 flex flex-col items-end gap-3 sm:bottom-28"
              style={{ right: "max(1rem, env(safe-area-inset-right))" }}
            >
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <span className="rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-lg border border-border">
                  Chat on WhatsApp
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-105">
                  <WhatsAppIcon className="h-6 w-6" />
                </span>
              </a>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setOpen(true);
                }}
                className="flex items-center gap-3"
              >
                <span className="rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-lg border border-border">
                  Ask AI Assistant
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-xl transition-transform hover:scale-105">
                  <Sparkles className="h-6 w-6 text-gold" />
                </span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 left-1/2 z-50 flex h-[75vh] max-h-[600px] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:left-auto sm:right-6 sm:translate-x-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-brand px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <Sparkles className="h-5 w-5 text-gold" />
                </span>
                <div>
                  <div className="text-sm font-bold leading-tight">
                    NextStep Assistant
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-white/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    Online · AI counselor
                  </div>
                </div>
              </div>
              <button
                onClick={resetChat}
                className="rounded-md p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Reset conversation"
                title="Reset conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="custom-scroll flex-1 space-y-3 overflow-y-auto bg-secondary/30 p-4"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-md bg-brand text-white"
                        : "rounded-bl-md bg-card text-foreground shadow-sm border border-border"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border bg-card px-3.5 py-3 shadow-sm">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand/60 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand/60 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand/60" />
                  </div>
                </div>
              )}

              {/* Suggestions when few messages */}
              {messages.length <= 1 && !loading && (
                <div className="space-y-2 pt-2">
                  <p className="px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Try asking
                  </p>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-left text-xs text-foreground transition hover:border-brand/40 hover:bg-brand/5"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border bg-card p-3">
              <div className="flex items-end gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Ask about destinations, costs, visas…"
                  rows={1}
                  className="max-h-24 min-h-[42px] resize-none text-sm"
                />
                <Button
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                  size="icon"
                  className="h-10 w-10 shrink-0 bg-brand text-white hover:bg-brand/90"
                  aria-label="Send"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
                AI guidance · always verify with a counselor before applying
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
