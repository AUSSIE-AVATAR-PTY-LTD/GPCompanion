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
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl text-slate-900">Check your email</CardTitle>
          <CardDescription className="text-slate-600 mt-2">
            We&apos;ve sent a verification link to your email address. Please verify your email to activate your
            2-month free trial.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            Already verified?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline font-medium">
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
        <p className="text-slate-600 mt-2">
          Start your <span className="font-semibold text-indigo-600">2-month free trial</span> — no credit card
          required
        </p>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">Clinic Information</CardTitle>
          <CardDescription>
            This information is used to verify your eligibility and cannot be used for multiple accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" placeholder="Jane" {...register("first_name")} />
                {errors.first_name && <p className="text-sm text-red-600">{errors.first_name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" placeholder="Smith" {...register("last_name")} />
                {errors.last_name && <p className="text-sm text-red-600">{errors.last_name.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="clinic_name">Clinic Name</Label>
              <Input id="clinic_name" placeholder="Riverside Medical Centre" {...register("clinic_name")} />
              {errors.clinic_name && <p className="text-sm text-red-600">{errors.clinic_name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="clinic_address">Clinic Address</Label>
              <Input
                id="clinic_address"
                placeholder="123 Main Street, Brisbane QLD 4000"
                {...register("clinic_address")}
              />
              {errors.clinic_address && (
                <p className="text-sm text-red-600">{errors.clinic_address.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="position">Position / Role</Label>
              <Input id="position" placeholder="General Practitioner" {...register("position")} />
              {errors.position && <p className="text-sm text-red-600">{errors.position.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input id="phone_number" placeholder="0412 345 678" {...register("phone_number")} />
              {errors.phone_number && <p className="text-sm text-red-600">{errors.phone_number.message}</p>}
              <p className="text-xs text-slate-500">
                Your phone number must be unique — one account per phone number.
              </p>
            </div>

            <hr className="border-gray-200" />
            <p className="text-sm font-medium text-slate-700">Account Credentials</p>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="jane@clinic.com.au" {...register("email")} />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  {...register("password")}
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  placeholder="Repeat password"
                  {...register("confirm_password")}
                />
                {errors.confirm_password && (
                  <p className="text-sm text-red-600">{errors.confirm_password.message}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? "Creating account..." : "Create Account & Start Free Trial"}
            </Button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>

            <p className="text-center text-xs text-slate-400">
              By creating an account you agree to our{" "}
              <Link href="/privacy" className="underline">
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
