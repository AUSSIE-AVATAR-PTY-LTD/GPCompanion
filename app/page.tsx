import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-50/50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <Image
                src="/images/gp-companion-logo.png"
                alt="GP Companion Logo"
                width={300}
                height={300}
                className="mx-auto"
                priority
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 text-balance">
              GP Companion
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto text-pretty">
              Comprehensive medical tools and health assessments designed
              specifically for healthcare professionals. Streamline your
              workflow with our secure, privacy-focused platform.
            </p>
          </div>
        </section>

        {/* Main Tools Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Essential Medical Tools
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Access comprehensive tools designed to enhance your clinical
                practice and improve patient care.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* GPCCMP Tool */}
              <Card className="bg-white border-indigo-100 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <CardTitle className="text-2xl text-slate-900">
                    GPCCMP Tool
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Create comprehensive GP Chronic Care Management Plans with
                    our streamlined workflow
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    <a href="/gpccmp" className="w-full block text-center">
                      Start GPCCMP
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Health Assessments */}
              <Card className="bg-white border-indigo-100 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <CardTitle className="text-2xl text-slate-900">
                    Health Assessments
                  </CardTitle>
                  <CardDescription className="text-slate-600 mb-4">
                    Access comprehensive health assessment tools for various
                    patient populations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    asChild
                  >
                    <Link href="/HealthAssessments">View All Assessments</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-indigo-50/40 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Why Choose GP Companion?
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Built specifically for healthcare professionals with privacy and
                efficiency in mind.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Privacy First
                </h3>
                <p className="text-slate-600">
                  All patient data stays in your browser. No external servers.
                  Complete confidentiality.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Fast & Efficient
                </h3>
                <p className="text-slate-600">
                  Streamlined workflows that save time and reduce administrative
                  burden.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Free to Use
                </h3>
                <p className="text-slate-600">
                  Completely free for all healthcare professionals. No hidden
                  costs or subscriptions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
