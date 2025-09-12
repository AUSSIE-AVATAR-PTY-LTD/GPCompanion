import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Contact Developer</h1>
            <p className="text-xl text-muted-foreground">
              Get in touch with Dr. Bobby Tork for questions, feedback, or support
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Send a Message</CardTitle>
                  <p className="text-muted-foreground">
                    Your message will be sent directly to the developer. We'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-foreground">
                        Full Name
                      </Label>
                      <Input id="fullName" placeholder="Dr. John Smith" className="bg-input border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="doctor@example.com"
                        className="bg-input border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-foreground">
                      Subject
                    </Label>
                    <Input id="subject" placeholder="Question about GPCCMP tool" className="bg-input border-border" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your question, feedback, or how we can help you..."
                      rows={6}
                      className="bg-input border-border"
                    />
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90">Send Message</Button>

                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Privacy Notice</h4>
                      <p className="text-sm text-muted-foreground">
                        Your contact information and message will be securely stored and used only to respond to your
                        inquiry. We respect your privacy and will never share your information with third parties.
                      </p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    We typically respond to messages within 24-48 hours during business days. For urgent technical
                    issues, please include "URGENT" in your subject line.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Feedback Welcome</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
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
