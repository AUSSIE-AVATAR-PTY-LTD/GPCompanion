import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">About Website</h1>
            <p className="text-muted-foreground">
              Learn more about our mission to provide free, secure clinical tools for healthcare professionals
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-foreground leading-relaxed mb-6">
                Our website offers a suite of practical and user-friendly tools designed to streamline the creation of
                essential clinical documents for healthcare professionals. Clinicians can effortlessly generate a wide
                range of health assessments and comprehensive GP Management Plans (GPCCMPs) for chronic disease
                management, all completely free of charge. This resource is built with the busy practitioner in mind,
                providing intuitive templates and workflows that save valuable time and reduce administrative burden,
                ultimately allowing for a greater focus on direct patient care.
              </p>

              <p className="text-foreground leading-relaxed">
                We place the utmost importance on patient privacy and data security. A key feature of our platform is
                that absolutely no patient information is ever uploaded or stored on our servers. All data you enter,
                from patient details to clinical notes, is saved directly and securely within your local web browser.
                This ensures that you maintain complete control over sensitive information, guaranteeing total
                confidentiality and peace of mind. It's a truly secure, practical, and free solution for modern clinical
                practice.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Comprehensive GPCCMP creation tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>75+ specialized health assessments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Complete local data storage for privacy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Intuitive, time-saving workflows</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Completely free for all healthcare professionals</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy Commitment</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>No data uploaded to external servers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>All information stays in your browser</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>No patient names or Medicare numbers required</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Complete control over sensitive information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Guaranteed confidentiality and peace of mind</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
