// app/AnalyticsProvider.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useCallback } from "react";
import * as gtag from "@/lib/gtag";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // تابعی که pageview می‌فرسته
  const sendPageview = useCallback((url: string) => {
    gtag.pageview(url);
  }, []);

  useEffect(() => {
    const url = pathname + (searchParams ? `?${searchParams.toString()}` : "");

    // اگر gtag همین الان موجوده، بفرست
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      sendPageview(url);
      return;
    }

    // اگر آماده نیست، به رویداد gtag-loaded گوش میدیم و وقتی دیسپاچ شد pageview میفرستیم
    const handler = () => {
      sendPageview(url);
    };
    window.addEventListener("gtag-loaded", handler);

    // تمیزکاری
    return () => {
      window.removeEventListener("gtag-loaded", handler);
    };
  }, [pathname, searchParams, sendPageview]);

  return null;
}
