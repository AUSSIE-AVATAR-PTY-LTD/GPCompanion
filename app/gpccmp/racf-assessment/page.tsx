"use client"

import { useState, useEffect, useCallback } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import Link from "next/link"

interface FormData {
  [key: string]: string | boolean
}

interface AssessmentData {
  title: string
  text: string
}

interface SectionHeaderProps {
  title: string
  isOpen: boolean
  onToggle: () => void
}

const SectionHeader = ({ title, isOpen, onToggle }: SectionHeaderProps) => (
  <div
    className="bg-transparent text-xl font-bold text-primary px-6 py-3 flex justify-between items-center cursor-pointer border-b border-primary/20"
    onClick={onToggle}
  >
    <h2>{title}</h2>
    {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
  </div>
)

// Assessment templates for modal functionality
const assessmentTemplates = {
  MMSE: {
    title: "Standardised Mini-Mental State Examination (SMMSE)",
    maxScore: 30,
    getInterpretation: (score: number) => {
      if (score >= 24) return "Score does not suggest significant cognitive impairment."
      if (score >= 18) return "Score suggests mild cognitive impairment."
      if (score >= 10) return "Score suggests moderate cognitive impairment."
      return "Score suggests severe cognitive impairment."
    },
  },
  MoCA: {
    title: "Montreal Cognitive Assessment (MoCA)",
    maxScore: 30,
    getInterpretation: (score: number) => {
      if (score >= 26) return "Score is within the normal range."
      return "Score < 26 suggests mild cognitive impairment."
    },
  },
  K10: {
    title: "Kessler Psychological Distress Scale (K10)",
    maxScore: 50,
    getInterpretation: (score: number) => {
      if (score <= 19) return "Score suggests the patient is likely to be well."
      if (score <= 24) return "Score suggests a mild mental disorder."
      if (score <= 29) return "Score suggests a moderate mental disorder."
      return "Score suggests a severe mental disorder."
    },
  },
  GDS: {
    title: "Geriatric Depression Scale (GDS-15)",
    maxScore: 15,
    getInterpretation: (score: number) => {
      if (score <= 5) return "Score is within the normal range."
      return "Score > 5 is suggestive of depression and warrants a follow-up comprehensive assessment."
    },
  },
  DASS21: {
    title: "Depression Anxiety Stress Scales (DASS-21)",
    maxScore: 42,
    getInterpretation: (scores: { d: number; a: number; s: number }) => {
      const { d, a, s } = scores
      const interp = []
      if (d <= 9) interp.push("Depression: Normal")
      else if (d <= 13) interp.push("Depression: Mild")
      else if (d <= 20) interp.push("Depression: Moderate")
      else if (d <= 27) interp.push("Depression: Severe")
      else interp.push("Depression: Extremely Severe")

      if (a <= 7) interp.push("Anxiety: Normal")
      else if (a <= 9) interp.push("Anxiety: Mild")
      else if (a <= 14) interp.push("Anxiety: Moderate")
      else if (a <= 19) interp.push("Anxiety: Severe")
      else interp.push("Anxiety: Extremely Severe")

      if (s <= 14) interp.push("Stress: Normal")
      else if (s <= 18) interp.push("Stress: Mild")
      else if (s <= 25) interp.push("Stress: Moderate")
      else if (s <= 33) interp.push("Stress: Severe")
      else interp.push("Stress: Extremely Severe")

      return interp.join("; ")
    },
  },
}

export default function RACFAssessmentPage() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    mbs: true,
    patient: true,
    history: true,
    clinical: true,
    physical: true,
    social: true,
    psychological: true,
    snap: true,
    immunisation: true,
    plan: true,
  })
  const [formData, setFormData] = useState<FormData>({})
  const [completedAssessments, setCompletedAssessments] = useState<AssessmentData[]>([])
  const [showModal, setShowModal] = useState<string | null>(null)
  const [showClearModal, setShowClearModal] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [otherImmunisations, setOtherImmunisations] = useState<string[]>([])

  const LOCAL_STORAGE_KEY = "racfHealthAssessmentData"

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const updateFormData = useCallback((key: string, value: string | boolean) => {
    setFormData((prev) => {
      const newData = { ...prev, [key]: value }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData))
      return newData
    })
  }, [])

  const calculateAge = (dob: string): string => {
    if (!dob) return "Age will be calculated"
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
    return `Age: ${age}`
  }

  const calculateBMI = (height: string, weight: string): string => {
    const h = Number.parseFloat(height)
    const w = Number.parseFloat(weight)
    if (h > 0 && w > 0) {
      const heightInMeters = h / 100
      const bmi = w / (heightInMeters * heightInMeters)
      let interpretation = ""
      if (bmi < 18.5) interpretation = " (Underweight)"
      else if (bmi >= 18.5 && bmi <= 24.9) interpretation = " (Healthy Weight)"
      else if (bmi >= 25 && bmi <= 29.9) interpretation = " (Overweight)"
      else if (bmi >= 30) interpretation = " (Obese)"
      return `BMI: ${bmi.toFixed(1)}${interpretation}`
    }
    return "BMI will be calculated"
  }

  const formatAusDate = (dateString: string): string => {
    if (!dateString) return "N/A"
    const [year, month, day] = dateString.split("-")
    return `${day}/${month}/${year}`
  }

  const generateReport = (): string => {
    let report = "Health assessment for permanent residents of residential aged care facilities\n"
    report += `MBS Item Number: ${formData["mbs-item"] || "N/A"}\n\n`

    // Patient Details
    report += "PATIENT DETAILS:\n"
    report += `- Name: ${formData["patient-name"] || "N/A"}\n`
    report += `- DOB: ${formatAusDate(formData["patient-dob"] as string)}\n`
    report += `- Age: ${calculateAge(formData["patient-dob"] as string).replace("Age: ", "")}\n`
    report += `- Gender: ${formData["patient-gender"] || "N/A"}\n`
    report += `- Medicare: ${formData["patient-medicare"] || "N/A"}\n`
    report += `- Date: ${formatAusDate(formData["assessment-date"] as string)}\n`
    report += `- Aboriginal and/or Torres Strait Islander origin: ${formData["atsi-origin"] ? "Yes" : "No"}\n\n`

    // History & Medication
    if (formData["past-medical-history"]) {
      report += "PAST MEDICAL HISTORY:\n"
      report += `${formData["past-medical-history"]}\n\n`
    }

    if (formData["regular-medications"]) {
      report += "REGULAR MEDICATIONS:\n"
      report += `${formData["regular-medications"]}\n\n`
    }

    // Medication Review
    const medReview = []
    if (formData["meds-reviewed"]) medReview.push("Medication list reviewed and reconciled with patient.")
    if (formData["hmr-recommended"]) medReview.push("Home Medication Review (HMR) recommended (Item Number 900).")
    if (medReview.length > 0) {
      report += "MEDICATION REVIEW:\n"
      medReview.forEach((item) => (report += `- ${item}\n`))
      report += "\n"
    }

    // Clinical Assessment
    report += "VITALS & EXAMINATIONS:\n"
    if (formData["bp"]) report += `- BP: ${formData["bp"]} mmHg\n`
    if (formData["pulse-rate"])
      report += `- Pulse: ${formData["pulse-rate"]} bpm, Rhythm: ${formData["pulse-rhythm"]}\n`
    if (formData["height"]) report += `- Height: ${formData["height"]} cm\n`
    if (formData["weight"]) report += `- Weight: ${formData["weight"]} kg\n`
    if (formData["height"] && formData["weight"]) {
      report += `- ${calculateBMI(formData["height"] as string, formData["weight"] as string)}\n`
    }
    report += `- Recent unintentional weight changes: ${formData["weight-change"] || "N/A"}\n`

    // Add examination details
    if (formData["ecg-performed"])
      report += `- ECG Interpretation: ${formData["ecg-interpretation"] || "Not specified"}\n`
    if (formData["abi-performed"])
      report += `- ABI: Left ${formData["abi-left"] || "N/A"}, Right ${formData["abi-right"] || "N/A"}\n`
    if (formData["cardio-exam"])
      report += `- Cardiovascular Exam: ${formData["cardio-exam-details"] || "Not specified"}\n`
    if (formData["resp-exam"]) report += `- Respiratory Exam: ${formData["resp-exam-details"] || "Not specified"}\n`
    if (formData["neuro-exam"]) report += `- Neurological Exam: ${formData["neuro-exam-details"] || "Not specified"}\n`
    if (formData["msk-exam"]) report += `- Musculoskeletal Exam: ${formData["msk-exam-details"] || "Not specified"}\n`
    if (formData["abdo-exam"]) report += `- Abdominal Exam: ${formData["abdo-exam-details"] || "Not specified"}\n`
    if (formData["other-exam"]) report += `- Other Exam: ${formData["other-exam-details"] || "Not specified"}\n`
    report += "\n"

    // Physical Function
    const physicalFunc = []
    physicalFunc.push(
      `Falls History: ${formData["falls-risk"] === "yes" ? `Fall in last 3 months. Details: ${formData["falls-details"] || "N/A"}` : "No falls in last 3 months."}`,
    )
    if (formData["adls-assessed"])
      physicalFunc.push(
        `ADLs: ${formData["adls-status"]}${formData["adls-status"] === "Dependent" ? `. Details: ${formData["adls-details"] || "N/A"}` : "."}`,
      )
    if (formData["continence-assessed"])
      physicalFunc.push(
        `Continence: ${formData["continence-status"]}${formData["continence-status"] === "Incontinent" ? `. Details: ${formData["continence-details"] || "N/A"}` : "."}`,
      )
    if (formData["chronic-pain"])
      physicalFunc.push(`Chronic Pain: Assessed. Details: ${formData["chronic-pain-details"] || "Not specified"}`)
    if (formData["pressure-risk"])
      physicalFunc.push(
        `Pressure Injury Risk: Assessed. High Risk: ${formData["pressure-high-risk"] || "N/A"}. Details: ${formData["pressure-risk-details"] || "Not specified"}`,
      )
    if (formData["vision-checked"])
      physicalFunc.push(
        `Vision checked: ${formData["vision-correction"] || "N/A"}, R:${formData["vision-va-r"]}, L:${formData["vision-va-l"]}, B:${formData["vision-va-b"]}`,
      )
    if (formData["hearing-checked"])
      physicalFunc.push(`Hearing: ${formData["hearing-status"]}${formData["hearing-aid-used"] ? " (uses aid)" : ""}`)
    if (formData["dental-assessed"])
      physicalFunc.push(`Dental health assessed. Details: ${formData["dental-details"] || "Not specified"}`)
    if (formData["foot-assessed"])
      physicalFunc.push(`Foot health assessed. Details: ${formData["foot-details"] || "Not specified"}`)
    if (formData["other-physical-assessment"])
      physicalFunc.push(`Other Physical Assessment: ${formData["other-physical-assessment"]}`)

    if (physicalFunc.length > 0) {
      report += "PHYSICAL FUNCTION:\n"
      physicalFunc.forEach((item) => (report += `- ${item}\n`))
      report += "\n"
    }

    // Social Function
    const socialFunc = []
    let visitorsText = `Regular visitors: ${formData["visitors-status"]}`
    if (formData["visitors-status"] === "yes") visitorsText += `. Details: ${formData["visitors-details"] || "N/A"}`
    socialFunc.push(visitorsText)

    let socialIsoText = `Feels lonely/isolated: ${formData["social-isolation"]}`
    if (formData["social-isolation"] === "yes")
      socialIsoText += `. Details: ${formData["social-isolation-details"] || "N/A"}`
    socialFunc.push(socialIsoText)

    socialFunc.push(
      `Advanced Care Plan: ${formData["acp"] === "yes" ? `Yes. Status: ${formData["resuscitation-status"] || "N/A"}` : "No"}`,
    )

    if (formData["other-social-assessment"])
      socialFunc.push(`Other Social Assessment: ${formData["other-social-assessment"]}`)

    if (socialFunc.length > 0) {
      report += "SOCIAL FUNCTION:\n"
      socialFunc.forEach((item) => (report += `- ${item}\n`))
      report += "\n"
    }

    // Psychological Function
    const psychFunc = []
    if (formData["cognition-assessed"] && formData["cognition-tool"]) {
      psychFunc.push(`Cognition Screen (${formData["cognition-tool"]}): ${formData["cognition-score"] || "N/A"}`)
    }
    if (formData["mood-assessed"] && formData["mood-tool"]) {
      psychFunc.push(`Mood Screen (${formData["mood-tool"]}): ${formData["mood-score"] || "N/A"}`)
    }

    if (psychFunc.length > 0) {
      report += "PSYCHOLOGICAL FUNCTION:\n"
      psychFunc.forEach((item) => (report += `- ${item}\n`))
      report += "\n"
    }

    // SNAP
    const snap = []
    if (formData["assess-smoking"]) snap.push(`Smoking: ${formData["smoking-status"]}`)
    if (formData["assess-nutrition"])
      snap.push(
        `Nutrition: ${formData["nutrition-status"]}. Details: ${formData["nutrition-details"] || "Not specified"}`,
      )
    if (formData["assess-alcohol"])
      snap.push(`Alcohol: ${formData["alcohol-drinks"]} std drinks / ${formData["alcohol-period"]}`)
    if (formData["assess-activity"]) snap.push(`Physical Activity: ${formData["activity-minutes"]} mins/week`)

    if (snap.length > 0) {
      report += "SNAP (SMOKING, NUTRITION, ALCOHOL, PHYSICAL ACTIVITY):\n"
      snap.forEach((item) => (report += `- ${item}\n`))
      report += "\n"
    }

    // Immunisation Status
    const immunisationStatus = []
    if (formData["influenza-utd"]) immunisationStatus.push("Influenza: Up to date")
    if (formData["tetanus-utd"]) immunisationStatus.push("Tetanus: Up to date")
    if (formData["pneumococcus-utd"]) immunisationStatus.push("Pneumococcus: Up to date")
    if (formData["covid-utd"]) immunisationStatus.push("COVID-19: Up to date")
    if (formData["shingrix-utd"]) immunisationStatus.push("Shingrix: Up to date")

    if (immunisationStatus.length > 0) {
      report += "IMMUNISATION STATUS:\n"
      immunisationStatus.forEach((item) => (report += `- ${item}\n`))
      report += "\n"
    }

    // Plan & Recommendations
    if (formData["plan-recommendations"]) {
      report += "PLAN & RECOMMENDATIONS:\n"
      report += `${formData["plan-recommendations"]}\n\n`
    }

    return report.trim()
  }

  const exportReport = (format: "txt" | "rtf") => {
    const reportText = generateReport()
    const patientName = (formData["patient-name"] as string)?.trim().replace(/ /g, "_") || "report"
    const fileName = `RACF_HealthAssessment_${patientName}`

    if (format === "rtf") {
      const rtfContent = convertToRtf(reportText, completedAssessments)
      downloadFile(`${fileName}.rtf`, rtfContent, "application/rtf")
    } else {
      downloadFile(`${fileName}.txt`, reportText, "text/plain")
    }
  }

  const convertToRtf = (plainText: string, assessmentsArray: AssessmentData[]): string => {
    const lines = plainText.split("\n")

    // Extract and remove the MBS line from the main text body for special formatting
    const mbsLineIndex = lines.findIndex((line) => line.startsWith("MBS Item Number:"))
    let mbsLine = ""
    if (mbsLineIndex !== -1) {
      mbsLine = lines.splice(mbsLineIndex, 1)[0]
      // Also remove the blank line that follows it
      if (lines[mbsLineIndex] === "") {
        lines.splice(mbsLineIndex, 1)
      }
    }

    // The first line is now the title, which we will replace
    lines.shift()

    let rtfBody = ""
    const newTitle = "Health assessment for permanent residents of residential aged care facilities"

    // Add formatted title (Size 16 = 32 half-points)
    rtfBody += `{\\pard\\qc\\b\\fs32 ${newTitle.replace(/\\/g, "\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}")}\\b0\\par}\n`

    // Add formatted MBS number (Size 12 = 24 half-points)
    if (mbsLine) {
      rtfBody += `{\\pard\\qc\\fs24 ${mbsLine.replace(/\\/g, "\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}")}\\par}\\par\n`
    }

    // Process the rest of the lines
    const rtf = lines.join("\n").replace(/\\/g, "\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}")
    const remainingRtfLines = rtf.split("\n").map((line) => {
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
      return "{\\pard\\sa100\\par}" // Use this for blank lines to ensure spacing
    })

    rtfBody += remainingRtfLines.join("\n")

    // Append assessments on new pages
    if (assessmentsArray && assessmentsArray.length > 0) {
      assessmentsArray.forEach((assessmentData) => {
        if (assessmentData && assessmentData.text) {
          rtfBody += "\\page\n"
          const titleRtf = assessmentData.title.replace(/\\/g, "\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}")
          rtfBody += `{\\pard\\sa200\\sl276\\slmult1\\b\\f0\\fs28 ${titleRtf}\\b0\\par}\\par\n`

          const assessmentRtf = assessmentData.text
            .replace(/\\/g, "\\\\")
            .replace(/{/g, "\\{")
            .replace(/}/g, "\\}")
            .split("\n")
            .map((line) => {
              if (line.trim() === "") return "{\\pard\\sa100\\par}"
              return `{\\pard\\sa100\\sl276\\slmult1\\fi0 ${line.trim()}\\par}`
            })
            .join("\n")
          rtfBody += assessmentRtf
        }
      })
    }

    return `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Inter;}}\\fs22\\sl360\\slmult1\n${rtfBody}\n}`
  }

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const element = document.createElement("a")
    const blob = new Blob([content], { type: mimeType })
    element.href = URL.createObjectURL(blob)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const clearForm = () => {
    setFormData({})
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    setCompletedAssessments([])
    setOtherImmunisations([])
    setShowClearModal(false)
  }

  const openAssessmentModal = (tool: string) => {
    setShowModal(tool)
  }

  const closeAssessmentModal = () => {
    setShowModal(null)
  }

  const addOtherImmunisation = () => {
    setOtherImmunisations([...otherImmunisations, ""])
  }

  const updateOtherImmunisation = (index: number, value: string) => {
    const updated = [...otherImmunisations]
    updated[index] = value
    setOtherImmunisations(updated)
  }

  const removeOtherImmunisation = (index: number) => {
    const updated = otherImmunisations.filter((_, i) => i !== index)
    setOtherImmunisations(updated)
  }

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData)
        setShowRestoreModal(true)
      } catch (error) {
        console.error("Error loading saved data:", error)
      }
    }
  }, [])

  const restoreSession = () => {
    setShowRestoreModal(false)
  }

  const startFresh = () => {
    setFormData({})
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    setShowRestoreModal(false)
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">
              Health assessment for permanent residents of residential aged care facilities
            </h1>
            <p className="text-muted-foreground">GP Health Assessment Tool</p>
            <p className="text-sm font-semibold mt-4">Developed by Dr Bobby Tork MD, FRACGP-RG</p>
            <p className="text-xs text-muted-foreground mt-1">© 2025 Dr Bobby Tork</p>
          </div>

          {/* MBS Item Selection */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="MBS Item Number" isOpen={openSections.mbs} onToggle={() => toggleSection("mbs")} />
            {openSections.mbs && (
              <CardContent className="p-6">
                <label className="block text-lg font-medium mb-3">
                  Select the appropriate MBS item number based on consultation time:
                </label>
                <div className="space-y-3">
                  {[
                    { value: "701", label: "Item 701 - Brief health assessment lasting no more than 30 minutes" },
                    {
                      value: "703",
                      label:
                        "Item 703 - Standard health assessment lasting at least 30 minutes and less than 45 minutes",
                    },
                    {
                      value: "705",
                      label: "Item 705 - Long health assessment lasting at least 45 minutes and less than 60 minutes",
                    },
                    { value: "707", label: "Item 707 - Prolonged health assessment lasting more than 60 minutes" },
                  ].map((item) => (
                    <label key={item.value} className="flex items-center">
                      <input
                        type="radio"
                        name="mbs-item"
                        value={item.value}
                        checked={formData["mbs-item"] === item.value}
                        onChange={(e) => updateFormData("mbs-item", e.target.value)}
                        className="h-4 w-4 text-primary mr-3"
                      />
                      <span dangerouslySetInnerHTML={{ __html: item.label.replace(/Item \d+/, "<b>$&</b>") }} />
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
            <SectionHeader
              title="Patient Details"
              isOpen={openSections.patient}
              onToggle={() => toggleSection("patient")}
            />
            {openSections.patient && (
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                    <label className="block text-sm font-medium mb-1">Assessment Date:</label>
                    <input
                      type="date"
                      value={(formData["assessment-date"] as string) || today}
                      onChange={(e) => updateFormData("assessment-date", e.target.value)}
                      className="w-full p-2 bg-muted border border-border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">DOB:</label>
                    <input
                      type="date"
                      value={(formData["patient-dob"] as string) || ""}
                      onChange={(e) => updateFormData("patient-dob", e.target.value)}
                      className="w-full p-2 bg-muted border border-border rounded-md"
                    />
                  </div>
                  <div className="flex flex-col justify-end h-full">
                    <div className="p-3 bg-muted rounded-md text-center font-medium min-h-[50px] flex items-center justify-center">
                      {calculateAge(formData["patient-dob"] as string)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                    <label className="block text-sm font-medium mb-1">Gender:</label>
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
            <SectionHeader
              title="History & Medication"
              isOpen={openSections.history}
              onToggle={() => toggleSection("history")}
            />
            {openSections.history && (
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Past Medical History:</label>
                    <textarea
                      value={(formData["past-medical-history"] as string) || ""}
                      onChange={(e) => updateFormData("past-medical-history", e.target.value)}
                      className="w-full p-2 bg-muted border border-border rounded-md h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Regular Medications:</label>
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
                        checked={(formData["meds-reviewed"] as boolean) || false}
                        onChange={(e) => updateFormData("meds-reviewed", e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      Medication list reviewed and reconciled with patient.
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["hmr-recommended"] as boolean) || false}
                        onChange={(e) => updateFormData("hmr-recommended", e.target.checked)}
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
            <SectionHeader
              title="Clinical & Functional Assessment"
              isOpen={openSections.clinical}
              onToggle={() => toggleSection("clinical")}
            />
            {openSections.clinical && (
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-border">Vitals & Examinations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                  <div>
                    <label className="block font-medium mb-1">Rhythm:</label>
                    <select
                      value={(formData["pulse-rhythm"] as string) || "Regular"}
                      onChange={(e) => updateFormData("pulse-rhythm", e.target.value)}
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
                      onChange={(e) => updateFormData("height", e.target.value)}
                      placeholder="e.g. 170"
                      className="w-full p-2 bg-muted border border-border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Weight (kg):</label>
                    <input
                      type="number"
                      value={(formData["weight"] as string) || ""}
                      onChange={(e) => updateFormData("weight", e.target.value)}
                      placeholder="e.g. 75"
                      className="w-full p-2 bg-muted border border-border rounded-md"
                    />
                  </div>
                  <div className="flex flex-col justify-end h-full">
                    <div className="p-3 bg-muted rounded-md text-center font-medium min-h-[50px] flex items-center justify-center">
                      {calculateBMI(formData["height"] as string, formData["weight"] as string)}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="font-medium">Has there been any recent unintentional weight changes?</span>
                  <div className="flex space-x-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="weight-change"
                        value="yes"
                        checked={formData["weight-change"] === "yes"}
                        onChange={(e) => updateFormData("weight-change", e.target.value)}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="weight-change"
                        value="no"
                        checked={formData["weight-change"] === "no"}
                        onChange={(e) => updateFormData("weight-change", e.target.value)}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>

                <hr className="my-6" />

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["ecg-performed"] as boolean) || false}
                        onChange={(e) => updateFormData("ecg-performed", e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      ECG performed (Item 11707)
                    </label>
                    {formData["ecg-performed"] && (
                      <div className="ml-6 mt-2">
                        <label className="block font-medium mb-1">Interpretation:</label>
                        <textarea
                          value={(formData["ecg-interpretation"] as string) || ""}
                          onChange={(e) => updateFormData("ecg-interpretation", e.target.value)}
                          placeholder="ECG interpretation..."
                          className="w-full p-2 bg-muted border border-border rounded-md"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["abi-performed"] as boolean) || false}
                        onChange={(e) => updateFormData("abi-performed", e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      ABI performed (Item 11610)
                    </label>
                    {formData["abi-performed"] && (
                      <div className="ml-6 mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium mb-1">Left:</label>
                          <input
                            type="text"
                            value={(formData["abi-left"] as string) || ""}
                            onChange={(e) => updateFormData("abi-left", e.target.value)}
                            placeholder="e.g. 1.1"
                            className="w-full p-2 bg-muted border border-border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-1">Right:</label>
                          <input
                            type="text"
                            value={(formData["abi-right"] as string) || ""}
                            onChange={(e) => updateFormData("abi-right", e.target.value)}
                            placeholder="e.g. 1.2"
                            className="w-full p-2 bg-muted border border-border rounded-md"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <hr className="my-6" />

                <div className="space-y-4">
                  {[
                    { key: "cardio-exam", label: "Cardiovascular examination", detailsKey: "cardio-exam-details" },
                    { key: "resp-exam", label: "Respiratory examination", detailsKey: "resp-exam-details" },
                    { key: "neuro-exam", label: "Neurological examination", detailsKey: "neuro-exam-details" },
                    { key: "msk-exam", label: "Musculoskeletal examination", detailsKey: "msk-exam-details" },
                    { key: "abdo-exam", label: "Abdominal examination", detailsKey: "abdo-exam-details" },
                    { key: "other-exam", label: "Other examination", detailsKey: "other-exam-details" },
                  ].map((exam) => (
                    <div key={exam.key}>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(formData[exam.key] as boolean) || false}
                          onChange={(e) => updateFormData(exam.key, e.target.checked)}
                          className="h-4 w-4 text-primary mr-2"
                        />
                        {exam.label}
                      </label>
                      {formData[exam.key] && (
                        <div className="ml-6 mt-2">
                          <textarea
                            value={(formData[exam.detailsKey] as string) || ""}
                            onChange={(e) => updateFormData(exam.detailsKey, e.target.value)}
                            placeholder={`Details of ${exam.label.toLowerCase()}...`}
                            className="w-full p-2 bg-muted border border-border rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Physical Function */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader
              title="Physical Function"
              isOpen={openSections.physical}
              onToggle={() => toggleSection("physical")}
            />
            {openSections.physical && (
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <span className="font-medium">Has the patient had a fall in the last 3 months?</span>
                    <div className="flex space-x-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="falls-risk"
                          value="yes"
                          checked={formData["falls-risk"] === "yes"}
                          onChange={(e) => updateFormData("falls-risk", e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="falls-risk"
                          value="no"
                          checked={formData["falls-risk"] === "no"}
                          onChange={(e) => updateFormData("falls-risk", e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                    {formData["falls-risk"] === "yes" && (
                      <div className="mt-2">
                        <textarea
                          value={(formData["falls-details"] as string) || ""}
                          onChange={(e) => updateFormData("falls-details", e.target.value)}
                          placeholder="Details of fall(s)..."
                          className="w-full p-2 bg-muted border border-border rounded-md"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["adls-assessed"] as boolean) || false}
                        onChange={(e) => updateFormData("adls-assessed", e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      Activities of Daily Living (ADLs) assessed.
                    </label>
                    {formData["adls-assessed"] && (
                      <div className="ml-6 mt-2">
                        <select
                          value={(formData["adls-status"] as string) || "Independent"}
                          onChange={(e) => updateFormData("adls-status", e.target.value)}
                          className="w-full p-2 bg-muted border border-border rounded-md mb-2"
                        >
                          <option value="Independent">Independent</option>
                          <option value="Dependent">Dependent</option>
                        </select>
                        {formData["adls-status"] === "Dependent" && (
                          <textarea
                            value={(formData["adls-details"] as string) || ""}
                            onChange={(e) => updateFormData("adls-details", e.target.value)}
                            placeholder="Details of dependency..."
                            className="w-full p-2 bg-muted border border-border rounded-md"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["continence-assessed"] as boolean) || false}
                        onChange={(e) => updateFormData("continence-assessed", e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      Continence assessed.
                    </label>
                    {formData["continence-assessed"] && (
                      <div className="ml-6 mt-2">
                        <select
                          value={(formData["continence-status"] as string) || "Continent"}
                          onChange={(e) => updateFormData("continence-status", e.target.value)}
                          className="w-full p-2 bg-muted border border-border rounded-md mb-2"
                        >
                          <option value="Continent">Continent</option>
                          <option value="Incontinent">Incontinent</option>
                        </select>
                        {formData["continence-status"] === "Incontinent" && (
                          <textarea
                            value={(formData["continence-details"] as string) || ""}
                            onChange={(e) => updateFormData("continence-details", e.target.value)}
                            placeholder="Details of incontinence..."
                            className="w-full p-2 bg-muted border border-border rounded-md"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {[
                    { key: "chronic-pain", label: "Chronic pain assessed", detailsKey: "chronic-pain-details" },
                    { key: "dental-assessed", label: "Dental health assessed", detailsKey: "dental-details" },
                    { key: "foot-assessed", label: "Foot health assessed", detailsKey: "foot-details" },
                  ].map((item) => (
                    <div key={item.key}>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(formData[item.key] as boolean) || false}
                          onChange={(e) => updateFormData(item.key, e.target.checked)}
                          className="h-4 w-4 text-primary mr-2"
                        />
                        {item.label}
                      </label>
                      {formData[item.key] && (
                        <div className="ml-6 mt-2">
                          <textarea
                            value={(formData[item.detailsKey] as string) || ""}
                            onChange={(e) => updateFormData(item.detailsKey, e.target.value)}
                            placeholder={`Details of ${item.label.toLowerCase()}...`}
                            className="w-full p-2 bg-muted border border-border rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["pressure-risk"] as boolean) || false}
                        onChange={(e) => updateFormData("pressure-risk", e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      Risk of pressure injuries assessed
                    </label>
                    {formData["pressure-risk"] && (
                      <div className="ml-6 mt-2">
                        <span className="font-medium block mb-2">Is the patient high risk for pressure injuries?</span>
                        <div className="flex space-x-4 mb-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="pressure-high-risk"
                              value="yes"
                              checked={formData["pressure-high-risk"] === "yes"}
                              onChange={(e) => updateFormData("pressure-high-risk", e.target.value)}
                              className="mr-2"
                            />
                            Yes
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="pressure-high-risk"
                              value="no"
                              checked={formData["pressure-high-risk"] === "no"}
                              onChange={(e) => updateFormData("pressure-high-risk", e.target.value)}
                              className="mr-2"
                            />
                            No
                          </label>
                        </div>
                        <textarea
                          value={(formData["pressure-risk-details"] as string) || ""}
                          onChange={(e) => updateFormData("pressure-risk-details", e.target.value)}
                          placeholder="Details of pressure injury risk..."
                          className="w-full p-2 bg-muted border border-border rounded-md"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["vision-checked"] as boolean) || false}
                        onChange={(e) => updateFormData("vision-checked", e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      Vision checked
                    </label>
                    {formData["vision-checked"] && (
                      <div className="ml-6 mt-2">
                        <div className="grid grid-cols-2 gap-2 items-center mb-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="vision-correction"
                              value="Corrected"
                              checked={formData["vision-correction"] === "Corrected"}
                              onChange={(e) => updateFormData("vision-correction", e.target.value)}
                              className="mr-2"
                            />
                            Corrected
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="vision-correction"
                              value="Uncorrected"
                              checked={formData["vision-correction"] === "Uncorrected"}
                              onChange={(e) => updateFormData("vision-correction", e.target.value)}
                              className="mr-2"
                            />
                            Uncorrected
                          </label>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={(formData["vision-va-r"] as string) || ""}
                            onChange={(e) => updateFormData("vision-va-r", e.target.value)}
                            placeholder="VA R"
                            className="w-full p-2 bg-muted border border-border rounded-md"
                          />
                          <input
                            type="text"
                            value={(formData["vision-va-l"] as string) || ""}
                            onChange={(e) => updateFormData("vision-va-l", e.target.value)}
                            placeholder="VA L"
                            className="w-full p-2 bg-muted border border-border rounded-md"
                          />
                          <input
                            type="text"
                            value={(formData["vision-va-b"] as string) || ""}
                            onChange={(e) => updateFormData("vision-va-b", e.target.value)}
                            placeholder="VA Both"
                            className="w-full p-2 bg-muted border border-border rounded-md"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["hearing-checked"] as boolean) || false}
                        onChange={(e) => updateFormData("hearing-checked", e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      Hearing checked
                    </label>
                    {formData["hearing-checked"] && (
                      <div className="ml-6 mt-2">
                        <select
                          value={(formData["hearing-status"] as string) || "Adequate"}
                          onChange={(e) => updateFormData("hearing-status", e.target.value)}
                          className="w-full p-2 bg-muted border border-border rounded-md mb-2"
                        >
                          <option value="Adequate">Adequate</option>
                          <option value="Inadequate">Inadequate</option>
                        </select>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(formData["hearing-aid-used"] as boolean) || false}
                            onChange={(e) => updateFormData("hearing-aid-used", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          Hearing aid used
                        </label>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Other physical function assessment:</label>
                    <textarea
                      value={(formData["other-physical-assessment"] as string) || ""}
                      onChange={(e) => updateFormData("other-physical-assessment", e.target.value)}
                      className="w-full p-2 bg-muted border border-border rounded-md h-20"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Social Function */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader
              title="Social Function"
              isOpen={openSections.social}
              onToggle={() => toggleSection("social")}
            />
            {openSections.social && (
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <span className="font-medium">Patient had regular friend/family member visitors?</span>
                    <div className="flex space-x-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="visitors-status"
                          value="yes"
                          checked={formData["visitors-status"] === "yes"}
                          onChange={(e) => updateFormData("visitors-status", e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="visitors-status"
                          value="no"
                          checked={formData["visitors-status"] === "no"}
                          onChange={(e) => updateFormData("visitors-status", e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                    {formData["visitors-status"] === "yes" && (
                      <div className="mt-2">
                        <textarea
                          value={(formData["visitors-details"] as string) || ""}
                          onChange={(e) => updateFormData("visitors-details", e.target.value)}
                          placeholder="Details of visitors..."
                          className="w-full p-2 bg-muted border border-border rounded-md"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="font-medium">
                      Social Isolation Screen: Does the patient often feel lonely or isolated?
                    </span>
                    <div className="flex space-x-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="social-isolation"
                          value="yes"
                          checked={formData["social-isolation"] === "yes"}
                          onChange={(e) => updateFormData("social-isolation", e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="social-isolation"
                          value="no"
                          checked={formData["social-isolation"] === "no"}
                          onChange={(e) => updateFormData("social-isolation", e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                    {formData["social-isolation"] === "yes" && (
                      <div className="mt-2">
                        <textarea
                          value={(formData["social-isolation-details"] as string) || ""}
                          onChange={(e) => updateFormData("social-isolation-details", e.target.value)}
                          placeholder="Details..."
                          className="w-full p-2 bg-muted border border-border rounded-md"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="font-medium">Does the patient have an Advanced Care Plan?</span>
                    <div className="flex space-x-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="acp"
                          value="yes"
                          checked={formData["acp"] === "yes"}
                          onChange={(e) => updateFormData("acp", e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="acp"
                          value="no"
                          checked={formData["acp"] === "no"}
                          onChange={(e) => updateFormData("acp", e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                    {formData["acp"] === "yes" && (
                      <div className="mt-2">
                        <label className="block font-medium mb-1">Resuscitation Status:</label>
                        <textarea
                          value={(formData["resuscitation-status"] as string) || ""}
                          onChange={(e) => updateFormData("resuscitation-status", e.target.value)}
                          placeholder="Enter resuscitation status..."
                          className="w-full p-2 bg-muted border border-border rounded-md"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Other social function assessment:</label>
                    <textarea
                      value={(formData["other-social-assessment"] as string) || ""}
                      onChange={(e) => updateFormData("other-social-assessment", e.target.value)}
                      className="w-full p-2 bg-muted border border-border rounded-md h-20"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Psychological Function */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader
              title="Psychological Function"
              isOpen={openSections.psychological}
              onToggle={() => toggleSection("psychological")}
            />
            {openSections.psychological && (
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["cognition-assessed"] as boolean) || false}
                        onChange={(e) => updateFormData("cognition-assessed", e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      Cognition assessed
                    </label>
                    {formData["cognition-assessed"] && (
                      <div className="ml-6 mt-2">
                        <div className="grid grid-cols-2 gap-4 items-start">
                          <select
                            value={(formData["cognition-tool"] as string) || ""}
                            onChange={(e) => updateFormData("cognition-tool", e.target.value)}
                            className="w-full p-2 bg-muted border border-border rounded-md"
                          >
                            <option value="">Select Tool...</option>
                            <option value="MMSE">MMSE</option>
                            <option value="MoCA">MoCA</option>
                          </select>
                          <div>
                            <input
                              type="text"
                              value={(formData["cognition-score"] as string) || ""}
                              onChange={(e) => updateFormData("cognition-score", e.target.value)}
                              placeholder="Score"
                              className="w-full p-2 bg-muted border border-border rounded-md"
                            />
                            {formData["cognition-tool"] && (
                              <button
                                type="button"
                                onClick={() => openAssessmentModal(formData["cognition-tool"] as string)}
                                className="text-primary hover:underline text-sm mt-1 block text-right"
                              >
                                Complete Assessment
                              </button>
                            )}
                            {formData["cognition-score"] && formData["cognition-tool"] && (
                              <div className="text-xs p-2 mt-2 bg-yellow-50 text-yellow-700 border border-yellow-400 rounded">
                                {assessmentTemplates[
                                  formData["cognition-tool"] as keyof typeof assessmentTemplates
                                ]?.getInterpretation(Number.parseInt(formData["cognition-score"] as string) || 0)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["mood-assessed"] as boolean) || false}
                        onChange={(e) => updateFormData("mood-assessed", e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      Mood assessed
                    </label>
                    {formData["mood-assessed"] && (
                      <div className="ml-6 mt-2">
                        <div className="grid grid-cols-2 gap-4 items-start">
                          <select
                            value={(formData["mood-tool"] as string) || ""}
                            onChange={(e) => updateFormData("mood-tool", e.target.value)}
                            className="w-full p-2 bg-muted border border-border rounded-md"
                          >
                            <option value="">Select Tool...</option>
                            <option value="K10">K10</option>
                            <option value="GDS">GDS</option>
                            <option value="DASS21">DASS-21</option>
                          </select>
                          <div>
                            <input
                              type="text"
                              value={(formData["mood-score"] as string) || ""}
                              onChange={(e) => updateFormData("mood-score", e.target.value)}
                              placeholder="Score"
                              className="w-full p-2 bg-muted border border-border rounded-md"
                            />
                            {formData["mood-tool"] && (
                              <button
                                type="button"
                                onClick={() => openAssessmentModal(formData["mood-tool"] as string)}
                                className="text-primary hover:underline text-sm mt-1 block text-right"
                              >
                                Complete Assessment
                              </button>
                            )}
                            {formData["mood-score"] && formData["mood-tool"] && (
                              <div className="text-xs p-2 mt-2 bg-yellow-50 text-yellow-700 border border-yellow-400 rounded">
                                {formData["mood-tool"] === "DASS21"
                                  ? "DASS-21 interpretation available after completion"
                                  : assessmentTemplates[
                                      formData["mood-tool"] as keyof typeof assessmentTemplates
                                    ]?.getInterpretation(Number.parseInt(formData["mood-score"] as string) || 0)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* SNAP */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="SNAP" isOpen={openSections.snap} onToggle={() => toggleSection("snap")} />
            {openSections.snap && (
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["assess-smoking"] as boolean) || false}
                        onChange={(e) => updateFormData("assess-smoking", e.target.checked)}
                        className="h-4 w-4 text-primary mr-3"
                      />
                      <label className="font-semibold">S - Smoking Status</label>
                    </div>
                    {formData["assess-smoking"] && (
                      <div className="ml-7 mt-2">
                        <select
                          value={(formData["smoking-status"] as string) || ""}
                          onChange={(e) => updateFormData("smoking-status", e.target.value)}
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

                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["assess-nutrition"] as boolean) || false}
                        onChange={(e) => updateFormData("assess-nutrition", e.target.checked)}
                        className="h-4 w-4 text-primary mr-3"
                      />
                      <label className="font-semibold">N - Nutrition</label>
                    </div>
                    {formData["assess-nutrition"] && (
                      <div className="ml-7 mt-2">
                        <select
                          value={(formData["nutrition-status"] as string) || ""}
                          onChange={(e) => updateFormData("nutrition-status", e.target.value)}
                          className="w-full p-2 bg-muted border border-border rounded-md mb-2"
                        >
                          <option value="">Select diet type...</option>
                          <option value="adequate">Adequate</option>
                          <option value="inadequate">Inadequate</option>
                        </select>
                        <textarea
                          value={(formData["nutrition-details"] as string) || ""}
                          onChange={(e) => updateFormData("nutrition-details", e.target.value)}
                          placeholder="Details of nutrition assessment..."
                          className="w-full p-2 bg-muted border border-border rounded-md"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["assess-alcohol"] as boolean) || false}
                        onChange={(e) => updateFormData("assess-alcohol", e.target.checked)}
                        className="h-4 w-4 text-primary mr-3"
                      />
                      <label className="font-semibold">A - Alcohol</label>
                    </div>
                    {formData["assess-alcohol"] && (
                      <div className="ml-7 mt-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={(formData["alcohol-drinks"] as string) || ""}
                            onChange={(e) => updateFormData("alcohol-drinks", e.target.value)}
                            placeholder="Std drinks"
                            className="w-1/2 p-2 bg-muted border border-border rounded-md"
                          />
                          <select
                            value={(formData["alcohol-period"] as string) || "week"}
                            onChange={(e) => updateFormData("alcohol-period", e.target.value)}
                            className="w-1/2 p-2 bg-muted border border-border rounded-md"
                          >
                            <option value="week">per week</option>
                            <option value="day">per day</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData["assess-activity"] as boolean) || false}
                        onChange={(e) => updateFormData("assess-activity", e.target.checked)}
                        className="h-4 w-4 text-primary mr-3"
                      />
                      <label className="font-semibold">P - Physical Activity</label>
                    </div>
                    {formData["assess-activity"] && (
                      <div className="ml-7 mt-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={(formData["activity-minutes"] as string) || ""}
                            onChange={(e) => updateFormData("activity-minutes", e.target.value)}
                            placeholder="Minutes of exercise"
                            className="w-full p-2 bg-muted border border-border rounded-md"
                          />
                          <span className="text-muted-foreground">per week</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Immunisation Status */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader
              title="Immunisation Status"
              isOpen={openSections.immunisation}
              onToggle={() => toggleSection("immunisation")}
            />
            {openSections.immunisation && (
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(formData["influenza-utd"] as boolean) || false}
                      onChange={(e) => updateFormData("influenza-utd", e.target.checked)}
                      className="h-4 w-4 text-primary mr-3"
                    />
                    Influenza UTD
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(formData["tetanus-utd"] as boolean) || false}
                      onChange={(e) => updateFormData("tetanus-utd", e.target.checked)}
                      className="h-4 w-4 text-primary mr-3"
                    />
                    Tetanus UTD
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(formData["pneumococcus-utd"] as boolean) || false}
                      onChange={(e) => updateFormData("pneumococcus-utd", e.target.checked)}
                      className="h-4 w-4 text-primary mr-3"
                    />
                    Pneumococcus UTD
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(formData["covid-utd"] as boolean) || false}
                      onChange={(e) => updateFormData("covid-utd", e.target.checked)}
                      className="h-4 w-4 text-primary mr-3"
                    />
                    COVID-19 UTD
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(formData["shingrix-utd"] as boolean) || false}
                      onChange={(e) => updateFormData("shingrix-utd", e.target.checked)}
                      className="h-4 w-4 text-primary mr-3"
                    />
                    Shingrix UTD
                  </label>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Plan & Recommendations */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader
              title="Plan & Recommendations"
              isOpen={openSections.plan}
              onToggle={() => toggleSection("plan")}
            />
            {openSections.plan && (
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-border">
                  Recommended Actions, Screening and Immunisations
                </h3>

                <h4 className="font-semibold mb-2">Screening</h4>
                <div className="pl-2 mb-6">
                  <label className="flex items-center my-2">
                    <input
                      type="checkbox"
                      checked={(formData["rec-osteoporosis"] as boolean) || false}
                      onChange={(e) => updateFormData("rec-osteoporosis", e.target.checked)}
                      className="h-4 w-4 text-primary mr-2"
                    />
                    Osteoporosis screening recommended.
                  </label>
                </div>

                <h4 className="font-semibold mb-2">Immunisations</h4>
                <div className="pl-2 mb-6">
                  <label className="flex items-center my-2">
                    <input
                      type="checkbox"
                      checked={(formData["rec-influenza"] as boolean) || false}
                      onChange={(e) => updateFormData("rec-influenza", e.target.checked)}
                      disabled={formData["influenza-utd"] as boolean}
                      className="h-4 w-4 text-primary mr-2"
                    />
                    Annual influenza immunisation
                  </label>
                  <label className="flex items-center my-2">
                    <input
                      type="checkbox"
                      checked={(formData["rec-covid"] as boolean) || false}
                      onChange={(e) => updateFormData("rec-covid", e.target.checked)}
                      disabled={formData["covid-utd"] as boolean}
                      className="h-4 w-4 text-primary mr-2"
                    />
                    COVID-19 immunisation
                  </label>
                </div>

                <div className="space-y-2 mb-4">
                  {otherImmunisations.map((immunisation, index) => (
                    <div key={index} className="flex items-center">
                      <label className="flex items-center my-2 flex-grow">
                        <input type="checkbox" checked readOnly className="h-4 w-4 text-primary mr-2" />
                        <input
                          type="text"
                          value={immunisation}
                          onChange={(e) => updateOtherImmunisation(index, e.target.value)}
                          className="flex-grow p-1 border-b border-border focus:outline-none focus:border-primary bg-transparent"
                          placeholder="Enter immunisation name..."
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeOtherImmunisation(index)}
                        className="ml-4 text-red-500 hover:text-red-700 font-bold"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addOtherImmunisation}
                  className="text-sm bg-muted hover:bg-muted/80 font-semibold py-1 px-3 rounded-md"
                >
                  + Add Other
                </button>

                <label className="block text-sm font-medium mt-8 mb-1">
                  Detail the management plan, referrals, and follow-up actions:
                </label>
                <textarea
                  value={(formData["plan-recommendations"] as string) || ""}
                  onChange={(e) => updateFormData("plan-recommendations", e.target.value)}
                  className="w-full p-2 bg-muted border border-border rounded-md h-48"
                />
              </CardContent>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mb-8">
            <Button variant="outline" onClick={() => setShowClearModal(true)}>
              Clear Form
            </Button>
            <Button variant="outline" onClick={() => exportReport("txt")}>
              Export as .txt
            </Button>
            <Button onClick={() => exportReport("rtf")}>Export as .rtf</Button>
          </div>

          {/* Privacy Notice */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Privacy Notice:</strong> All assessment data is saved locally in your browser and never
              transmitted to our servers. Generated documents will be downloaded to your device for your records.
            </p>
          </div>

          {/* Back to Assessments */}
          <div className="text-center mt-6">
            <Link href="/gpccmp">
              <Button variant="outline">← Back to All Assessments</Button>
            </Link>
          </div>
        </div>
      </div>

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

      {/* Restore Session Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-2">Saved Session Found</h3>
            <p className="text-muted-foreground mb-4">
              Would you like to restore your previously entered data or start a new assessment?
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={startFresh}>
                Start Fresh
              </Button>
              <Button onClick={restoreSession}>Restore Session</Button>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Modal Placeholder */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {assessmentTemplates[showModal as keyof typeof assessmentTemplates]?.title}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeAssessmentModal}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Assessment tool interface would be implemented here with full interactive functionality.
              </p>
              <Button className="mt-4" onClick={closeAssessmentModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
