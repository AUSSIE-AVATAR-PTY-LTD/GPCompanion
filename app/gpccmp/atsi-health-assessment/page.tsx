"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ATSIHealthAssessmentPage() {
  const atsiOptions = [
    {
      title: "ATSI Adult",
      description: "Aboriginal and Torres Strait Islander Adult Health Assessment (MBS Item 715) - Ages 15-54 years",
      href: "/gpccmp/atsi-adult",
    },
    {
      title: "ATSI Child",
      description: "Aboriginal and Torres Strait Islander Child Health Assessment - Ages 0-14 years",
      href: "/gpccmp/atsi-child",
    },
    {
      title: "ATSI Senior",
      description: "Aboriginal and Torres Strait Islander Senior Health Assessment - Ages 55+ years",
      href: "/gpccmp/atsi-senior",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/gpccmp">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Assessments
              </Button>
            </Link>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">ATSI Health Assessment</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the appropriate Aboriginal and Torres Strait Islander health assessment based on the patient's age
              group.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {atsiOptions.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                  <CardDescription className="text-sm">{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={option.href}>
                    <Button className="w-full">Start Assessment</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Privacy Notice:</strong> All assessment data is saved locally in your browser and never
              transmitted to our servers. Generated documents will be downloaded to your device for your records.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
