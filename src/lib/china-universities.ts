// China MBBS / Clinical Medicine universities — 2026 fee data.
// Source: NextStep International partner fee sheet (July 2026).
// All tuition/accommodation figures are ¥ (RMB) per year unless noted.

export type ChinaUniversity = {
  name: string;
  /** Package price, e.g. "¥32,400" — or a label like "Negotiable" */
  packageYuan: string;
  /** USD equivalent, e.g. "$4,500" — empty when not applicable */
  packageUsd: string;
  program: "Clinical Medicine" | "MBBS";
  /** HSK Chinese-language requirement */
  hsk: "Not required" | "Required" | "HSK-3 required";
  tuitionYear1: string;
  tuitionYear2to5: string;
  accommodation: string;
};

export const chinaUniversities: ChinaUniversity[] = [
  { name: "Chengde Medical University", packageYuan: "¥32,400", packageUsd: "$4,500", program: "Clinical Medicine", hsk: "Not required", tuitionYear1: "¥18,000", tuitionYear2to5: "¥18,000", accommodation: "¥4,500" },
  { name: "Shandong Second Medical University", packageYuan: "¥43,400", packageUsd: "$6,050", program: "Clinical Medicine", hsk: "Not required", tuitionYear1: "¥24,000", tuitionYear2to5: "¥24,000", accommodation: "¥5,000" },
  { name: "Yangtze University", packageYuan: "¥28,800", packageUsd: "$4,000", program: "Clinical Medicine", hsk: "Required", tuitionYear1: "¥12,800", tuitionYear2to5: "¥20,000", accommodation: "¥2,400" },
  { name: "Yichun University", packageYuan: "¥28,800", packageUsd: "$4,000", program: "Clinical Medicine", hsk: "Required", tuitionYear1: "¥12,000", tuitionYear2to5: "¥20,000", accommodation: "¥4,500" },
  { name: "Jiu Jiang University", packageYuan: "¥28,800", packageUsd: "$4,000", program: "Clinical Medicine", hsk: "Not required", tuitionYear1: "¥11,000", tuitionYear2to5: "¥20,000", accommodation: "¥5,000" },
  { name: "Jilin Medical University", packageYuan: "¥28,800", packageUsd: "$4,000", program: "Clinical Medicine", hsk: "Required", tuitionYear1: "¥17,000", tuitionYear2to5: "¥17,000", accommodation: "¥2,000" },
  { name: "Jingangshan University", packageYuan: "¥28,800", packageUsd: "$4,000", program: "Clinical Medicine", hsk: "Required", tuitionYear1: "¥10,000", tuitionYear2to5: "¥19,000", accommodation: "¥4,000" },
  { name: "Binzhou Medical University", packageYuan: "¥36,000", packageUsd: "$5,000", program: "Clinical Medicine", hsk: "Required", tuitionYear1: "¥12,000", tuitionYear2to5: "¥22,000", accommodation: "¥6,000" },
  { name: "Gannan Medical University", packageYuan: "¥32,400", packageUsd: "$4,500", program: "Clinical Medicine", hsk: "Required", tuitionYear1: "¥20,000", tuitionYear2to5: "¥26,000", accommodation: "¥4,000" },
  { name: "Henan Medical University", packageYuan: "¥32,400", packageUsd: "$4,500", program: "Clinical Medicine", hsk: "Not required", tuitionYear1: "¥10,000", tuitionYear2to5: "¥20,000", accommodation: "¥4,000" },
  { name: "Shenyang Medical College", packageYuan: "¥36,000", packageUsd: "$5,000", program: "Clinical Medicine", hsk: "Not required", tuitionYear1: "¥15,000", tuitionYear2to5: "¥25,000", accommodation: "¥5,000" },
  { name: "Hubei University of Medicine", packageYuan: "¥32,400", packageUsd: "$4,500", program: "Clinical Medicine", hsk: "Required", tuitionYear1: "¥10,000", tuitionYear2to5: "¥15,000", accommodation: "¥5,000" },
  { name: "Nanchang University", packageYuan: "¥36,000", packageUsd: "$5,000", program: "Clinical Medicine", hsk: "Required", tuitionYear1: "¥13,000", tuitionYear2to5: "¥20,000", accommodation: "¥4,600" },
  { name: "Zhejiang Chinese Medical University", packageYuan: "¥43,400", packageUsd: "$6,050", program: "Clinical Medicine", hsk: "Not required", tuitionYear1: "¥22,000", tuitionYear2to5: "¥22,000", accommodation: "¥4,400" },
  { name: "Hainan Medical University", packageYuan: "¥39,600", packageUsd: "$5,500", program: "Clinical Medicine", hsk: "HSK-3 required", tuitionYear1: "¥20,500", tuitionYear2to5: "¥20,500", accommodation: "¥5,000–6,000" },
  { name: "Shandong First Medical University", packageYuan: "¥36,000", packageUsd: "$5,000", program: "Clinical Medicine", hsk: "Not required", tuitionYear1: "¥13,000", tuitionYear2to5: "¥25,000", accommodation: "¥3,400" },
  { name: "Shihezi University", packageYuan: "¥39,600", packageUsd: "$5,500", program: "MBBS", hsk: "Not required", tuitionYear1: "¥30,000", tuitionYear2to5: "¥30,000", accommodation: "¥5,000" },
  { name: "North Sichuan Medical University", packageYuan: "App fee 600", packageUsd: "Service 1,000", program: "MBBS", hsk: "Not required", tuitionYear1: "¥32,000", tuitionYear2to5: "¥32,000", accommodation: "¥6,000" },
  { name: "Jinzhou Medical University", packageYuan: "App fee 600", packageUsd: "Service 1,000", program: "MBBS", hsk: "Not required", tuitionYear1: "¥38,000", tuitionYear2to5: "¥38,000", accommodation: "¥6,500" },
  { name: "Xiamen University", packageYuan: "App fee 600", packageUsd: "Service 1,000", program: "MBBS", hsk: "Not required", tuitionYear1: "¥38,000", tuitionYear2to5: "¥38,000", accommodation: "¥1,600" },
  { name: "Kunming Medical University", packageYuan: "Negotiable", packageUsd: "", program: "MBBS", hsk: "Not required", tuitionYear1: "¥35,000", tuitionYear2to5: "¥35,000", accommodation: "¥5,000" },
  { name: "Southern Medical University", packageYuan: "Negotiable", packageUsd: "", program: "MBBS", hsk: "Not required", tuitionYear1: "¥45,000", tuitionYear2to5: "¥45,000", accommodation: "¥6,000–10,000" },
  { name: "Ningbo University", packageYuan: "Negotiable", packageUsd: "", program: "MBBS", hsk: "Not required", tuitionYear1: "¥38,000", tuitionYear2to5: "¥38,000", accommodation: "¥6,000" },
  { name: "China Three Gorges University", packageYuan: "Negotiable", packageUsd: "", program: "MBBS", hsk: "Not required", tuitionYear1: "¥26,000", tuitionYear2to5: "¥26,000", accommodation: "¥6,000" },
  { name: "Qingdao University", packageYuan: "Negotiable", packageUsd: "", program: "MBBS", hsk: "Not required", tuitionYear1: "¥30,000", tuitionYear2to5: "¥30,000", accommodation: "¥10,000–11,000" },
  { name: "Guangzhou Medical University", packageYuan: "Negotiable", packageUsd: "", program: "MBBS", hsk: "Not required", tuitionYear1: "¥30,000", tuitionYear2to5: "¥30,000", accommodation: "¥6,000" },
  { name: "Wenzhou Medical University", packageYuan: "Negotiable", packageUsd: "", program: "MBBS", hsk: "Not required", tuitionYear1: "¥30,000", tuitionYear2to5: "¥30,000", accommodation: "¥7,000" },
  { name: "Xuzhou Medical University", packageYuan: "Negotiable", packageUsd: "", program: "MBBS", hsk: "Not required", tuitionYear1: "¥30,000", tuitionYear2to5: "¥30,000", accommodation: "¥4,500" },
  { name: "Central South University", packageYuan: "Negotiable", packageUsd: "", program: "MBBS", hsk: "Not required", tuitionYear1: "Contact us", tuitionYear2to5: "Contact us", accommodation: "Contact us" },
];
