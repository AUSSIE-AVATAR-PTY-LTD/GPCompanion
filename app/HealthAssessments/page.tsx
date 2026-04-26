import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const IconDocument = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6" />
  </svg>
);
const IconShield = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 4v6c0 5-3.58 9.74-7 11-3.42-1.26-7-6-7-11V6l7-4z" />
  </svg>
);
const IconPeople = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const IconHeart = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M20.8 7.2a4.5 4.5 0 00-6.36 0L12 9.64 9.56 7.2a4.5 4.5 0 10-6.36 6.36L12 22l8.8-8.44a4.5 4.5 0 000-6.36z" />
  </svg>
);
const IconStar = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M12 17.3l5.09 3.3-1.46-6.09L19.9 9.6l-6.24-.54L12 3l-1.66 6.06-6.24.54 4.27 4.91L6.91 20.6z" />
  </svg>
);
const IconClipboard = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M9 2h6a2 2 0 012 2v1H7V4a2 2 0 012-2z" />
    <path strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M7 7h10v12a2 2 0 01-2 2H9a2 2 0 01-2-2V7z" />
  </svg>
);
const IconPulse = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l2-6 4 12 2-6h5" />
  </svg>
);

const cards = [
  {
    title: "Type 2 Diabetes Risk Evaluation",
    desc: "GP Health Assessment Tool for people aged 40–49 years",
    href: "/api/tools?tool=diabetes-risk",
    Icon: IconShield,
    tag: "MBS Item",
  },
  {
    title: "45–49 Year Old Health Assessment",
    desc: "GP Health Assessment Tool for people at risk of developing chronic disease",
    href: "/api/tools?tool=health-check-45",
    Icon: IconDocument,
    tag: "Preventive",
  },
  {
    title: "75+ Health Assessment",
    desc: "GP Health Assessment Tool for older adults",
    href: "/api/tools?tool=health-assessment-75",
    Icon: IconPeople,
    tag: "Aged Care",
  },
  {
    title: "Aboriginal & Torres Strait Islander Adult Health Assessment",
    desc: "MBS Item 715 — For person aged 15 to 54 years",
    href: "/api/tools?tool=1554",
    Icon: IconStar,
    tag: "MBS Item 715",
  },
  {
    title: "Aboriginal & Torres Strait Islander Child Health Assessment",
    desc: "MBS Item 715 — For child under 15 years",
    href: "/api/tools?tool=atsi-child",
    Icon: IconClipboard,
    tag: "MBS Item 715",
  },
  {
    title: "Aboriginal & Torres Strait Islander Older Person Health Assessment",
    desc: "GP Health Assessment Tool for older persons aged 55 years and over",
    href: "/api/tools?tool=atsi-senior",
    Icon: IconPeople,
    tag: "MBS Item 715",
  },
  {
    title: "Heart Health Check",
    desc: "GP Health Assessment Tool (MBS Items 699/177)",
    href: "/api/tools?tool=heart-health",
    Icon: IconHeart,
    tag: "MBS Items 699/177",
  },
  {
    title: "Health Assessment for People with an Intellectual Disability",
    desc: "GP Health Assessment Tool",
    href: "/api/tools?tool=id",
    Icon: IconDocument,
    tag: "Disability",
  },
  {
    title: "Menopause & Perimenopause Health Assessment",
    desc: "GP Health Assessment Tool",
    href: "/api/tools?tool=menopause",
    Icon: IconShield,
    tag: "Women's Health",
  },
  {
    title: "Health Assessment for Residential Aged Care Facilities",
    desc: "GP Health Assessment Tool for permanent residents",
    href: "/api/tools?tool=aged-care",
    Icon: IconPulse,
    tag: "Aged Care",
  },
  {
    title: "Refugee Health Assessment",
    desc: "Comprehensive Post-Arrival Health Assessment Tool",
    href: "/api/tools?tool=refugee",
    Icon: IconPeople,
    tag: "Refugee",
  },
  {
    title: "Health Assessment for Former ADF Serving Members",
    desc: "GP Health Assessment Tool for Australian Defence Force veterans",
    href: "/api/tools?tool=adf-veteran",
    Icon: IconStar,
    tag: "Veterans",
  },
];

export default function HealthAssessmentsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-teal-50 to-white py-16 border-b border-teal-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-teal-600 text-xs font-semibold tracking-widest uppercase mb-4 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100">Clinical Tools</span>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Health Assessments</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Select an assessment tool below. All clinical data stays in your browser — nothing is ever uploaded.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-teal-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-medium">{cards.length} assessment tools available</span>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map(({ title, desc, href, Icon, tag }) => (
                <a
                  key={href}
                  href={href}
                  className="group block rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
                >
                  <Card className="h-full rounded-2xl border border-teal-100 hover:border-teal-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-teal-600 to-teal-400 group-hover:from-teal-500 group-hover:to-teal-300 transition-all" />
                    <CardHeader className="pt-6 px-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-100 text-teal-600 group-hover:bg-teal-200 transition-colors flex-shrink-0">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium text-teal-600 bg-teal-50 border border-teal-100 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                          {tag}
                        </span>
                      </div>
                      <CardTitle className="text-base font-semibold text-slate-900 leading-snug">
                        {title}
                      </CardTitle>
                      <CardDescription className="text-slate-500 mt-1 text-sm leading-relaxed">
                        {desc}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 pb-6 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Open Tool
                        </span>
                        <span className="text-teal-400 transform transition-transform group-hover:translate-x-1 text-lg">→</span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
