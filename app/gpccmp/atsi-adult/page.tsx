"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface FormData {
  [key: string]: string | boolean | string[]
}

interface SectionState {
  [key: string]: boolean
}

export default function ATSIAdultPage() {
  const [formData, setFormData] = useState<FormData>({})
  const [openSections, setOpenSections] = useState<SectionState>({
    patientAdmin: true,
    historyMedication: true,
    socialHistory: true,
    riskFactors: true,
    lifestyle: true,
    examination: true,
    planReferrals: true,
  })

  useEffect(() => {
    const savedData = localStorage.getItem("atsi-adult-assessment")
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("atsi-adult-assessment", JSON.stringify(formData))
  }, [formData])

  const updateFormData = (key: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const calculateAge = (dob: string) => {
    if (!dob) return ""
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age.toString()
  }

  const calculateBMI = (height: string, weight: string) => {
    if (!height || !weight) return ""
    const heightM = Number.parseFloat(height) / 100
    const weightKg = Number.parseFloat(weight)
    if (heightM > 0 && weightKg > 0) {
      return (weightKg / (heightM * heightM)).toFixed(1)
    }
    return ""
  }

  const exportAsText = () => {
    const content = generateReportContent()
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ATSI-Adult-Health-Assessment.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsRTF = () => {
    const content = generateRTFContent()
    const blob = new Blob([content], { type: "application/rtf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ATSI-Adult-Health-Assessment.rtf"
    a.click()
    URL.revokeObjectURL(url)
  }

  const generateReportContent = () => {
    return `ABORIGINAL AND TORRES STRAIT ISLANDER ADULT HEALTH ASSESSMENT
MBS Item 715 - For patients aged 15-54 years

Assessment Date: ${formData.assessmentDate || ""}
Patient Name: ${formData.patientName || "Not provided"}
DOB: ${formData.patientDob || ""}
Age: ${formData.patientDob ? calculateAge(formData.patientDob as string) : ""}
Gender: ${formData.patientGender || ""}

PATIENT & ADMINISTRATIVE DETAILS
Usual GP: ${formData.usualGp || ""}
Previous Assessment Date: ${formData.prevAssessmentDate || ""}
Consent Obtained: ${formData.consentObtained ? "Yes" : "No"}

SOCIAL HISTORY
Family Relationships/Social Support: ${formData.familyRelationships || ""}

EXAMINATION
Blood Pressure: ${formData.bp || ""}
Heart Rate: ${formData.hr || ""} (${formData.hrRhythm || ""})
Height: ${formData.heightCm || ""} cm
Weight: ${formData.weightKg || ""} kg
BMI: ${formData.heightCm && formData.weightKg ? calculateBMI(formData.heightCm as string, formData.weightKg as string) : ""} kg/m²
Waist Circumference: ${formData.waist || ""} cm

PLAN & RECOMMENDATIONS
${formData.planRecommendations || ""}

Generated on: ${new Date().toLocaleDateString()}
`
  }

  const generateRTFContent = () => {
    const textContent = generateReportContent()
    return `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 ${textContent.replace(/\n/g, "\\par ")}}`
  }

  const clearForm = () => {
    if (confirm("Are you sure you want to clear all form data?")) {
      setFormData({})
      localStorage.removeItem("atsi-adult-assessment")
    }
  }

  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <div
      className="bg-transparent text-xl font-bold text-primary px-6 py-3 flex justify-between items-center cursor-pointer border-b border-primary/20"
      onClick={() => toggleSection(section)}
    >
      <h2>{title}</h2>
      {openSections[section] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/gpccmp/atsi-health-assessment">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to ATSI Assessments
              </Button>
            </Link>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Aboriginal and Torres Strait Islander Adult Health Assessment</h1>
            <p className="text-muted-foreground">MBS Item 715 - For patients aged 15-54 years</p>
            <p className="text-sm text-muted-foreground mt-2">Developed by Dr Bobby Tork MD, FRACGP-RG</p>
          </div>

          {/* Patient & Admin Section */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="Patient & Admin" section="patientAdmin" />
            {openSections.patientAdmin && (
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b border-primary/20 pb-2">Patient Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Name: <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      value={(formData.patientName as string) || ""}
                      onChange={(e) => updateFormData("patientName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Assessment Date:</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      value={(formData.assessmentDate as string) || new Date().toISOString().slice(0, 10)}
                      onChange={(e) => updateFormData("assessmentDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">DOB:</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      value={(formData.patientDob as string) || ""}
                      onChange={(e) => updateFormData("patientDob", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Age:</label>
                    <div className="p-3 bg-muted rounded-md text-center font-medium">
                      {formData.patientDob ? calculateAge(formData.patientDob as string) : "Age will be calculated"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender:</label>
                    <select
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      value={(formData.patientGender as string) || ""}
                      onChange={(e) => updateFormData("patientGender", e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-primary border-b border-primary/20 pb-2 mt-6">
                  Administrative Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Usual GP:</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      value={(formData.usualGp as string) || ""}
                      onChange={(e) => updateFormData("usualGp", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Previous Assessment Date:</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      value={(formData.prevAssessmentDate as string) || ""}
                      onChange={(e) => updateFormData("prevAssessmentDate", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={(formData.consentObtained as boolean) || false}
                        onChange={(e) => updateFormData("consentObtained", e.target.checked)}
                      />
                      Consent obtained to perform health assessment.
                    </label>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Examination Section */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="Examination & Investigations" section="examination" />
            {openSections.examination && (
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b border-primary/20 pb-2">Examination</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Blood Pressure (mmHg):</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder="e.g., 120/80"
                      value={(formData.bp as string) || ""}
                      onChange={(e) => updateFormData("bp", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Heart Rate:</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        value={(formData.hr as string) || ""}
                        onChange={(e) => updateFormData("hr", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Rhythm:</label>
                      <select
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        value={(formData.hrRhythm as string) || "Regular"}
                        onChange={(e) => updateFormData("hrRhythm", e.target.value)}
                      >
                        <option>Regular</option>
                        <option>Irregular</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Height (cm):</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      value={(formData.heightCm as string) || ""}
                      onChange={(e) => updateFormData("heightCm", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Weight (kg):</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      value={(formData.weightKg as string) || ""}
                      onChange={(e) => updateFormData("weightKg", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Waist Circumference (cm):</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      value={(formData.waist as string) || ""}
                      onChange={(e) => updateFormData("waist", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">BMI (kg/m²):</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-input rounded-md bg-muted"
                      value={
                        formData.heightCm && formData.weightKg
                          ? calculateBMI(formData.heightCm as string, formData.weightKg as string)
                          : ""
                      }
                      readOnly
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Plan & Referrals Section */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="Plan & Referrals" section="planReferrals" />
            {openSections.planReferrals && (
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Plan Details:</label>
                  <textarea
                    className="w-full px-3 py-2 border border-input rounded-md bg-background h-48"
                    value={(formData.planRecommendations as string) || ""}
                    onChange={(e) => updateFormData("planRecommendations", e.target.value)}
                  />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mb-8">
            <Button variant="outline" onClick={clearForm}>
              Clear Form
            </Button>
            <Button variant="outline" onClick={exportAsText}>
              Export as .txt
            </Button>
            <Button onClick={exportAsRTF}>Export as .rtf</Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
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
