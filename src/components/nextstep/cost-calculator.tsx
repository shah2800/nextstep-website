"use client";

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Home, UtensilsCrossed, Bus, Zap, HeartPulse, Sparkles, Calculator } from "lucide-react";
import {
  cityCosts,
  lifestyleMultiplier,
  lifestyleLabels,
  lifestyleDescriptions,
  type LifeStyle,
  type CostBreakdown,
} from "@/lib/cost-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#1e3a8a", "#d4a017", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
const CATEGORY_LABELS = ["Rent", "Food", "Transport", "Utilities", "Health", "Leisure"];
const CATEGORY_ICONS = [Home, UtensilsCrossed, Bus, Zap, HeartPulse, Sparkles];

function scaleBreakdown(b: CostBreakdown, mult: number) {
  return {
    rent: Math.round(b.rent * mult),
    food: Math.round(b.food * mult),
    transport: Math.round(b.transport * mult),
    utilities: Math.round(b.utilities * mult),
    health: Math.round(b.health * mult),
    leisure: Math.round(b.leisure * mult),
  };
}

export function CostCalculator() {
  const [cityIdx, setCityIdx] = useState("0");
  const [lifestyle, setLifestyle] = useState<LifeStyle>("balanced");

  const city = cityCosts[parseInt(cityIdx)] ?? cityCosts[0];
  const mult = lifestyleMultiplier[lifestyle];

  const scaled = useMemo(() => scaleBreakdown(city.breakdown, mult), [city, mult]);
  const total = useMemo(
    () =>
      scaled.rent + scaled.food + scaled.transport + scaled.utilities + scaled.health + scaled.leisure,
    [scaled]
  );

  const chartData = useMemo(
    () =>
      [
        { name: "Rent", value: scaled.rent },
        { name: "Food", value: scaled.food },
        { name: "Transport", value: scaled.transport },
        { name: "Utilities", value: scaled.utilities },
        { name: "Health", value: scaled.health },
        { name: "Leisure", value: scaled.leisure },
      ].filter((d) => d.value > 0),
    [scaled]
  );

  const annualTotal = total * 12;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Controls + breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-brand" />
            Plan your monthly budget
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* City select */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Destination City</Label>
            <Select value={cityIdx} onValueChange={setCityIdx}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {cityCosts.map((c, i) => (
                  <SelectItem key={`${c.city}-${i}`} value={String(i)}>
                    {c.city} <span className="text-muted-foreground">({c.currency})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lifestyle select */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Lifestyle</Label>
            <Select value={lifestyle} onValueChange={(v) => setLifestyle(v as LifeStyle)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(lifestyleLabels) as LifeStyle[]).map((k) => (
                  <SelectItem key={k} value={k}>
                    {lifestyleLabels[k]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {lifestyleDescriptions[lifestyle]}
            </p>
          </div>

          {/* Category breakdown list */}
          <div className="space-y-2 pt-2">
            {CATEGORY_LABELS.map((label, i) => {
              const Icon = CATEGORY_ICONS[i];
              const val = [scaled.rent, scaled.food, scaled.transport, scaled.utilities, scaled.health, scaled.leisure][i];
              const pct = total > 0 ? Math.round((val / total) * 100) : 0;
              return (
                <div key={label} className="flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: COLORS[i] }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
                  <span className="text-xs text-muted-foreground">{pct}%</span>
                  <span className="w-24 text-right text-sm font-semibold tabular-nums text-foreground">
                    {city.currencySymbol} {val.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chart + totals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Where your money goes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `${city.currencySymbol} ${value.toLocaleString()}/mo`,
                    "",
                  ]}
                  contentStyle={{
                    borderRadius: "0.5rem",
                    border: "1px solid var(--border)",
                    fontSize: "0.8rem",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.5rem" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Totals */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-secondary/40 p-4 text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Monthly Total
              </div>
              <div className="mt-1 text-2xl font-extrabold text-brand tabular-nums">
                {city.currencySymbol} {total.toLocaleString()}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-brand p-4 text-center text-white">
              <div className="text-xs font-medium uppercase tracking-wide text-white/80">
                Annual Estimate
              </div>
              <div className="mt-1 text-2xl font-extrabold tabular-nums">
                {city.currencySymbol} {annualTotal.toLocaleString()}
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Estimates exclude tuition. Visa financial evidence usually requires
            tuition + 9-12 months living costs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
