// pages/privacy.tsx
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600">
              Your privacy and patient data security are our highest priorities
            </p>
          </div>

          <Card className="mb-8 rounded-xl border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Our Privacy Commitment</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                Your privacy and the security of patient data are the cornerstones of our platform's design. We
                guarantee complete confidentiality by ensuring that no information you enter is ever uploaded or stored
                on any external server; all data remains exclusively within your local browser, under your full control.
              </p>

              <p className="text-gray-600 leading-relaxed">
                To provide an even greater level of security and peace of mind, our tools are engineered to function
                perfectly without requiring you to enter the patient's name or Medicare card number. This unique feature
                allows clinicians to confidently create detailed health assessments and management plans while
                maintaining absolute patient anonymity, eliminating any concern about digital data handling.
              </p>

              <p className="text-gray-600 leading-relaxed">
                Our commitment ensures you can leverage these practical, free resources with the highest confidence,
                knowing that patient confidentiality is protected at every step.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
