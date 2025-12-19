// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import Script from "next/script";
import { AnalyticsProvider } from "./AnalyticsProvider";

/**
 * Google Analytics IDs (دو تا که گفتی)
 * اگر خواستی بعداً از env استفاده کنی، می‌تونیم اینو تغییر بدیم.
 */
const GA_IDS = ["G-61RLS51ZH5", "G-XMPYXRQRH0"];

export const metadata: Metadata = {
  title: "GP Companion - Medical Tools for Healthcare Professionals",
  description:
    "Comprehensive GP Chronic Care Management Plans and Health Assessment tools for clinics",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // از آنجا که از next/script استفاده می‌کنیم، ترتیب اجرا رعایت می‌شود:
  // 1) extern gtag.js لود می‌شود
  // 2) سپس inline init اجرا شده و هر دو ID با gtag('config', ...) مقداردهی می‌شوند
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>

        {/* Providerی که در هر تغییر مسیر pageview می‌فرستد */}
        <AnalyticsProvider />
        <Analytics />

        {/* لود کردن کتابخانه gtag (فقط یک بار) */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_IDS[0]}`}
        />

        {/* init و config برای هر دو ID و دیسپاچ رویداد 'gtag-loaded' */}
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            // Config برای هر دو property
            gtag('config', '${GA_IDS[0]}', { page_path: window.location.pathname });
            gtag('config', '${GA_IDS[1]}', { page_path: window.location.pathname });
            // اطلاع‌رسانی به اپلیکیشن که gtag آماده است
            try {
              window.dispatchEvent(new Event('gtag-loaded'));
            } catch(e) {
              // بعضی مرورگرها ممکنه خطا بدن؛ ولی عملاً مشکلی نیست
              console.warn("gtag dispatch failed", e);
            }
          `}
        </Script>
      </body>
    </html>
  );
}
