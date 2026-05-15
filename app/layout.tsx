import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "sonner"
import "./globals.css"
import { AnalyticsProvider } from "./AnalyticsProvider"
import GoogleAnalytics from "./GoogleAnalytics"

export const metadata: Metadata = {
  title: "GP Companion — Clinical Tools for Healthcare Professionals",
  description:
    "Comprehensive GP Chronic Care Management Plans and Health Assessment tools for Australian GPs and clinics.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://gpcompanion.com.au"),
  openGraph: {
    title: "GP Companion — Clinical Tools for Healthcare Professionals",
    description:
      "Comprehensive GP Chronic Care Management Plans and Health Assessment tools for Australian GPs.",
    type: "website",
    locale: "en_AU",
    images: [
      {
        url: "/images/gp-companion-logo.png",
        width: 512,
        height: 512,
        alt: "GP Companion",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "GP Companion — Clinical Tools for Healthcare Professionals",
    description: "Comprehensive clinical tools for Australian GPs.",
    images: ["/images/gp-companion-logo.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <GoogleAnalytics />
        <Suspense fallback={null}>{children}</Suspense>
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
        <Analytics />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
