import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function DeveloperPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-teal-50 to-white py-16 border-b border-teal-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-teal-600 text-xs font-semibold tracking-widest uppercase mb-4 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100">Meet The Developer</span>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Developer</h1>
            <p className="text-xl text-slate-500">Meet the healthcare professional behind GP Companion</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Profile Card */}
            <Card className="rounded-2xl border border-teal-100 shadow-sm overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-400" />
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <Image
                        src="/images/dr-bobby-tork.jpeg"
                        alt="Dr. Bobby Tork"
                        width={192}
                        height={192}
                        className="w-44 h-44 rounded-2xl object-cover shadow-md"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h2 className="text-2xl font-bold text-slate-900">Dr. Bobby Tork</h2>
                      <span className="text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-medium">MD, FRACGP-RG</span>
                    </div>

                    <p className="text-slate-500 text-sm mb-1">Rural Generalist · Melbourne Medical School</p>
                    <div className="w-12 h-0.5 bg-teal-300 mb-5" />

                    <p className="text-slate-600 leading-relaxed mb-4">
                      Dr. Bobby Tork MD, FRACGP-RG is a dedicated rural generalist and a graduate of the Melbourne Medical
                      School, who brings a dual focus to his practice. He combines his commitment to frontline patient
                      care with a deep professional interest in the systems that support healthcare delivery.
                    </p>

                    <p className="text-slate-600 leading-relaxed">
                      Dr. Tork applies his clinical insights toward the development of more effective and efficient care
                      models, with the goal of enhancing the quality, coordination, and accessibility of medical services
                      for all patients.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detail Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-2xl border border-teal-100 shadow-sm overflow-hidden">
                <div className="h-1 bg-teal-500" />
                <CardHeader className="pt-6">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <CardTitle className="text-lg text-slate-900">Clinical Excellence</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-slate-500 leading-relaxed text-sm">
                    With a strong foundation in rural general practice, Dr. Tork understands the unique challenges faced
                    by healthcare professionals in diverse settings. His experience in frontline patient care informs
                    every aspect of the tools and systems he develops.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-teal-100 shadow-sm overflow-hidden">
                <div className="h-1 bg-teal-500" />
                <CardHeader className="pt-6">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <CardTitle className="text-lg text-slate-900">Innovation in Healthcare</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-slate-500 leading-relaxed text-sm">
                    Dr. Tork's passion for improving healthcare delivery systems drives his commitment to creating
                    practical, efficient tools that enhance the quality and accessibility of medical services for both
                    practitioners and patients.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
