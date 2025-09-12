import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">
              Your privacy and patient data security are our highest priorities
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Our Privacy Commitment</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your privacy and the security of patient data are the cornerstones of our platform's design. We
                guarantee complete confidentiality by ensuring that no information you enter is ever uploaded or stored
                on any external server; all data remains exclusively within your local browser, under your full control.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                To provide an even greater level of security and peace of mind, our tools are engineered to function
                perfectly without requiring you to enter the patient's name or Medicare card number. This unique feature
                allows clinicians to confidently create detailed health assessments and management plans while
                maintaining absolute patient anonymity, eliminating any concern about digital data handling.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Our commitment ensures you can leverage these practical, free resources with the highest confidence,
                knowing that patient confidentiality is protected at every step.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Data Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">All data stored locally in your browser only</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">No information transmitted to external servers</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">You maintain complete control over all data</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Data can be cleared at any time</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Patient Anonymity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">No patient names required</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">No Medicare card numbers needed</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Use initials or codes for identification</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Absolute patient anonymity maintained</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Technical Security Measures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Local Storage Only</h3>
                <p className="text-muted-foreground">
                  All clinical data is stored using your browser's local storage technology. This means the information
                  never leaves your device and is not accessible to anyone else.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">No Server Communication</h3>
                <p className="text-muted-foreground">
                  Our assessment tools operate entirely within your browser. No patient data is ever transmitted over
                  the internet or stored on remote servers.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Secure by Design</h3>
                <p className="text-muted-foreground">
                  The platform is architected from the ground up with privacy as the primary consideration, ensuring
                  that patient confidentiality is built into every feature.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">User Control</h3>
                <p className="text-muted-foreground">
                  You have complete control over all data. You can clear, export, or manage your information at any time
                  without any external dependencies.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Privacy Guarantee</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We guarantee that no patient information entered into our tools will ever be stored on our servers,
                transmitted over the internet, or accessible to anyone other than you. Your privacy and your patients'
                confidentiality are absolutely protected.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
