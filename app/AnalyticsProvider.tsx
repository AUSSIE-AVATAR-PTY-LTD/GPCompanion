// app/AnalyticsProvider.tsx
"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import * as gtag from "@/lib/gtag";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams ? `?${searchParams.toString()}` : "");
    let attempts = 0;
    const maxAttempts = 10;
    const wait = 500; // ms

    const trySend = () => {
      attempts++;
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        gtag.pageview(url);
      } else if (attempts < maxAttempts) {
        setTimeout(trySend, wait);
      } else {
        console.warn("GA: gtag did not become available after retries");
      }
    };

    trySend();
  }, [pathname, searchParams]);

  return null;
}
