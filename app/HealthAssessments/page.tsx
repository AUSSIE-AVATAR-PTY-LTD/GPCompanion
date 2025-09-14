// pages/index.tsx  (یا app/page.tsx اگر از app-router استفاده می‌کنی)
import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

/* --------------------
   SVG آیکون‌ها (هر کارت یک آیکون یکتا)
   -------------------- */
const IconDocument = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden
  >
    <path
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
    />
    <path
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14 2v6h6"
    />
  </svg>
);
const IconShield = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden
  >
    <path
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 2l7 4v6c0 5-3.58 9.74-7 11-3.42-1.26-7-6-7-11V6l7-4z"
    />
  </svg>
);
const IconPeople = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden
  >
    <path
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 11a4 4 0 10-8 0"
    />
    <path
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 21v-1a4 4 0 014-4h8a4 4 0 014 4v1"
    />
  </svg>
);
const IconHeart = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden
  >
    <path
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.8 7.2a4.5 4.5 0 00-6.36 0L12 9.64 9.56 7.2a4.5 4.5 0 10-6.36 6.36L12 22l8.8-8.44a4.5 4.5 0 000-6.36z"
    />
  </svg>
);
const IconStar = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden
  >
    <path
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 17.3l5.09 3.3-1.46-6.09L19.9 9.6l-6.24-.54L12 3l-1.66 6.06-6.24.54 4.27 4.91L6.91 20.6z"
    />
  </svg>
);
const IconClipboard = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden
  >
    <path
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 2h6a2 2 0 012 2v1H7V4a2 2 0 012-2z"
    />
    <path
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 7h10v12a2 2 0 01-2 2H9a2 2 0 01-2-2V7z"
    />
  </svg>
);
const IconPulse = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden
  >
    <path
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12h3l2-6 4 12 2-6h5"
    />
  </svg>
);

/* --------------------
   داده کارت‌ها (title/desc/href/Icon)
   اگر می‌خواهی href‌ها به فایل‌های static public بروند:
   مثلاً href: "/gpccmp" یا "/gpccmp/index.html"
   -------------------- */
const cards = [
  {
    title: "Type 2 Diabetes Risk Evaluation",
    desc: "GP Health Assessment Tool for people aged 40-49 years",
    href: "/type-2-diabetes",
    Icon: IconShield,
  },
  {
    title: "45-49 Year Old Health Assessment",
    desc: "GP Health Assessment Tool for people at risk of developing chronic disease",
    href: "/45-49-health",
    Icon: IconDocument,
  },
  {
    title: "75+ Health Assessment",
    desc: "GP Health Assessment Tool",
    href: "/75-plus",
    Icon: IconPeople,
  },
  {
    title: "Aboriginal & Torres Strait Islander Adult Health Assessment",
    desc: "MBS Item 715 — For person aged 15 to 54 years",
    href: "/atsi-adult-15-54",
    Icon: IconStar,
  },
  {
    title: "Aboriginal & Torres Strait Islander Child Health Assessment",
    desc: "MBS Item 715 — For child under 15 years",
    href: "/atsi-child-under-15",
    Icon: IconClipboard,
  },
  {
    title: "Aboriginal & Torres Strait Islander Older Person Health Assessment",
    desc: "GP Health Assessment Tool for older persons aged 55 years and over",
    href: "/atsi-older-55-plus",
    Icon: IconPeople,
  },
  {
    title: "Heart Health Check",
    desc: "GP Health Assessment Tool (MBS Items 699/177)",
    href: "/heart-health-check",
    Icon: IconHeart,
  },
  {
    title: "Health Assessment for People with an Intellectual Disability",
    desc: "GP Health Assessment Tool",
    href: "/intellectual-disability",
    Icon: IconDocument,
  },
  {
    title: "Menopause & Perimenopause Health Assessment",
    desc: "GP Health Assessment Tool",
    href: "/menopause-perimenopause",
    Icon: IconShield,
  },
  {
    title:
      "Health assessment for permanent residents of residential aged care facilities",
    desc: "GP Health Assessment Tool",
    href: "/racf-aged-care",
    Icon: IconPulse,
  },
  {
    title: "Refugee Health Assessment",
    desc: "Comprehensive Post-Arrival Health Assessment Tool",
    href: "/refugee",
    Icon: IconPeople,
  },
  {
    title:
      "Health Assessment for Former Serving Members of the Australian Defence Force",
    desc: "GP Health Assessment Tool",
    href: "/former-serving-adf",
    Icon: IconStar,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grid کارت‌ها */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map(({ title, desc, href, Icon }) => (
              <Link
                key={href}
                href={href}
                className="group block rounded-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
              >
                <Card className="h-full rounded-xl border border-indigo-100 bg-gradient-to-tr from-indigo-50/40 to-indigo-50 hover:shadow-lg transition transform group-hover:-translate-y-1">
                  <CardHeader className="pt-6 px-6 text-center">
                    <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-indigo-100 text-indigo-700">
                      <Icon className="w-7 h-7" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-2 text-sm">
                      {desc}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-6 pb-6 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-block text-sm px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        Open Tool
                      </span>
                      <span className="text-indigo-500 text-lg transform transition group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <footer className="bg-indigo-950 text-indigo-100 border-t border-indigo-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-lg">GP</span>
                </div>
                <span className="font-bold text-xl text-white">
                  GP Companion
                </span>
              </div>

              <p className="text-indigo-200 text-sm max-w-md">
                Comprehensive medical tools and health assessments designed for
                healthcare professionals. Streamline your workflow with our
                secure, privacy-focused platform.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-indigo-200 hover:text-white transition-colors text-sm"
                  >
                    About Website
                  </Link>
                </li>
                <li>
                  <Link
                    href="/developer"
                    className="text-indigo-200 hover:text-white transition-colors text-sm"
                  >
                    Developer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-indigo-200 hover:text-white transition-colors text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-indigo-200 hover:text-white transition-colors text-sm"
                  >
                    Contact Developer
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Tools</h3>
              <ul className="space-y-2">
                <li>
                  <span className="text-indigo-200 text-sm">GPCCMP Tool</span>
                </li>
                <li>
                  <span className="text-indigo-200 text-sm">
                    Health Assessments
                  </span>
                </li>
                <li>
                  <span className="text-indigo-200 text-sm">
                    75+ Health Assessment
                  </span>
                </li>
                <li>
                  <span className="text-indigo-200 text-sm">
                    ATSI Health Assessment
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-indigo-800 mt-8 pt-8 text-center">
            <p className="text-indigo-300 text-sm">
              © 2024 GP Companion. All rights reserved. Designed for healthcare
              professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
