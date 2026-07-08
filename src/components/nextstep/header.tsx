"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, GraduationCap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Destinations", href: "#destinations" },
  { label: "AI Tools", href: "#ai-tools" },
  { label: "Services", href: "#services" },
  { label: "Assistant", href: "#assistant" },
  { label: "Track", href: "/?track=true" },
  { label: "Contact", href: "#contact" },
];

export function Header({ onBookSession }: { onBookSession: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "glass sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "shadow-sm" : ""
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="#" className="flex items-center gap-2.5 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-md transition-transform group-hover:scale-105">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight text-brand">
              NextStep
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              International
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-brand"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden items-center gap-2 md:flex">
          <a
            href="https://wa.me/923142638901?text=Hello%20NextStep!%20I%20have%20a%20question%20about%20studying%20abroad."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-green-600"
          >
            <MessageCircle className="h-4 w-4" />
            +92 314 2638901
          </a>
          <a href="/?apply=true">
            <Button
              className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-sm"
            >
              Apply Now
            </Button>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-brand md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-brand"
              >
                {l.label}
              </a>
            ))}
            <a
              href="https://wa.me/923142638901?text=Hello%20NextStep!%20I%20have%20a%20question%20about%20studying%20abroad."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-green-600"
            >
              <MessageCircle className="h-4 w-4" /> +92 314 2638901
            </a>
            <a href="/?apply=true" className="mt-2 block">
              <Button
                onClick={() => setOpen(false)}
                className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
              >
                Apply Now
              </Button>
            </a>
            <a href="/?track=true" className="mt-2 block">
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="w-full"
              >
                Track Application
              </Button>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
