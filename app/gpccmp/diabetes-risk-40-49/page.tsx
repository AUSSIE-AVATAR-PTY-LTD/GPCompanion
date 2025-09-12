"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import Link from "next/link"

// SectionHeader component for consistent styling
const SectionHeader = ({ title, isOpen, onToggle }: { title: string; isOpen: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between p-4 bg-transparent border-b border-primary/20 hover:bg-primary/5 transition-colors"
  >
    <h3 className="text-xl font-bold text-primary">{title}</h3>
    {isOpen ? <ChevronUp className="h-5 w-5 text-primary" /> : <ChevronDown className="h-5 w-5 text-primary" />}
  </button>
)

export default function DiabetesRisk4049Page() {
  // Form state management
  const [formData, setFormData] = useState({
    // Patient Details
    patientAge: "",
    patientGender: "",
    patientWeight: "",
    patientHeight: "",
    patientBMI: "",

    // Risk Factors
    familyHistory: "",
    previousGDM: "",
    previousIGT: "",
    hypertension: "",
    cardiovascularDisease: "",
    polycysticOvaries: "",

    // Lifestyle Factors
    physicalActivity: "",
    smokingStatus: "",
    alcoholConsumption: "",
    dietQuality: "",

    // Investigations
    fastingGlucose: "",
    hba1c: "",
    oralGlucoseTolerance: "",
    lipidProfile: "",
    bloodPressure: "",

    // Assessment Results
    riskLevel: "",
    recommendations: "",
    followUpPlan: "",
    referrals: "",
  })

  // Section visibility state - all open by default
  const [openSections, setOpenSections] = useState({
    patientDetails: true,
    riskFactors: true,
    lifestyle: true,
    investigations: true,
    assessment: true,
    plan: true,
  })

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("diabetesRisk4049Assessment")
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("diabetesRisk4049Assessment", JSON.stringify(formData))
  }, [formData])

  // Calculate BMI automatically
  useEffect(() => {
    if (formData.patientWeight && formData.patientHeight) {
      const weight = Number.parseFloat(formData.patientWeight)
      const height = Number.parseFloat(formData.patientHeight) / 100 // Convert cm to m
      if (weight > 0 && height > 0) {
        const bmi = (weight / (height * height)).toFixed(1)
        setFormData((prev) => ({ ...prev, patientBMI: bmi }))
      }
    }
  }, [formData.patientWeight, formData.patientHeight])

  // Calculate age from date of birth
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const clearForm = () => {
    if (confirm("Are you sure you want to clear all form data?")) {
      setFormData({
        patientAge: "",
        patientGender: "",
        patientWeight: "",
        patientHeight: "",
        patientBMI: "",
        familyHistory: "",
        previousGDM: "",
        previousIGT: "",
        hypertension: "",
        cardiovascularDisease: "",
        polycysticOvaries: "",
        physicalActivity: "",
        smokingStatus: "",
        alcoholConsumption: "",
        dietQuality: "",
        fastingGlucose: "",
        hba1c: "",
        oralGlucoseTolerance: "",
        lipidProfile: "",
        bloodPressure: "",
        riskLevel: "",
        recommendations: "",
        followUpPlan: "",
        referrals: "",
      })
      localStorage.removeItem("diabetesRisk4049Assessment")
    }
  }

  const exportAsText = () => {
    const content = `TYPE 2 DIABETES RISK EVALUATION
GP Health Assessment Tool for people aged 40-49 years

PATIENT DETAILS
Age: ${formData.patientAge} years
Gender: ${formData.patientGender}
Weight: ${formData.patientWeight} kg
Height: ${formData.patientHeight} cm
BMI: ${formData.patientBMI}

RISK FACTORS
Family History of Diabetes: ${formData.familyHistory}
Previous Gestational Diabetes: ${formData.previousGDM}
Previous Impaired Glucose Tolerance: ${formData.previousIGT}
Hypertension: ${formData.hypertension}
Cardiovascular Disease: ${formData.cardiovascularDisease}
Polycystic Ovary Syndrome: ${formData.polycysticOvaries}

LIFESTYLE FACTORS
Physical Activity: ${formData.physicalActivity}
Smoking Status: ${formData.smokingStatus}
Alcohol Consumption: ${formData.alcoholConsumption}
Diet Quality: ${formData.dietQuality}

INVESTIGATIONS
Fasting Glucose: ${formData.fastingGlucose}
HbA1c: ${formData.hba1c}
Oral Glucose Tolerance Test: ${formData.oralGlucoseTolerance}
Lipid Profile: ${formData.lipidProfile}
Blood Pressure: ${formData.bloodPressure}

ASSESSMENT & PLAN
Risk Level: ${formData.riskLevel}
Recommendations: ${formData.recommendations}
Follow-up Plan: ${formData.followUpPlan}
Referrals: ${formData.referrals}

Generated on: ${new Date().toLocaleDateString()}
Developed by Dr Bobby Tork MD, FRACGP-RG`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "diabetes-risk-assessment-40-49.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsRTF = () => {
    const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 \\b TYPE 2 DIABETES RISK EVALUATION\\b0\\par
GP Health Assessment Tool for people aged 40-49 years\\par\\par

\\b PATIENT DETAILS\\b0\\par
Age: ${formData.patientAge} years\\par
Gender: ${formData.patientGender}\\par
Weight: ${formData.patientWeight} kg\\par
Height: ${formData.patientHeight} cm\\par
BMI: ${formData.patientBMI}\\par\\par

\\b RISK FACTORS\\b0\\par
Family History of Diabetes: ${formData.familyHistory}\\par
Previous Gestational Diabetes: ${formData.previousGDM}\\par
Previous Impaired Glucose Tolerance: ${formData.previousIGT}\\par
Hypertension: ${formData.hypertension}\\par
Cardiovascular Disease: ${formData.cardiovascularDisease}\\par
Polycystic Ovary Syndrome: ${formData.polycysticOvaries}\\par\\par

\\b LIFESTYLE FACTORS\\b0\\par
Physical Activity: ${formData.physicalActivity}\\par
Smoking Status: ${formData.smokingStatus}\\par
Alcohol Consumption: ${formData.alcoholConsumption}\\par
Diet Quality: ${formData.dietQuality}\\par\\par

\\b INVESTIGATIONS\\b0\\par
Fasting Glucose: ${formData.fastingGlucose}\\par
HbA1c: ${formData.hba1c}\\par
Oral Glucose Tolerance Test: ${formData.oralGlucoseTolerance}\\par
Lipid Profile: ${formData.lipidProfile}\\par
Blood Pressure: ${formData.bloodPressure}\\par\\par

\\b ASSESSMENT & PLAN\\b0\\par
Risk Level: ${formData.riskLevel}\\par
Recommendations: ${formData.recommendations}\\par
Follow-up Plan: ${formData.followUpPlan}\\par
Referrals: ${formData.referrals}\\par\\par

Generated on: ${new Date().toLocaleDateString()}\\par
Developed by Dr Bobby Tork MD, FRACGP-RG\\par
}`

    const blob = new Blob([rtfContent], { type: "application/rtf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "diabetes-risk-assessment-40-49.rtf"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/gpccmp" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessments
            </Link>
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Type 2 Diabetes Risk Evaluation</h1>
              <p className="text-muted-foreground mb-2">GP Health Assessment Tool for people aged 40-49 years</p>
              <p className="text-sm font-semibold">Developed by Dr Bobby Tork MD, FRACGP-RG</p>
              <p className="text-xs text-muted-foreground">© 2025 Dr Bobby Tork</p>
            </div>
          </div>

          {/* Assessment Form */}
          <Card className="border-primary/20">
            <CardHeader className="pb-0">
              <div className="space-y-6">
                {/* Patient Details Section */}
                <div className="border border-primary/20 rounded-lg">
                  <SectionHeader
                    title="Patient Details"
                    isOpen={openSections.patientDetails}
                    onToggle={() => toggleSection("patientDetails")}
                  />
                  {openSections.patientDetails && (
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Date of Birth</label>
                          <input
                            type="date"
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            onChange={(e) => {
                              const age = calculateAge(e.target.value)
                              handleInputChange("patientAge", age)
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Age (calculated)</label>
                          <input
                            type="text"
                            value={formData.patientAge}
                            readOnly
                            className="w-full p-3 border border-input rounded-md bg-muted"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Gender</label>
                          <select
                            value={formData.patientGender}
                            onChange={(e) => handleInputChange("patientGender", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                          <input
                            type="number"
                            value={formData.patientWeight}
                            onChange={(e) => handleInputChange("patientWeight", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter weight in kg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Height (cm)</label>
                          <input
                            type="number"
                            value={formData.patientHeight}
                            onChange={(e) => handleInputChange("patientHeight", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter height in cm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">BMI (calculated)</label>
                          <input
                            type="text"
                            value={formData.patientBMI}
                            readOnly
                            className="w-full p-3 border border-input rounded-md bg-muted"
                          />
                        </div>
                      </div>
                    </CardContent>
                  )}
                </div>

                {/* Risk Factors Section */}
                <div className="border border-primary/20 rounded-lg">
                  <SectionHeader
                    title="Risk Factors"
                    isOpen={openSections.riskFactors}
                    onToggle={() => toggleSection("riskFactors")}
                  />
                  {openSections.riskFactors && (
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Family History of Diabetes</label>
                          <select
                            value={formData.familyHistory}
                            onChange={(e) => handleInputChange("familyHistory", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Select</option>
                            <option value="Yes - First degree relative">Yes - First degree relative</option>
                            <option value="Yes - Second degree relative">Yes - Second degree relative</option>
                            <option value="No">No</option>
                            <option value="Unknown">Unknown</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Previous Gestational Diabetes</label>
                          <select
                            value={formData.previousGDM}
                            onChange={(e) => handleInputChange("previousGDM", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="N/A">N/A</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Previous Impaired Glucose Tolerance</label>
                          <select
                            value={formData.previousIGT}
                            onChange={(e) => handleInputChange("previousIGT", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="Unknown">Unknown</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Hypertension</label>
                          <select
                            value={formData.hypertension}
                            onChange={(e) => handleInputChange("hypertension", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Select</option>
                            <option value="Yes - Treated">Yes - Treated</option>
                            <option value="Yes - Untreated">Yes - Untreated</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Cardiovascular Disease</label>
                          <select
                            value={formData.cardiovascularDisease}
                            onChange={(e) => handleInputChange("cardiovascularDisease", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Polycystic Ovary Syndrome</label>
                          <select
                            value={formData.polycysticOvaries}
                            onChange={(e) => handleInputChange("polycysticOvaries", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="N/A">N/A</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </div>

                {/* Lifestyle Factors Section */}
                <div className="border border-primary/20 rounded-lg">
                  <SectionHeader
                    title="Lifestyle Factors"
                    isOpen={openSections.lifestyle}
                    onToggle={() => toggleSection("lifestyle")}
                  />
                  {openSections.lifestyle && (
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Physical Activity</label>
                          <select
                            value={formData.physicalActivity}
                            onChange={(e) => handleInputChange("physicalActivity", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Select</option>
                            <option value="Regular (≥150 min/week)">Regular (≥150 min/week)</option>
                            <option value="Moderate (75-149 min/week)">Moderate (75-149 min/week)</option>
                            <option value="Minimal (<75 min/week)">Minimal (&lt;75 min/week)</option>
                            <option value="Sedentary">Sedentary</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Smoking Status</label>
                          <select
                            value={formData.smokingStatus}
                            onChange={(e) => handleInputChange("smokingStatus", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Select</option>
                            <option value="Never smoked">Never smoked</option>
                            <option value="Ex-smoker">Ex-smoker</option>
                            <option value="Current smoker">Current smoker</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Alcohol Consumption</label>
                          <select
                            value={formData.alcoholConsumption}
                            onChange={(e) => handleInputChange("alcoholConsumption", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Select</option>
                            <option value="Within guidelines">Within guidelines</option>
                            <option value="Exceeds guidelines">Exceeds guidelines</option>
                            <option value="Non-drinker">Non-drinker</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Diet Quality</label>
                          <select
                            value={formData.dietQuality}
                            onChange={(e) => handleInputChange("dietQuality", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Select</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </div>

                {/* Investigations Section */}
                <div className="border border-primary/20 rounded-lg">
                  <SectionHeader
                    title="Investigations"
                    isOpen={openSections.investigations}
                    onToggle={() => toggleSection("investigations")}
                  />
                  {openSections.investigations && (
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Fasting Glucose (mmol/L)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={formData.fastingGlucose}
                            onChange={(e) => handleInputChange("fastingGlucose", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter fasting glucose"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">HbA1c (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={formData.hba1c}
                            onChange={(e) => handleInputChange("hba1c", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter HbA1c"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Oral Glucose Tolerance Test</label>
                          <input
                            type="text"
                            value={formData.oralGlucoseTolerance}
                            onChange={(e) => handleInputChange("oralGlucoseTolerance", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter OGTT results"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Lipid Profile</label>
                          <input
                            type="text"
                            value={formData.lipidProfile}
                            onChange={(e) => handleInputChange("lipidProfile", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter lipid results"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">Blood Pressure</label>
                          <input
                            type="text"
                            value={formData.bloodPressure}
                            onChange={(e) => handleInputChange("bloodPressure", e.target.value)}
                            className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter blood pressure readings"
                          />
                        </div>
                      </div>
                    </CardContent>
                  )}
                </div>

                {/* Assessment & Plan Section */}
                <div className="border border-primary/20 rounded-lg">
                  <SectionHeader
                    title="Assessment & Plan"
                    isOpen={openSections.plan}
                    onToggle={() => toggleSection("plan")}
                  />
                  {openSections.plan && (
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Risk Level</label>
                        <select
                          value={formData.riskLevel}
                          onChange={(e) => handleInputChange("riskLevel", e.target.value)}
                          className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select risk level</option>
                          <option value="Low Risk">Low Risk</option>
                          <option value="Moderate Risk">Moderate Risk</option>
                          <option value="High Risk">High Risk</option>
                          <option value="Very High Risk">Very High Risk</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Recommendations</label>
                        <textarea
                          value={formData.recommendations}
                          onChange={(e) => handleInputChange("recommendations", e.target.value)}
                          className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          rows={4}
                          placeholder="Enter recommendations for diabetes prevention..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Follow-up Plan</label>
                        <textarea
                          value={formData.followUpPlan}
                          onChange={(e) => handleInputChange("followUpPlan", e.target.value)}
                          className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          rows={3}
                          placeholder="Enter follow-up plan..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Referrals</label>
                        <textarea
                          value={formData.referrals}
                          onChange={(e) => handleInputChange("referrals", e.target.value)}
                          className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          rows={3}
                          placeholder="Enter any referrals required..."
                        />
                      </div>
                    </CardContent>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center pt-6">
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
            </CardHeader>
          </Card>

          {/* Privacy Notice */}
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
