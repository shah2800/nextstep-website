import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { loadContent } from "@/lib/content";
import { SiteContentProvider } from "@/components/nextstep/site-content-provider";
import { Analytics } from "@vercel/analytics/react";

// Font optimization: preload + display swap so text renders instantly
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // mono font is rarely used; don't block first paint
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nextstepinternationals.com"),
  title: "NextStep International | Study Abroad for Pakistani Students",
  description:
    "Compare study destinations, universities, admissions, costs, scholarships, and visa guidance for Pakistani students. Get personalized guidance from NextStep counselors.",
  keywords: [
    "study abroad",
    "Pakistani students",
    "higher education consultants",
    "UK universities",
    "Australia study",
    "Canada study visa",
    "USA universities",
    "IELTS PTE",
    "scholarships",
    "NextStep Pakistan",
  ],
  authors: [{ name: "NextStep International" }],
  // Favicon comes from src/app/icon.png + apple-icon.png (Next.js file convention)
  openGraph: {
    title: "NextStep International | Study Abroad",
    description:
      "Compare study destinations, universities, admissions, costs, scholarships, and visa guidance for Pakistani students.",
    siteName: "NextStep International",
    type: "website",
    url: "https://www.nextstepinternationals.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "NextStep International — Study Abroad for Pakistani Students" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextStep International | Study Abroad",
    description:
      "Compare study destinations, universities, admissions, costs, scholarships, and visa guidance for Pakistani students.",
    images: ["/og-image.png"],
  },
  // Tell the browser to pre-resolve DNS for the WhatsApp/external domains
  // so links open with zero delay
  other: {
    "dns-prefetch": ["https://wa.me", "https://fonts.googleapis.com"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Smooth scrolling + theme color for mobile browser chrome
  themeColor: "#0a1f44",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await loadContent();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Brand entity for Google: Organization (logo in search results) + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "EducationalOrganization",
                  "@id": "https://www.nextstepinternationals.com/#organization",
                  name: "NextStep International",
                  alternateName: "NextStep International Study Abroad Consultants",
                  url: "https://www.nextstepinternationals.com",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://www.nextstepinternationals.com/logo-white-tile.png",
                    width: 512,
                    height: 512,
                  },
                  image: "https://www.nextstepinternationals.com/og-image.png",
                  description:
                    "NextStep International is a study-abroad consultancy in Lahore, Pakistan helping students with admissions, scholarships, and student visas for MBBS, business, IT and engineering programs worldwide.",
                  slogan: "We turn aspirations into admissions.",
                  areaServed: "PK",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Lahore",
                    addressCountry: "PK",
                  },
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+92-314-2638901",
                    contactType: "customer service",
                    availableLanguage: ["en", "ur"],
                  },
                  sameAs: [
                    "https://www.instagram.com/nextstepintl_official/",
                    "https://www.facebook.com/profile.php?id=61589102386856",
                    "https://www.youtube.com/@nextstepintl_official",
                    "https://www.pinterest.com/nextstepintl_official/",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.nextstepinternationals.com/#website",
                  url: "https://www.nextstepinternationals.com",
                  name: "NextStep International",
                  publisher: { "@id": "https://www.nextstepinternationals.com/#organization" },
                  inLanguage: "en",
                },
              ],
            }),
          }}
        />
        {/* Resource hints — tell browser to start fetching critical assets NOW */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="preload" as="image" href="/images/hero-students.png" fetchPriority="high" />
        {/* Inline critical background color so there's no white flash before CSS loads */}
        <style dangerouslySetInnerHTML={{ __html: "body{background:#f7f9fc;margin:0}" }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        style={{ background: "#f7f9fc" }}
      >
        <SiteContentProvider content={content}>
          {children}
          <Toaster />
          <Sonner />
          <Analytics />
        </SiteContentProvider>
      </body>
    </html>
  );
}
