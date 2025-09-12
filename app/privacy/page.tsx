import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">Your privacy and patient data security are our highest priorities</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Our Privacy Commitment</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-foreground leading-relaxed mb-6">
                Your privacy and the security of patient data are the cornerstones of our platform's design. We
                guarantee complete confidentiality by ensuring that no information you enter is ever uploaded or stored
                on any external server; all data remains exclusively within your local browser, under your full control.
              </p>

              <p className="text-foreground leading-relaxed mb-6">
                To provide an even greater level of security and peace of mind, our tools are engineered to function
                perfectly without requiring you to enter the patient's name or Medicare card number. This unique feature
                allows clinicians to confidently create detailed health assessments and management plans while
                maintaining absolute patient anonymity, eliminating any concern about digital data handling.
              </p>

              <p className="text-foreground leading-relaxed">
                Our commitment ensures you can leverage these practical, free resources with the highest confidence,
                knowing that patient confidentiality is protected at every step.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Data Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>All data stored locally in your browser only</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>No information transmitted to external servers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>You maintain complete control over all data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Data can be cleared at any time</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Anonymity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>No patient names required</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>No Medicare card numbers needed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use initials or codes for identification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Absolute patient anonymity maintained</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Technical Security Measures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Local Storage Only</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    All clinical data is stored using your browser's local storage technology. This means the
                    information never leaves your device and is not accessible to anyone else.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">No Server Communication</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Our assessment tools operate entirely within your browser. No patient data is ever transmitted over
                    the internet or stored on remote servers.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Secure by Design</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    The platform is architected from the ground up with privacy as the primary consideration, ensuring
                    that patient confidentiality is built into every feature.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">User Control</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    You have complete control over all data. You can clear, export, or manage your information at any
                    time without any external dependencies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Privacy Guarantee</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 font-medium">
                We guarantee that no patient information entered into our tools will ever be stored on our servers,
                transmitted over the internet, or accessible to anyone other than you. Your privacy and your patients'
                confidentiality are absolutely protected.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
