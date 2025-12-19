import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import { AnalyticsProvider } from "./AnalyticsProvider";
import GoogleAnalytics from "./GoogleAnalytics";

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
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <GoogleAnalytics />
        <Suspense fallback={null}>{children}</Suspense>
        <AnalyticsProvider />
        <Analytics />
      </body>
    </html>
  );
}