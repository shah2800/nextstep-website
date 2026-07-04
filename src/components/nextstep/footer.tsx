"use client";

import Link from "next/link";
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Award,
} from "lucide-react";

const popular = [
  "United Kingdom",
  "Australia",
  "United States",
  "Canada",
  "Germany",
  "Ireland",
];

const explore = [
  "About Us",
  "Services",
  "Study Destinations",
  "Our Branches",
  "Projects",
  "NextStep Alumni",
];

const resources = [
  "Course Finder",
  "AI Assistant",
  "IELTS / PTE",
  "Events",
  "Blogs",
  "Complaint / Feedback",
];

export function Footer({
  onGetGuidance,
  onBookSession,
}: {
  onGetGuidance: () => void;
  onBookSession: () => void;
}) {
  return (
    <footer
      id="contact"
      className="mt-auto scroll-mt-20 border-t border-border bg-brand text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="#" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-lg font-extrabold tracking-tight">
                  NextStep
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/70">
                  International
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
              A leading consultancy firm offering quality education services
              across Pakistan for students who aspire to study abroad. We turn
              aspirations into admissions.
            </p>

            {/* Accreditation */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/85">
              <Award className="h-4 w-4 text-gold" />
              Authorized Representatives · Direct University Tie-ups
            </div>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-2">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Youtube, label: "YouTube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/80 transition hover:bg-gold hover:text-gold-foreground"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <FooterCol title="Explore" links={explore} />
            <FooterCol title="Resources" links={resources} />
            <FooterCol
              title="Popular Destinations"
              links={popular}
            />
          </div>

          {/* Contact + CTA */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wide text-white/90">
              Get Started
            </h4>
            <div className="mt-3 flex flex-col gap-2">
              <button
                onClick={onGetGuidance}
                className="rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-gold-foreground transition hover:bg-gold/90"
              >
                Course Finder
              </button>
              <button
                onClick={onBookSession}
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Book a Session
              </button>
            </div>

            <h4 className="mt-6 text-sm font-bold uppercase tracking-wide text-white/90">
              Contact Info
            </h4>
            <ul className="mt-3 space-y-2.5 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>
                  Office #31/2, Upper Ground, Mall of Lahore, 172 Tufail Road,
                  Cantt Lahore
                </span>
              </li>
              <li>
                <a
                  href="tel:+923142638901"
                  className="flex items-center gap-2 hover:text-gold"
                >
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  +92 314 2638901
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@nextstepinternationals.com"
                  className="flex items-center gap-2 hover:text-gold"
                >
                  <Mail className="h-4 w-4 shrink-0 text-gold" />
                  info@nextstepinternationals.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/70 sm:flex-row">
          <p>
            Copyright © {new Date().getFullYear()} NextStep International.
            All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gold">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gold">
              Terms of Service
            </a>
            <a href="?admin=true" className="hover:text-gold">
              Admin
            </a>
          </div>
        </div>
      </div>

      {/* WhatsApp floating (decorative, part of footer) */}
      <a
        href="https://wa.me/923142638901"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 left-5 z-40 hidden items-center gap-2 rounded-full bg-green-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-green-600 sm:flex"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.821 11.821 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.515 5.256l-.999 3.648 3.973-1.003zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
        Chat on WhatsApp
      </a>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-bold uppercase tracking-wide text-white/90">
        {title}
      </h4>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="text-sm text-white/75 transition hover:text-gold"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
