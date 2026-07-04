import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
