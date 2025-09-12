"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function GPCCMPPage() {
  const assessmentOptions: Array<{
    title: string
    description: string
    href: string
  }> = [
    {
      title: "GPCCMP & Review Generator",
      description: "Developed by Dr Bobby Tork MD, FRACGP-RG",
      href: "/gpccmp/gpccmp-generator",
    },
    {
      title: "Refugee Health Assessment",
      description: "Comprehensive Post-Arrival Health Assessment Tool",
      href: "/gpccmp/refugee-health",
    },
    {
      title: "Menopause & Perimenopause Health Assessment",
      description: "GP Health Assessment Tool",
      href: "/gpccmp/menopause-health",
    },
    {
      title: "Heart Health Check",
      description: "GP Health Assessment Tool (MBS Items 699/177)",
      href: "/gpccmp/heart-health",
    },
    {
      title: "ATSI Health Assessment",
      description: "For an Aboriginal or Torres Strait Islander...",
      href: "/gpccmp/atsi-health-assessment",
    },
    {
      title: "Health Assessment for People with an Intellectual Disability",
      description: "GP Health Assessment Tool",
      href: "/gpccmp/intellectual-disability",
    },
    {
      title: "Type 2 Diabetes Risk Evaluation",
      description: "GP Health Assessment Tool for people aged 40-49 years",
      href: "/gpccmp/diabetes-risk-40-49",
    },
    {
      title: "45-49 Year Old Health Assessment",
      description: "GP Health Assessment Tool for people at risk of developing chronic disease",
      href: "/gpccmp/health-check-45-49",
    },
    {
      title: "75+ Health Assessment",
      description: "GP Health Assessment Tool",
      href: "/gpccmp/health-assessment-75-plus",
    },
    {
      title: "Health assessment for permanent residents of residential aged care facilities",
      description: "GP Health Assessment Tool",
      href: "/gpccmp/racf-assessment",
    },
    {
      title: "Health Assessment for Former Serving Members of the Australian Defence Force",
      description: "GP Health Assessment Tool",
      href: "/gpccmp/veteran-health",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">GP Chronic Care Management Plans & Health Assessments</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our comprehensive range of health assessments and chronic care management plans. All tools
              maintain complete patient privacy by storing data locally in your browser.
            </p>
          </div>

          {assessmentOptions.length === 0 ? (
            <div className="text-center py-12">
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Assessment Tools Coming Soon</CardTitle>
                  <CardDescription>Assessment options will be added here as they become available.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessmentOptions.map((option, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={option.href}>
                      <Button className="w-full">Start Assessment</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

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
