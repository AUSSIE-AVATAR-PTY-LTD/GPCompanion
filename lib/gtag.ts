// lib/gtag.ts
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * لیست ID های Google Analytics
 * اگر بعدا خواستی از env بخونی: process.env.NEXT_PUBLIC_GA_IDS محیطی
 */
export const GA_IDS = ["G-61RLS51ZH5", "G-XMPYXRQRH0"];

/**
 * ارسال pageview: برای هر property یک config جدا اجرا می‌کنیم
 */
export const pageview = (url: string) => {
  if (typeof window === "undefined") return;
  GA_IDS.forEach((id) => {
    if (typeof window.gtag === "function") {
      try {
        window.gtag("config", id, {
          page_path: url,
        });
      } catch (e) {
        console.warn("gtag config failed for", id, e);
      }
    } else {
      // اگر gtag هنوز آماده نیست، منتظر رویداد 'gtag-loaded' باش (AnalyticsProvider مسئول این کاره)
      console.warn("gtag not available yet — skipping pageview for", url);
    }
  });
};

/**
 * ارسال event سفارشی: به هر property ارسال می‌کنیم و از send_to استفاده می‌کنیم
 */
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
  GA_IDS.forEach((id) => {
    if (typeof window.gtag === "function") {
      try {
        window.gtag("event", action, {
          event_category: category,
          event_label: label,
          value,
          send_to: id,
        });
      } catch (e) {
        console.warn("gtag event failed for", id, e);
      }
    } else {
      console.warn("gtag not available yet — skipping event", action);
    }
  });
};
