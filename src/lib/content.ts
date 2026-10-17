// Site content layer — default values + DB-backed overrides.
// The admin dashboard edits SiteContent rows; public components read via
// /api/content which merges DB overrides over these defaults.

export const defaultContent = {
  // Hero
  heroBadge: "Trusted by 12,000+ Pakistani students",
  heroTitle: "Study destinations matched to your goals and budget",
  heroSubtitle:
    "Compare country guides covering universities, admissions, tuition, living costs, scholarships, and visa considerations for students applying from Pakistan — all in one place.",
  heroPrimaryCta: "Get My Options Reviewed",
  heroSecondaryCta: "Book a Session",
  heroTrust1: "Direct University Partnerships · 850+ Institutions",
  heroTrust2: "15+ Years of Trusted Guidance",
  heroImage: "/images/hero-students.png",

  // Counseling CTA
  counselingBadge: "Free initial guidance",
  counselingTitle: "Unsure which destination fits your profile?",
  counselingSubtitle:
    "Share your qualification, graduation year, preferred course, budget, and English test status. A NextStep counselor will help you identify realistic countries and next steps — at no cost.",
  counselingCta1: "Request Destination Guidance",
  counselingCta2: "Book a Session",
  counselingImage: "/images/counseling.png",

  // AI Assistant section
  assistantBadge: "AI-Powered",
  assistantTitle: "Meet your NextStep AI Assistant",
  assistantSubtitle:
    "Get instant, personalized destination recommendations based on your academic background, budget, and goals — available 24/7 in your pocket. Ask about courses, costs, scholarships, and visa steps.",
  assistantCta: "Chat with NextStep Assistant",

  // Newsletter section
  newsletterTitle: "Get study-abroad updates in your inbox",
  newsletterSubtitle:
    "New scholarships, intake deadlines, and visa changes — once a week, no spam.",

  // Footer / contact info
  footerAddress:
    "Office #31/2, Upper Ground, Mall of Lahore, 172 Tufail Road, Cantt Lahore",
  footerPhone: "+995 511 11 36 70",
  footerEmail: "info@nextstepinternationals.com",
  footerWhatsapp: "995511113670",
  footerBrand: "NextStep International",

  // Stats
  stats: [
    { label: "Students Placed", value: "12,000+", icon: "Users" },
    { label: "Partner Universities", value: "850+", icon: "Building2" },
    { label: "Study Destinations", value: "16", icon: "Globe2" },
    { label: "Visa Success Rate", value: "96%", icon: "BadgeCheck" },
  ],

  // Services
  services: [
    {
      icon: "Compass",
      title: "Career Counseling",
      description:
        "Personalized guidance to match your academic background, budget, and career goals with the right destination and course.",
    },
    {
      icon: "FileCheck",
      title: "University Admissions",
      description:
        "End-to-end application support — from shortlisting universities to statement of purpose review and offer acceptance.",
    },
    {
      icon: "Plane",
      title: "Visa Processing",
      description:
        "Expert handling of student visa applications with a 96% success rate, including documentation, financials, and interview prep.",
    },
    {
      icon: "GraduationCap",
      title: "IELTS / PTE Preparation",
      description:
        "Certified trainers deliver targeted IELTS and PTE prep to help you hit the band score your dream university demands.",
    },
    {
      icon: "Wallet",
      title: "Scholarship Guidance",
      description:
        "Maximize your funding with scholarship matching, essay coaching, and timely application tracking for 200+ awards.",
    },
    {
      icon: "Home",
      title: "Pre-Departure & Accommodation",
      description:
        "Airport pickup, accommodation arrangement, bank account setup, and SIM activation so you settle in stress-free.",
    },
  ],

  // Compare factors
  compareFactors: [
    {
      icon: "GraduationCap",
      title: "Academic Fit",
      description:
        "Entry requirements, relevant courses, intakes, and progression options matched to your qualification.",
      points: [
        "Entry requirements & academic equivalency",
        "Course curriculum & specialization options",
        "Intake availability & deadlines",
        "Progression and pathway programs",
      ],
    },
    {
      icon: "Wallet",
      title: "Realistic Budget",
      description:
        "Tuition, living costs, available scholarships, and the funds needed for a visa application.",
      points: [
        "Tuition fee range per program",
        "Monthly living cost estimates",
        "Scholarship & funding options",
        "Visa financial evidence requirements",
      ],
    },
    {
      icon: "FileCheck",
      title: "Visa Preparation",
      description:
        "English test expectations, financial evidence, document timelines, and country-specific requirements.",
      points: [
        "English test score requirements",
        "Financial evidence & bank statements",
        "Document attestation & timelines",
        "Interview preparation & country rules",
      ],
    },
  ],
};

export type SiteContentType = typeof defaultContent;

// Keys that are stored as JSON arrays/objects
const JSON_KEYS = ["stats", "services", "compareFactors"];

/**
 * Load content from DB, merging over defaults. Falls back to defaults
 * if a key is missing or JSON parse fails.
 */
export async function loadContent(): Promise<SiteContentType> {
  try {
    const { db } = await import("@/lib/db");
    const rows = await db.siteContent.findMany();
    const overrides: Record<string, unknown> = {};
    for (const row of rows) {
      if (JSON_KEYS.includes(row.key)) {
        try {
          overrides[row.key] = JSON.parse(row.value);
        } catch {
          // ignore malformed
        }
      } else {
        overrides[row.key] = row.value;
      }
    }
    return { ...defaultContent, ...overrides } as SiteContentType;
  } catch {
    return defaultContent;
  }
}
