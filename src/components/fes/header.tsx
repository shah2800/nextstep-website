"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, GraduationCap, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Destinations", href: "#destinations" },
  { label: "Compare", href: "#compare" },
  { label: "Services", href: "#services" },
  { label: "Assistant", href: "#assistant" },
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
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-white/70 backdrop-blur-sm"
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
              FES
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Education Consultants
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
            href="tel:+923458454769"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-brand"
          >
            <Phone className="h-4 w-4" />
            +92 345 8454769
          </a>
          <Button
            onClick={onBookSession}
            className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-sm"
          >
            Book Session
          </Button>
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
              href="tel:+923458454769"
              className="flex items-center gap-1.5 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary"
            >
              <Phone className="h-4 w-4" /> +92 345 8454769
            </a>
            <Button
              onClick={() => {
                setOpen(false);
                onBookSession();
              }}
              className="mt-2 bg-gold text-gold-foreground hover:bg-gold/90"
            >
              Book Session
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
