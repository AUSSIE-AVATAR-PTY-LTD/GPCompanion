"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError(null)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      setError("Invalid email or password.")
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <Card className="w-full max-w-md border border-teal-100 rounded-2xl shadow-lg overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-400" />
      <CardHeader className="text-center pt-8 pb-2">
        <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <CardTitle className="text-2xl text-slate-900">Welcome back</CardTitle>
        <CardDescription className="text-slate-500">Sign in to your GP Companion account</CardDescription>
      </CardHeader>
      <CardContent className="pb-8 pt-6 px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="jane@clinic.com.au"
              className="border-teal-100 focus:border-teal-400 rounded-lg h-11"
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
              <Link href="/reset-password" className="text-xs text-teal-600 hover:text-teal-700 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              className="border-teal-100 focus:border-teal-400 rounded-lg h-11"
              {...register("password")}
            />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
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
            className="w-full bg-teal-600 hover:bg-teal-700 text-white h-11 rounded-lg font-medium shadow-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-teal-600 hover:text-teal-700 hover:underline font-medium">
              Start free trial
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
