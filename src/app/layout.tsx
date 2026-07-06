import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

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
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "NextStep International | Study Abroad",
    description:
      "Compare study destinations, universities, admissions, costs, scholarships, and visa guidance for Pakistani students.",
    siteName: "NextStep International",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextStep International | Study Abroad",
    description:
      "Compare study destinations, universities, admissions, costs, scholarships, and visa guidance for Pakistani students.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to font origin for faster font fetch */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}
