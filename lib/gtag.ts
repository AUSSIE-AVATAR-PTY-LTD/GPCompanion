// lib/gtag.ts
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-MKKD030FVM";

export const pageview = (url: string) => {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  } else {
    // اگر gtag لود نشده، چیزی لاگ می‌کنیم (اختیاری) یا می‌توانیم retry کنیم.
    console.warn("gtag not available yet — skipping pageview for", url);
  }
};

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  } else {
    console.warn("gtag not available yet — skipping event", action);
  }
};
