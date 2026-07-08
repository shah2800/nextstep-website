// Cost of living data per destination (monthly, in USD)
// Breakdown by category for the Cost of Living Calculator

export type LifeStyle = "frugal" | "balanced" | "comfortable";

export type CostBreakdown = {
  rent: number;
  food: number;
  transport: number;
  utilities: number;
  health: number;
  leisure: number;
};

export type CityCost = {
  city: string;
  baseCost: number; // balanced monthly total in USD
  currency: string;
  currencySymbol: string;
  breakdown: CostBreakdown;
};

export const lifestyleMultiplier: Record<LifeStyle, number> = {
  frugal: 0.72,
  balanced: 1,
  comfortable: 1.45,
};

export const lifestyleLabels: Record<LifeStyle, string> = {
  frugal: "Frugal",
  balanced: "Balanced",
  comfortable: "Comfortable",
};

export const lifestyleDescriptions: Record<LifeStyle, string> = {
  frugal: "Shared housing, home-cooked meals, public transport",
  balanced: "Shared/private room, mix of eating out & cooking",
  comfortable: "Private apartment, frequent dining out, gym & leisure",
};

export const cityCosts: CityCost[] = [
  // United Kingdom
  { city: "London", baseCost: 1700, currency: "GBP", currencySymbol: "£", breakdown: { rent: 900, food: 350, transport: 180, utilities: 120, health: 50, leisure: 100 } },
  { city: "Manchester", baseCost: 1300, currency: "GBP", currencySymbol: "£", breakdown: { rent: 650, food: 300, transport: 120, utilities: 110, health: 40, leisure: 80 } },
  { city: "Birmingham", baseCost: 1200, currency: "GBP", currencySymbol: "£", breakdown: { rent: 600, food: 280, transport: 110, utilities: 105, health: 40, leisure: 65 } },
  { city: "Edinburgh", baseCost: 1250, currency: "GBP", currencySymbol: "£", breakdown: { rent: 620, food: 290, transport: 110, utilities: 108, health: 40, leisure: 82 } },
  // Australia
  { city: "Sydney", baseCost: 1900, currency: "AUD", currencySymbol: "A$", breakdown: { rent: 1000, food: 380, transport: 200, utilities: 130, health: 60, leisure: 130 } },
  { city: "Melbourne", baseCost: 1750, currency: "AUD", currencySymbol: "A$", breakdown: { rent: 920, food: 360, transport: 190, utilities: 125, health: 55, leisure: 100 } },
  { city: "Brisbane", baseCost: 1550, currency: "AUD", currencySymbol: "A$", breakdown: { rent: 800, food: 330, transport: 160, utilities: 120, health: 55, leisure: 85 } },
  // United States
  { city: "New York", baseCost: 2300, currency: "USD", currencySymbol: "$", breakdown: { rent: 1300, food: 450, transport: 130, utilities: 150, health: 80, leisure: 190 } },
  { city: "Boston", baseCost: 2100, currency: "USD", currencySymbol: "$", breakdown: { rent: 1200, food: 420, transport: 120, utilities: 145, health: 75, leisure: 140 } },
  { city: "Chicago", baseCost: 1700, currency: "USD", currencySymbol: "$", breakdown: { rent: 950, food: 380, transport: 110, utilities: 130, health: 70, leisure: 60 } },
  { city: "Texas", baseCost: 1500, currency: "USD", currencySymbol: "$", breakdown: { rent: 800, food: 350, transport: 120, utilities: 125, health: 65, leisure: 40 } },
  // Canada
  { city: "Toronto", baseCost: 1650, currency: "CAD", currencySymbol: "C$", breakdown: { rent: 900, food: 350, transport: 150, utilities: 120, health: 50, leisure: 80 } },
  { city: "Vancouver", baseCost: 1700, currency: "CAD", currencySymbol: "C$", breakdown: { rent: 950, food: 345, transport: 145, utilities: 120, health: 50, leisure: 90 } },
  { city: "Montreal", baseCost: 1300, currency: "CAD", currencySymbol: "C$", breakdown: { rent: 650, food: 300, transport: 110, utilities: 110, health: 45, leisure: 85 } },
  // Germany
  { city: "Berlin", baseCost: 1050, currency: "EUR", currencySymbol: "€", breakdown: { rent: 550, food: 250, transport: 90, utilities: 80, health: 30, leisure: 50 } },
  { city: "Munich", baseCost: 1200, currency: "EUR", currencySymbol: "€", breakdown: { rent: 680, food: 260, transport: 95, utilities: 80, health: 30, leisure: 55 } },
  { city: "Hamburg", baseCost: 1100, currency: "EUR", currencySymbol: "€", breakdown: { rent: 600, food: 255, transport: 92, utilities: 80, health: 30, leisure: 43 } },
  // Ireland
  { city: "Dublin", baseCost: 1500, currency: "EUR", currencySymbol: "€", breakdown: { rent: 850, food: 300, transport: 130, utilities: 90, health: 30, leisure: 100 } },
  { city: "Cork", baseCost: 1200, currency: "EUR", currencySymbol: "€", breakdown: { rent: 650, food: 270, transport: 100, utilities: 85, health: 30, leisure: 65 } },
  // Netherlands
  { city: "Amsterdam", baseCost: 1550, currency: "EUR", currencySymbol: "€", breakdown: { rent: 850, food: 310, transport: 120, utilities: 95, health: 35, leisure: 140 } },
  { city: "Rotterdam", baseCost: 1300, currency: "EUR", currencySymbol: "€", breakdown: { rent: 700, food: 280, transport: 105, utilities: 90, health: 35, leisure: 90 } },
  // UAE
  { city: "Dubai (UAE)", baseCost: 1800, currency: "AED", currencySymbol: "AED", breakdown: { rent: 1000, food: 350, transport: 150, utilities: 130, health: 70, leisure: 100 } },
  // Malaysia
  { city: "Kuala Lumpur", baseCost: 650, currency: "MYR", currencySymbol: "RM", breakdown: { rent: 280, food: 180, transport: 60, utilities: 55, health: 25, leisure: 50 } },
  // Türkiye
  { city: "Istanbul", baseCost: 550, currency: "TRY", currencySymbol: "₺", breakdown: { rent: 240, food: 150, transport: 55, utilities: 50, health: 20, leisure: 35 } },
  { city: "Ankara", baseCost: 450, currency: "TRY", currencySymbol: "₺", breakdown: { rent: 190, food: 130, transport: 45, utilities: 45, health: 20, leisure: 20 } },
  // Hungary
  { city: "Budapest", baseCost: 600, currency: "EUR", currencySymbol: "€", breakdown: { rent: 300, food: 150, transport: 50, utilities: 45, health: 20, leisure: 35 } },
  // New Zealand
  { city: "Auckland", baseCost: 1750, currency: "NZD", currencySymbol: "NZ$", breakdown: { rent: 950, food: 360, transport: 150, utilities: 120, health: 55, leisure: 115 } },
  { city: "Wellington", baseCost: 1650, currency: "NZD", currencySymbol: "NZ$", breakdown: { rent: 880, food: 350, transport: 145, utilities: 115, health: 55, leisure: 105 } },
  // Singapore
  { city: "Singapore", baseCost: 1900, currency: "SGD", currencySymbol: "S$", breakdown: { rent: 1000, food: 400, transport: 150, utilities: 130, health: 60, leisure: 160 } },
  // Indonesia
  { city: "Jakarta", baseCost: 450, currency: "USD", currencySymbol: "$", breakdown: { rent: 180, food: 130, transport: 45, utilities: 40, health: 20, leisure: 35 } },
  // Georgia
  { city: "Tbilisi", baseCost: 420, currency: "USD", currencySymbol: "$", breakdown: { rent: 180, food: 120, transport: 40, utilities: 40, health: 20, leisure: 20 } },
  { city: "Batumi", baseCost: 380, currency: "USD", currencySymbol: "$", breakdown: { rent: 160, food: 110, transport: 35, utilities: 35, health: 20, leisure: 20 } },
  // China
  { city: "Beijing", baseCost: 650, currency: "CNY", currencySymbol: "¥", breakdown: { rent: 300, food: 180, transport: 50, utilities: 50, health: 20, leisure: 50 } },
  { city: "Shanghai", baseCost: 680, currency: "CNY", currencySymbol: "¥", breakdown: { rent: 320, food: 190, transport: 55, utilities: 50, health: 20, leisure: 45 } },
  { city: "Guangzhou", baseCost: 550, currency: "CNY", currencySymbol: "¥", breakdown: { rent: 250, food: 160, transport: 45, utilities: 45, health: 20, leisure: 30 } },
];
