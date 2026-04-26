"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const signUpSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    clinic_name: z.string().min(1, "Clinic name is required"),
    clinic_address: z.string().min(1, "Clinic address is required"),
    position: z.string().min(1, "Position is required"),
    phone_number: z
      .string()
      .min(10, "Enter a valid phone number")
      .regex(/^[0-9+\s\-()]+$/, "Enter a valid phone number"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

type SignUpFormData = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({ resolver: zodResolver(signUpSchema) })

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true)
    setError(null)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        clinic_name: data.clinic_name,
        clinic_address: data.clinic_address,
        position: data.position,
        phone_number: data.phone_number,
      }),
    })

    const result = await res.json()

    if (!res.ok) {
      setError(result.error ?? "Something went wrong. Please try again.")
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <Card className="w-full max-w-md text-center border border-teal-100 rounded-2xl shadow-lg overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-400" />
        <CardHeader className="pt-10">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl text-slate-900">Check your email</CardTitle>
          <CardDescription className="text-slate-500 mt-2">
            We&apos;ve sent a verification link to your email address. Please verify your email to activate your
            2-month free trial.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10">
          <p className="text-sm text-slate-500">
            Already verified?{" "}
            <Link href="/login" className="text-teal-600 hover:text-teal-700 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
        <p className="text-slate-500 mt-2">
          Start your <span className="font-semibold text-teal-600">2-month free trial</span> — no credit card required
        </p>
      </div>

      <Card className="border border-teal-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-400" />
        <CardHeader className="pt-8">
          <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
            <div className="w-7 h-7 bg-teal-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            Clinic Information
          </CardTitle>
          <CardDescription className="text-slate-500">
            This information is used to verify your eligibility and cannot be used for multiple accounts.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8 px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="first_name" className="text-slate-700 font-medium">First Name</Label>
                <Input id="first_name" placeholder="Jane" className="border-teal-100 focus:border-teal-400 rounded-lg h-11" {...register("first_name")} />
                {errors.first_name && <p className="text-sm text-red-600">{errors.first_name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name" className="text-slate-700 font-medium">Last Name</Label>
                <Input id="last_name" placeholder="Smith" className="border-teal-100 focus:border-teal-400 rounded-lg h-11" {...register("last_name")} />
                {errors.last_name && <p className="text-sm text-red-600">{errors.last_name.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="clinic_name" className="text-slate-700 font-medium">Clinic Name</Label>
              <Input id="clinic_name" placeholder="Riverside Medical Centre" className="border-teal-100 focus:border-teal-400 rounded-lg h-11" {...register("clinic_name")} />
              {errors.clinic_name && <p className="text-sm text-red-600">{errors.clinic_name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="clinic_address" className="text-slate-700 font-medium">Clinic Address</Label>
              <Input
                id="clinic_address"
                placeholder="123 Main Street, Brisbane QLD 4000"
                className="border-teal-100 focus:border-teal-400 rounded-lg h-11"
                {...register("clinic_address")}
              />
              {errors.clinic_address && (
                <p className="text-sm text-red-600">{errors.clinic_address.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="position" className="text-slate-700 font-medium">Position / Role</Label>
              <Input id="position" placeholder="General Practitioner" className="border-teal-100 focus:border-teal-400 rounded-lg h-11" {...register("position")} />
              {errors.position && <p className="text-sm text-red-600">{errors.position.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone_number" className="text-slate-700 font-medium">Phone Number</Label>
              <Input id="phone_number" placeholder="0412 345 678" className="border-teal-100 focus:border-teal-400 rounded-lg h-11" {...register("phone_number")} />
              {errors.phone_number && <p className="text-sm text-red-600">{errors.phone_number.message}</p>}
              <p className="text-xs text-slate-400">
                Your phone number must be unique — one account per phone number.
              </p>
            </div>

            <div className="border-t border-teal-100 pt-5">
              <p className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Account Credentials
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
              <Input id="email" type="email" placeholder="jane@clinic.com.au" className="border-teal-100 focus:border-teal-400 rounded-lg h-11" {...register("email")} />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  className="border-teal-100 focus:border-teal-400 rounded-lg h-11"
                  {...register("password")}
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm_password" className="text-slate-700 font-medium">Confirm Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  placeholder="Repeat password"
                  className="border-teal-100 focus:border-teal-400 rounded-lg h-11"
                  {...register("confirm_password")}
                />
                {errors.confirm_password && (
                  <p className="text-sm text-red-600">{errors.confirm_password.message}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 rounded-lg font-medium shadow-sm text-base"
            >
              {loading ? "Creating account..." : "Create Account & Start Free Trial"}
            </Button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-teal-600 hover:text-teal-700 hover:underline font-medium">
                Sign in
              </Link>
            </p>

            <p className="text-center text-xs text-slate-400">
              By creating an account you agree to our{" "}
              <Link href="/privacy" className="underline hover:text-slate-600">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
