"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp, ArrowLeft, X } from "lucide-react"

// Medical data arrays from the original HTML
const conditions = [
  { id: "diabetes1", name: "Type 1 Diabetes" },
  { id: "diabetes2", name: "Type 2 Diabetes" },
  { id: "obesity", name: "Obesity" },
  { id: "ckd", name: "Chronic Kidney Disease (CKD)" },
  { id: "asthma", name: "Asthma" },
  { id: "copd", name: "COPD" },
  { id: "ischaemic_heart_disease", name: "Ischaemic Heart Disease" },
  { id: "heart_failure", name: "Heart Failure" },
  { id: "atrial_fibrillation", name: "Atrial Fibrillation" },
  { id: "hypertension", name: "Hypertension" },
  { id: "osteoporosis", name: "Osteoporosis" },
  { id: "obstructive_sleep_apnoea", name: "Obstructive Sleep Apnoea" },
  { id: "osteoarthritis", name: "Osteoarthritis" },
  { id: "inflammatory_arthritis", name: "Inflammatory Arthritis (e.g., RA)", specify: true },
  { id: "chronic_pain", name: "Chronic Pain", specify: true },
  { id: "cancer", name: "Cancer", specify: true },
  { id: "mental_health", name: "Mental Health Condition (e.g., Depression, Anxiety)", specify: true },
]

const riskFactors = [
  { id: "alcohol", name: "Excessive Alcohol Use" },
  { id: "drugs", name: "Recreational Drug Use" },
]

const alliedHealth = [
  "Podiatrist",
  "Dietitian",
  "Exercise Physiologist",
  "Physiotherapist",
  "Psychologist",
  "Occupational Therapist",
  "Diabetic Educator",
  "Audiologist",
  "Osteopath",
  "Chiropractor",
  "Aboriginal Health Worker",
  "Social Worker",
]

const healthAssessments = [
  {
    name: "Aboriginal and Torres Strait Islander Health Assessment",
    criteria: { atsi: true },
    text: "ATSI Health Assessment",
  },
  {
    name: "Health Assessment for People Aged 75 Years and Older",
    criteria: { minAge: 75 },
    text: "75+ Health Assessment",
  },
  {
    name: "Health Assessment for People with an Intellectual Disability",
    criteria: {},
    text: "Intellectual Disability Health Assessment",
  },
  {
    name: "Health Assessment for Refugees and Other Humanitarian Entrants",
    criteria: {},
    text: "Refugee Health Assessment",
  },
  {
    name: "Health Assessment for People Aged 45-49 Years at Risk of Chronic Disease",
    criteria: { minAge: 45, maxAge: 49 },
    text: "45-49 Health Assessment",
  },
  {
    name: "Health assessment for people aged 40-49 with a high risk of developing diabetes",
    criteria: { minAge: 40, maxAge: 49 },
    text: "40-49 Diabetes Risk Assessment",
  },
  { name: "Heart Health Assessment", criteria: { heartHealth: true }, text: "Heart Health Assessment" },
  {
    name: "Menopause and Perimenopause Health Assessment",
    criteria: { gender: "female", minAge: 40 },
    text: "Menopause Health Assessment",
  },
]

// Goals and actions data mapping
const dataMap = {
  goals: {
    diabetes1: [
      "Maintain HbA1c between 6.5-7.5%",
      "Attend annual diabetic eye and foot screening",
      "Demonstrate correct insulin administration technique",
      "Develop a sick day management plan",
    ],
    diabetes2: [
      "Achieve and maintain target HbA1c <7%",
      "Engage in 150 mins of moderate-intensity activity/week",
      "Follow a healthy eating plan for diabetes",
      "Complete annual cycle of care",
    ],
    obesity: [
      "Aim for gradual weight loss of 5-10% over 6 months",
      "Incorporate 3-4 sessions of structured exercise/week",
      "Adopt a balanced, calorie-controlled diet",
      "Improve overall physical fitness and mobility",
    ],
    hypertension: [
      "Achieve and maintain a target blood pressure of <140/90 mmHg",
      "Reduce dietary sodium intake",
      "Engage in regular aerobic exercise",
      "Regularly self-monitor blood pressure at home",
    ],
    smoking: [
      "Set a quit date and achieve complete cessation",
      "Develop strategies to cope with cravings",
      "Utilise smoking cessation aids as discussed",
      "Improve cardiovascular and respiratory health",
    ],
  },
  actions: {
    diabetes1: [
      "Monitor blood glucose levels as recommended",
      "Administer insulin as prescribed and rotate injection sites",
    ],
    diabetes2: [
      "Take oral hypoglycaemic agents/insulin as prescribed",
      "Attend annual cycle of care appointments with GP",
    ],
    obesity: ["Keep a food and activity diary", "Engage in regular physical activity"],
    hypertension: ["Monitor blood pressure at home", "Reduce salt in diet and read food labels"],
    smoking: ["Contact Quitline (13 78 48) for support", "Discuss cessation medications (NRT, etc.) with GP"],
  },
  services: {
    diabetes1: ["Endocrinologist review", "Diabetic Educator consultation", "Annual Optometrist and Podiatrist review"],
    diabetes2: [
      "Dietitian for dietary planning",
      "Podiatrist for annual foot check",
      "Exercise Physiologist for tailored exercise plan",
    ],
    obesity: [
      "Dietitian for weight management plan",
      "Exercise Physiologist",
      "Consider referral to weight management clinic",
    ],
    hypertension: [
      "Regular GP review for blood pressure check",
      "Dietitian for DASH diet advice",
      "Home Blood Pressure Monitor",
    ],
    smoking: ["GP counselling and support", "Pharmacist for NRT advice", "Quitline telephone support"],
  },
}

