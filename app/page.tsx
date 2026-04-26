import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-teal-950 via-teal-800 to-teal-600 py-28 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-teal-900/40 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-teal-700/10 blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8 inline-block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 inline-block border border-white/20">
                <Image
                  src="/images/gp-companion-logo.png"
                  alt="GP Companion Logo"
                  width={180}
                  height={180}
                  className="mx-auto drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">GP Companion</h1>
            <p className="text-xl text-teal-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Comprehensive medical tools and health assessments designed specifically for healthcare professionals.
              Streamline your workflow with our secure, privacy-focused platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-teal-800 hover:bg-teal-50 px-10 h-14 text-lg font-semibold shadow-xl rounded-xl border-0">
                <Link href="/signup">Start 2-Month Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-white/50 text-white hover:bg-white/10 px-10 h-14 text-lg rounded-xl bg-transparent">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-teal-200">
              <span className="flex items-center gap-1.5 text-sm">
                <svg className="w-4 h-4 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center gap-1.5 text-sm">
                <svg className="w-4 h-4 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                2-month free trial
              </span>
              <span className="flex items-center gap-1.5 text-sm">
                <svg className="w-4 h-4 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Cancel anytime
              </span>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="bg-teal-950 py-4 border-b border-teal-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-teal-300">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Privacy-first platform
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                No patient data uploaded
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Built by Australian GPs
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Save hours every week
              </div>
            </div>
          </div>
        </section>

        {/* Main Tools Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block text-teal-600 text-xs font-semibold tracking-widest uppercase mb-3 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100">Clinical Tools Suite</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Essential Medical Tools</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Access comprehensive tools designed to enhance your clinical practice and improve patient care.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="group border border-teal-100 hover:border-teal-300 hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
                <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-400" />
                <CardHeader className="text-center pb-4 pt-8">
                  <div className="w-20 h-20 bg-teal-50 border-2 border-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-100 transition-colors">
                    <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <CardTitle className="text-2xl text-slate-900 mb-2">GPCCMP Tool</CardTitle>
                  <CardDescription className="text-slate-500 text-base leading-relaxed">
                    Create comprehensive GP Chronic Care Management Plans with our streamlined, time-saving workflow
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 shadow-sm rounded-lg" asChild>
                    <a href="/gpccmp">Start GPCCMP →</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group border border-teal-100 hover:border-teal-300 hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
                <div className="h-1.5 bg-gradient-to-r from-teal-400 to-teal-600" />
                <CardHeader className="text-center pb-4 pt-8">
                  <div className="w-20 h-20 bg-teal-50 border-2 border-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-100 transition-colors">
                    <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <CardTitle className="text-2xl text-slate-900 mb-2">Health Assessments</CardTitle>
                  <CardDescription className="text-slate-500 text-base leading-relaxed">
                    Access 12+ comprehensive health assessment tools for various patient populations and demographics
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 shadow-sm rounded-lg" asChild>
                    <Link href="/HealthAssessments">View All Assessments →</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-teal-50/50 py-24 border-y border-teal-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block text-teal-600 text-xs font-semibold tracking-widest uppercase mb-3 bg-white px-4 py-1.5 rounded-full border border-teal-100">Why GPs Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Built for Clinical Practice</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Purpose-built for healthcare professionals with privacy and efficiency at the core.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-teal-100 shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Privacy First</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  All patient data stays in your browser. No external servers. Complete confidentiality guaranteed.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-teal-100 shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Fast & Efficient</h3>
                <p className="text-slate-500 leading-relaxed text-sm">Streamlined workflows that save hours each week and reduce administrative burden significantly.</p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-teal-100 shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">2-Month Free Trial</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Start with a full-featured 2-month free trial. No credit card required. No commitment needed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-br from-teal-950 to-teal-700 rounded-3xl p-14 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-teal-500/20 blur-2xl" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-teal-900/40 blur-2xl" />
              </div>
              <div className="relative">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to streamline your practice?</h2>
                <p className="text-teal-100 mb-8 max-w-xl mx-auto text-lg">
                  Join healthcare professionals across Australia using GP Companion to save time and deliver better patient care.
                </p>
                <Button asChild size="lg" className="bg-white text-teal-800 hover:bg-teal-50 px-10 h-14 text-lg font-semibold shadow-lg rounded-xl border-0">
                  <Link href="/signup">Start Your Free Trial Today</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
