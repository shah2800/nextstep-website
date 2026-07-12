import type { Metadata } from "next";
import { ChinaUniversitiesPage } from "@/components/nextstep/china-universities-page";

export const metadata: Metadata = {
  title: "MBBS in China 2026 — Universities, Fees & Packages | NextStep International",
  description:
    "Compare 29 Chinese medical universities for MBBS / Clinical Medicine 2026: packages, 1st-year and 2nd–5th-year tuition, hostel costs, and HSK requirements for Pakistani students.",
};

export default function Page() {
  return <ChinaUniversitiesPage />;
}