interface FormData {
  [key: string]: any
}

interface SectionState {
  [key: string]: boolean
}

export default function GPCCMPGeneratorPage() {
  const [currentView, setCurrentView] = useState<"selection" | "new" | "review">("selection")
  const [formData, setFormData] = useState<FormData>({
    assessmentDate: new Date().toISOString().slice(0, 10),
    selectedConditions: [],
    selectedRiskFactors: [],
    otherConditions: [],
    goals: [],
    actions: [],
    services: [],
    assessments: [],
    specialists: [],
    reviewDates: [],
    alliedHealthSelected: [],
    otherAllied: [],
  })
  const [reviewData, setReviewData] = useState<FormData>({
    reviewDate: new Date().toISOString().slice(0, 10),
    achievedGoals: [],
    newGoals: [],
    specialists: [],
    alliedHealthSelected: [],
    otherAllied: [],
  })
  const [openSections, setOpenSections] = useState<SectionState>({})
  const [showPatientSummary, setShowPatientSummary] = useState(false)

  // Initialize all sections as open
  useEffect(() => {
    const sections = [
      "patientDetails",
      "myMedicare",
      "consent",
      "conditions",
      "medications",
      "goals",
      "actions",
      "services",
      "assessments",
      "careTeam",
      "planDistribution",
      "planReview",
      "reviewDetails",
      "reviewGoals",
      "teamFeedback",
      "managementUpdates",
      "newReferrals",
      "patientAgreement",
      "nextReview",
    ]
    const initialState: SectionState = {}
    sections.forEach((section) => {
      initialState[section] = true
    })
    setOpenSections(initialState)

    // Set initial review date 3 months from now
    const reviewDate = new Date()
    reviewDate.setMonth(reviewDate.getMonth() + 3)
    setFormData((prev) => ({
      ...prev,
      reviewDates: [reviewDate.toISOString().slice(0, 10)],
    }))
  }, [])

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleInputChange = (field: string, value: any, isReview = false) => {
    if (isReview) {
      setReviewData((prev) => ({ ...prev, [field]: value }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }

    // Auto-save to localStorage
    const key = isReview ? "gpccmp_review_data" : "gpccmp_form_data"
    const data = isReview ? { ...reviewData, [field]: value } : { ...formData, [field]: value }
    localStorage.setItem(key, JSON.stringify(data))
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
    return age
  }

  const formatAusDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const [year, month, day] = dateString.split("-")
    return `${day}/${month}/${year}`
  }

  const handleConditionChange = (conditionId: string, checked: boolean) => {
    const newConditions = checked
      ? [...formData.selectedConditions, conditionId]
      : formData.selectedConditions.filter((id: string) => id !== conditionId)

    handleInputChange("selectedConditions", newConditions)
    updateGeneratedContent(newConditions, formData.selectedRiskFactors, formData.smokingStatus)
  }

  const updateGeneratedContent = (conditions: string[], riskFactors: string[], smokingStatus: string) => {
    const activeGoals = new Set<string>()
    const activeActions = new Set<string>()
    const activeServices = new Set<string>()

    // Add items from selected conditions
    conditions.forEach((conditionId) => {
      if (dataMap.goals[conditionId]) {
        dataMap.goals[conditionId].forEach((item) => activeGoals.add(item))
      }
      if (dataMap.actions[conditionId]) {
        dataMap.actions[conditionId].forEach((item) => activeActions.add(item))
      }
      if (dataMap.services[conditionId]) {
        dataMap.services[conditionId].forEach((item) => activeServices.add(item))
      }
    })

    // Add smoking-related items if current smoker
    if (smokingStatus === "current") {
      if (dataMap.goals["smoking"]) {
        dataMap.goals["smoking"].forEach((item) => activeGoals.add(item))
      }
      if (dataMap.actions["smoking"]) {
        dataMap.actions["smoking"].forEach((item) => activeActions.add(item))
      }
      if (dataMap.services["smoking"]) {
        dataMap.services["smoking"].forEach((item) => activeServices.add(item))
      }
    }

    handleInputChange("goals", Array.from(activeGoals))
    handleInputChange("actions", Array.from(activeActions))
    handleInputChange("services", Array.from(activeServices))
  }

  const addItem = (field: string, value: string, isReview = false) => {
    if (!value.trim()) return
    const currentData = isReview ? reviewData : formData
    const currentItems = currentData[field] || []
    handleInputChange(field, [...currentItems, value.trim()], isReview)
  }

  const removeItem = (field: string, index: number, isReview = false) => {
    const currentData = isReview ? reviewData : formData
    const currentItems = currentData[field] || []
    const newItems = currentItems.filter((_: any, i: number) => i !== index)
    handleInputChange(field, newItems, isReview)
  }

  const exportData = (format: "txt" | "rtf", isReview = false) => {
    const data = isReview ? reviewData : formData
    const title = isReview ? "GPCCMP Review" : "GP Chronic Care Management Plan"
    const date = new Date().toLocaleDateString("en-AU")

    let content = `${title}\nGenerated: ${date}\n${"=".repeat(50)}\n\n`

    if (!isReview) {
      // New GPCCMP export
      content += `PATIENT DETAILS\n`
      content += `Name: ${data.patientName || "N/A"}\n`
      content += `DOB: ${formatAusDate(data.dob)}\n`
      content += `Age: ${calculateAge(data.dob) || "N/A"}\n`
      content += `Gender: ${data.gender || "N/A"}\n`
      content += `Medicare No: ${data.medicareNumber || "N/A"}\n`
      content += `ATSI: ${data.atsiStatus ? "Yes" : "No"}\n\n`

      content += `CHRONIC CONDITIONS\n`
      if (data.selectedConditions?.length > 0) {
        data.selectedConditions.forEach((conditionId: string) => {
          const condition = conditions.find((c) => c.id === conditionId)
          if (condition) content += `• ${condition.name}\n`
        })
      }
      if (data.otherConditions?.length > 0) {
        data.otherConditions.forEach((condition: string) => {
          content += `• ${condition}\n`
        })
      }
      content += `\n`

      content += `CLINICAL COMMENTS\n${data.clinicalComments || "None"}\n\n`

      content += `CURRENT MEDICATIONS\n${data.medicationList || "None listed"}\n\n`

      if (data.goals?.length > 0) {
        content += `HEALTH GOALS\n`
        data.goals.forEach((goal: string) => (content += `• ${goal}\n`))
        content += `\n`
      }

      if (data.actions?.length > 0) {
        content += `PATIENT ACTIONS\n`
        data.actions.forEach((action: string) => (content += `• ${action}\n`))
        content += `\n`
      }

      if (data.services?.length > 0) {
        content += `SERVICES & TREATMENTS\n`
        data.services.forEach((service: string) => (content += `• ${service}\n`))
        content += `\n`
      }
    } else {
      // Review export
      content += `PATIENT DETAILS\n`
      content += `Name: ${data.patientName || "N/A"}\n`
      content += `Review Date: ${formatAusDate(data.reviewDate)}\n\n`

      if (data.achievedGoals?.length > 0) {
        content += `ACHIEVED GOALS\n`
        data.achievedGoals.forEach((goal: string) => (content += `• ${goal}\n`))
        content += `\n`
      }

      if (data.newGoals?.length > 0) {
        content += `NEW/REVISED GOALS\n`
        data.newGoals.forEach((goal: string) => (content += `• ${goal}\n`))
        content += `\n`
      }

      content += `TEAM FEEDBACK\n${data.teamFeedback || "None"}\n\n`
      content += `MEDICATION CHANGES\n${data.updateMedications || "No changes"}\n\n`
      content += `DIAGNOSIS CHANGES\n${data.updateDiagnoses || "No changes"}\n\n`
      content += `ACTION CHANGES\n${data.updateActions || "No changes"}\n\n`
    }

    if (format === "rtf") {
      content = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}\\f0\\fs24 ${content.replace(/\n/g, "\\par ").replace(/•/g, "\\bullet ")}}`
    }

    const blob = new Blob([content], { type: format === "rtf" ? "application/rtf" : "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-${date.replace(/\//g, "-")}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearForm = (isReview = false) => {
    if (isReview) {
      setReviewData({
        reviewDate: new Date().toISOString().slice(0, 10),
        achievedGoals: [],
        newGoals: [],
        specialists: [],
        alliedHealthSelected: [],
        otherAllied: [],
      })
      localStorage.removeItem("gpccmp_review_data")
    } else {
      setFormData({
        assessmentDate: new Date().toISOString().slice(0, 10),
        selectedConditions: [],
        selectedRiskFactors: [],
        otherConditions: [],
        goals: [],
        actions: [],
        services: [],
        assessments: [],
        specialists: [],
        reviewDates: [],
        alliedHealthSelected: [],
        otherAllied: [],
      })
      localStorage.removeItem("gpccmp_form_data")
    }
  }

  const SectionHeader = ({
    title,
    section,
    children,
  }: { title: string; section: string; children: React.ReactNode }) => (
    <div className="border border-primary/20 rounded-lg overflow-hidden mb-6">
      <button
        type="button"
        onClick={() => toggleSection(section)}
        className="w-full bg-transparent text-xl font-bold text-primary px-6 py-4 flex justify-between items-center hover:bg-primary/5 transition-colors border-b border-primary/20"
      >
        <span>{title}</span>
        {openSections[section] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {openSections[section] && <div className="p-6 bg-white">{children}</div>}
    </div>
  )

  const RemovableItem = ({ text, onRemove }: { text: string; onRemove: () => void }) => (
    <div className="p-2 bg-white rounded shadow-sm flex items-center justify-between text-sm border">
      <span>{text}</span>
      <button onClick={onRemove} className="ml-4 text-red-500 hover:text-red-700">
        <X className="w-4 h-4" />
      </button>
    </div>
  )

  if (currentView === "selection") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-primary mb-2">GPCCMP & Review Generator</h1>
              <p className="text-sm font-semibold text-muted-foreground">Developed by Dr Bobby Tork MD, FRACGP-RG</p>
              <p className="text-xs text-muted-foreground mt-1">© 2025 Dr Bobby Tork</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card
                className="p-8 text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all border-2 hover:border-primary"
                onClick={() => setCurrentView("new")}
              >
                <h2 className="text-2xl font-bold text-primary mb-4">Create New GPCCMP</h2>
                <p className="text-muted-foreground">
                  Start a new comprehensive care and coordination management plan for a patient with chronic conditions.
                </p>
              </Card>

              <Card
                className="p-8 text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all border-2 hover:border-primary"
                onClick={() => setCurrentView("review")}
              >
                <h2 className="text-2xl font-bold text-primary mb-4">Review Existing GPCCMP</h2>
                <p className="text-muted-foreground">
                  Review a patient's progress, update their existing plan, and document changes.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" onClick={() => setCurrentView("selection")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Button>

          {currentView === "new" && (
            <div className="space-y-6">
              {/* Patient Details Section */}
              <SectionHeader title="Patient Details" section="patientDetails">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name: <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                      value={formData.patientName || ""}
                      onChange={(e) => handleInputChange("patientName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Date:</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                      value={formData.assessmentDate || ""}
                      onChange={(e) => handleInputChange("assessmentDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DOB:</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                      value={formData.dob || ""}
                      onChange={(e) => handleInputChange("dob", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age:</label>
                    <div className="p-3 bg-gray-100 rounded-md text-center font-medium">
                      {formData.dob ? `Age: ${calculateAge(formData.dob)}` : "Age will be calculated"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medicare No: <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                      value={formData.medicareNumber || ""}
                      onChange={(e) => handleInputChange("medicareNumber", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender:</label>
                    <select
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                      value={formData.gender || ""}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary mr-2"
                        checked={formData.atsiStatus || false}
                        onChange={(e) => handleInputChange("atsiStatus", e.target.checked)}
                      />
                      Aboriginal and/or Torres Strait Islander origin
                    </label>
                  </div>
                </div>
              </SectionHeader>

              <SectionHeader title="MyMedicare Registration" section="myMedicare">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient's regular GP</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                      value={formData.regularGp || ""}
                      onChange={(e) => handleInputChange("regularGp", e.target.value)}
                      placeholder="Enter GP name..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Is the patient registered with MyMedicare at this clinic?
                    </label>
                    <div className="mt-2 space-x-6">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="myMedicare"
                          value="yes"
                          className="h-4 w-4 text-primary"
                          checked={formData.myMedicare === "yes"}
                          onChange={(e) => handleInputChange("myMedicare", e.target.value)}
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="myMedicare"
                          value="no"
                          className="h-4 w-4 text-primary"
                          checked={formData.myMedicare === "no"}
                          onChange={(e) => handleInputChange("myMedicare", e.target.value)}
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                    {formData.myMedicare === "no" && (
                      <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                        <p className="text-sm text-yellow-800">
                          <strong>Action Required:</strong> Please encourage and assist the patient with registering for
                          MyMedicare at this clinic to access enhanced benefits.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </SectionHeader>

              <SectionHeader title="Patient Consent" section="consent">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary mt-1"
                      checked={formData.consentPlan || false}
                      onChange={(e) => handleInputChange("consentPlan", e.target.checked)}
                    />
                    <label className="ml-3 text-sm font-medium text-gray-700">
                      I confirm that the patient has provided their informed consent for the creation of this GPCCMP.
                    </label>
                  </div>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary mt-1"
                      checked={formData.consentShare || false}
                      onChange={(e) => handleInputChange("consentShare", e.target.checked)}
                    />
                    <label className="ml-3 text-sm font-medium text-gray-700">
                      I confirm the patient has provided their consent to sharing relevant information (including
                      relevant parts of the plan) with the members of the multidisciplinary team.
                    </label>
                  </div>
                </div>
              </SectionHeader>

              <SectionHeader title="Chronic Health Conditions and Risk Factors" section="conditions">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Chronic Conditions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {conditions.map((condition) => (
                        <div key={condition.id} className="flex items-start">
                          <input
                            type="checkbox"
                            id={condition.id}
                            className="h-4 w-4 text-primary mt-1"
                            checked={formData.selectedConditions?.includes(condition.id) || false}
                            onChange={(e) => handleConditionChange(condition.id, e.target.checked)}
                          />
                          <label htmlFor={condition.id} className="ml-3 text-sm font-medium text-gray-700">
                            {condition.name}
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 space-y-2">
                      {formData.otherConditions?.map((condition: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                            value={condition}
                            onChange={(e) => {
                              const newConditions = [...formData.otherConditions]
                              newConditions[index] = e.target.value
                              handleInputChange("otherConditions", newConditions)
                            }}
                            placeholder="Enter other chronic condition..."
                          />
                          <button
                            onClick={() => removeItem("otherConditions", index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" onClick={() => addItem("otherConditions", "")} className="mt-2">
                      Add Other Condition
                    </Button>
                  </div>

                  <div className="border-t pt-6">
                    <label className="block text-lg font-semibold text-gray-800 mb-2">
                      Clinical Summary & Comments
                    </label>
                    <textarea
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                      rows={4}
                      value={formData.clinicalComments || ""}
                      onChange={(e) => handleInputChange("clinicalComments", e.target.value)}
                      placeholder="Enter any additional clinical notes, summary, or comments here..."
                    />
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Factors</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Smoking Status</label>
                          <select
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                            value={formData.smokingStatus || "never"}
                            onChange={(e) => {
                              handleInputChange("smokingStatus", e.target.value)
                              updateGeneratedContent(
                                formData.selectedConditions,
                                formData.selectedRiskFactors,
                                e.target.value,
                              )
                            }}
                          >
                            <option value="never">Never smoked</option>
                            <option value="current">Current smoker</option>
                            <option value="ex">Ex-smoker</option>
                          </select>
                        </div>
                        {(formData.smokingStatus === "current" || formData.smokingStatus === "ex") && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pack Years</label>
                            <input
                              type="number"
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                              value={formData.packYears || ""}
                              onChange={(e) => handleInputChange("packYears", e.target.value)}
                              placeholder="e.g., 20"
                            />
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {riskFactors.map((factor) => (
                          <div key={factor.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={factor.id}
                              className="h-4 w-4 text-primary"
                              checked={formData.selectedRiskFactors?.includes(factor.id) || false}
                              onChange={(e) => {
                                const newFactors = e.target.checked
                                  ? [...(formData.selectedRiskFactors || []), factor.id]
                                  : (formData.selectedRiskFactors || []).filter((id: string) => id !== factor.id)
                                handleInputChange("selectedRiskFactors", newFactors)
                              }}
                            />
                            <label htmlFor={factor.id} className="ml-3 text-sm font-medium text-gray-700">
                              {factor.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SectionHeader>

              <SectionHeader title="Current Medication List" section="medications">
                <textarea
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                  rows={6}
                  value={formData.medicationList || ""}
                  onChange={(e) => handleInputChange("medicationList", e.target.value)}
                  placeholder="Enter current medications, including dose and frequency..."
                />
              </SectionHeader>

              <SectionHeader title="Health and lifestyle goals" section="goals">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Developed by the patient and medical practitioner using a shared decision making approach.
                  </p>
                  <div className="p-4 bg-primary/5 rounded-lg min-h-[150px] space-y-2">
                    {formData.goals?.length > 0 ? (
                      formData.goals.map((goal: string, index: number) => (
                        <RemovableItem key={index} text={goal} onRemove={() => removeItem("goals", index)} />
                      ))
                    ) : (
                      <p className="text-gray-500 italic">Goals will appear here as conditions are selected.</p>
                    )}
                  </div>
                  <div className="flex gap-4 pt-4 border-t">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                      placeholder="Add a custom goal..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addItem("goals", (e.target as HTMLInputElement).value)
                          ;(e.target as HTMLInputElement).value = ""
                        }
                      }}
                    />
                    <Button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addItem("goals", input.value)
                        input.value = ""
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </SectionHeader>

              <SectionHeader title="Actions to be taken by the patient" section="actions">
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg min-h-[150px] space-y-2">
                    {formData.actions?.length > 0 ? (
                      formData.actions.map((action: string, index: number) => (
                        <RemovableItem key={index} text={action} onRemove={() => removeItem("actions", index)} />
                      ))
                    ) : (
                      <p className="text-gray-500 italic">Patient actions will appear here.</p>
                    )}
                  </div>
                  <div className="flex gap-4 pt-4 border-t">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                      placeholder="Add a custom action..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addItem("actions", (e.target as HTMLInputElement).value)
                          ;(e.target as HTMLInputElement).value = ""
                        }
                      }}
                    />
                    <Button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addItem("actions", input.value)
                        input.value = ""
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </SectionHeader>

              <SectionHeader title="Treatment and services the patient is likely to need" section="services">
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg min-h-[150px] space-y-2">
                    {formData.services?.length > 0 ? (
                      formData.services.map((service: string, index: number) => (
                        <RemovableItem key={index} text={service} onRemove={() => removeItem("services", index)} />
                      ))
                    ) : (
                      <p className="text-gray-500 italic">Treatments and services will appear here.</p>
                    )}
                  </div>
                  <div className="flex gap-4 pt-4 border-t">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                      placeholder="Add a custom service..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addItem("services", (e.target as HTMLInputElement).value)
                          ;(e.target as HTMLInputElement).value = ""
                        }
                      }}
                    />
                    <Button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addItem("services", input.value)
                        input.value = ""
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </SectionHeader>

              <SectionHeader title="Care Team Members" section="careTeam">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Allied Health (for Team Care Arrangements - TCA)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {alliedHealth.map((item) => {
                        const safeId = `ah_${item.replace(/\s+/g, "")}`
                        return (
                          <div key={safeId} className="flex items-center">
                            <input
                              type="checkbox"
                              id={safeId}
                              className="h-4 w-4 text-primary"
                              checked={formData.alliedHealthSelected?.includes(item) || false}
                              onChange={(e) => {
                                const newSelected = e.target.checked
                                  ? [...(formData.alliedHealthSelected || []), item]
                                  : (formData.alliedHealthSelected || []).filter(
                                      (selected: string) => selected !== item,
                                    )
                                handleInputChange("alliedHealthSelected", newSelected)
                              }}
                            />
                            <label htmlFor={safeId} className="ml-3 text-sm font-medium text-gray-700">
                              {item}
                            </label>
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-4 space-y-2">
                      {formData.otherAllied?.map((item: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                            value={item}
                            onChange={(e) => {
                              const newItems = [...formData.otherAllied]
                              newItems[index] = e.target.value
                              handleInputChange("otherAllied", newItems)
                            }}
                            placeholder="Enter other allied health..."
                          />
                          <button
                            onClick={() => removeItem("otherAllied", index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" onClick={() => addItem("otherAllied", "")} className="mt-2">
                      Add Other Allied Health
                    </Button>

                    <div className="mt-6 pt-4 border-t">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="pharmacistDMMR"
                          className="h-4 w-4 text-primary"
                          checked={formData.pharmacistDMMR || false}
                          onChange={(e) => handleInputChange("pharmacistDMMR", e.target.checked)}
                        />
                        <label htmlFor="pharmacistDMMR" className="ml-3 text-sm font-medium text-gray-700">
                          Pharmacist (DMMR, Item 900)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Specialists</h3>
                    <div className="space-y-2 mb-4">
                      {formData.specialists?.length > 0 ? (
                        formData.specialists.map((specialist: string, index: number) => (
                          <RemovableItem
                            key={index}
                            text={specialist}
                            onRemove={() => removeItem("specialists", index)}
                          />
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No specialists added yet.</p>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                        placeholder="Enter specialist name and practice..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            addItem("specialists", (e.target as HTMLInputElement).value)
                            ;(e.target as HTMLInputElement).value = ""
                          }
                        }}
                      />
                      <Button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          addItem("specialists", input.value)
                          input.value = ""
                        }}
                      >
                        Add Specialist
                      </Button>
                    </div>
                  </div>
                </div>
              </SectionHeader>

              <SectionHeader title="Plan Distribution" section="planDistribution">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="copyOffered"
                    className="h-4 w-4 text-primary mt-1"
                    checked={formData.copyOffered || false}
                    onChange={(e) => handleInputChange("copyOffered", e.target.checked)}
                  />
                  <label htmlFor="copyOffered" className="ml-3 text-sm font-medium text-gray-700">
                    A copy of this plan was offered to patient or patient's carer.
                  </label>
                </div>
              </SectionHeader>

              <SectionHeader title="Plan Review" section="planReview">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review Dates</label>
                  <div className="space-y-2 mb-4">
                    {formData.reviewDates?.map((date: string, index: number) => (
                      <RemovableItem
                        key={index}
                        text={formatAusDate(date)}
                        onRemove={() => removeItem("reviewDates", index)}
                      />
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="date"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addItem("reviewDates", (e.target as HTMLInputElement).value)
                          ;(e.target as HTMLInputElement).value = ""
                        }
                      }}
                    />
                    <Button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addItem("reviewDates", input.value)
                        input.value = ""
                      }}
                    >
                      Add Review Date
                    </Button>
                  </div>
                </div>
              </SectionHeader>
            </div>
          )}

          {currentView === "review" && (
            <div className="space-y-6">
              <SectionHeader title="Patient & Review Details" section="reviewDetails">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name: <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                      value={reviewData.patientName || ""}
                      onChange={(e) => handleInputChange("patientName", e.target.value, true)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of this Review:</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                      value={reviewData.reviewDate || ""}
                      onChange={(e) => handleInputChange("reviewDate", e.target.value, true)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DOB:</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                      value={reviewData.dob || ""}
                      onChange={(e) => handleInputChange("dob", e.target.value, true)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age:</label>
                    <div className="p-3 bg-gray-100 rounded-md text-center font-medium">
                      {reviewData.dob ? `Age: ${calculateAge(reviewData.dob)}` : "Age will be calculated"}
                    </div>
                  </div>
                </div>
              </SectionHeader>

              <SectionHeader title="Review of Patient Goals" section="reviewGoals">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Achieved Goals</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Add goals from the original plan that have been successfully achieved.
                    </p>
                    <div className="p-4 bg-primary/5 rounded-lg min-h-[150px] space-y-2">
                      {reviewData.achievedGoals?.length > 0 ? (
                        reviewData.achievedGoals.map((goal: string, index: number) => (
                          <RemovableItem
                            key={index}
                            text={goal}
                            onRemove={() => removeItem("achievedGoals", index, true)}
                          />
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No achieved goals added.</p>
                      )}
                    </div>
                    <div className="flex gap-4 mt-4 pt-4 border-t">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                        placeholder="Enter achieved goal..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            addItem("achievedGoals", (e.target as HTMLInputElement).value, true)
                            ;(e.target as HTMLInputElement).value = ""
                          }
                        }}
                      />
                      <Button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          addItem("achievedGoals", input.value, true)
                          input.value = ""
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="mt-3 flex items-center">
                      <input
                        type="checkbox"
                        id="noAchievedGoals"
                        className="h-4 w-4 text-primary"
                        checked={reviewData.noAchievedGoals || false}
                        onChange={(e) => handleInputChange("noAchievedGoals", e.target.checked, true)}
                      />
                      <label htmlFor="noAchievedGoals" className="ml-2 text-sm text-gray-700">
                        None
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">New / Revised Goals</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Add any new goals or existing goals that have been revised.
                    </p>
                    <div className="p-4 bg-primary/5 rounded-lg min-h-[150px] space-y-2">
                      {reviewData.newGoals?.length > 0 ? (
                        reviewData.newGoals.map((goal: string, index: number) => (
                          <RemovableItem key={index} text={goal} onRemove={() => removeItem("newGoals", index, true)} />
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No new or revised goals added.</p>
                      )}
                    </div>
                    <div className="flex gap-4 mt-4 pt-4 border-t">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                        placeholder="Enter new or revised goal..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            addItem("newGoals", (e.target as HTMLInputElement).value, true)
                            ;(e.target as HTMLInputElement).value = ""
                          }
                        }}
                      />
                      <Button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          addItem("newGoals", input.value, true)
                          input.value = ""
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="mt-3 flex items-center">
                      <input
                        type="checkbox"
                        id="noNewGoals"
                        className="h-4 w-4 text-primary"
                        checked={reviewData.noNewGoals || false}
                        onChange={(e) => handleInputChange("noNewGoals", e.target.checked, true)}
                      />
                      <label htmlFor="noNewGoals" className="ml-2 text-sm text-gray-700">
                        None
                      </label>
                    </div>
                  </div>
                </div>
              </SectionHeader>

              <SectionHeader title="Feedback from Multidisciplinary Team" section="teamFeedback">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document any information, correspondence or feedback from specialists, allied health, or other team
                    members since the last plan.
                  </label>
                  <textarea
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                    rows={6}
                    value={reviewData.teamFeedback || ""}
                    onChange={(e) => handleInputChange("teamFeedback", e.target.value, true)}
                    placeholder="e.g., 'Received letter from Dr. Smith (Cardiologist) noting good BP control...', 'Patient reports physio has helped with mobility...'"
                  />
                </div>
              </SectionHeader>

              <SectionHeader title="Updates to Management Plan" section="managementUpdates">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">Changes to Medications</label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="noMedicationChange"
                          className="h-4 w-4 text-primary"
                          checked={reviewData.noMedicationChange || false}
                          onChange={(e) => handleInputChange("noMedicationChange", e.target.checked, true)}
                        />
                        <label htmlFor="noMedicationChange" className="ml-2 text-sm text-gray-700">
                          No Change
                        </label>
                      </div>
                    </div>
                    <textarea
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md disabled:bg-gray-200 disabled:cursor-not-allowed"
                      rows={6}
                      value={reviewData.noMedicationChange ? "No Change" : reviewData.updateMedications || ""}
                      onChange={(e) => handleInputChange("updateMedications", e.target.value, true)}
                      disabled={reviewData.noMedicationChange}
                      placeholder="List any new medications, ceased medications, or dose changes."
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Changes to Diagnoses / Conditions
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="noDiagnosisChange"
                          className="h-4 w-4 text-primary"
                          checked={reviewData.noDiagnosisChange || false}
                          onChange={(e) => handleInputChange("noDiagnosisChange", e.target.checked, true)}
                        />
                        <label htmlFor="noDiagnosisChange" className="ml-2 text-sm text-gray-700">
                          No Change
                        </label>
                      </div>
                    </div>
                    <textarea
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md disabled:bg-gray-200 disabled:cursor-not-allowed"
                      rows={6}
                      value={reviewData.noDiagnosisChange ? "No Change" : reviewData.updateDiagnoses || ""}
                      onChange={(e) => handleInputChange("updateDiagnoses", e.target.value, true)}
                      disabled={reviewData.noDiagnosisChange}
                      placeholder="List any new or resolved health conditions."
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Changes to Patient Actions / Services
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="noActionChange"
                          className="h-4 w-4 text-primary"
                          checked={reviewData.noActionChange || false}
                          onChange={(e) => handleInputChange("noActionChange", e.target.checked, true)}
                        />
                        <label htmlFor="noActionChange" className="ml-2 text-sm text-gray-700">
                          No Change
                        </label>
                      </div>
                    </div>
                    <textarea
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md disabled:bg-gray-200 disabled:cursor-not-allowed"
                      rows={6}
                      value={reviewData.noActionChange ? "No Change" : reviewData.updateActions || ""}
                      onChange={(e) => handleInputChange("updateActions", e.target.value, true)}
                      disabled={reviewData.noActionChange}
                      placeholder="List any new actions, goals, or required services."
                    />
                  </div>
                </div>
              </SectionHeader>

              <SectionHeader title="Patient Agreement & Consent" section="patientAgreement">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="consentUpdates"
                      className="h-4 w-4 text-primary mt-1"
                      checked={reviewData.consentUpdates || false}
                      onChange={(e) => handleInputChange("consentUpdates", e.target.checked, true)}
                    />
                    <label htmlFor="consentUpdates" className="ml-3 text-sm font-medium text-gray-700">
                      The patient agrees with the reviewed plan and all documented updates.
                    </label>
                  </div>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="reviewConsentShare"
                      className="h-4 w-4 text-primary mt-1"
                      checked={reviewData.consentShare || false}
                      onChange={(e) => handleInputChange("consentShare", e.target.checked, true)}
                    />
                    <label htmlFor="reviewConsentShare" className="ml-3 text-sm font-medium text-gray-700">
                      The patient provides consent to share relevant updated information with existing and/or new
                      members of the multidisciplinary care team.
                    </label>
                  </div>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="reviewCopyOffered"
                      className="h-4 w-4 text-primary mt-1"
                      checked={reviewData.copyOffered || false}
                      onChange={(e) => handleInputChange("copyOffered", e.target.checked, true)}
                    />
                    <label htmlFor="reviewCopyOffered" className="ml-3 text-sm font-medium text-gray-700">
                      A copy of this updated plan was offered to the patient and/or their carer.
                    </label>
                  </div>
                </div>
              </SectionHeader>

              <SectionHeader title="Next Plan Review" section="nextReview">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Set date for next scheduled review
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                    value={reviewData.nextReviewDate || ""}
                    onChange={(e) => handleInputChange("nextReviewDate", e.target.value, true)}
                  />
                </div>
              </SectionHeader>

              <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-lg">
                <h4 className="font-bold text-lg mb-2">Practitioner Checklist (Not for Export)</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Ensure this review document is added to the patient's medical records.</li>
                  <li>Ensure copies are provided to the patient/carer as agreed.</li>
                  <li>Ensure relevant updated parts of the plan are sent to the care team members.</li>
                </ul>
              </div>
            </div>
          )}

          <div className="mt-8 mb-6 flex flex-wrap gap-4">
            <Button onClick={() => clearForm(currentView === "review")} variant="outline">
              Clear Form
            </Button>
            {currentView === "new" && (
              <Button onClick={() => setShowPatientSummary(true)} variant="outline">
                Patient Summary
              </Button>
            )}
            <Button onClick={() => exportData("txt", currentView === "review")} variant="outline">
              Export as .txt
            </Button>
            <Button onClick={() => exportData("rtf", currentView === "review")} variant="outline">
              Export as .rtf
            </Button>
          </div>

          {/* Privacy Notice */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 text-center">
              <strong>Privacy Notice:</strong> All data is saved locally in your browser and never transmitted to our
              servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
