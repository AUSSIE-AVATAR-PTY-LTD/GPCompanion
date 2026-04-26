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

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-teal-50 to-white py-16 border-b border-teal-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-teal-600 text-xs font-semibold tracking-widest uppercase mb-4 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100">Get In Touch</span>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Developer</h1>
            <p className="text-xl text-slate-500">
              Get in touch with Dr. Bobby Tork for questions, feedback, or support
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="rounded-2xl border border-teal-100 shadow-sm overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-teal-600 to-teal-400" />
                  <CardHeader className="pt-8">
                    <CardTitle className="text-2xl text-slate-900">Send a Message</CardTitle>
                    <p className="text-slate-500 mt-1">
                      Your message will be sent directly to the developer. We'll get back to you as soon as possible.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-slate-700 font-medium">Full Name</Label>
                        <Input id="fullName" placeholder="Dr. John Smith" className="border-teal-100 focus:border-teal-400 bg-white rounded-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                        <Input id="email" type="email" placeholder="doctor@example.com" className="border-teal-100 focus:border-teal-400 bg-white rounded-lg" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-slate-700 font-medium">Subject</Label>
                      <Input id="subject" placeholder="Question about GPCCMP tool" className="border-teal-100 focus:border-teal-400 bg-white rounded-lg" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-slate-700 font-medium">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your question, feedback, or how we can help you..."
                        rows={6}
                        className="border-teal-100 focus:border-teal-400 bg-white rounded-lg resize-none"
                      />
                    </div>

                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white h-11 rounded-lg shadow-sm font-medium">
                      Send Message
                    </Button>

                    <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm mb-1">Privacy Notice</h4>
                          <p className="text-sm text-slate-600">
                            Your contact information and message will be securely stored and used only to respond to your
                            inquiry. We respect your privacy and will never share your information with third parties.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="rounded-2xl border border-teal-100 shadow-sm overflow-hidden">
                  <div className="h-1 bg-teal-500" />
                  <CardHeader className="pt-6">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <CardTitle className="text-lg text-slate-900">Response Time</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <p className="text-slate-500 text-sm leading-relaxed">
                      We typically respond within 24–48 hours during business days. For urgent technical
                      issues, please include "URGENT" in your subject line.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border border-teal-100 shadow-sm overflow-hidden">
                  <div className="h-1 bg-teal-500" />
                  <CardHeader className="pt-6">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <CardTitle className="text-lg text-slate-900">Feedback Welcome</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <p className="text-slate-500 text-sm leading-relaxed">
                      We value your feedback and suggestions for improving our tools. Your input helps us create better
                      resources for healthcare professionals across Australia.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
