"use client";

import React, { createContext, useContext } from "react";
import { SiteContentType, defaultContent } from "@/lib/content";

const SiteContentContext = createContext<SiteContentType>(defaultContent);

export function SiteContentProvider({
  children,
  content,
}: {
  children: React.ReactNode;
  content: SiteContentType;
}) {
  return (
    <SiteContentContext.Provider value={content}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (context === undefined) {
    throw new Error("useSiteContent must be used within a SiteContentProvider");
  }
  return context;
}
