"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setSubmitStatus("success")
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Contact Developer</h1>
            <p className="text-muted-foreground">
              Get in touch with Dr. Bobby Tork for questions, feedback, or support
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>
                Your message will be sent directly to the developer. We'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">Message sent successfully!</p>
                  <p className="text-green-600 text-sm mt-1">Thank you for your message. We'll get back to you soon.</p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">Failed to send message</p>
                  <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Dr. John Smith"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="doctor@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Question about GPCCMP tool"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Please describe your question, feedback, or how we can help you..."
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending Message..." : "Send Message"}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Privacy Notice</h3>
                <p className="text-sm text-muted-foreground">
                  Your contact information and message will be securely stored and used only to respond to your inquiry.
                  We respect your privacy and will never share your information with third parties.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  We typically respond to messages within 24-48 hours during business days. For urgent technical issues,
                  please include "URGENT" in your subject line.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback Welcome</CardTitle>
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
    </div>
  )
}
