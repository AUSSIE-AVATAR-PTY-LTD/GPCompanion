import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-teal-50 to-white py-16 border-b border-teal-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-teal-600 text-xs font-semibold tracking-widest uppercase mb-4 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100">About Us</span>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">About GP Companion</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Learn more about our mission to provide secure, efficient clinical tools for healthcare professionals
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <Card className="rounded-2xl border border-teal-100 overflow-hidden shadow-sm">
              <div className="h-1 bg-gradient-to-r from-teal-600 to-teal-400" />
              <CardHeader className="pt-8">
                <CardTitle className="text-2xl text-slate-900 flex items-center gap-3">
                  <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pb-8">
                <p className="text-slate-600 leading-relaxed">
                  Our website offers a suite of practical and user-friendly tools designed to streamline the creation of
                  essential clinical documents for healthcare professionals. Clinicians can effortlessly generate a wide
                  range of health assessments and comprehensive GP Management Plans (GPCCMPs) for chronic disease
                  management, all completely free of charge. This resource is built with the busy practitioner in mind,
                  providing intuitive templates and workflows that save valuable time and reduce administrative burden,
                  ultimately allowing for a greater focus on direct patient care.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  We place the utmost importance on patient privacy and data security. A key feature of our platform is
                  that absolutely no patient information is ever uploaded or stored on our servers. All data you enter,
                  from patient details to clinical notes, is saved directly and securely within your local web browser.
                  This ensures that you maintain complete control over sensitive information, guaranteeing total
                  confidentiality and peace of mind. It's a truly secure, practical, and free solution for modern clinical
                  practice.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-teal-100 overflow-hidden shadow-sm">
              <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-600" />
              <CardHeader className="pt-8">
                <CardTitle className="text-2xl text-slate-900 flex items-center gap-3">
                  <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  Privacy Commitment
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <ul className="space-y-4">
                  {[
                    "No patient data uploaded to external servers",
                    "All information stays securely in your browser",
                    "No patient names or Medicare numbers required",
                    "Complete control over sensitive clinical information",
                    "Guaranteed confidentiality and peace of mind",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
