import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import Footer from "@/components/footer"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "GP Companion - Free Clinical Tools for Healthcare Professionals",
  description:
    "Effortlessly create GP Management Plans (GPCCMPs) and Health Assessments with this free online tool. Complete patient privacy guaranteed.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable} min-h-screen flex flex-col`}>
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
