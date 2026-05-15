"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })
type FormData = z.infer<typeof schema>

export function ResetPasswordConfirmForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login?error=reset_expired")
      } else {
        setSessionReady(true)
      }
    })
  }, [router])

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password: data.password })
    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }
    setDone(true)
    setLoading(false)
    setTimeout(() => router.push("/dashboard"), 2000)
  }

  if (!sessionReady) return null

  if (done) {
    return (
      <Card className="w-full max-w-md text-center border border-teal-100 rounded-2xl shadow-lg overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-400" />
        <CardHeader className="pt-10">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl text-slate-900">Password updated</CardTitle>
          <CardDescription className="text-slate-500 mt-2">
            Your password has been changed. Redirecting to your dashboard…
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border border-teal-100 rounded-2xl shadow-lg overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-400" />
      <CardHeader className="text-center pt-8 pb-2">
        <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <CardTitle className="text-2xl text-slate-900">Set a new password</CardTitle>
        <CardDescription className="text-slate-500">
          Choose a strong password for your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8 pt-6 px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-slate-700 font-medium">New Password</Label>
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
            <Label htmlFor="confirm_password" className="text-slate-700 font-medium">Confirm New Password</Label>
            <Input
              id="confirm_password"
              type="password"
              placeholder="Repeat password"
              className="border-teal-100 focus:border-teal-400 rounded-lg h-11"
              {...register("confirm_password")}
            />
            {errors.confirm_password && <p className="text-sm text-red-600">{errors.confirm_password.message}</p>}
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
            {loading ? "Updating..." : "Update Password"}
          </Button>

          <p className="text-center text-sm text-slate-500">
            <Link href="/login" className="text-teal-600 hover:text-teal-700 hover:underline font-medium">
              Back to sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
