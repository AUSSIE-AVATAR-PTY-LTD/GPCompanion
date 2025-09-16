// pages/about.tsx
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Website</h1>
            <p className="text-xl text-gray-600">
              Learn more about our mission to provide free, secure clinical tools for healthcare professionals
            </p>
          </div>

          <Card className="mb-8 rounded-xl border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                Our website offers a suite of practical and user-friendly tools designed to streamline the creation of
                essential clinical documents for healthcare professionals. Clinicians can effortlessly generate a wide
                range of health assessments and comprehensive GP Management Plans (GPCCMPs) for chronic disease
                management, all completely free of charge. This resource is built with the busy practitioner in mind,
                providing intuitive templates and workflows that save valuable time and reduce administrative burden,
                ultimately allowing for a greater focus on direct patient care.
              </p>

              <p className="text-gray-600 leading-relaxed">
                We place the utmost importance on patient privacy and data security. A key feature of our platform is
                that absolutely no patient information is ever uploaded or stored on our servers. All data you enter,
                from patient details to clinical notes, is saved directly and securely within your local web browser.
                This ensures that you maintain complete control over sensitive information, guaranteeing total
                confidentiality and peace of mind. It's a truly secure, practical, and free solution for modern clinical
                practice.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Privacy Commitment</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-600">No Patient data uploaded to external servers.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-600">All information stays in your browser</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-600">No patient names or Medicare numbers required</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-600">Complete control over sensitive information</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-600">Guaranteed confidentiality and peace of mind</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}