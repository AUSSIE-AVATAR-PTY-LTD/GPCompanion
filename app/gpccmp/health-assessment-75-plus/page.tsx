"use client"

import { useState, useEffect, useCallback } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

interface FormData {
  [key: string]: string | boolean
}

interface AssessmentData {
  text: string
  title: string
}

interface DASSScores {
  d: number
  a: number
  s: number
}

export default function HealthAssessment75Plus() {
  const [formData, setFormData] = useState<FormData>({})
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    "mbs-selection": true,
    "patient-details": true,
    "history-medication": true,
    "clinical-functional": true,
    snap: true,
    immunisation: true,
    "plan-recommendations": true,
  })
  const [completedAssessments, setCompletedAssessments] = useState<AssessmentData[]>([])
  const [lastAutoRecs, setLastAutoRecs] = useState<string[]>([])
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [showAssessmentModal, setShowAssessmentModal] = useState(false)
  const [currentAssessment, setCurrentAssessment] = useState<{
    tool: string
    targetInputId: string
  } | null>(null)

  // Auto-save functionality
  useEffect(() => {
    const savedData = localStorage.getItem("75PlusHealthAssessmentData")
    if (savedData) {
      setShowRestoreModal(true)
    }
  }, [])

  const saveData = useCallback(() => {
    localStorage.setItem("75PlusHealthAssessmentData", JSON.stringify(formData))
  }, [formData])

  useEffect(() => {
    saveData()
  }, [formData, saveData])

  const restoreData = () => {
    const savedData = localStorage.getItem("75PlusHealthAssessmentData")
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
    setShowRestoreModal(false)
  }

  const discardData = () => {
    localStorage.removeItem("75PlusHealthAssessmentData")
    setShowRestoreModal(false)
  }

  const clearForm = () => {
    setFormData({})
    localStorage.removeItem("75PlusHealthAssessmentData")
    setShowClearModal(false)
  }

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const updateFormData = (key: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const getRadioValue = (name: string): string => {
    return (
      Object.keys(formData)
        .find((key) => key.startsWith(`${name}-`) && formData[key] === true)
        ?.replace(`${name}-`, "") || ""
    )
  }

  const setRadioValue = (name: string, value: string) => {
    // Clear all radio options for this name
    Object.keys(formData).forEach((key) => {
      if (key.startsWith(`${name}-`)) {
        updateFormData(key, false)
      }
    })
    // Set the selected option
    updateFormData(`${name}-${value}`, true)
  }

  // Age calculation
  const calculateAge = () => {
    const dob = formData["patient-dob"] as string
    if (!dob) return { age: null, error: "" }

    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--

    return {
      age,
      error: age < 75 ? "Patient under 75." : "",
    }
  }

  // BMI calculation
  const calculateBMI = () => {
    const height = Number.parseFloat(formData["height"] as string)
    const weight = Number.parseFloat(formData["weight"] as string)

    if (height > 0 && weight > 0) {
      const heightM = height / 100
      const bmi = weight / (heightM * heightM)

      let interpretation = ""
      if (bmi < 18.5) interpretation = "Underweight"
      else if (bmi < 25) interpretation = "Normal weight"
      else if (bmi < 30) interpretation = "Overweight"
      else interpretation = "Obese"

      return { bmi: bmi.toFixed(1), interpretation }
    }
    return { bmi: "N/A", interpretation: "" }
  }

  // Generate management plan recommendations
  const generateAutoRecommendations = (): string[] => {
    const recs: string[] = []

    // Add recommendations based on form data
    if (formData["hmr-checkbox"]) {
      recs.push("- Consideration of referral for DMMR (Item 900).")
    }

    const rhythm = formData["pulse-rhythm"] as string
    if (rhythm === "Irregularly Irregular" || rhythm === "Regularly Irregular") {
      recs.push(
        "- Irregular pulse detected. Recommend ECG and further evaluation for arrhythmia (e.g., Atrial Fibrillation).",
      )
    }

    const { bmi } = calculateBMI()
    if (bmi !== "N/A") {
      const bmiValue = Number.parseFloat(bmi)
      if (bmiValue < 18.5)
        recs.push(
          "- Patient is underweight (BMI < 18.5). Consider investigating for underlying causes and nutritional support.",
        )
      if (bmiValue >= 25 && bmiValue < 30)
        recs.push("- Patient is overweight (BMI 25-29.9). Provide lifestyle advice on diet and exercise.")
      if (bmiValue >= 30)
        recs.push(
          "- Patient is obese (BMI >= 30). Consider comprehensive management plan including dietitian referral and exercise physiologist.",
        )
    }

    if (getRadioValue("falls-risk") === "yes") {
      recs.push("- Assess mobility and falls risk further; consider OT referral.")
    }

    if (formData["smoking-status"] === "current") {
      recs.push("- Smoking cessation advice offered and patient provided with resources.")
    }

    return recs
  }

  // Update management plan with auto-recommendations
  const updateManagementPlan = () => {
    const newAutoRecs = generateAutoRecommendations()
    const currentText = (formData["plan-recommendations"] as string) || ""

    // Remove old auto-recommendations
    let userText = currentText
    if (lastAutoRecs.length > 0) {
      const autoRecsBlock = lastAutoRecs.join("\n")
      if (currentText.startsWith(autoRecsBlock)) {
        userText = currentText.substring(autoRecsBlock.length).trim()
      }
    }

    // Add new auto-recommendations
    let combinedText = newAutoRecs.join("\n")
    if (combinedText && userText) {
      combinedText += "\n\n"
    }
    combinedText += userText

    updateFormData("plan-recommendations", combinedText)
    setLastAutoRecs(newAutoRecs)
  }

  // Export functionality
  const generateReport = (): string => {
    const getValue = (key: string) => (formData[key] as string) || ""
    const isChecked = (key: string) => (formData[key] as boolean) || false
    const formatDate = (dateString: string) => {
      if (!dateString) return "N/A"
      const [year, month, day] = dateString.split("-")
      return `${day}/${month}/${year}`
    }

    let report = "75+ HEALTH ASSESSMENT\n\n"

    report += `MBS Item Number: ${getRadioValue("mbs-item") || "N/A"}\n\n`

    // Patient Details
    const { age } = calculateAge()
    report += "PATIENT DETAILS:\n"
    report += `- Name: ${getValue("patient-name") || "N/A"}\n`
    report += `- DOB: ${formatDate(getValue("patient-dob"))}\n`
    report += `- Age: ${age || "N/A"}\n`
    report += `- Gender: ${getValue("patient-gender") || "N/A"}\n`
    report += `- Medicare: ${getValue("patient-medicare") || "N/A"}\n`
    report += `- Date: ${formatDate(getValue("assessment-date"))}\n`
    report += `- Aboriginal and/or Torres Strait Islander origin: ${isChecked("atsi-origin") ? "Yes" : "No"}\n\n`

    // History & Medication
    if (getValue("past-medical-history")) {
      report += "PAST MEDICAL HISTORY:\n"
      report += `${getValue("past-medical-history")}\n\n`
    }

    if (getValue("regular-medications")) {
      report += "REGULAR MEDICATIONS:\n"
      report += `${getValue("regular-medications")}\n\n`
    }

    // Vitals & Anthropometry
    const vitals: string[] = []
    if (getValue("bp")) vitals.push(`BP: ${getValue("bp")} mmHg`)
    if (getValue("pulse-rate")) vitals.push(`Pulse: ${getValue("pulse-rate")} bpm, Rhythm: ${getValue("pulse-rhythm")}`)
    if (getValue("height")) vitals.push(`Height: ${getValue("height")} cm`)
    if (getValue("weight")) vitals.push(`Weight: ${getValue("weight")} kg`)

    const { bmi, interpretation } = calculateBMI()
    if (bmi !== "N/A") {
      vitals.push(`BMI: ${bmi} kg/m² (${interpretation})`)
    }

    if (vitals.length > 0) {
      report += "VITALS & ANTHROPOMETRY:\n"
      vitals.forEach((vital) => (report += `- ${vital}\n`))
      report += "\n"
    }

    // Plan & Recommendations
    if (getValue("plan-recommendations")) {
      report += "PLAN & RECOMMENDATIONS:\n"
      report += `${getValue("plan-recommendations")}\n\n`
    }

    return report.trim()
  }

  const exportTxt = () => {
    const report = generateReport()
    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `75Plus_Health_Assessment_${formData["patient-name"] || "Patient"}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportRtf = () => {
    const plainText = generateReport()
    const rtfContent = convertToRtf(plainText)
    const blob = new Blob([rtfContent], { type: "application/rtf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `75Plus_Health_Assessment_${formData["patient-name"] || "Patient"}.rtf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const convertToRtf = (plainText: string): string => {
    const rtf = plainText.replace(/\\/g, "\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}")

    const lines = rtf.split("\n")
    const rtfLines = lines.map((line) => {
      const trimmedLine = line.trim()

      if (trimmedLine.match(/^[A-Z\s&'(),-]{5,}:$/)) {
        return `{\\pard\\sa100\\sl276\\slmult1\\b\\ul ${trimmedLine.slice(0, -1)}\\ul0\\b0\\par}`
      }

      if (trimmedLine.startsWith("- ")) {
        return `{\\pard\\fi-360\\li720\\sa100\\sl276\\slmult1 -\\tab ${trimmedLine.substring(2)}\\par}`
      }

      if (trimmedLine.length > 0) {
        return `{\\pard\\sa100\\sl276\\slmult1 ${trimmedLine}\\par}`
      }
      return "\\par"
    })

    const rtfBody = rtfLines.join("\n")
    return `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Inter;}}\\fs22\\sl360\\slmult1\n${rtfBody}\n}`
  }

  const SectionHeader = ({ title, sectionId }: { title: string; sectionId: string }) => (
    <div
      className="bg-transparent text-xl font-bold text-primary px-6 py-3 flex justify-between items-center cursor-pointer border-b border-primary/20"
      onClick={() => toggleSection(sectionId)}
    >
      <h2>{title}</h2>
      <ChevronDown className={`w-6 h-6 transition-transform ${openSections[sectionId] ? "rotate-180" : ""}`} />
    </div>
  )

  const { age, error: ageError } = calculateAge()
  const { bmi, interpretation: bmiInterpretation } = calculateBMI()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">75+ Health Assessment</h1>
            <p className="text-muted-foreground">GP Health Assessment Tool</p>
            <p className="text-sm font-semibold text-muted-foreground mt-4">Developed by Dr Bobby Tork MD, FRACGP-RG</p>
            <p className="text-xs text-muted-foreground">&copy; 2025 Dr Bobby Tork</p>
          </div>

          {/* MBS Selection */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="MBS Item Number" sectionId="mbs-selection" />
            {openSections["mbs-selection"] && (
              <CardContent className="p-6">
                <label className="block text-lg font-medium text-foreground mb-3">
                  Select the appropriate MBS item number based on consultation time:
                </label>
                <div className="space-y-3">
                  {[
                    { value: "701", label: "Item 701 - Brief health assessment (less than 30 minutes)" },
                    { value: "703", label: "Item 703 - Standard health assessment (30 to 45 minutes)" },
                    { value: "705", label: "Item 705 - Long health assessment (46 to 60 minutes)" },
                    { value: "707", label: "Item 707 - Prolonged health assessment (more than 60 minutes)" },
                  ].map((item) => (
                    <label key={item.value} className="flex items-center">
                      <input
                        type="radio"
                        name="mbs-item"
                        value={item.value}
                        checked={getRadioValue("mbs-item") === item.value}
                        onChange={() => setRadioValue("mbs-item", item.value)}
                        className="h-4 w-4 text-primary focus:ring-primary border-border rounded mr-3"
                      />
                      <span className="font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg text-sm text-primary">
                  This health assessment is available annually to an eligible patient.
                </div>
              </CardContent>
            )}
          </Card>

          {/* Patient Details */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="Patient Details" sectionId="patient-details" />
            {openSections["patient-details"] && (
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Name: <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={(formData["patient-name"] as string) || ""}
                      onChange={(e) => updateFormData("patient-name", e.target.value)}
                      className="w-full p-2 bg-muted border border-border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Assessment Date:</label>
                    <input
                      type="date"
                      value={(formData["assessment-date"] as string) || new Date().toISOString().slice(0, 10)}
                      onChange={(e) => updateFormData("assessment-date", e.target.value)}
                      className="w-full p-2 bg-muted border border-border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">DOB:</label>
                    <input
                      type="date"
                      value={(formData["patient-dob"] as string) || ""}
                      onChange={(e) => updateFormData("patient-dob", e.target.value)}
                      className="w-full p-2 bg-muted border border-border rounded-md"
                    />
                  </div>
                  <div>
                    <div className="p-3 bg-muted rounded-md text-center font-medium min-h-[50px] flex items-center justify-center">
                      {age ? `Age: ${age}` : "Age will be calculated"}
                    </div>
                    {ageError && <div className="text-destructive text-sm text-center mt-1">{ageError}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Medicare No: <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={(formData["patient-medicare"] as string) || ""}
                      onChange={(e) => updateFormData("patient-medicare", e.target.value)}
                      className="w-full p-2 bg-muted border border-border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Gender:</label>
                    <select
                      value={(formData["patient-gender"] as string) || ""}
                      onChange={(e) => updateFormData("patient-gender", e.target.value)}
                      className="w-full p-2 bg-muted border border-border rounded-md"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["atsi-origin"] as boolean) || false}
                        onChange={(e) => updateFormData("atsi-origin", e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      Aboriginal and/or Torres Strait Islander origin
                    </label>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* History & Medication */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="History & Medication" sectionId="history-medication" />
            {openSections["history-medication"] && (
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Past Medical History:</label>
                    <textarea
                      value={(formData["past-medical-history"] as string) || ""}
                      onChange={(e) => updateFormData("past-medical-history", e.target.value)}
                      className="w-full p-2 bg-muted border border-border rounded-md h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Regular Medications:</label>
                    <textarea
                      value={(formData["regular-medications"] as string) || ""}
                      onChange={(e) => updateFormData("regular-medications", e.target.value)}
                      className="w-full p-2 bg-muted border border-border rounded-md h-24"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["meds-reviewed-checkbox"] as boolean) || false}
                        onChange={(e) => updateFormData("meds-reviewed-checkbox", e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      Medication list reviewed and reconciled with patient.
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["hmr-checkbox"] as boolean) || false}
                        onChange={(e) => {
                          updateFormData("hmr-checkbox", e.target.checked)
                          setTimeout(updateManagementPlan, 100)
                        }}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      Home Medication Review (HMR) recommended (Item 900)
                    </label>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Clinical & Functional Assessment */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="Clinical & Functional Assessment" sectionId="clinical-functional" />
            {openSections["clinical-functional"] && (
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-4 border-b border-border pb-2">
                      Vitals & Anthropometry
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-start">
                      <div>
                        <label className="block font-medium mb-1">BP (mmHg):</label>
                        <input
                          type="text"
                          value={(formData["bp"] as string) || ""}
                          onChange={(e) => updateFormData("bp", e.target.value)}
                          placeholder="e.g. 130/80"
                          className="w-full p-2 bg-muted border border-border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Pulse (bpm):</label>
                        <input
                          type="text"
                          value={(formData["pulse-rate"] as string) || ""}
                          onChange={(e) => updateFormData("pulse-rate", e.target.value)}
                          placeholder="e.g. 70"
                          className="w-full p-2 bg-muted border border-border rounded-md"
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <label className="block font-medium mb-1">Rhythm:</label>
                        <select
                          value={(formData["pulse-rhythm"] as string) || "Regular"}
                          onChange={(e) => {
                            updateFormData("pulse-rhythm", e.target.value)
                            setTimeout(updateManagementPlan, 100)
                          }}
                          className="w-full p-2 bg-muted border border-border rounded-md"
                        >
                          <option value="Regular">Regular</option>
                          <option value="Irregularly Irregular">Irregularly Irregular</option>
                          <option value="Regularly Irregular">Regularly Irregular</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Height (cm):</label>
                        <input
                          type="number"
                          value={(formData["height"] as string) || ""}
                          onChange={(e) => {
                            updateFormData("height", e.target.value)
                            setTimeout(updateManagementPlan, 100)
                          }}
                          placeholder="e.g. 170"
                          className="w-full p-2 bg-muted border border-border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Weight (kg):</label>
                        <input
                          type="number"
                          value={(formData["weight"] as string) || ""}
                          onChange={(e) => {
                            updateFormData("weight", e.target.value)
                            setTimeout(updateManagementPlan, 100)
                          }}
                          placeholder="e.g. 75"
                          className="w-full p-2 bg-muted border border-border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">BMI (kg/m²):</label>
                        <div className="p-3 bg-muted rounded-md text-center font-medium min-h-[50px] flex items-center justify-center">
                          {bmi}
                        </div>
                        <div
                          className={`text-sm text-center mt-1 font-medium ${
                            bmiInterpretation === "Normal weight"
                              ? "text-green-600"
                              : bmiInterpretation === "Overweight"
                                ? "text-yellow-600"
                                : bmiInterpretation === "Obese"
                                  ? "text-red-600"
                                  : bmiInterpretation === "Underweight"
                                    ? "text-blue-600"
                                    : ""
                          }`}
                        >
                          {bmiInterpretation}
                        </div>
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Waist (cm):</label>
                        <input
                          type="number"
                          value={(formData["waist-circumference"] as string) || ""}
                          onChange={(e) => updateFormData("waist-circumference", e.target.value)}
                          placeholder="e.g. 90"
                          className="w-full p-2 bg-muted border border-border rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-4 border-b border-border pb-2">
                      Physical Function
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <span className="font-medium">Has the patient had a fall in the last 3 months?</span>
                        <div className="flex space-x-4 mt-1">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="falls-risk"
                              checked={getRadioValue("falls-risk") === "yes"}
                              onChange={() => {
                                setRadioValue("falls-risk", "yes")
                                setTimeout(updateManagementPlan, 100)
                              }}
                              className="mr-2"
                            />
                            Yes
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="falls-risk"
                              checked={getRadioValue("falls-risk") === "no"}
                              onChange={() => {
                                setRadioValue("falls-risk", "no")
                                setTimeout(updateManagementPlan, 100)
                              }}
                              className="mr-2"
                            />
                            No
                          </label>
                        </div>
                        {getRadioValue("falls-risk") === "yes" && (
                          <div className="mt-2 pl-6">
                            <textarea
                              value={(formData["falls-details"] as string) || ""}
                              onChange={(e) => updateFormData("falls-details", e.target.value)}
                              placeholder="Details of fall(s)..."
                              className="w-full p-2 bg-muted border border-border rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* SNAP */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="SNAP" sectionId="snap" />
            {openSections["snap"] && (
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["assess-smoking"] as boolean) || false}
                        onChange={(e) => updateFormData("assess-smoking", e.target.checked)}
                        className="h-4 w-4 text-primary mr-3"
                      />
                      <label className="font-semibold text-foreground">S - Smoking Status</label>
                    </div>
                    {formData["assess-smoking"] && (
                      <div className="mt-2 pl-6">
                        <select
                          value={(formData["smoking-status"] as string) || ""}
                          onChange={(e) => {
                            updateFormData("smoking-status", e.target.value)
                            setTimeout(updateManagementPlan, 100)
                          }}
                          className="w-full p-2 bg-muted border border-border rounded-md"
                        >
                          <option value="">Select status...</option>
                          <option value="current">Current Smoker</option>
                          <option value="ex">Ex-smoker</option>
                          <option value="non">Non-smoker</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Plan & Recommendations */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="Plan & Recommendations" sectionId="plan-recommendations" />
            {openSections["plan-recommendations"] && (
              <CardContent className="p-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Detail the management plan, referrals, and follow-up actions:
                  </label>
                  <textarea
                    value={(formData["plan-recommendations"] as string) || ""}
                    onChange={(e) => updateFormData("plan-recommendations", e.target.value)}
                    className="w-full p-2 bg-muted border border-border rounded-md h-48"
                  />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mb-8">
            <Button variant="outline" onClick={() => setShowClearModal(true)}>
              Clear Form
            </Button>
            <Button onClick={exportTxt} className="bg-green-600 hover:bg-green-700">
              Export as .txt
            </Button>
            <Button onClick={exportRtf} className="bg-blue-600 hover:bg-blue-700">
              Export as .rtf
            </Button>
          </div>

          {/* Privacy Notice */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Privacy Notice:</strong> All assessment data is saved locally in your browser and never
              transmitted to our servers. Generated documents will be downloaded to your device for your records.
            </p>
          </div>
        </div>
      </div>

      {/* Restore Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-2">Saved Data Found</h3>
            <p className="text-muted-foreground mb-4">Would you like to restore your previous session?</p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={discardData}>
                Discard
              </Button>
              <Button onClick={restoreData}>Restore</Button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-2">Are you sure?</h3>
            <p className="text-muted-foreground mb-4">All entered data will be lost. This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => setShowClearModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={clearForm}>
                Clear Form
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
