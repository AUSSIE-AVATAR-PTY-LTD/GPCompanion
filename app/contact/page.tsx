// pages/contact.tsx
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Developer</h1>
            <p className="text-xl text-gray-600">
              Get in touch with Dr. Bobby Tork for questions, feedback, or support
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="rounded-xl border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">Send a Message</CardTitle>
                  <p className="text-gray-600">
                    Your message will be sent directly to the developer. We'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-700">
                        Full Name
                      </Label>
                      <Input id="fullName" placeholder="Dr. John Smith" className="bg-white border-gray-300" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="doctor@example.com"
                        className="bg-white border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-700">
                      Subject
                    </Label>
                    <Input id="subject" placeholder="Question about GPCCMP tool" className="bg-white border-gray-300" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your question, feedback, or how we can help you..."
                      rows={6}
                      className="bg-white border-gray-300"
                    />
                  </div>

                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Send Message</Button>

                  <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Privacy Notice</h4>
                      <p className="text-sm text-gray-600">
                        Your contact information and message will be securely stored and used only to respond to your
                        inquiry. We respect your privacy and will never share your information with third parties.
                      </p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="rounded-xl border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    We typically respond to messages within 24-48 hours during business days. For urgent technical
                    issues, please include "URGENT" in your subject line.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-xl border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Feedback Welcome</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    We value your feedback and suggestions for improving our tools. Your input helps us create better
                    resources for healthcare professionals.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}