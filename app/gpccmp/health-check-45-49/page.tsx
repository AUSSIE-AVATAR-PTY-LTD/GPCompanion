"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import Link from "next/link"

// SectionHeader component for consistent styling
const SectionHeader = ({ title, isOpen, onToggle }: { title: string; isOpen: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between p-4 bg-transparent border-b border-primary/20 text-xl font-bold text-primary hover:bg-primary/5 transition-colors"
  >
    <span>{title}</span>
    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
  </button>
)

export default function HealthCheck4549Page() {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    mbsInfo: true,
    patientDetails: true,
    historyMedication: true,
    riskFactors: true,
    snapEd: true,
    examination: true,
    plan: true,
  })
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [assessmentModal, setAssessmentModal] = useState<{
    isOpen: boolean
    type: string
    targetField: string
    score: number
  }>({ isOpen: false, type: "", targetField: "", score: 0 })

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("health-check-45-49-data")
    if (savedData) {
      setShowRestoreModal(true)
    }
  }, [])

  // Save data whenever formData changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem("health-check-45-49-data", JSON.stringify(formData))
    }
  }, [formData])

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return ""
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age.toString()
  }

  const calculateBMI = (weight: string, height: string) => {
    if (!weight || !height) return ""
    const weightNum = Number.parseFloat(weight)
    const heightNum = Number.parseFloat(height) / 100 // Convert cm to m
    if (weightNum > 0 && heightNum > 0) {
      return (weightNum / (heightNum * heightNum)).toFixed(2)
    }
    return ""
  }

  const restoreSession = () => {
    const savedData = localStorage.getItem("health-check-45-49-data")
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData))
      } catch (error) {
        console.error("Error loading saved data:", error)
      }
    }
    setShowRestoreModal(false)
  }

  const startFresh = () => {
    localStorage.removeItem("health-check-45-49-data")
    setShowRestoreModal(false)
  }

  const clearForm = () => {
    if (confirm("Are you sure you want to clear all form data? This action cannot be undone.")) {
      setFormData({})
      localStorage.removeItem("health-check-45-49-data")
    }
  }

  const updateAutomaticRecommendations = () => {
    const recommendations = []

    // BMI-based recommendations
    const bmi = Number.parseFloat(formData.bmi || "0")
    if (bmi >= 30) {
      recommendations.push("- Patient has obesity (BMI ≥ 30). Discussed eligibility for a GP Management Plan (GPMP).")
    }

    // Risk factor recommendations
    if (formData.riskCholesterol) {
      recommendations.push("- Review and optimise treatment of dyslipidaemia.")
    }
    if (formData.riskBP) {
      recommendations.push("- Review and optimise treatment of hypertension.")
    }
    if (formData.riskGlucose) {
      recommendations.push("- Review and optimise treatment of impaired glucose metabolism.")
    }
    if (formData.riskSkinCancer) {
      recommendations.push(
        "- Patient has risk factors for skin cancer. Recommend regular self-checks and a formal skin check by a doctor.",
      )
    }

    // Lifestyle recommendations
    if (formData.smokingStatus === "current") {
      recommendations.push(
        "- Discuss smoking cessation strategies, including nicotine replacement therapy and counseling support.",
      )
    }
    if (formData.nutritionStatus === "poor") {
      recommendations.push(
        "- Encourage a balanced diet including at least 5 servings of vegetables and 2 servings of fruit daily.",
      )
    }

    // Alcohol recommendations
    const drinks = Number.parseInt(formData.alcoholDrinks || "0")
    const period = formData.alcoholPeriod || "week"
    if ((period === "week" && drinks > 10) || (period === "day" && drinks > 4)) {
      recommendations.push(
        "- Alcohol intake is above recommended guidelines. Advise calculating AUDIT-C score and discuss safe alcohol intake (no more than 10 standard drinks/week and no more than 4 on any one day).",
      )
    }

    // Physical activity recommendations
    const activity = Number.parseInt(formData.activityMinutes || "0")
    if (activity < 150) {
      recommendations.push(
        "- Recommend aiming for at least 150 minutes of moderate-intensity aerobic activity per week.",
      )
    }

    // Family history recommendations
    if (formData.fhBreast || formData.fhColorectal) {
      recommendations.push("- Consider escalated screening for breast and/or bowel cancer as per guidelines.")
    }

    // Irregular pulse
    if (formData.hrRhythm === "Irregular") {
      recommendations.push(
        "- Irregular pulse noted. Recommend ECG to investigate for potential arrhythmia (e.g., Atrial Fibrillation).",
      )
    }

    return recommendations.join("\n")
  }

  const openAssessmentModal = (type: string, targetField: string) => {
    setAssessmentModal({ isOpen: true, type, targetField, score: 0 })
  }

  const closeAssessmentModal = () => {
    setAssessmentModal({ isOpen: false, type: "", targetField: "", score: 0 })
  }

  const finalizeAssessment = () => {
    updateFormData(assessmentModal.targetField, assessmentModal.score)
    closeAssessmentModal()
  }

  const exportAsText = () => {
    let report = "45-49 YEAR OLD HEALTH ASSESSMENT\n"
    report += "GP Health Assessment Tool for people at risk of developing chronic disease\n"
    report += `MBS Item Number: ${formData.mbsItem || "N/A"}\n\n`

    // Patient Details
    report += "PATIENT DETAILS:\n"
    report += `- Name: ${formData.patientName || "N/A"}\n`
    report += `- DOB: ${formData.patientDob ? new Date(formData.patientDob).toLocaleDateString("en-AU") : "N/A"}\n`
    report += `- Age: ${formData.age || "N/A"}\n`
    report += `- Gender: ${formData.patientGender || "N/A"}\n`
    report += `- Medicare: ${formData.patientMedicare || "N/A"}\n`
    report += `- Date: ${formData.assessmentDate ? new Date(formData.assessmentDate).toLocaleDateString("en-AU") : "N/A"}\n`
    report += `- Aboriginal and/or Torres Strait Islander origin: ${formData.patientAtsi ? "Yes" : "No"}\n\n`

    // History & Medication
    if (formData.pastMedicalHistory) {
      report += "PAST MEDICAL HISTORY:\n" + formData.pastMedicalHistory + "\n\n"
    }
    if (formData.regularMedications) {
      report += "REGULAR MEDICATIONS:\n" + formData.regularMedications + "\n\n"
    }

    // Risk Factors
    const biomedicalRisks = []
    if (formData.riskCholesterol)
      biomedicalRisks.push(`- High cholesterol (${formData.cholesterolMeds || "status not specified"})`)
    if (formData.riskBP) biomedicalRisks.push(`- High blood pressure (${formData.bpMeds || "status not specified"})`)
    if (formData.riskGlucose)
      biomedicalRisks.push(`- Impaired glucose metabolism (${formData.glucoseMeds || "status not specified"})`)
    if (formData.riskSkinCancer) biomedicalRisks.push("- History of skin cancer or significant sun exposure")
    if (formData.otherBiomedicalRisks) biomedicalRisks.push(`- Other: ${formData.otherBiomedicalRisks}`)

    if (biomedicalRisks.length > 0) {
      report += "BIOMEDICAL RISK FACTORS:\n" + biomedicalRisks.join("\n") + "\n\n"
    }

    // Family History
    const familyHistory = []
    if (formData.fhBreast)
      familyHistory.push(`- Breast cancer${formData.fhBreastDetails ? ": " + formData.fhBreastDetails : ""}`)
    if (formData.fhDiabetes)
      familyHistory.push(`- Diabetes${formData.fhDiabetesDetails ? ": " + formData.fhDiabetesDetails : ""}`)
    if (formData.fhColorectal)
      familyHistory.push(
        `- Colorectal Cancer${formData.fhColorectalDetails ? ": " + formData.fhColorectalDetails : ""}`,
      )
    if (formData.fhMental)
      familyHistory.push(`- Mental Health conditions${formData.fhMentalDetails ? ": " + formData.fhMentalDetails : ""}`)
    if (formData.fhOther)
      familyHistory.push(`- Other chronic disease${formData.fhOtherDetails ? ": " + formData.fhOtherDetails : ""}`)

    if (familyHistory.length > 0) {
      report += "SIGNIFICANT FAMILY HISTORY:\n" + familyHistory.join("\n") + "\n\n"
    }

    // SNAP-Ed Assessment
    const snapItems = []
    if (formData.assessSmoking)
      snapItems.push(
        `- Smoking: ${formData.smokingStatus || "Not specified"}${formData.smokingStatus === "current" ? ` (Pack Years: ${formData.smokingPackYears || "N/A"})` : ""}`,
      )
    if (formData.assessNutrition)
      snapItems.push(
        `- Nutrition: ${formData.nutritionStatus || "Not specified"}${formData.nutritionDetails ? ` (Details: ${formData.nutritionDetails})` : ""}`,
      )
    if (formData.assessAlcohol)
      snapItems.push(
        `- Alcohol: ${formData.alcoholDrinks || "N/A"} standard drinks ${formData.alcoholPeriod || "per week"}`,
      )
    if (formData.assessActivity)
      snapItems.push(`- Physical Activity: ${formData.activityMinutes || "N/A"} minutes per week`)
    if (formData.assessMood) {
      const tool = formData.moodTool || "N/A"
      const score = formData.moodScore || "N/A"
      snapItems.push(`- Emotional Wellbeing: Assessed using ${tool}. Score: ${score}`)
    }

    if (snapItems.length > 0) {
      report += "SNAP-ED ASSESSMENT:\n" + snapItems.join("\n") + "\n\n"
    }

    // Examination
    const examFindings = [
      `- Blood Pressure: ${formData.bp || "N/A"} mmHg`,
      `- Heart Rate: ${formData.hr || "N/A"} bpm (${formData.hrRhythm || "Regular"})`,
      `- Height: ${formData.heightCm || "N/A"} cm`,
      `- Weight: ${formData.weightKg || "N/A"} kg`,
      `- Waist: ${formData.waist || "N/A"} cm`,
      `- BMI: ${formData.bmi || "N/A"} kg/m²`,
    ]

    if (formData.examCvs) examFindings.push(`- Cardiovascular Exam: ${formData.examCvsDetails || "Normal"}`)
    if (formData.examResp) examFindings.push(`- Respiratory Exam: ${formData.examRespDetails || "Normal"}`)
    if (formData.examAbdo) examFindings.push(`- Abdominal Exam: ${formData.examAbdoDetails || "Normal"}`)
    if (formData.examOther) examFindings.push(`- Other Findings: ${formData.examOther}`)

    report += "EXAMINATION:\n" + examFindings.join("\n") + "\n\n"

    // Investigations
    const investigations = []
    if (formData.invFastingLipids) investigations.push("- Fasting lipids ordered/reviewed")
    if (formData.invFastingGlucose) investigations.push("- Fasting glucose/HbA1c ordered/reviewed")
    if (formData.investigationsOther) investigations.push(`- Other: ${formData.investigationsOther}`)

    if (investigations.length > 0) {
      report += "INVESTIGATIONS:\n" + investigations.join("\n") + "\n\n"
    }

    // Plan & Recommendations
    const assessments = []
    if (formData.recMenopauseAssessment) assessments.push("- Menopause health assessment recommended.")
    if (formData.recHeartHealthAssessment) assessments.push("- Heart Health Assessment recommended.")
    if (formData.recAtsiAssessment) assessments.push("- ATSI health assessment recommended.")
    if (formData.recDiabetesRiskAssessment) assessments.push("- 40-49 YO Type 2 Diabetes Risk Evaluation recommended.")

    if (assessments.length > 0) {
      report += "RECOMMENDED ASSESSMENTS:\n" + assessments.join("\n") + "\n\n"
    }

    const screening = []
    if (formData.recBowelScreening) screening.push("- Bowel screening recommended.")
    if (formData.recBreastScreening) screening.push("- Breast screening recommended.")
    if (formData.recCervicalScreening) screening.push("- Cervical screening recommended.")

    if (screening.length > 0) {
      report += "RECOMMENDED SCREENING:\n" + screening.join("\n") + "\n\n"
    }

    const immunisations = []
    if (formData.recFluVax) immunisations.push("- Annual influenza immunisation recommended.")
    if (formData.recCovidVax) immunisations.push("- COVID-19 immunisation recommended.")

    if (immunisations.length > 0) {
      report += "RECOMMENDED IMMUNISATIONS:\n" + immunisations.join("\n") + "\n\n"
    }

    if (formData.planRecommendations) {
      report += "MANAGEMENT PLAN, REFERRALS, AND FOLLOW-UP ACTIONS:\n" + formData.planRecommendations + "\n\n"
    }

    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `45-49-health-assessment-${formData.patientName?.replace(/\s+/g, "_") || "report"}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsRTF = () => {
    let rtfContent = "{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Inter;}}\\pard\\sa0\\sl276\\slmult1 "

    const escapeRtf = (str: string) => {
      if (typeof str !== "string") return ""
      return str.replace(/\\/g, "\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}").replace(/\n/g, "\\par\n")
    }

    rtfContent += "{\\pard\\qc\\b\\fs32 " + escapeRtf("45-49 YEAR OLD HEALTH ASSESSMENT") + "\\par}"
    rtfContent +=
      "{\\pard\\qc\\fs24 " +
      escapeRtf("GP Health Assessment Tool for people at risk of developing chronic disease") +
      "\\par\\par}"
    rtfContent += "{\\pard\\qc\\fs24 " + escapeRtf(`MBS Item Number: ${formData.mbsItem || "N/A"}`) + "\\par\\par}"

    // Add sections with RTF formatting
    const addSection = (title: string, content: string[]) => {
      if (content.length > 0) {
        rtfContent += "{\\pard\\sa100\\sl276\\slmult1\\b\\ul " + escapeRtf(title.toUpperCase()) + "\\ul0\\b0\\par}"
        content.forEach((line) => {
          const isListItem = line.startsWith("- ")
          const lineText = isListItem ? line.substring(2) : line
          rtfContent +=
            "{\\pard\\fi360\\sa100\\sl276\\slmult1\\fs22 " + (isListItem ? "- " : "") + escapeRtf(lineText) + "\\par}"
        })
      }
    }

    // Patient Details
    const patientDetails = [
      `Name: ${formData.patientName || "N/A"}`,
      `DOB: ${formData.patientDob ? new Date(formData.patientDob).toLocaleDateString("en-AU") : "N/A"}`,
      `Age: ${formData.age || "N/A"}`,
      `Gender: ${formData.patientGender || "N/A"}`,
      `Medicare: ${formData.patientMedicare || "N/A"}`,
      `Date: ${formData.assessmentDate ? new Date(formData.assessmentDate).toLocaleDateString("en-AU") : "N/A"}`,
      `Aboriginal and/or Torres Strait Islander origin: ${formData.patientAtsi ? "Yes" : "No"}`,
    ]
    addSection(
      "Patient Details",
      patientDetails.map((item) => `- ${item}`),
    )

    rtfContent += "}"

    const blob = new Blob([rtfContent], { type: "application/rtf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `45-49-health-assessment-${formData.patientName?.replace(/\s+/g, "_") || "report"}.rtf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Restore Session Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md mx-4">
            <h3 className="text-xl font-bold mb-2">Restore Previous Session?</h3>
            <p className="text-muted-foreground mb-6">
              We found saved data from your last session. Would you like to continue where you left off?
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

      {/* Assessment Modal */}
      {assessmentModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {assessmentModal.type === "K10" ? "Kessler Psychological Distress Scale (K10)" : "DASS-21 Assessment"}
              </h2>
              <Button variant="ghost" onClick={closeAssessmentModal}>
                ×
              </Button>
            </div>
            <div className="mb-4">
              <p className="text-muted-foreground">
                {assessmentModal.type === "K10"
                  ? "Over the last 4 weeks, about how often did the patient feel..."
                  : "Please read each statement and indicate how much the statement applied to you over the past week."}
              </p>
            </div>
            <div className="flex justify-end">
              <Button onClick={finalizeAssessment}>Finalise & Close</Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/gpccmp" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessments
            </Link>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">45-49 Year Old Health Assessment</h1>
              <p className="text-muted-foreground mb-2">
                GP Health Assessment Tool for people at risk of developing chronic disease
              </p>
              <p className="text-sm font-semibold">Developed by Dr Bobby Tork MD, FRACGP-RG</p>
              <p className="text-xs text-muted-foreground">© 2025 Dr Bobby Tork</p>
            </div>
          </div>

          <Card className="border-primary/20">
            <CardContent className="p-0">
              {/* MBS Item Number */}
              <div>
                <SectionHeader
                  title="MBS Item Number"
                  isOpen={openSections.mbsInfo}
                  onToggle={() => toggleSection("mbsInfo")}
                />
                {openSections.mbsInfo && (
                  <div className="p-6 space-y-4">
                    <label className="block text-lg font-medium mb-3">
                      Select the appropriate MBS item number based on consultation time:
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="mbsItem"
                          value="701"
                          checked={formData.mbsItem === "701"}
                          onChange={(e) => updateFormData("mbsItem", e.target.value)}
                          className="h-4 w-4 text-primary mr-3"
                        />
                        <strong>Item 701</strong> - Brief health assessment lasting no more than 30 minutes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="mbsItem"
                          value="703"
                          checked={formData.mbsItem === "703"}
                          onChange={(e) => updateFormData("mbsItem", e.target.value)}
                          className="h-4 w-4 text-primary mr-3"
                        />
                        <strong>Item 703</strong> - Standard health assessment lasting at least 30 minutes and less than
                        45 minutes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="mbsItem"
                          value="705"
                          checked={formData.mbsItem === "705"}
                          onChange={(e) => updateFormData("mbsItem", e.target.value)}
                          className="h-4 w-4 text-primary mr-3"
                        />
                        <strong>Item 705</strong> - Long health assessment lasting at least 45 minutes and less than 60
                        minutes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="mbsItem"
                          value="707"
                          checked={formData.mbsItem === "707"}
                          onChange={(e) => updateFormData("mbsItem", e.target.value)}
                          className="h-4 w-4 text-primary mr-3"
                        />
                        <strong>Item 707</strong> - Prolonged health assessment lasting more than 60 minutes
                      </label>
                    </div>
                    <div className="mt-4 p-3 bg-primary/10 rounded-lg text-sm text-primary">
                      This health assessment is available once to an eligible patient.
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Name: <span className="text-muted-foreground font-normal">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.patientName || ""}
                          onChange={(e) => updateFormData("patientName", e.target.value)}
                          className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Assessment Date:</label>
                        <input
                          type="date"
                          value={formData.assessmentDate || new Date().toISOString().split("T")[0]}
                          onChange={(e) => updateFormData("assessmentDate", e.target.value)}
                          className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">DOB:</label>
                        <input
                          type="date"
                          value={formData.patientDob || ""}
                          onChange={(e) => {
                            updateFormData("patientDob", e.target.value)
                            const age = calculateAge(e.target.value)
                            updateFormData("age", age)
                          }}
                          className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted rounded-md text-center font-medium flex items-center justify-center">
                          {formData.age ? `Age: ${formData.age}` : "Age will be calculated"}
                        </div>
                        {formData.age && (Number.parseInt(formData.age) < 45 || Number.parseInt(formData.age) > 49) && (
                          <div className="text-destructive font-bold text-sm flex items-center justify-center text-center">
                            Age must be 45-49
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Medicare No: <span className="text-muted-foreground font-normal">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.patientMedicare || ""}
                          onChange={(e) => updateFormData("patientMedicare", e.target.value)}
                          className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Gender:</label>
                        <select
                          value={formData.patientGender || ""}
                          onChange={(e) => updateFormData("patientGender", e.target.value)}
                          className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
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
                            checked={formData.patientAtsi || false}
                            onChange={(e) => updateFormData("patientAtsi", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          Aboriginal and/or Torres Strait Islander origin
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* History & Medication */}
              <div>
                <SectionHeader
                  title="History & Medication"
                  isOpen={openSections.historyMedication}
                  onToggle={() => toggleSection("historyMedication")}
                />
                {openSections.historyMedication && (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Past Medical History:</label>
                      <textarea
                        value={formData.pastMedicalHistory || ""}
                        onChange={(e) => updateFormData("pastMedicalHistory", e.target.value)}
                        rows={4}
                        className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Regular Medications:</label>
                      <textarea
                        value={formData.regularMedications || ""}
                        onChange={(e) => updateFormData("regularMedications", e.target.value)}
                        rows={4}
                        className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.medsReviewed || false}
                        onChange={(e) => updateFormData("medsReviewed", e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      Medication list reviewed and reconciled with patient.
                    </label>
                  </div>
                )}
              </div>

              {/* Risk Factor Assessment */}
              <div>
                <SectionHeader
                  title="Risk Factor Assessment"
                  isOpen={openSections.riskFactors}
                  onToggle={() => toggleSection("riskFactors")}
                />
                {openSections.riskFactors && (
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-semibold text-lg mb-4 pb-2 border-b border-primary/20">Biomedical Risks</h3>

                        <label className="flex items-center my-2">
                          <input
                            type="checkbox"
                            checked={formData.riskCholesterol || false}
                            onChange={(e) => updateFormData("riskCholesterol", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          High cholesterol
                        </label>
                        {formData.riskCholesterol && (
                          <div className="ml-6 mt-2 space-y-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="cholesterolMeds"
                                value="Medicated"
                                checked={formData.cholesterolMeds === "Medicated"}
                                onChange={(e) => updateFormData("cholesterolMeds", e.target.value)}
                                className="h-4 w-4 text-primary mr-2"
                              />
                              Medicated
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="cholesterolMeds"
                                value="Unmedicated"
                                checked={formData.cholesterolMeds === "Unmedicated"}
                                onChange={(e) => updateFormData("cholesterolMeds", e.target.value)}
                                className="h-4 w-4 text-primary mr-2"
                              />
                              Unmedicated
                            </label>
                          </div>
                        )}

                        <label className="flex items-center my-2">
                          <input
                            type="checkbox"
                            checked={formData.riskBP || false}
                            onChange={(e) => updateFormData("riskBP", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          High blood pressure
                        </label>
                        {formData.riskBP && (
                          <div className="ml-6 mt-2 space-y-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="bpMeds"
                                value="Medicated"
                                checked={formData.bpMeds === "Medicated"}
                                onChange={(e) => updateFormData("bpMeds", e.target.value)}
                                className="h-4 w-4 text-primary mr-2"
                              />
                              Medicated
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="bpMeds"
                                value="Unmedicated"
                                checked={formData.bpMeds === "Unmedicated"}
                                onChange={(e) => updateFormData("bpMeds", e.target.value)}
                                className="h-4 w-4 text-primary mr-2"
                              />
                              Unmedicated
                            </label>
                          </div>
                        )}

                        <label className="flex items-center my-2">
                          <input
                            type="checkbox"
                            checked={formData.riskGlucose || false}
                            onChange={(e) => updateFormData("riskGlucose", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          Impaired glucose metabolism
                        </label>
                        {formData.riskGlucose && (
                          <div className="ml-6 mt-2 space-y-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="glucoseMeds"
                                value="Medicated"
                                checked={formData.glucoseMeds === "Medicated"}
                                onChange={(e) => updateFormData("glucoseMeds", e.target.value)}
                                className="h-4 w-4 text-primary mr-2"
                              />
                              Medicated
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="glucoseMeds"
                                value="Unmedicated"
                                checked={formData.glucoseMeds === "Unmedicated"}
                                onChange={(e) => updateFormData("glucoseMeds", e.target.value)}
                                className="h-4 w-4 text-primary mr-2"
                              />
                              Unmedicated
                            </label>
                          </div>
                        )}

                        <label className="flex items-center my-2">
                          <input
                            type="checkbox"
                            checked={formData.riskSkinCancer || false}
                            onChange={(e) => updateFormData("riskSkinCancer", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          History of skin cancer / sig. sun exposure
                        </label>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Other biomedical risks:</label>
                          <textarea
                            value={formData.otherBiomedicalRisks || ""}
                            onChange={(e) => updateFormData("otherBiomedicalRisks", e.target.value)}
                            className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter other risks..."
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-4 pb-2 border-b border-primary/20">
                          Significant family history
                        </h3>

                        <label className="flex items-center my-2">
                          <input
                            type="checkbox"
                            checked={formData.fhBreast || false}
                            onChange={(e) => updateFormData("fhBreast", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          Breast cancer
                        </label>
                        {formData.fhBreast && (
                          <div className="ml-6 mt-2">
                            <textarea
                              value={formData.fhBreastDetails || ""}
                              onChange={(e) => updateFormData("fhBreastDetails", e.target.value)}
                              className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Details..."
                            />
                          </div>
                        )}

                        <label className="flex items-center my-2">
                          <input
                            type="checkbox"
                            checked={formData.fhDiabetes || false}
                            onChange={(e) => updateFormData("fhDiabetes", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          Diabetes
                        </label>
                        {formData.fhDiabetes && (
                          <div className="ml-6 mt-2">
                            <textarea
                              value={formData.fhDiabetesDetails || ""}
                              onChange={(e) => updateFormData("fhDiabetesDetails", e.target.value)}
                              className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Details..."
                            />
                          </div>
                        )}

                        <label className="flex items-center my-2">
                          <input
                            type="checkbox"
                            checked={formData.fhColorectal || false}
                            onChange={(e) => updateFormData("fhColorectal", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          Colorectal Cancer
                        </label>
                        {formData.fhColorectal && (
                          <div className="ml-6 mt-2">
                            <textarea
                              value={formData.fhColorectalDetails || ""}
                              onChange={(e) => updateFormData("fhColorectalDetails", e.target.value)}
                              className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Details..."
                            />
                          </div>
                        )}

                        <label className="flex items-center my-2">
                          <input
                            type="checkbox"
                            checked={formData.fhMental || false}
                            onChange={(e) => updateFormData("fhMental", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          Mental Health conditions
                        </label>
                        {formData.fhMental && (
                          <div className="ml-6 mt-2">
                            <textarea
                              value={formData.fhMentalDetails || ""}
                              onChange={(e) => updateFormData("fhMentalDetails", e.target.value)}
                              className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Details..."
                            />
                          </div>
                        )}

                        <label className="flex items-center my-2">
                          <input
                            type="checkbox"
                            checked={formData.fhOther || false}
                            onChange={(e) => updateFormData("fhOther", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          Other chronic disease
                        </label>
                        {formData.fhOther && (
                          <div className="ml-6 mt-2">
                            <textarea
                              value={formData.fhOtherDetails || ""}
                              onChange={(e) => updateFormData("fhOtherDetails", e.target.value)}
                              className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Details..."
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SNAP-Ed Assessment */}
              <div>
                <SectionHeader
                  title="SNAP-Ed Assessment"
                  isOpen={openSections.snapEd}
                  onToggle={() => toggleSection("snapEd")}
                />
                {openSections.snapEd && (
                  <div className="p-6 space-y-4">
                    <p className="text-muted-foreground mb-4">
                      Assessment of Smoking, Nutrition, Alcohol, Physical Activity, and Emotional Wellbeing.
                    </p>

                    <div className="space-y-4">
                      {/* Smoking */}
                      <div className="p-4 border border-input rounded-lg">
                        <div className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            checked={formData.assessSmoking || false}
                            onChange={(e) => updateFormData("assessSmoking", e.target.checked)}
                            className="h-4 w-4 text-primary mr-3"
                          />
                          <label className="font-semibold">S - Smoking Status</label>
                        </div>
                        {formData.assessSmoking && (
                          <div className="mt-3 pt-3 border-t border-input">
                            <div className="flex items-center space-x-4">
                              <select
                                value={formData.smokingStatus || ""}
                                onChange={(e) => updateFormData("smokingStatus", e.target.value)}
                                className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                              >
                                <option value="">Select status...</option>
                                <option value="current">Current Smoker</option>
                                <option value="ex">Ex-smoker</option>
                                <option value="non">Non-smoker</option>
                              </select>
                              {formData.smokingStatus === "current" && (
                                <input
                                  type="text"
                                  value={formData.smokingPackYears || ""}
                                  onChange={(e) => updateFormData("smokingPackYears", e.target.value)}
                                  className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                  placeholder="Pack Years..."
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Nutrition */}
                      <div className="p-4 border border-input rounded-lg">
                        <div className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            checked={formData.assessNutrition || false}
                            onChange={(e) => updateFormData("assessNutrition", e.target.checked)}
                            className="h-4 w-4 text-primary mr-3"
                          />
                          <label className="font-semibold">N - Nutrition</label>
                        </div>
                        {formData.assessNutrition && (
                          <div className="mt-3 pt-3 border-t border-input">
                            <div className="flex items-center space-x-4">
                              <select
                                value={formData.nutritionStatus || ""}
                                onChange={(e) => updateFormData("nutritionStatus", e.target.value)}
                                className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                              >
                                <option value="">Select diet type...</option>
                                <option value="balanced">Balanced</option>
                                <option value="poor">Poor</option>
                              </select>
                              {formData.nutritionStatus && (
                                <input
                                  type="text"
                                  value={formData.nutritionDetails || ""}
                                  onChange={(e) => updateFormData("nutritionDetails", e.target.value)}
                                  className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                  placeholder="Details..."
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Alcohol */}
                      <div className="p-4 border border-input rounded-lg">
                        <div className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            checked={formData.assessAlcohol || false}
                            onChange={(e) => updateFormData("assessAlcohol", e.target.checked)}
                            className="h-4 w-4 text-primary mr-3"
                          />
                          <label className="font-semibold">A - Alcohol</label>
                        </div>
                        {formData.assessAlcohol && (
                          <div className="mt-3 pt-3 border-t border-input">
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={formData.alcoholDrinks || ""}
                                onChange={(e) => updateFormData("alcoholDrinks", e.target.value)}
                                className="w-1/2 p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Standard drinks"
                              />
                              <select
                                value={formData.alcoholPeriod || "week"}
                                onChange={(e) => updateFormData("alcoholPeriod", e.target.value)}
                                className="w-1/2 p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                              >
                                <option value="week">per week</option>
                                <option value="day">per day</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Physical Activity */}
                      <div className="p-4 border border-input rounded-lg">
                        <div className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            checked={formData.assessActivity || false}
                            onChange={(e) => updateFormData("assessActivity", e.target.checked)}
                            className="h-4 w-4 text-primary mr-3"
                          />
                          <label className="font-semibold">P - Physical Activity</label>
                        </div>
                        {formData.assessActivity && (
                          <div className="mt-3 pt-3 border-t border-input">
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={formData.activityMinutes || ""}
                                onChange={(e) => updateFormData("activityMinutes", e.target.value)}
                                className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Minutes of exercise"
                              />
                              <span className="text-muted-foreground">per week</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Emotional Wellbeing */}
                    <div className="mt-6 pt-6 border-t-2 border-dashed border-primary/30">
                      <div className="p-4 border border-input rounded-lg bg-muted/50">
                        <div className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            checked={formData.assessMood || false}
                            onChange={(e) => updateFormData("assessMood", e.target.checked)}
                            className="h-4 w-4 text-primary mr-3"
                          />
                          <label className="font-semibold">E - Emotional Wellbeing (Depression Screening)</label>
                        </div>
                        {formData.assessMood && (
                          <div className="mt-3 pt-3 border-t border-input">
                            <div className="flex items-center space-x-4">
                              <select
                                value={formData.moodTool || ""}
                                onChange={(e) => updateFormData("moodTool", e.target.value)}
                                className="w-1/3 p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                              >
                                <option value="">Select Tool...</option>
                                <option value="K10">K10</option>
                                <option value="DASS21">DASS-21</option>
                              </select>
                              <input
                                type="text"
                                value={formData.moodScore || ""}
                                readOnly
                                className="w-1/3 p-2 border border-input rounded-md bg-muted"
                                placeholder="Score"
                              />
                              <Button
                                onClick={() => openAssessmentModal(formData.moodTool, "moodScore")}
                                disabled={!formData.moodTool}
                                className="w-1/3"
                              >
                                Launch Assessment
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Examination & Investigations */}
              <div>
                <SectionHeader
                  title="Examination & Investigations"
                  isOpen={openSections.examination}
                  onToggle={() => toggleSection("examination")}
                />
                {openSections.examination && (
                  <div className="p-6 space-y-6">
                    <h3 className="font-semibold text-lg mb-4 pb-2 border-b border-primary/20">Examination</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Blood Pressure (mmHg):</label>
                        <input
                          type="text"
                          value={formData.bp || ""}
                          onChange={(e) => updateFormData("bp", e.target.value)}
                          className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="e.g., 120/80"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Heart Rate:</label>
                          <input
                            type="number"
                            value={formData.hr || ""}
                            onChange={(e) => updateFormData("hr", e.target.value)}
                            className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Rhythm:</label>
                          <select
                            value={formData.hrRhythm || "Regular"}
                            onChange={(e) => updateFormData("hrRhythm", e.target.value)}
                            className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="Regular">Regular</option>
                            <option value="Irregular">Irregular</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Height (cm):</label>
                        <input
                          type="number"
                          value={formData.heightCm || ""}
                          onChange={(e) => {
                            updateFormData("heightCm", e.target.value)
                            updateFormData("bmi", calculateBMI(formData.weightKg, e.target.value))
                          }}
                          className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Weight (kg):</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.weightKg || ""}
                          onChange={(e) => {
                            updateFormData("weightKg", e.target.value)
                            updateFormData("bmi", calculateBMI(e.target.value, formData.heightCm))
                          }}
                          className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Waist Circumference (cm):</label>
                        <input
                          type="number"
                          value={formData.waist || ""}
                          onChange={(e) => updateFormData("waist", e.target.value)}
                          className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">BMI (kg/m²):</label>
                        <input
                          type="text"
                          value={formData.bmi || ""}
                          readOnly
                          className="w-full p-2 border border-input rounded-md bg-muted"
                        />
                      </div>
                    </div>

                    <label className="flex items-center my-2">
                      <input
                        type="checkbox"
                        checked={formData.examCvs || false}
                        onChange={(e) => updateFormData("examCvs", e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      Cardiovascular examination
                    </label>
                    {formData.examCvs && (
                      <div className="ml-6 mt-2">
                        <textarea
                          value={formData.examCvsDetails || ""}
                          onChange={(e) => updateFormData("examCvsDetails", e.target.value)}
                          className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Findings..."
                        />
                      </div>
                    )}

                    <label className="flex items-center my-2">
                      <input
                        type="checkbox"
                        checked={formData.examResp || false}
                        onChange={(e) => updateFormData("examResp", e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      Respiratory examination
                    </label>
                    {formData.examResp && (
                      <div className="ml-6 mt-2">
                        <textarea
                          value={formData.examRespDetails || ""}
                          onChange={(e) => updateFormData("examRespDetails", e.target.value)}
                          className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Findings..."
                        />
                      </div>
                    )}

                    <label className="flex items-center my-2">
                      <input
                        type="checkbox"
                        checked={formData.examAbdo || false}
                        onChange={(e) => updateFormData("examAbdo", e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      Abdominal examination
                    </label>
                    {formData.examAbdo && (
                      <div className="ml-6 mt-2">
                        <textarea
                          value={formData.examAbdoDetails || ""}
                          onChange={(e) => updateFormData("examAbdoDetails", e.target.value)}
                          className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Findings..."
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-1">Other examination findings:</label>
                      <textarea
                        value={formData.examOther || ""}
                        onChange={(e) => updateFormData("examOther", e.target.value)}
                        className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div className="mt-6">
                      <h3 className="font-semibold text-lg mb-4 pb-2 border-b border-primary/20">Investigations</h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.invFastingLipids || false}
                            onChange={(e) => updateFormData("invFastingLipids", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          Fasting lipids ordered/reviewed
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.invFastingGlucose || false}
                            onChange={(e) => updateFormData("invFastingGlucose", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          Fasting glucose/HbA1c ordered/reviewed
                        </label>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-1">Other relevant investigations:</label>
                        <textarea
                          value={formData.investigationsOther || ""}
                          onChange={(e) => updateFormData("investigationsOther", e.target.value)}
                          className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Plan & Recommendations */}
              <div>
                <SectionHeader
                  title="Plan & Recommendations"
                  isOpen={openSections.plan}
                  onToggle={() => toggleSection("plan")}
                />
                {openSections.plan && (
                  <div className="p-6 space-y-6">
                    <h3 className="font-semibold text-lg mb-4 pb-2 border-b border-primary/20">
                      Recommended actions, screening and immunisations
                    </h3>

                    <div>
                      <h4 className="font-semibold mb-2">Assessments</h4>
                      <div className="pl-2 space-y-2">
                        {formData.patientGender === "female" && (
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.recMenopauseAssessment || false}
                              onChange={(e) => updateFormData("recMenopauseAssessment", e.target.checked)}
                              className="h-4 w-4 text-primary mr-2"
                            />
                            Menopause assessment
                          </label>
                        )}
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.recHeartHealthAssessment || false}
                            onChange={(e) => updateFormData("recHeartHealthAssessment", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          Heart Health Assessment
                        </label>
                        {formData.patientAtsi && (
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.recAtsiAssessment || false}
                              onChange={(e) => updateFormData("recAtsiAssessment", e.target.checked)}
                              className="h-4 w-4 text-primary mr-2"
                            />
                            ATSI health assessment
                          </label>
                        )}
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.recDiabetesRiskAssessment || false}
                            onChange={(e) => updateFormData("recDiabetesRiskAssessment", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          40-49 YO Type 2 Diabetes Risk Evaluation
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Screening</h4>
                      <div className="pl-2 space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.recBowelScreening || false}
                            onChange={(e) => updateFormData("recBowelScreening", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          Bowel screening
                        </label>
                        {formData.patientGender === "female" && (
                          <>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.recBreastScreening || false}
                                onChange={(e) => updateFormData("recBreastScreening", e.target.checked)}
                                className="h-4 w-4 text-primary mr-2"
                              />
                              Breast screening
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.recCervicalScreening || false}
                                onChange={(e) => updateFormData("recCervicalScreening", e.target.checked)}
                                className="h-4 w-4 text-primary mr-2"
                              />
                              Cervical screening
                            </label>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Immunisations</h4>
                      <div className="pl-2 space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.recFluVax || false}
                            onChange={(e) => updateFormData("recFluVax", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          Annual influenza immunisation
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.recCovidVax || false}
                            onChange={(e) => updateFormData("recCovidVax", e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          COVID-19 immunisation
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Detail the management plan, referrals, and follow-up actions:
                      </label>
                      <textarea
                        value={formData.planRecommendations || updateAutomaticRecommendations()}
                        onChange={(e) => updateFormData("planRecommendations", e.target.value)}
                        rows={8}
                        className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-primary/20">
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    onClick={clearForm}
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                  >
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
        </div>
      </div>
    </div>
  )
}
