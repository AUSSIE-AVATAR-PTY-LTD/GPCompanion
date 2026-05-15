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
import { createClient } from "@/lib/supabase/client"

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
})
type FormData = z.infer<typeof schema>

export function ResetPasswordForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password/confirm`,
    })
    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <Card className="w-full max-w-md text-center border border-teal-100 rounded-2xl shadow-lg overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-400" />
        <CardHeader className="pt-10">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <CardTitle className="text-2xl text-slate-900">Check your email</CardTitle>
          <CardDescription className="text-slate-500 mt-2">
            If an account exists for that email, we&apos;ve sent a password reset link. Check your inbox and spam folder.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10">
          <Link href="/login" className="text-teal-600 hover:text-teal-700 hover:underline font-medium text-sm">
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border border-teal-100 rounded-2xl shadow-lg overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-400" />
      <CardHeader className="text-center pt-8 pb-2">
        <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <CardTitle className="text-2xl text-slate-900">Forgot your password?</CardTitle>
        <CardDescription className="text-slate-500">
          Enter your email and we&apos;ll send you a reset link.
        </CardDescription>
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
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

          <p className="text-center text-sm text-slate-500">
            Remember your password?{" "}
            <Link href="/login" className="text-teal-600 hover:text-teal-700 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
