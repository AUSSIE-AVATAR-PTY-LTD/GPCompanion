import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Effortlessly create GP Management Plans (GPCCMPs) and Health Assessments
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            This free online tool offers a clear, efficient workflow and guarantees complete patient privacy by never
            saving any data to its servers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* GPCCMP Tool Box */}
          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold mb-3">GPCCMP Tool</h2>
                <p className="text-muted-foreground mb-6">
                  Create comprehensive GP Chronic Care Management Plans with our streamlined workflow
                </p>
              </div>
              <Button asChild size="lg" className="w-full">
                <Link href="/gpccmp">Start GPCCMP</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold mb-3">Health Assessments</h2>
                <p className="text-muted-foreground mb-6">
                  Access comprehensive health assessment tools for various patient populations
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="text-sm font-medium text-foreground mb-2">Featured Assessments:</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    75+ Health Assessment
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    45-49 Health Check
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    ATSI Health Assessment
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Plus: Heart Health, Menopause, Veteran, Refugee, Intellectual Disability, Diabetes Risk, and RACF
                  assessments
                </div>
              </div>

              <Button asChild size="lg" className="w-full" variant="secondary">
                <Link href="/gpccmp">View All Assessments</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Complete Privacy</h3>
            <p className="text-muted-foreground text-sm">
              No data is ever saved to our servers. Everything stays in your browser.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast & Efficient</h3>
            <p className="text-muted-foreground text-sm">Streamlined workflows designed to save you valuable time.</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Completely Free</h3>
            <p className="text-muted-foreground text-sm">
              All tools and assessments are provided at no cost to healthcare professionals.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
