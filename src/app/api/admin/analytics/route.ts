import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/analytics — aggregated analytics for the dashboard
export async function GET() {
  try {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Totals
    const totalVisitors = await db.visit.count();
    const visitorsToday = await db.visit.count({
      where: { firstSeen: { gte: dayAgo } },
    });
    const visitorsThisWeek = await db.visit.count({
      where: { firstSeen: { gte: weekAgo } },
    });
    const totalClicks = await db.clickEvent.count();
    const clicksToday = await db.clickEvent.count({
      where: { createdAt: { gte: dayAgo } },
    });
    const totalSectionViews = await db.sectionView.count();

    // Avg session duration — compute in JS from all section views
    const allSectionViews = await db.sectionView.findMany({
      select: { sessionId: true, durationMs: true },
    });
    const bySession = new Map<string, number>();
    for (const sv of allSectionViews) {
      bySession.set(
        sv.sessionId,
        (bySession.get(sv.sessionId) ?? 0) + sv.durationMs
      );
    }
    const avgDurationMs =
      bySession.size > 0
        ? Math.round(
            Array.from(bySession.values()).reduce((a, b) => a + b, 0) /
              bySession.size
          )
        : 0;

    // Top clicked elements — fetch recent clicks and aggregate in JS
    const allClicks = await db.clickEvent.findMany({
      select: { elementType: true, elementLabel: true, section: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    const clickCounts = new Map<string, { type: string; label: string; count: number }>();
    for (const c of allClicks) {
      const key = `${c.elementType}|${c.elementLabel}`;
      const existing = clickCounts.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        clickCounts.set(key, { type: c.elementType, label: c.elementLabel, count: 1 });
      }
    }
    const topClicks = Array.from(clickCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Top sections by total time
    const sectionAgg = new Map<string, { totalMs: number; views: number }>();
    for (const sv of allSectionViews) {
      // allSectionViews doesn't have sectionId — re-fetch with it
    }
    const allSections = await db.sectionView.findMany({
      select: { sectionId: true, durationMs: true },
    });
    for (const s of allSections) {
      const existing = sectionAgg.get(s.sectionId);
      if (existing) {
        existing.totalMs += s.durationMs;
        existing.views += 1;
      } else {
        sectionAgg.set(s.sectionId, { totalMs: s.durationMs, views: 1 });
      }
    }
    const topSections = Array.from(sectionAgg.entries())
      .map(([section, v]) => ({
        section,
        totalMs: v.totalMs,
        views: v.views,
        avgMs: v.views > 0 ? Math.round(v.totalMs / v.views) : 0,
      }))
      .sort((a, b) => b.totalMs - a.totalMs)
      .slice(0, 8);

    // Visitors over last 7 days
    const dailyVisitors: Array<{ date: string; count: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      const count = await db.visit.count({
        where: { firstSeen: { gte: start, lt: end } },
      });
      dailyVisitors.push({ date: start.toISOString().slice(0, 10), count });
    }

    // Recent activity
    const recentClicks = allClicks.slice(0, 10).map((c) => ({
      type: c.elementType,
      label: c.elementLabel,
      section: c.section,
      time: c.createdAt.toISOString(),
    }));

    // Lead counts
    const guidanceCount = await db.guidanceRequest.count();
    const bookingCount = await db.bookingSession.count();
    const newsletterCount = await db.newsletter.count();
    const countryCount = await db.country.count();

    return NextResponse.json({
      stats: {
        totalVisitors,
        visitorsToday,
        visitorsThisWeek,
        totalClicks,
        clicksToday,
        totalSectionViews,
        avgDurationMs,
        guidanceCount,
        bookingCount,
        newsletterCount,
        countryCount,
      },
      topClicks,
      topSections,
      dailyVisitors,
      recentClicks,
    });
  } catch (error) {
    console.error("GET /api/admin/analytics error:", error);
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}
