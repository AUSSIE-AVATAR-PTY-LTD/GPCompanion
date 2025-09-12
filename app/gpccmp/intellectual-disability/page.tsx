"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

interface FormData {
  [key: string]: string
}

interface SectionState {
  [key: string]: boolean
}

const SectionHeader = ({ title, isOpen, onToggle }: { title: string; isOpen: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between p-4 bg-transparent text-primary border-b border-primary/20 hover:bg-primary/5 transition-colors"
  >
    <h3 className="text-xl font-bold text-primary">{title}</h3>
    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
  </button>
)

export default function IntellectualDisabilityAssessment() {
  const [formData, setFormData] = useState<FormData>({})
  const [openSections, setOpenSections] = useState<SectionState>({
    mbsInfo: true,
    patientDetails: true,
    healthHistory: true,
    examination: true,
    functionalAssessment: true,
    mentalHealth: true,
    carePlanning: true,
  })

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("intellectual-disability-assessment")
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("intellectual-disability-assessment", JSON.stringify(formData))
  }, [formData])

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const calculateAge = () => {
    const dob = formData["patient-dob"]
    if (!dob) return ""

    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age.toString()
  }

  const calculateBMI = () => {
    const height = Number.parseFloat(formData["height"] || "0")
    const weight = Number.parseFloat(formData["weight"] || "0")

    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100
      const bmi = weight / (heightInMeters * heightInMeters)
      return bmi.toFixed(1)
    }
    return ""
  }

  const clearForm = () => {
    if (confirm("Are you sure you want to clear all form data?")) {
      setFormData({})
      localStorage.removeItem("intellectual-disability-assessment")
    }
  }

  const exportAsText = () => {
    let report = "HEALTH ASSESSMENT FOR PEOPLE WITH AN INTELLECTUAL DISABILITY\n"
    report += "=" + "=".repeat(60) + "\n\n"

    report += `MBS Item Number: ${formData["mbs-item"] || "N/A"}\n\n`

    report += "PATIENT DETAILS:\n"
    report += `Name: ${formData["patient-name"] || "N/A"}\n`
    report += `Date of Birth: ${formData["patient-dob"] || "N/A"}\n`
    report += `Age: ${calculateAge() || "N/A"}\n`
    report += `Gender: ${formData["patient-gender"] || "N/A"}\n`
    report += `Address: ${formData["patient-address"] || "N/A"}\n\n`

    report += "HEALTH HISTORY:\n"
    report += `Medical Conditions: ${formData["medical-conditions"] || "N/A"}\n`
    report += `Current Medications: ${formData["current-medications"] || "N/A"}\n`
    report += `Allergies: ${formData["allergies"] || "N/A"}\n\n`

    report += "EXAMINATION:\n"
    report += `Height: ${formData["height"] || "N/A"} cm\n`
    report += `Weight: ${formData["weight"] || "N/A"} kg\n`
    report += `BMI: ${calculateBMI() || "N/A"}\n`
    report += `Blood Pressure: ${formData["blood-pressure"] || "N/A"}\n`
    report += `Heart Rate: ${formData["heart-rate"] || "N/A"}\n\n`

    report += "FUNCTIONAL ASSESSMENT:\n"
    report += `Communication: ${formData["communication"] || "N/A"}\n`
    report += `Mobility: ${formData["mobility"] || "N/A"}\n`
    report += `Daily Living Skills: ${formData["daily-living"] || "N/A"}\n\n`

    report += "CARE PLANNING:\n"
    report += `Recommendations: ${formData["recommendations"] || "N/A"}\n`
    report += `Follow-up: ${formData["follow-up"] || "N/A"}\n\n`

    report += `Assessment completed on: ${new Date().toLocaleDateString()}\n`

    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `intellectual-disability-assessment-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsRTF = () => {
    let rtf = "{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}\\f0\\fs24 "

    rtf += "\\b HEALTH ASSESSMENT FOR PEOPLE WITH AN INTELLECTUAL DISABILITY\\b0\\par\\par "

    rtf += `\\b MBS Item Number:\\b0 ${formData["mbs-item"] || "N/A"}\\par\\par `

    rtf += "\\b PATIENT DETAILS:\\b0\\par "
    rtf += `Name: ${formData["patient-name"] || "N/A"}\\par `
    rtf += `Date of Birth: ${formData["patient-dob"] || "N/A"}\\par `
    rtf += `Age: ${calculateAge() || "N/A"}\\par `
    rtf += `Gender: ${formData["patient-gender"] || "N/A"}\\par `
    rtf += `Address: ${formData["patient-address"] || "N/A"}\\par\\par `

    rtf += "\\b HEALTH HISTORY:\\b0\\par "
    rtf += `Medical Conditions: ${formData["medical-conditions"] || "N/A"}\\par `
    rtf += `Current Medications: ${formData["current-medications"] || "N/A"}\\par `
    rtf += `Allergies: ${formData["allergies"] || "N/A"}\\par\\par `

    rtf += "\\b EXAMINATION:\\b0\\par "
    rtf += `Height: ${formData["height"] || "N/A"} cm\\par `
    rtf += `Weight: ${formData["weight"] || "N/A"} kg\\par `
    rtf += `BMI: ${calculateBMI() || "N/A"}\\par `
    rtf += `Blood Pressure: ${formData["blood-pressure"] || "N/A"}\\par `
    rtf += `Heart Rate: ${formData["heart-rate"] || "N/A"}\\par\\par `

    rtf += "\\b FUNCTIONAL ASSESSMENT:\\b0\\par "
    rtf += `Communication: ${formData["communication"] || "N/A"}\\par `
    rtf += `Mobility: ${formData["mobility"] || "N/A"}\\par `
    rtf += `Daily Living Skills: ${formData["daily-living"] || "N/A"}\\par\\par `

    rtf += "\\b CARE PLANNING:\\b0\\par "
    rtf += `Recommendations: ${formData["recommendations"] || "N/A"}\\par `
    rtf += `Follow-up: ${formData["follow-up"] || "N/A"}\\par\\par `

    rtf += `Assessment completed on: ${new Date().toLocaleDateString()}\\par `
    rtf += "}"

    const blob = new Blob([rtf], { type: "application/rtf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `intellectual-disability-assessment-${new Date().toISOString().split("T")[0]}.rtf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Health Assessment for People with an Intellectual Disability</h1>
            <p className="text-muted-foreground">GP Health Assessment Tool</p>
            <p className="text-sm text-muted-foreground mt-2">Developed by Dr Bobby Tork MD, FRACGP-RG</p>
          </div>

          <Card className="border-primary/20">
            <CardContent className="p-0">
              {/* MBS Information */}
              <div>
                <SectionHeader
                  title="MBS Information"
                  isOpen={openSections.mbsInfo}
                  onToggle={() => toggleSection("mbsInfo")}
                />
                {openSections.mbsInfo && (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">MBS Item Number</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="mbs-item"
                            value="701"
                            checked={formData["mbs-item"] === "701"}
                            onChange={(e) => updateFormData("mbs-item", e.target.value)}
                            className="mr-2"
                          />
                          Item 701 - Health assessment for people with an intellectual disability
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Patient Details */}
              <div>
                <SectionHeader
                  title="Patient Details"
                  isOpen={openSections.patientDetails}
                  onToggle={() => toggleSection("patientDetails")}
                />
                {openSections.patientDetails && (
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Patient Name (Optional)</label>
                        <input
                          type="text"
                          value={formData["patient-name"] || ""}
                          onChange={(e) => updateFormData("patient-name", e.target.value)}
                          className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Date of Birth</label>
                        <input
                          type="date"
                          value={formData["patient-dob"] || ""}
                          onChange={(e) => updateFormData("patient-dob", e.target.value)}
                          className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Age</label>
                        <input
                          type="text"
                          value={calculateAge()}
                          readOnly
                          className="w-full p-3 border border-input rounded-md bg-muted"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Gender</label>
                        <select
                          value={formData["patient-gender"] || ""}
                          onChange={(e) => updateFormData("patient-gender", e.target.value)}
                          className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Address</label>
                      <textarea
                        value={formData["patient-address"] || ""}
                        onChange={(e) => updateFormData("patient-address", e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Health History */}
              <div>
                <SectionHeader
                  title="Health History"
                  isOpen={openSections.healthHistory}
                  onToggle={() => toggleSection("healthHistory")}
                />
                {openSections.healthHistory && (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Medical Conditions</label>
                      <textarea
                        value={formData["medical-conditions"] || ""}
                        onChange={(e) => updateFormData("medical-conditions", e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="List current medical conditions..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Medications</label>
                      <textarea
                        value={formData["current-medications"] || ""}
                        onChange={(e) => updateFormData("current-medications", e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="List current medications with dosages..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Allergies</label>
                      <textarea
                        value={formData["allergies"] || ""}
                        onChange={(e) => updateFormData("allergies", e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="List known allergies..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Examination */}
              <div>
                <SectionHeader
                  title="Physical Examination"
                  isOpen={openSections.examination}
                  onToggle={() => toggleSection("examination")}
                />
                {openSections.examination && (
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Height (cm)</label>
                        <input
                          type="number"
                          value={formData["height"] || ""}
                          onChange={(e) => updateFormData("height", e.target.value)}
                          className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                        <input
                          type="number"
                          value={formData["weight"] || ""}
                          onChange={(e) => updateFormData("weight", e.target.value)}
                          className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">BMI</label>
                        <input
                          type="text"
                          value={calculateBMI()}
                          readOnly
                          className="w-full p-3 border border-input rounded-md bg-muted"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Blood Pressure</label>
                        <input
                          type="text"
                          value={formData["blood-pressure"] || ""}
                          onChange={(e) => updateFormData("blood-pressure", e.target.value)}
                          className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="e.g., 120/80"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Heart Rate</label>
                        <input
                          type="text"
                          value={formData["heart-rate"] || ""}
                          onChange={(e) => updateFormData("heart-rate", e.target.value)}
                          className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="bpm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Functional Assessment */}
              <div>
                <SectionHeader
                  title="Functional Assessment"
                  isOpen={openSections.functionalAssessment}
                  onToggle={() => toggleSection("functionalAssessment")}
                />
                {openSections.functionalAssessment && (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Communication</label>
                      <textarea
                        value={formData["communication"] || ""}
                        onChange={(e) => updateFormData("communication", e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Describe communication abilities and needs..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Mobility</label>
                      <textarea
                        value={formData["mobility"] || ""}
                        onChange={(e) => updateFormData("mobility", e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Describe mobility and physical function..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Daily Living Skills</label>
                      <textarea
                        value={formData["daily-living"] || ""}
                        onChange={(e) => updateFormData("daily-living", e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Describe activities of daily living capabilities..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Mental Health */}
              <div>
                <SectionHeader
                  title="Mental Health & Behavioral Assessment"
                  isOpen={openSections.mentalHealth}
                  onToggle={() => toggleSection("mentalHealth")}
                />
                {openSections.mentalHealth && (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Mental Health Status</label>
                      <textarea
                        value={formData["mental-health"] || ""}
                        onChange={(e) => updateFormData("mental-health", e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Describe mental health status and any concerns..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Behavioral Concerns</label>
                      <textarea
                        value={formData["behavioral-concerns"] || ""}
                        onChange={(e) => updateFormData("behavioral-concerns", e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Describe any behavioral concerns or challenges..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Care Planning */}
              <div>
                <SectionHeader
                  title="Care Planning & Recommendations"
                  isOpen={openSections.carePlanning}
                  onToggle={() => toggleSection("carePlanning")}
                />
                {openSections.carePlanning && (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Recommendations</label>
                      <textarea
                        value={formData["recommendations"] || ""}
                        onChange={(e) => updateFormData("recommendations", e.target.value)}
                        rows={5}
                        className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="List recommendations for ongoing care..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Follow-up Plan</label>
                      <textarea
                        value={formData["follow-up"] || ""}
                        onChange={(e) => updateFormData("follow-up", e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Describe follow-up plan and timeline..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-primary/20">
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button onClick={clearForm} variant="outline">
                    Clear Form
                  </Button>
                  <Button onClick={exportAsText} variant="outline">
                    Export as .txt
                  </Button>
                  <Button onClick={exportAsRTF} variant="outline">
                    Export as .rtf
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Privacy Notice:</strong> All assessment data is saved locally in your browser and never
              transmitted to our servers. Generated documents will be downloaded to your device for your records.
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/gpccmp">
              <Button variant="outline">← Back to Assessment Options</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
