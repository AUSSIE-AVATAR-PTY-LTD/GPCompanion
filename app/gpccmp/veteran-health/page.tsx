"use client"
import { useState, useEffect, useCallback } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
interface FormData {
  [key: string]: string | boolean | number
}
interface AssessmentModal {
  isOpen: boolean
  tool: string
  targetInput: string
  title: string
  content: string
  score: number | string
}
const LOCAL_STORAGE_KEY = "adfHealthAssessmentData"
export default function VeteranHealthPage() {
  const [formData, setFormData] = useState<FormData>({})
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    mbs: true,
    patient: true,
    service: true,
    social: true,
    history: true,
    risks: true,
    snap: true,
    examination: true,
    concerns: true,
    plan: true,
  })
  const [assessmentModal, setAssessmentModal] = useState<AssessmentModal>({
    isOpen: false,
    tool: "",
    targetInput: "",
    title: "",
    content: "",
    score: 0,
  })
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [lastAutoRecs, setLastAutoRecs] = useState("")
  const [lastCompletedAssessment, setLastCompletedAssessment] = useState<any>(null)
  const [modalAnswers, setModalAnswers] = useState<{ [key: string]: string }>({})
  const [generatedReport, setGeneratedReport] = useState<string>("") // New state for report preview

  // Auto-save functionality
  const debouncedSave = useCallback(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData))
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [formData])
  useEffect(() => {
    const cleanup = debouncedSave()
    return cleanup
  }, [debouncedSave])
  // Check for saved data on load
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedData) {
      setShowRestoreModal(true)
    }
  }, [])
  useEffect(() => {
    if (formData["patient-name"] === "big brother!") {
      setShowEasterEgg(true)
    }
  }, [formData["patient-name"]])
  const restoreSession = () => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
    setShowRestoreModal(false)
  }
  const startFresh = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    setShowRestoreModal(false)
  }
  const clearForm = () => {
    setFormData({})
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    setLastAutoRecs("")
    setLastCompletedAssessment(null)
    setGeneratedReport("") // Clear report preview
    setShowClearModal(false)
  }
  const updateFormData = (key: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setTimeout(() => updateManagementPlan(), 100)
  }
  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }
  const calculateAge = () => {
    const dob = formData["patient-dob"] as string
    if (!dob) return null
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
    return age
  }
  const calculateBMI = () => {
    const height = Number.parseFloat(formData["height-cm"] as string)
    const weight = Number.parseFloat(formData["weight-kg"] as string)
    if (height > 0 && weight > 0) {
      return (weight / (height / 100) ** 2).toFixed(2)
    }
    return ""
  }
  const interpretBMI = (bmi: string) => {
    const bmiValue = Number.parseFloat(bmi)
    if (isNaN(bmiValue)) return ""
    if (bmiValue < 18.5) return "Underweight"
    if (bmiValue < 25) return "Healthy"
    if (bmiValue < 30) return "Overweight"
    return "Obese"
  }
  const calculateSocialIsolationScore = () => {
    let score = 0
    for (let i = 0; i < 3; i++) {
      const value = formData[`social-q${i}`] as string
      if (value) score += Number.parseInt(value)
    }
    return score
  }
  const getSocialIsolationInterpretation = (score: number) => {
    if (score >= 3 && score <= 5) return "Not Lonely"
    if (score >= 6 && score <= 7) return "Moderately Lonely"
    if (score >= 8) return "Severely Lonely"
    return "Score not calculated"
  }
  const updateManagementPlan = () => {
    const autoRecs = new Set<string>()
    const isChecked = (id: string) => formData[id] as boolean
    const getValue = (id: string) => (formData[id] as string) || ""
    // BMI Triggers
    const bmi = calculateBMI()
    const bmiValue = Number.parseFloat(bmi)
    if (!isNaN(bmiValue)) {
      if (bmiValue >= 30) {
        autoRecs.add(
          "- Patient has obesity (BMI ≥ 30). Discussed eligibility for a GP Management Plan (GPMP) and referral to a dietitian/exercise physiologist.",
        )
      } else if (bmiValue >= 25) {
        autoRecs.add(
          "- Patient is overweight (BMI 25-29.9). Discussed lifestyle modifications including diet and exercise to achieve a healthy weight.",
        )
      } else if (bmiValue < 18.5) {
        autoRecs.add(
          "- Patient is underweight (BMI < 18.5). Discussed nutritional assessment and strategies for healthy weight gain. Consider investigating for underlying causes.",
        )
      }
    }
    // Heart Rate Trigger
    if (getValue("hr-rhythm") === "Irregular") {
      autoRecs.add(
        "- Irregular pulse noted. Recommend ECG to investigate for potential arrhythmia (e.g., Atrial Fibrillation).",
      )
    }
    // Biomedical Risk Triggers
    if (isChecked("risk-cholesterol")) autoRecs.add("- Review and optimise treatment of dyslipidaemia.")
    if (isChecked("risk-bp")) autoRecs.add("- Review and optimise treatment of hypertension.")
    if (isChecked("risk-glucose")) autoRecs.add("- Review and optimise treatment of impaired glucose metabolism.")
    // SNAP Triggers
    if (getValue("smoking-status") === "current") {
      autoRecs.add(
        "- Discuss smoking cessation strategies, including nicotine replacement therapy and counseling support (e.g., Quitline 13 7848).",
      )
    }
    if (getValue("nutrition-status") === "poor") {
      autoRecs.add(
        "- Encourage a balanced diet including at least 5 servings of vegetables and 2 servings of fruit daily. Consider referral to a dietitian.",
      )
    }
    const auditC = Number.parseInt(getValue("audit-c-score"), 10)
    if (!isNaN(auditC) && auditC >= 5) {
      autoRecs.add(
        "- AUDIT-C score suggests unhealthy alcohol intake. Discussed safe alcohol limits and offered support resources (e.g., Open Arms, local drug and alcohol services).",
      )
    }
    const activity = Number.parseInt(getValue("activity-minutes"), 10)
    if (!isNaN(activity) && activity < 150) {
      autoRecs.add("- Recommend aiming for at least 150 minutes of moderate-intensity aerobic activity per week.")
    }
    // Veteran-Specific Triggers
    if (isChecked("exam-pain"))
      autoRecs.add("- Develop a pain management plan, consider referral to a pain specialist or physiotherapist.")
    if (isChecked("sleep-issues"))
      autoRecs.add("- Provide sleep hygiene advice and consider further assessment for sleep disorders.")
    if (isChecked("anger-issues"))
      autoRecs.add(
        "- Consider referral to anger management resources or psychology via a Mental Health Treatment Plan (e.g., Open Arms - Veterans & Families Counselling).",
      )
    if (isChecked("risk-harm"))
      autoRecs.add(
        "- IMMEDIATE ACTION: Enacted safety plan and arranged urgent referral to mental health services (e.g., local CATT/PECT, Open Arms 24/7 support line 1800 011 046).",
      )
    // Social Isolation Trigger
    const socialScore = calculateSocialIsolationScore()
    if (socialScore >= 6) {
      autoRecs.add(
        "- Patient may be experiencing social isolation. Discussed local community groups, veteran support networks (e.g., RSL, Open Arms), and social prescribing options.",
      )
    }
    const newAutoRecsText = Array.from(autoRecs).join("\n")
    const currentText = getValue("plan-recommendations")
    const userText = currentText.replace(lastAutoRecs, "").trim()
    setFormData((prev) => ({
      ...prev,
      "plan-recommendations": (newAutoRecsText + (newAutoRecsText && userText ? "\n\n" : "") + userText).trim(),
    }))
    setLastAutoRecs(newAutoRecsText)
  }
  const openAssessmentModal = (tool: string, targetInput: string) => {
    const templates: { [key: string]: any } = {
      K10: {
        title: "Kessler Psychological Distress Scale (K10)",
        questions: [
          "Tired out for no good reason?",
          "Nervous?",
          "So nervous that nothing could calm them down?",
          "So nervous that nothing could calm them down?",
          "Hopeless?",
          "Restless or fidgety?",
          "So restless they could not sit still?",
          "Depressed?",
          "That everything was an effort?",
          "So sad that nothing could cheer them up?",
          "Worthless?",
        ],
        options: [
          "None of the time",
          "A little of the time",
          "Some of the time",
          "Most of the time",
          "All of the time",
        ],
        values: [1, 2, 3, 4, 5],
        maxScore: 50,
      },
      DASS21: {
        title: "Depression Anxiety Stress Scales (DASS-21)",
        questions: [
          { q: "I found it hard to wind down", scale: "stress" },
          { q: "I was aware of dryness of my mouth", scale: "anxiety" },
          { q: "I couldn't seem to experience any positive feeling at all", scale: "depression" },
          { q: "I experienced breathing difficulty", scale: "anxiety" },
          { q: "I found it difficult to work up the initiative to do things", scale: "depression" },
          { q: "I tended to over-react to situations", scale: "stress" },
          { q: "I experienced trembling (e.g. in the hands)", scale: "anxiety" },
          { q: "I felt that I was using a lot of nervous energy", scale: "stress" },
          { q: "I was worried about situations in which I might panic", scale: "anxiety" },
          { q: "I felt that I had nothing to look forward to", scale: "depression" },
          { q: "I found myself getting agitated", scale: "stress" },
          { q: "I found it difficult to relax", scale: "stress" },
          { q: "I felt down-hearted and blue", scale: "depression" },
          { q: "I was intolerant of anything that kept me from getting on", scale: "stress" },
          { q: "I felt I was close to panic", scale: "anxiety" },
          { q: "I was unable to become enthusiastic about anything", scale: "depression" },
          { q: "I felt I was not worth much as a person", scale: "depression" },
          { q: "I felt that I was rather touchy", scale: "stress" },
          { q: "I was aware of the action of my heart in the absence of physical exertion", scale: "anxiety" },
          { q: "I felt scared without any good reason", scale: "anxiety" },
          { q: "I felt that life was meaningless", scale: "depression" },
        ],
        options: [
          "Did not apply to me at all",
          "Applied to me to some degree",
          "Applied to me to a considerable degree",
          "Applied to me very much",
        ],
        values: [0, 1, 2, 3],
      },
      AUDITC: {
        title: "Alcohol Use Disorders Identification Test (AUDIT-C)",
        questions: [
          "How often do you have a drink containing alcohol?",
          "How many standard drinks containing alcohol do you have on a typical day when you are drinking?",
          "How often do you have six or more standard drinks on one occasion?",
        ],
        options: [
          ["Never", "Monthly or less", "2 to 4 times a month", "2 to 3 times a week", "4 or more times a week"],
          ["1 or 2", "3 or 4", "5 or 6", "7, 8, or 9", "10 or more"],
          ["Never", "Less than monthly", "Monthly", "Weekly", "Daily or almost daily"],
        ],
        values: [0, 1, 2, 3, 4],
        maxScore: 12,
      },
      PCL5: {
        title: "PTSD Checklist for DSM-5 (PCL-5)",
        questions: [
          "Repeated, disturbing, and unwanted memories of the stressful experience?",
          "Repeated, disturbing dreams of the stressful experience?",
          "Suddenly feeling or acting as if the stressful experience were actually happening again?",
          "Feeling very upset when something reminded you of the stressful experience?",
          "Having strong physical reactions when something reminded you of the stressful experience?",
          "Avoiding memories, thoughts, or feelings related to the stressful experience?",
          "Avoiding external reminders of the stressful experience?",
          "Trouble remembering important parts of the stressful experience?",
          "Having strong negative beliefs about yourself, other people, or the world?",
          "Blaming yourself or someone else for the stressful experience or what happened after it?",
          "Having strong negative feelings such as fear, horror, anger, guilt, or shame?",
          "Loss of interest in activities you used to enjoy?",
          "Feeling distant or cut off from other people?",
          "Trouble experiencing positive feelings?",
          "Behaving in an irritable or angry way?",
          "Taking too many risks or doing things that could cause you harm?",
          'Being "superalert" or watchful or on guard?',
          "Feeling jumpy or easily startled?",
          "Having difficulty concentrating?",
          "Trouble falling or staying asleep?",
        ],
        options: ["Not at all", "A little bit", "Moderately", "Quite a bit", "Extremely"],
        values: [0, 1, 2, 3, 4],
        maxScore: 80,
      },
    }
    const template = templates[tool]
    if (template) {
      setAssessmentModal({
        isOpen: true,
        tool,
        targetInput,
        title: template.title,
        content: "",
        score: 0,
      })
      setModalAnswers({})
    }
  }
  const closeAssessmentModal = () => {
    setAssessmentModal({
      isOpen: false,
      tool: "",
      targetInput: "",
      title: "",
      content: "",
      score: 0,
    })
    setModalAnswers({})
  }
  const getScoreInterpretation = (tool: string, score: any) => {
    switch (tool) {
      case "K10":
        if (score >= 10 && score <= 19) return "Likely to be well."
        if (score >= 20 && score <= 24) return "Likely to have a mild mental disorder."
        if (score >= 25 && score <= 29) return "Likely to have a moderate mental disorder."
        if (score >= 30) return "Likely to have a severe mental disorder."
        return "Low psychological distress."
      case "DASS21":
        const getCategory = (s: number, scale: string) => {
          const thresholds: { [key: string]: number[] } = {
            depression: [10, 14, 21, 28],
            anxiety: [8, 10, 15, 20],
            stress: [15, 19, 26, 34],
          }
          const labels = ["Normal", "Mild", "Moderate", "Severe", "Extremely Severe"]
          for (let i = 0; i < thresholds[scale].length; i++) {
            if (s < thresholds[scale][i]) return labels[i]
          }
          return labels[4]
        }
        return `Depression: ${getCategory(score.d, "depression")}, Anxiety: ${getCategory(score.a, "anxiety")}, Stress: ${getCategory(score.s, "stress")}`
      case "PCL5":
        if (score >= 31 && score <= 33) return "PTSD is a provisional diagnosis and further assessment is required."
        if (score > 33) return "PTSD is a provisional diagnosis and further assessment is required."
        return "PTSD is unlikely."
      case "AUDITC":
        if (score >= 5) return "Unhealthy alcohol use likely."
        return "Low risk of unhealthy alcohol use."
      default:
        return "Interpretation not available."
    }
  }
  const finalizeAssessment = () => {
    const template = getAssessmentTemplate(assessmentModal.tool)
    if (!template) return
    let finalScore: any = 0
    let interpretation = ""
    if (assessmentModal.tool === "DASS21") {
      let depressionScore = 0,
        anxietyScore = 0,
        stressScore = 0
      template.questions.forEach((q: any, i: number) => {
        const answer = modalAnswers[`q${i}`]
        if (answer) {
          const value = Number.parseInt(answer)
          if (q.scale === "depression") depressionScore += value
          else if (q.scale === "anxiety") anxietyScore += value
          else if (q.scale === "stress") stressScore += value
        }
      })
      const finalDepression = depressionScore * 2
      const finalAnxiety = anxietyScore * 2
      const finalStress = stressScore * 2
      finalScore = { d: finalDepression, a: finalAnxiety, s: finalStress }
      interpretation = getScoreInterpretation("DASS21", finalScore)
      setFormData((prev) => ({
        ...prev,
        [assessmentModal.targetInput]: `D:${finalDepression}, A:${finalAnxiety}, S:${finalStress} | ${interpretation}`,
      }))
    } else {
      Object.values(modalAnswers).forEach((answer) => {
        finalScore += Number.parseInt(answer) || 0
      })
      interpretation = getScoreInterpretation(assessmentModal.tool, finalScore)
      const maxScore = template.maxScore ? ` / ${template.maxScore}` : ""
      setFormData((prev) => ({
        ...prev,
        [assessmentModal.targetInput]: `${finalScore}${maxScore} | ${interpretation}`,
      }))
    }
    closeAssessmentModal()
    updateManagementPlan()
  }
  const getAssessmentTemplate = (tool: string) => {
    const templates: { [key: string]: any } = {
      K10: {
        questions: [
          "Tired out for no good reason?",
          "Nervous?",
          "So nervous that nothing could calm them down?",
          "So nervous that nothing could calm them down?",
          "Hopeless?",
          "Restless or fidgety?",
          "So restless they could not sit still?",
          "So restless they could not sit still?",
          "Depressed?",
          "That everything was an effort?",
          "So sad that nothing could cheer them up?",
          "Worthless?",
        ],
        options: [
          "None of the time",
          "A little of the time",
          "Some of the time",
          "Most of the time",
          "All of the time",
        ],
        values: [1, 2, 3, 4, 5],
        maxScore: 50,
      },
      DASS21: {
        questions: [
          { q: "I found it hard to wind down", scale: "stress" },
          { q: "I was aware of dryness of my mouth", scale: "anxiety" },
          { q: "I couldn't seem to experience any positive feeling at all", scale: "depression" },
          { q: "I experienced breathing difficulty", scale: "anxiety" },
          { q: "I found it difficult to work up the initiative to do things", scale: "depression" },
          { q: "I tended to over-react to situations", scale: "stress" },
          { q: "I experienced trembling (e.g. in the hands)", scale: "anxiety" },
          { q: "I felt that I was using a lot of nervous energy", scale: "stress" },
          { q: "I was worried about situations in which I might panic", scale: "anxiety" },
          { q: "I felt that I had nothing to look forward to", scale: "depression" },
          { q: "I found myself getting agitated", scale: "stress" },
          { q: "I found it difficult to relax", scale: "stress" },
          { q: "I felt down-hearted and blue", scale: "depression" },
          { q: "I was intolerant of anything that kept me from getting on", scale: "stress" },
          { q: "I felt I was close to panic", scale: "anxiety" },
          { q: "I was unable to become enthusiastic about anything", scale: "depression" },
          { q: "I felt I was not worth much as a person", scale: "depression" },
          { q: "I felt that I was rather touchy", scale: "stress" },
          { q: "I was aware of the action of my heart in the absence of physical exertion", scale: "anxiety" },
          { q: "I felt scared without any good reason", scale: "anxiety" },
          { q: "I felt that life was meaningless", scale: "depression" },
        ],
        options: [
          "Did not apply to me at all",
          "Applied to me to some degree",
          "Applied to me to a considerable degree",
          "Applied to me very much",
        ],
        values: [0, 1, 2, 3],
      },
      AUDITC: {
        questions: [
          "How often do you have a drink containing alcohol?",
          "How many standard drinks containing alcohol do you have on a typical day when you are drinking?",
          "How often do you have six or more standard drinks on one occasion?",
        ],
        options: [
          ["Never", "Monthly or less", "2 to 4 times a month", "2 to 3 times a week", "4 or more times a week"],
          ["1 or 2", "3 or 4", "5 or 6", "7, 8, or 9", "10 or more"],
          ["Never", "Less than monthly", "Monthly", "Weekly", "Daily or almost daily"],
        ],
        values: [0, 1, 2, 3, 4],
        maxScore: 12,
      },
      PCL5: {
        questions: [
          "Repeated, disturbing, and unwanted memories of the stressful experience?",
          "Repeated, disturbing dreams of the stressful experience?",
          "Suddenly feeling or acting as if the stressful experience were actually happening again?",
          "Feeling very upset when something reminded you of the stressful experience?",
          "Having strong physical reactions when something reminded you of the stressful experience?",
          "Avoiding memories, thoughts, or feelings related to the stressful experience?",
          "Avoiding external reminders of the stressful experience?",
          "Trouble remembering important parts of the stressful experience?",
          "Having strong negative beliefs about yourself, other people, or the world?",
          "Blaming yourself or someone else for the stressful experience or what happened after it?",
          "Having strong negative feelings such as fear, horror, anger, guilt, or shame?",
          "Loss of interest in activities you used to enjoy?",
          "Feeling distant or cut off from other people?",
          "Trouble experiencing positive feelings?",
          "Behaving in an irritable or angry way?",
          "Taking too many risks or doing things that could cause you harm?",
          'Being "superalert" or watchful or on guard?',
          "Feeling jumpy or easily startled?",
          "Having difficulty concentrating?",
          "Trouble falling or staying asleep?",
        ],
        options: ["Not at all", "A little bit", "Moderately", "Quite a bit", "Extremely"],
        values: [0, 1, 2, 3, 4],
        maxScore: 80,
      },
    }
    return templates[tool]
  }
  const generateReportText = () => { // New function to generate report text
    const age = calculateAge()
    const bmi = calculateBMI()
    const bmiInterpretation = interpretBMI(bmi)
    const today = new Date().toLocaleDateString("en-AU")
    const getValue = (id: string) => (formData[id] as string) || ""
    const isChecked = (id: string) => formData[id] as boolean
    let report = `HEALTH ASSESSMENT FOR FORMER SERVING MEMBERS OF THE AUSTRALIAN DEFENCE FORCE\n`
    report += `MBS Item Number: ${getValue("mbs-item") || "N/A"}\n\n`
    report += `PATIENT DETAILS:\n`
    report += `- Name: ${getValue("patient-name") || "N/A"}\n`
    report += `- DOB: ${formData["patient-dob"] ? new Date(formData["patient-dob"] as string).toLocaleDateString("en-AU") : "N/A"}\n`
    report += `- Age: ${age || "N/A"}\n`
    report += `- Gender: ${getValue("patient-gender") || "N/A"}\n`
    report += `- Medicare: ${getValue("patient-medicare") || "N/A"}\n`
    report += `- Date: ${today}\n`
    report += `- Aboriginal and/or Torres Strait Islander origin: ${isChecked("patient-atsi") ? "Yes" : "No"}\n\n`
    if (getValue("service-history")) {
      report += `SERVICE HISTORY:\n${getValue("service-history")}\n\n`
    }
    if (getValue("discharge-reason")) {
      report += `REASON FOR DISCHARGE:\n${getValue("discharge-reason")}\n\n`
    }
    if (getValue("dva-status")) {
      report += `DVA STATUS:\n${getValue("dva-status")}\n\n`
    }
    // Social History
    const socialItems = []
    if (getValue("relationship-status")) socialItems.push(`- Relationship Status: ${getValue("relationship-status")}`)
    if (getValue("children")) socialItems.push(`- Number of Children: ${getValue("children")}`)
    if (getValue("occupation")) socialItems.push(`- Current Occupation: ${getValue("occupation")}`)
    if (socialItems.length > 0) {
      report += `SOCIAL HISTORY:\n${socialItems.join("\n")}\n\n`
    }
    // Medical History
    if (getValue("past-medical-history")) {
      report += `CURRENT & PAST MEDICAL HISTORY:\n${getValue("past-medical-history")}\n\n`
    }
    if (getValue("regular-medications")) {
      report += `CURRENT MEDICATIONS:\n${getValue("regular-medications")}\n\n`
    }
    // Risk Factors
    const biomedicalRisks = []
    if (isChecked("risk-cholesterol")) biomedicalRisks.push("- High cholesterol")
    if (isChecked("risk-bp")) biomedicalRisks.push("- High blood pressure")
    if (isChecked("risk-glucose")) biomedicalRisks.push("- Impaired glucose metabolism")
    if (getValue("other-biomedical-risks")) biomedicalRisks.push(`- Other: ${getValue("other-biomedical-risks")}`)
    if (biomedicalRisks.length > 0) {
      report += `BIOMEDICAL RISK FACTORS:\n${biomedicalRisks.join("\n")}\n\n`
    }
    // SNAP Assessment
    const snapItems = []
    if (isChecked("assess-smoking")) snapItems.push(`- Smoking: ${getValue("smoking-status") || "Not specified"}`)
    if (isChecked("assess-nutrition")) snapItems.push(`- Nutrition: ${getValue("nutrition-status") || "Not specified"}`)
    if (isChecked("assess-alcohol")) snapItems.push(`- Alcohol: AUDIT-C Score: ${getValue("audit-c-score") || "N/A"}`)
    if (isChecked("assess-activity"))
      snapItems.push(`- Physical Activity: ${getValue("activity-minutes") || "N/A"} minutes per week`)
    if (snapItems.length > 0) {
      report += `SNAP ASSESSMENT:\n${snapItems.join("\n")}\n\n`
    }
    // Examination
    const examFindings = [
      `- Blood Pressure: ${getValue("bp") || "N/A"} mmHg`,
      `- Heart Rate: ${getValue("hr") || "N/A"} bpm (${getValue("hr-rhythm") || "Regular"})`,
      `- Height: ${getValue("height-cm") || "N/A"} cm`,
      `- Weight: ${getValue("weight-kg") || "N/A"} kg`,
      `- Waist: ${getValue("waist") || "N/A"} cm`,
      `- BMI: ${bmi || "N/A"} kg/m² (${bmiInterpretation})`,
    ]
    if (getValue("exam-other")) examFindings.push(`- Other Findings: ${getValue("exam-other")}`)
    report += `EXAMINATION:\n${examFindings.join("\n")}\n\n`
    // Mental Health
    const mentalHealthItems = []
    if (isChecked("risk-harm")) mentalHealthItems.push("- Risk of harm to self/others ASSESSED")
    if (isChecked("assess-mood")) {
      const moodScore = getValue("mood-score")
      mentalHealthItems.push(`- Emotional Wellbeing: ${getValue("mood-tool") || "N/A"} Score: ${moodScore || "N/A"}`)
    }
    if (isChecked("assess-social-isolation")) {
      const score = calculateSocialIsolationScore()
      const interpretation = getSocialIsolationInterpretation(score)
      mentalHealthItems.push(`- Social Isolation: Score: ${score}/9 (${interpretation})`)
    }
    if (mentalHealthItems.length > 0) {
      report += `MENTAL HEALTH & WELLBEING:\n${mentalHealthItems.join("\n")}\n\n`
    }
    if (getValue("other-concerns")) {
      report += `PATIENT'S OTHER HEALTH CONCERNS:\n${getValue("other-concerns")}\n\n`
    }
    if (getValue("plan-recommendations")) {
      report += `MANAGEMENT PLAN, REFERRALS, AND FOLLOW-UP ACTIONS:\n${getValue("plan-recommendations")}\n\n`
    }
    return report
  }
  const generateReport = (format: "txt" | "rtf") => {
    const report = generateReportText()
    let content = report
    let mimeType = "text/plain"
    let extension = "txt"
    if (format === "rtf") {
      let rtfReport = `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Inter;}}\\pard\\sa0\\sl276\\slmult1 `
      rtfReport += `{\\pard\\qc\\b\\fs32 ${report.replace(/\\/g, "\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}").replace(/\n/g, "\\par\n")}\\par}`
      rtfReport += `}`
      content = rtfReport
      mimeType = "application/rtf"
      extension = "rtf"
    }
    const fileName = `ADF_Veteran_Assessment_${((formData["patient-name"] as string) || "report").replace(/ /g, "_")}.${extension}`
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  const previewReport = () => { // New function to preview report
    const report = generateReportText()
    setGeneratedReport(report)
  }
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReport)
      .then(() => alert("Report copied to clipboard!"))
      .catch(() => alert("Failed to copy report."))
  }
  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <div
      className="bg-transparent text-xl font-bold text-primary px-6 py-3 flex justify-between items-center cursor-pointer border-b border-primary/20"
      onClick={() => toggleSection(section)}
    >
      <h2>{title}</h2>
      {openSections[section] ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
    </div>
  )
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">
              Health Assessment for Former Serving Members of the Australian Defence Force
            </h1>
            <p className="text-muted-foreground">GP Health Assessment Tool</p>
            <p className="text-sm font-semibold mt-4">Developed by Dr Bobby Tork MD, FRACGP-RG</p>
            <p className="text-xs text-muted-foreground mt-1">© 2025 Dr Bobby Tork</p>
          </div>
          {/* Service History */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="Service History" section="service" />
            {openSections.service && (
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-medium mb-1">Branch of Service</label>
                    <select
                      value={(formData["service-branch"] as string) || ""}
                      onChange={(e) => updateFormData("service-branch", e.target.value)}
                      className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                    >
                      <option value="">Select branch</option>
                      <option value="Army">Army</option>
                      <option value="Navy">Navy</option>
                      <option value="Air Force">Air Force</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Years of Service</label>
                    <input
                      type="number"
                      value={(formData["service-years"] as string) || ""}
                      onChange={(e) => updateFormData("service-years", e.target.value)}
                      className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-medium mb-1">Service Number</label>
                    <input
                      type="text"
                      value={(formData["service-number"] as string) || ""}
                      onChange={(e) => updateFormData("service-number", e.target.value)}
                      className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">DVA File Number</label>
                    <input
                      type="text"
                      value={(formData["dva-number"] as string) || ""}
                      onChange={(e) => updateFormData("dva-number", e.target.value)}
                      className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Deployments/Operations</label>
                  <textarea
                    value={(formData["deployments"] as string) || ""}
                    onChange={(e) => updateFormData("deployments", e.target.value)}
                    className="block w-full px-3 py-2 bg-muted border border-input rounded-md h-20"
                    placeholder="List deployments, operations, and locations"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Service-Related Injuries/Conditions</label>
                  <textarea
                    value={(formData["service-injuries"] as string) || ""}
                    onChange={(e) => updateFormData("service-injuries", e.target.value)}
                    className="block w-full px-3 py-2 bg-muted border border-input rounded-md h-20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(formData["dva-pension"] as boolean) || false}
                      onChange={(e) => updateFormData("dva-pension", e.target.checked)}
                      className="mr-2"
                    />
                    DVA Disability Pension
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(formData["dva-healthcare"] as boolean) || false}
                      onChange={(e) => updateFormData("dva-healthcare", e.target.checked)}
                      className="mr-2"
                    />
                    DVA Healthcare Card
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(formData["exposure-history"] as boolean) || false}
                      onChange={(e) => updateFormData("exposure-history", e.target.checked)}
                      className="mr-2"
                    />
                    History of Chemical/Environmental Exposure
                  </label>
                </div>
              </CardContent>
            )}
          </Card>
          {/* Social History */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="Social History" section="social" />
            {openSections.social && (
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-medium mb-1">Relationship Status</label>
                    <select
                      value={(formData["relationship-status"] as string) || ""}
                      onChange={(e) => updateFormData("relationship-status", e.target.value)}
                      className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                    >
                      <option value="">Select status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="De facto">De facto</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Separated">Separated</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Number of Children</label>
                    <input
                      type="number"
                      value={(formData["children"] as string) || ""}
                      onChange={(e) => updateFormData("children", e.target.value)}
                      className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-medium mb-1">Current Occupation</label>
                    <input
                      type="text"
                      value={(formData["occupation"] as string) || ""}
                      onChange={(e) => updateFormData("occupation", e.target.value)}
                      className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Housing Status</label>
                    <select
                      value={(formData["housing-status"] as string) || ""}
                      onChange={(e) => updateFormData("housing-status", e.target.value)}
                      className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                    >
                      <option value="">Select status</option>
                      <option value="Own home">Own home</option>
                      <option value="Renting">Renting</option>
                      <option value="Living with family">Living with family</option>
                      <option value="Homeless">Homeless</option>
                      <option value="Supported accommodation">Supported accommodation</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Social Support Network</label>
                  <textarea
                    value={(formData["social-support"] as string) || ""}
                    onChange={(e) => updateFormData("social-support", e.target.value)}
                    className="block w-full px-3 py-2 bg-muted border border-input rounded-md h-20"
                    placeholder="Describe family, friends, community connections"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(formData["financial-stress"] as boolean) || false}
                      onChange={(e) => updateFormData("financial-stress", e.target.checked)}
                      className="mr-2"
                    />
                    Financial stress/difficulties
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(formData["social-isolation"] as boolean) || false}
                      onChange={(e) => updateFormData("social-isolation", e.target.checked)}
                      className="mr-2"
                    />
                    Social isolation concerns
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(formData["legal-issues"] as boolean) || false}
                      onChange={(e) => updateFormData("legal-issues", e.target.checked)}
                      className="mr-2"
                    />
                    Legal issues
                  </label>
                </div>
              </CardContent>
            )}
          </Card>
          {/* History & Medication */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="History & Medication" section="history" />
            {openSections.history && (
              <CardContent className="p-6">
                <div className="mb-4">
                  <label className="block font-medium mb-1">Past Medical History</label>
                  <textarea
                    value={(formData["past-medical-history"] as string) || ""}
                    onChange={(e) => updateFormData("past-medical-history", e.target.value)}
                    className="block w-full px-3 py-2 bg-muted border border-input rounded-md h-24"
                    placeholder="Include significant medical conditions, surgeries, hospitalizations"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Current Medications</label>
                  <textarea
                    value={(formData["current-medications"] as string) || ""}
                    onChange={(e) => updateFormData("current-medications", e.target.value)}
                    className="block w-full px-3 py-2 bg-muted border border-input rounded-md h-24"
                    placeholder="List all current medications including dose and frequency"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Allergies</label>
                  <textarea
                    value={(formData["allergies"] as string) || ""}
                    onChange={(e) => updateFormData("allergies", e.target.value)}
                    className="block w-full px-3 py-2 bg-muted border border-input rounded-md h-20"
                    placeholder="Drug allergies, environmental allergies, food allergies"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Family History</label>
                  <textarea
                    value={(formData["family-history"] as string) || ""}
                    onChange={(e) => updateFormData("family-history", e.target.value)}
                    className="block w-full px-3 py-2 bg-muted border border-input rounded-md h-20"
                    placeholder="Significant family medical history"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(formData["medication-review"] as boolean) || false}
                      onChange={(e) => updateFormData("medication-review", e.target.checked)}
                      className="mr-2"
                    />
                    Medication review completed
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(formData["medication-adherence"] as boolean) || false}
                      onChange={(e) => updateFormData("medication-adherence", e.target.checked)}
                      className="mr-2"
                    />
                    Medication adherence concerns
                  </label>
                </div>
              </CardContent>
            )}
          </Card>
          {/* Risk Factor Assessment */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="Risk Factor Assessment" section="risks" />
            {openSections.risks && (
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-primary border-b border-primary/20 pb-2">
                      Biomedical Risks
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(formData["risk-cholesterol"] as boolean) || false}
                          onChange={(e) => updateFormData("risk-cholesterol", e.target.checked)}
                          className="h-4 w-4 text-primary mr-2"
                        />
                        High cholesterol
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(formData["risk-bp"] as boolean) || false}
                          onChange={(e) => updateFormData("risk-bp", e.target.checked)}
                          className="h-4 w-4 text-primary mr-2"
                        />
                        High blood pressure
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(formData["risk-glucose"] as boolean) || false}
                          onChange={(e) => updateFormData("risk-glucose", e.target.checked)}
                          className="h-4 w-4 text-primary mr-2"
                        />
                        Impaired glucose metabolism
                      </label>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Other biomedical risks (including exposure history e.g loud noise, burn pits, asbestos or
                          other chemicals):
                        </label>
                        <textarea
                          value={(formData["other-biomedical-risks"] as string) || ""}
                          onChange={(e) => updateFormData("other-biomedical-risks", e.target.value)}
                          className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                          placeholder="Enter other risks..."
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-primary border-b border-primary/20 pb-2">
                      Significant Family History
                    </h3>
                    <div className="space-y-3">
                      {[
                        { id: "fh-breast", label: "Breast cancer" },
                        { id: "fh-diabetes", label: "Diabetes" },
                        { id: "fh-colorectal", label: "Colorectal Cancer" },
                        { id: "fh-mental", label: "Mental Health conditions" },
                        { id: "fh-other", label: "Other chronic disease" },
                      ].map((item) => (
                        <label key={item.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(formData[item.id] as boolean) || false}
                            onChange={(e) => updateFormData(item.id, e.target.checked)}
                            className="h-4 w-4 text-primary mr-2"
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
          {/* SNAP & Substance Use Assessment */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="SNAP & Substance Use Assessment" section="snap" />
            {openSections.snap && (
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  Assessment of Smoking, Nutrition, Alcohol, Physical Activity, and Substance Use.
                </p>
                <div className="space-y-4">
                  {/* Smoking */}
                  <div className="p-4 border border-input rounded-lg">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={(formData["assess-smoking"] as boolean) || false}
                        onChange={(e) => updateFormData("assess-smoking", e.target.checked)}
                        className="h-4 w-4 text-primary mr-3"
                      />
                      <label className="font-semibold">S - Smoking Status</label>
                    </div>
                    {formData["assess-smoking"] && (
                      <div className="ml-7">
                        <select
                          value={(formData["smoking-status"] as string) || ""}
                          onChange={(e) => updateFormData("smoking-status", e.target.value)}
                          className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                        >
                          <option value="">Select status...</option>
                          <option value="current">Current Smoker</option>
                          <option value="ex">Ex-smoker</option>
                          <option value="non">Non-smoker</option>
                        </select>
                        {formData["smoking-status"] === "current" && (
                          <input
                            type="text"
                            value={(formData["smoking-pack-years"] as string) || ""}
                            onChange={(e) => updateFormData("smoking-pack-years", e.target.value)}
                            className="block w-full px-3 py-2 bg-muted border border-input rounded-md mt-2"
                            placeholder="Pack Years..."
                          />
                        )}
                      </div>
                    )}
                  </div>
                  {/* Nutrition */}
                  <div className="p-4 border border-input rounded-lg">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={(formData["assess-nutrition"] as boolean) || false}
                        onChange={(e) => updateFormData("assess-nutrition", e.target.checked)}
                        className="h-4 w-4 text-primary mr-3"
                      />
                      <label className="font-semibold">N - Nutrition</label>
                    </div>
                    {formData["assess-nutrition"] && (
                      <div className="ml-7">
                        <select
                          value={(formData["nutrition-status"] as string) || ""}
                          onChange={(e) => updateFormData("nutrition-status", e.target.value)}
                          className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                        >
                          <option value="">Select diet type...</option>
                          <option value="balanced">Balanced</option>
                          <option value="poor">Poor</option>
                        </select>
                      </div>
                    )}
                  </div>
                  {/* Alcohol */}
                  <div className="p-4 border border-input rounded-lg">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={(formData["assess-alcohol"] as boolean) || false}
                        onChange={(e) => updateFormData("assess-alcohol", e.target.checked)}
                        className="h-4 w-4 text-primary mr-3"
                      />
                      <label className="font-semibold">A - Alcohol</label>
                    </div>
                    {formData["assess-alcohol"] && (
                      <div className="ml-7 flex items-center space-x-4">
                        <input
                          type="text"
                          value={(formData["audit-c-score"] as string) || ""}
                          onChange={(e) => updateFormData("audit-c-score", e.target.value)}
                          className="block w-1/2 px-3 py-2 bg-muted border border-input rounded-md"
                          placeholder="AUDIT-C Score"
                        />
                        <Button onClick={() => openAssessmentModal("AUDITC", "audit-c-score")} className="w-1/2">
                          Launch AUDIT-C
                        </Button>
                      </div>
                    )}
                  </div>
                  {/* Physical Activity */}
                  <div className="p-4 border border-input rounded-lg">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={(formData["assess-activity"] as boolean) || false}
                        onChange={(e) => updateFormData("assess-activity", e.target.checked)}
                        className="h-4 w-4 text-primary mr-3"
                      />
                      <label className="font-semibold">P - Physical Activity</label>
                    </div>
                    {formData["assess-activity"] && (
                      <div className="ml-7 flex items-center space-x-2">
                        <input
                          type="number"
                          value={(formData["activity-minutes"] as string) || ""}
                          onChange={(e) => updateFormData("activity-minutes", e.target.value)}
                          className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                          placeholder="Minutes of exercise"
                        />
                        <span className="text-muted-foreground">per week</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
          {/* Examination & Investigations */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="Examination & Investigations" section="examination" />
            {openSections.examination && (
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-primary border-b border-primary/20 pb-2">Examination</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Blood Pressure (mmHg):</label>
                    <input
                      type="text"
                      value={(formData["bp"] as string) || ""}
                      onChange={(e) => updateFormData("bp", e.target.value)}
                      className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                      placeholder="e.g., 120/80"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Heart Rate:</label>
                      <input
                        type="number"
                        value={(formData["hr"] as string) || ""}
                        onChange={(e) => updateFormData("hr", e.target.value)}
                        className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Rhythm:</label>
                      <select
                        value={(formData["hr-rhythm"] as string) || "Regular"}
                        onChange={(e) => updateFormData("hr-rhythm", e.target.value)}
                        className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
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
                      value={(formData["height-cm"] as string) || ""}
                      onChange={(e) => {
                        updateFormData("height-cm", e.target.value)
                        // Auto-calculate BMI
                        const height = Number.parseFloat(e.target.value)
                        const weight = Number.parseFloat(formData["weight-kg"] as string)
                        if (height > 0 && weight > 0) {
                          const bmi = (weight / (height / 100) ** 2).toFixed(2)
                          updateFormData("bmi", bmi)
                        }
                      }}
                      className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Weight (kg):</label>
                    <input
                      type="number"
                      value={(formData["weight-kg"] as string) || ""}
                      onChange={(e) => {
                        updateFormData("weight-kg", e.target.value)
                        // Auto-calculate BMI
                        const weight = Number.parseFloat(e.target.value)
                        const height = Number.parseFloat(formData["height-cm"] as string)
                        if (height > 0 && weight > 0) {
                          const bmi = (weight / (height / 100) ** 2).toFixed(2)
                          updateFormData("bmi", bmi)
                        }
                      }}
                      className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Waist Circumference (cm):</label>
                    <input
                      type="number"
                      value={(formData["waist"] as string) || ""}
                      onChange={(e) => updateFormData("waist", e.target.value)}
                      className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="block text-sm font-medium">BMI (kg/m²):</label>
                    <input
                      type="text"
                      value={calculateBMI()}
                      readOnly
                      className="block w-1/2 px-3 py-2 bg-muted border border-input rounded-md"
                    />
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        interpretBMI(calculateBMI()) === "Healthy"
                          ? "bg-green-100 text-green-800"
                          : interpretBMI(calculateBMI()) === "Overweight"
                            ? "bg-yellow-100 text-yellow-800"
                            : interpretBMI(calculateBMI()) === "Obese" || interpretBMI(calculateBMI()) === "Underweight"
                              ? "bg-red-100 text-red-800"
                              : ""
                      }`}
                    >
                      {interpretBMI(calculateBMI())}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  {[
                    { id: "exam-cvs", label: "Cardiovascular examination" },
                    { id: "exam-resp", label: "Respiratory examination" },
                    { id: "exam-abdo", label: "Abdominal examination" },
                    { id: "exam-hearing", label: "Hearing assessment (for hearing loss or tinnitus)" },
                    { id: "exam-pain", label: "Patient reports bodily pain" },
                  ].map((item) => (
                    <label key={item.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData[item.id] as boolean) || false}
                        onChange={(e) => updateFormData(item.id, e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Other examination findings:</label>
                  <textarea
                    value={(formData["exam-other"] as string) || ""}
                    onChange={(e) => updateFormData("exam-other", e.target.value)}
                    className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                  />
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-primary border-b border-primary/20 pb-2">
                    Mental Health and Wellbeing
                  </h3>
                  <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <label className="flex items-center font-semibold text-red-800">
                      <input
                        type="checkbox"
                        checked={(formData["risk-harm"] as boolean) || false}
                        onChange={(e) => updateFormData("risk-harm", e.target.checked)}
                        className="h-4 w-4 text-red-600 mr-2"
                      />
                      Risk of harm to self or others
                    </label>
                  </div>
                  <div className="p-4 border border-input rounded-lg mb-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={(formData["assess-mood"] as boolean) || false}
                        onChange={(e) => updateFormData("assess-mood", e.target.checked)}
                        className="h-4 w-4 text-primary mr-3"
                      />
                      <label className="font-semibold">Emotional Wellbeing Screening</label>
                    </div>
                    {formData["assess-mood"] && (
                      <div className="ml-7 flex items-center space-x-4">
                        <select
                          value={(formData["mood-tool"] as string) || ""}
                          onChange={(e) => updateFormData("mood-tool", e.target.value)}
                          className="block w-1/3 px-3 py-2 bg-muted border border-input rounded-md"
                        >
                          <option value="">Select Tool...</option>
                          <option value="K10">K10</option>
                          <option value="DASS21">DASS-21</option>
                          <option value="PCL5">PCL-5 (PTSD)</option>
                        </select>
                        <input
                          type="text"
                          value={(formData["mood-score"] as string) || ""}
                          onChange={(e) => updateFormData("mood-score", e.target.value)}
                          className="block w-1/3 px-3 py-2 bg-muted border border-input rounded-md"
                          placeholder="Score"
                          readOnly
                        />
                        <Button
                          onClick={() => openAssessmentModal(formData["mood-tool"] as string, "mood-score")}
                          disabled={!formData["mood-tool"]}
                          className="w-1/3"
                        >
                          Launch Assessment
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border border-input rounded-lg mb-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={(formData["assess-social-isolation"] as boolean) || false}
                        onChange={(e) => updateFormData("assess-social-isolation", e.target.checked)}
                        className="h-4 w-4 text-primary mr-3"
                      />
                      <label className="font-semibold">Social Isolation Screening (3-Item Loneliness Scale)</label>
                    </div>
                    {formData["assess-social-isolation"] && (
                      <div className="ml-7">
                        <p className="text-muted-foreground mb-4 text-sm">Ask the patient "How often do you feel..."</p>
                        <div className="space-y-4">
                          {["...that you lack companionship?", "...left out?", "...isolated from others?"].map(
                            (question, i) => (
                              <div key={i}>
                                <p className="font-medium mb-2">
                                  {i + 1}. {question}
                                </p>
                                <div className="flex space-x-4 text-sm">
                                  {["Hardly ever", "Some of the time", "Often"].map((option, j) => (
                                    <label key={j} className="flex items-center">
                                      <input
                                        type="radio"
                                        name={`social-q${i}`}
                                        value={j + 1}
                                        checked={formData[`social-q${i}`] === (j + 1).toString()}
                                        onChange={(e) => updateFormData(`social-q${i}`, e.target.value)}
                                        className="mr-1"
                                      />
                                      {option}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                        <div className="mt-4 p-3 bg-muted rounded-md text-center font-medium">
                          Score: {calculateSocialIsolationScore()} / 9 (
                          {getSocialIsolationInterpretation(calculateSocialIsolationScore())})
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {[
                      { id: "sleep-issues", label: "Reports sleep difficulties" },
                      { id: "anger-issues", label: "Reports issues with anger" },
                      { id: "sexual-health-assessed", label: "Sexual health assessed" },
                    ].map((item) => (
                      <label key={item.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(formData[item.id] as boolean) || false}
                          onChange={(e) => updateFormData(item.id, e.target.checked)}
                          className="h-4 w-4 text-primary mr-2"
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-primary border-b border-primary/20 pb-2">
                    Investigations
                  </h3>
                  <div className="space-y-3 mb-4">
                    {["Fasting lipids ordered/reviewed", "Fasting glucose/HbA1c ordered/reviewed"].map((item) => (
                      <label key={item} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            (formData[`investigation-${item.toLowerCase().replace(/[^a-z0-9]/g, "-")}`] as boolean) ||
                            false
                          }
                          onChange={(e) =>
                            updateFormData(
                              `investigation-${item.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4 text-primary mr-2"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Other relevant investigations:</label>
                    <textarea
                      value={(formData["investigations-other"] as string) || ""}
                      onChange={(e) => updateFormData("investigations-other", e.target.value)}
                      className="block w-full px-3 py-2 bg-muted border border-input rounded-md"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
          {/* Patient's Other Health Concerns */}
          <Card className="mb-6 border-primary/20">
            <CardContent className="p-6">
              <label className="block font-medium mb-1 text-lg">Patient's Other Health Concerns</label>
              <textarea
                value={(formData["other-concerns"] as string) || ""}
                onChange={(e) => updateFormData("other-concerns", e.target.value)}
                className="block w-full px-3 py-2 bg-muted border border-input rounded-md h-28"
              />
            </CardContent>
          </Card>
          {/* Plan & Recommendations */}
          <Card className="mb-6 border-primary/20">
            <SectionHeader title="Plan & Recommendations" section="plan" />
            {openSections.plan && (
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-primary border-b border-primary/20 pb-2">
                  Recommended actions, screening and immunisations
                </h3>
                <h4 className="font-semibold mb-2">Assessments</h4>
                <div className="pl-2 space-y-2 mb-6">
                  {[
                    { id: "rec-heart-health-assessment", label: "Heart Health Assessment" },
                    { id: "rec-diabetes-risk-assessment", label: "Type 2 Diabetes Risk Evaluation" },
                    { id: "rec-cvc-assessment", label: "CVC (Coordinated Veterans' Care Program) assessment" },
                  ].map((item) => (
                    <label key={item.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData[item.id] as boolean) || false}
                        onChange={(e) => updateFormData(item.id, e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
                <h4 className="font-semibold mb-2">Screening</h4>
                <div className="pl-2 space-y-2 mb-6">
                  {[
                    { id: "rec-bowel-screening", label: "Bowel screening" },
                    {
                      id: "rec-breast-screening",
                      label: "Breast screening",
                      condition: formData["patient-gender"] === "female",
                    },
                    {
                      id: "rec-cervical-screening",
                      label: "Cervical screening",
                      condition: formData["patient-gender"] === "female",
                    },
                  ].map((item) => (
                    <label key={item.id} className={`flex items-center ${item.condition === false ? "hidden" : ""}`}>
                      <input
                        type="checkbox"
                        checked={(formData[item.id] as boolean) || false}
                        onChange={(e) => updateFormData(item.id, e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
                <h4 className="font-semibold mb-2">Immunisations</h4>
                <div className="pl-2 space-y-2 mb-6">
                  {[
                    { id: "rec-flu-vax", label: "Annual influenza immunisation" },
                    { id: "rec-covid-vax", label: "COVID-19 immunisation" },
                  ].map((item) => (
                    <label key={item.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData[item.id] as boolean) || false}
                        onChange={(e) => updateFormData(item.id, e.target.checked)}
                        className="h-4 w-4 text-primary mr-2"
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Detail the management plan, referrals (e.g., Open Arms), and follow-up actions:
                  </label>
                  <textarea
                    value={(formData["plan-recommendations"] as string) || ""}
                    onChange={(e) => updateFormData("plan-recommendations", e.target.value)}
                    className="block w-full px-3 py-2 bg-muted border border-input rounded-md h-48"
                  />
                </div>
              </CardContent>
            )}
          </Card>
          {/* Generated Assessment Report */}
          <Card className="mb-6 border-primary/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Generated Assessment Report</h2>
                <Button onClick={copyToClipboard} disabled={!generatedReport}>
                  Copy to Clipboard
                </Button>
              </div>
              <textarea
                value={generatedReport}
                readOnly
                className="block w-full px-3 py-2 bg-muted border border-input rounded-md h-64"
              />
            </CardContent>
          </Card>
          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setShowClearModal(true)}>
              Clear Form
            </Button>
            <Button onClick={() => generateReport("txt")} className="bg-green-600 hover:bg-green-700">
              Save as .txt
            </Button>
            <Button onClick={() => generateReport("rtf")} className="bg-blue-600 hover:bg-blue-700">
              Save as .rtf
            </Button>
            <Button onClick={previewReport}>
              Generate Report
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4 text-center">
            <h2 className="text-xl font-bold mb-4">Restore Previous Session?</h2>
            <p className="mb-6">We found saved data from your last session. Would you like to restore it?</p>
            <div className="flex justify-center space-x-4">
              <Button onClick={startFresh}>Start Fresh</Button>
              <Button onClick={restoreSession} className="bg-primary">Yes, Restore</Button>
            </div>
          </div>
        </div>
      )}
      {/* Clear Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4 text-center">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="mb-6">All entered data will be lost. This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => setShowClearModal(false)}>Cancel</Button>
              <Button onClick={clearForm} className="bg-red-600">Clear Form</Button>
            </div>
          </div>
        </div>
      )}
      {/* Assessment Modal */}
      {assessmentModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h2 className="text-2xl font-bold">{assessmentModal.title}</h2>
              <div className="flex items-center space-x-4">
                <div className="px-4 py-2 bg-primary/10 rounded-full font-bold text-primary">
                  Score: {assessmentModal.score}
                </div>
                <Button variant="ghost" size="sm" onClick={closeAssessmentModal}>
                  ×
                </Button>
              </div>
            </div>
            <div className="mb-6">
              {assessmentModal.tool === "K10" && (
                <div>
                  <p className="text-muted-foreground mb-4">
                    Over the last 4 weeks, about how often did the patient feel...
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    {getAssessmentTemplate("K10")?.questions.map((question: string, i: number) => (
                      <div key={i} className="mb-6 pb-4 border-b">
                        <p className="font-medium mb-2">
                          {i + 1}. {question}
                        </p>
                        <div className="space-y-2 text-sm">
                          {getAssessmentTemplate("K10")?.options.map((option: string, j: number) => (
                            <label key={j} className="flex items-center">
                              <input
                                type="radio"
                                name={`k10-q${i}`}
                                value={j + 1}
                                checked={modalAnswers[`q${i}`] === (j + 1).toString()}
                                onChange={(e) => {
                                  setModalAnswers((prev) => ({ ...prev, [`q${i}`]: e.target.value }))
                                  // Update score
                                  const newAnswers = { ...modalAnswers, [`q${i}`]: e.target.value }
                                  const score = Object.values(newAnswers).reduce(
                                    (sum, val) => sum + (Number.parseInt(val as string) || 0),
                                    0,
                                  )
                                  setAssessmentModal((prev) => ({ ...prev, score }))
                                }}
                                className="mr-2"
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {assessmentModal.tool === "AUDITC" && (
                <div>
                  <p className="text-muted-foreground mb-4">
                    Please answer the following questions about your alcohol use.
                  </p>
                  {getAssessmentTemplate("AUDITC")?.questions.map((question: string, i: number) => (
                    <div key={i} className="mb-6 pb-4 border-b">
                      <p className="font-medium mb-2">
                        {i + 1}. {question}
                      </p>
                      <div className="space-y-2 text-sm">
                        {getAssessmentTemplate("AUDITC")?.options[i].map((option: string, j: number) => (
                          <label key={j} className="flex items-center">
                            <input
                              type="radio"
                              name={`auditc-q${i}`}
                              value={j}
                              checked={modalAnswers[`q${i}`] === j.toString()}
                              onChange={(e) => {
                                setModalAnswers((prev) => ({ ...prev, [`q${i}`]: e.target.value }))
                                // Update score
                                const newAnswers = { ...modalAnswers, [`q${i}`]: e.target.value }
                                const score = Object.values(newAnswers).reduce(
                                  (sum, val) => sum + (Number.parseInt(val as string) || 0),
                                  0,
                                )
                                setAssessmentModal((prev) => ({ ...prev, score }))
                              }}
                              className="mr-2"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Add other assessment tools similarly */}
            </div>
            <div className="flex justify-end">
              <Button onClick={finalizeAssessment} className="bg-primary">
                Finalise & Close
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Easter Egg Modal */}
      {showEasterEgg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4 text-center">
            <p className="font-semibold">Developed by Dr Bobby Tork MD, FRACGP-RG</p>
            <p className="text-sm">© 2025 Dr Bobby Tork</p>
            <Button onClick={() => setShowEasterEgg(false)} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
