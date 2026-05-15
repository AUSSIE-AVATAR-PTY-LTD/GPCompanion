"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"
import { differenceInDays, format } from "date-fns"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import type { Profile, Subscription } from "@/lib/supabase/types"

const PLANS = [
  {
    id: "weekly",
    label: "Weekly",
    price: "$20",
    period: "/ week",
    description: "Billed every week",
    saving: null,
  },
  {
    id: "monthly",
    label: "Monthly",
    price: "$81",
    period: "/ month",
    description: "Billed every month",
    saving: "Save 6%",
  },
  {
    id: "yearly",
    label: "Yearly",
    price: "$936",
    period: "/ year",
    description: "Billed annually",
    saving: "Save 10%",
  },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    trialing: { label: "Free Trial", className: "bg-teal-100 text-teal-800" },
    active: { label: "Active", className: "bg-green-100 text-green-800" },
    past_due: { label: "Payment Due", className: "bg-yellow-100 text-yellow-800" },
    canceled: { label: "Canceled", className: "bg-red-100 text-red-800" },
    expired: { label: "Expired", className: "bg-slate-100 text-slate-700" },
  }
  const { label, className } = map[status] ?? { label: status, className: "bg-slate-100 text-slate-700" }
  return <Badge className={`${className} font-medium`}>{label}</Badge>
}

type Invoice = { id: string; date: string; amount: string; status: string; description: string }

function DashboardInner({ profile, subscription, invoices }: { profile: Profile; subscription: Subscription; invoices: Invoice[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [hasCanceled, setHasCanceled] = useState(false)

  const paymentStatus = searchParams.get("payment")
  const upgradePrompt = searchParams.get("upgrade") === "true"

  const now = new Date()
  const trialEnd = new Date(subscription.trial_end)
  const trialDaysLeft = Math.max(0, differenceInDays(trialEnd, now))
  const trialDaysTotal = Math.max(1, differenceInDays(trialEnd, new Date(subscription.trial_start ?? subscription.created_at)))
  const trialElapsedPct = Math.min(100, Math.max(5, ((trialDaysTotal - trialDaysLeft) / trialDaysTotal) * 100))
  const isTrialing = subscription.status === "trialing" && trialEnd > now
  const isActive = subscription.status === "active"
  const needsUpgrade = !isTrialing && !isActive

  const periodStart = subscription.current_period_start ? new Date(subscription.current_period_start) : null
  const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end) : null
  const periodDaysLeft = periodEnd ? Math.max(0, differenceInDays(periodEnd, now)) : null
  const periodTotal = periodStart && periodEnd ? differenceInDays(periodEnd, periodStart) : null
  const periodProgress = periodTotal && periodDaysLeft !== null
    ? Math.max(5, ((periodTotal - periodDaysLeft) / periodTotal) * 100)
    : 0

  const handleCheckout = async (plan: string) => {
    setCheckoutLoading(plan)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const { url, error } = await res.json()
      if (error || !url) {
        toast.error(error ?? "Could not start checkout. Please try again.")
        setCheckoutLoading(null)
        return
      }
      window.location.href = url
    } catch {
      toast.error("Something went wrong. Please try again.")
      setCheckoutLoading(null)
    }
  }

  const handlePortal = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" })
      const { url, error } = await res.json()
      if (error || !url) {
        toast.error(error ?? "Could not open billing portal. Please try again.")
        setPortalLoading(false)
        return
      }
      window.location.href = url
    } catch {
      toast.error("Something went wrong. Please try again.")
      setPortalLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You will keep access until the end of your current billing period.")) return
    setCancelLoading(true)
    try {
      const res = await fetch("/api/stripe/cancel", { method: "POST" })
      if (!res.ok) {
        const { error } = await res.json()
        toast.error(error ?? "Could not cancel subscription. Please try again.")
        setCancelLoading(false)
        return
      }
      setHasCanceled(true)
      toast.success("Subscription canceled. You'll keep access until the end of your billing period.")
    } catch {
      toast.error("Something went wrong. Please try again.")
    }
    setCancelLoading(false)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, <span className="text-teal-700">{profile.first_name}</span>
          </h1>
          <p className="text-slate-500 mt-1">{profile.clinic_name}</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="text-slate-600 border-slate-200 hover:border-teal-200 hover:text-teal-700 rounded-lg">
          Sign Out
        </Button>
      </div>

      {/* Payment status alerts */}
      {paymentStatus === "success" && (
        <div className="bg-teal-50 border border-teal-200 text-teal-800 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Payment successful — your subscription is now active.
        </div>
      )}
      {paymentStatus === "canceled" && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Checkout was canceled. You can subscribe below when you&apos;re ready.
        </div>
      )}
      {upgradePrompt && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Your trial has expired. Please choose a plan below to continue using GP Companion.
        </div>
      )}

      {/* Subscription Status Card */}
      <Card className="border border-teal-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-teal-600 to-teal-400" />
        <CardHeader className="pt-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-slate-900">Subscription Status</CardTitle>
            <StatusBadge status={subscription.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pb-6">
          {isTrialing && (
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <div
                  className="bg-teal-500 h-2 rounded-full transition-all"
                  style={{ width: `${trialElapsedPct}%` }}
                />
              </div>
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                {trialDaysLeft} days left
              </span>
            </div>
          )}
          {isTrialing && (
            <p className="text-sm text-slate-600">
              Your free trial ends on <strong>{format(trialEnd, "d MMMM yyyy")}</strong>.
            </p>
          )}
          {isActive && periodEnd && periodDaysLeft !== null && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full transition-all"
                    style={{ width: `${periodProgress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  {periodDaysLeft} days left
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Current plan: <strong className="capitalize">{subscription.plan}</strong> — renews on{" "}
                <strong>{format(periodEnd, "d MMMM yyyy")}</strong>.
              </p>
            </>
          )}
          {isActive && !hasCanceled && (
            <div className="flex items-center gap-4 mt-1">
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                className="text-xs text-teal-600 hover:text-teal-700 hover:underline"
              >
                {portalLoading ? "Loading..." : "Payment history"}
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="text-xs text-red-500 hover:text-red-600 hover:underline"
              >
                {cancelLoading ? "Canceling..." : "Cancel subscription"}
              </button>
            </div>
          )}
          {isActive && hasCanceled && (
            <p className="text-sm text-amber-700">
              Cancellation scheduled — access continues until{" "}
              {periodEnd ? <strong>{format(periodEnd, "d MMMM yyyy")}</strong> : "end of billing period"}.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tools — only shown during valid access */}
      {(isTrialing || isActive) && (
        <Card className="border border-teal-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-600" />
          <CardHeader className="pt-6">
            <CardTitle className="text-lg text-slate-900">Your Clinical Tools</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
            <a href="/api/tools?tool=gpccmp" className="group">
              <div className="border border-teal-100 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-white to-teal-50/30">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-teal-200 transition-colors">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900">GPCCMP Tool</h3>
                <p className="text-sm text-slate-500 mt-1">Create GP Chronic Care Management Plans</p>
              </div>
            </a>
            <a href="/HealthAssessments" className="group">
              <div className="border border-teal-100 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-white to-teal-50/30">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-teal-200 transition-colors">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900">Health Assessments</h3>
                <p className="text-sm text-slate-500 mt-1">Access all health assessment tools</p>
              </div>
            </a>
          </CardContent>
        </Card>
      )}

      {/* Pricing — shown when no active sub */}
      {(needsUpgrade || isTrialing) && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {needsUpgrade ? "Choose a plan to continue" : "Upgrade before your trial ends"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={`rounded-2xl border-2 transition-all overflow-hidden ${
                  plan.id === "monthly"
                    ? "border-teal-500 shadow-lg shadow-teal-100"
                    : "border-slate-200 hover:border-teal-200"
                }`}
              >
                {plan.id === "monthly" && (
                  <div className="bg-teal-600 text-white text-xs font-semibold text-center py-1.5 tracking-wider uppercase">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center pb-2 pt-6">
                  <CardTitle className="text-slate-900">{plan.label}</CardTitle>
                  <div className="text-3xl font-bold text-slate-900 mt-2">
                    {plan.price}
                    <span className="text-base font-normal text-slate-400">{plan.period}</span>
                  </div>
                  {plan.saving && (
                    <span className="inline-block mt-1 bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {plan.saving}
                    </span>
                  )}
                  <CardDescription className="text-slate-500 mt-1 text-sm">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg h-10"
                    onClick={() => handleCheckout(plan.id)}
                    disabled={checkoutLoading === plan.id}
                  >
                    {checkoutLoading === plan.id ? "Redirecting..." : "Subscribe"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Profile Info */}
      <Card className="border border-teal-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-1 bg-slate-200" />
        <CardHeader className="pt-6">
          <CardTitle className="text-lg text-slate-900">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700 pb-6">
          <div className="bg-slate-50 rounded-lg px-4 py-3"><span className="text-slate-400 text-xs block mb-0.5">Name</span>{profile.first_name} {profile.last_name}</div>
          <div className="bg-slate-50 rounded-lg px-4 py-3"><span className="text-slate-400 text-xs block mb-0.5">Position</span>{profile.position}</div>
          <div className="bg-slate-50 rounded-lg px-4 py-3"><span className="text-slate-400 text-xs block mb-0.5">Clinic</span>{profile.clinic_name}</div>
          <div className="bg-slate-50 rounded-lg px-4 py-3"><span className="text-slate-400 text-xs block mb-0.5">Address</span>{profile.clinic_address}</div>
          <div className="bg-slate-50 rounded-lg px-4 py-3"><span className="text-slate-400 text-xs block mb-0.5">Phone</span>{profile.phone_number}</div>
          <div className="bg-slate-50 rounded-lg px-4 py-3"><span className="text-slate-400 text-xs block mb-0.5">Email</span>{profile.email}</div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="border border-teal-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-1 bg-slate-200" />
        <CardHeader className="pt-6">
          <CardTitle className="text-lg text-slate-900">Payment History</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          {invoices.length === 0 ? (
            <p className="text-sm text-slate-400">No payments yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-700">
                <thead>
                  <tr className="border-b border-teal-100 text-left text-slate-400 text-xs uppercase tracking-wide">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Description</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-slate-50 last:border-0">
                      <td className="py-2.5">{inv.date}</td>
                      <td className="py-2.5">{inv.description}</td>
                      <td className="py-2.5 font-medium">{inv.amount}</td>
                      <td className="py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          inv.status === "paid" ? "bg-teal-100 text-teal-700" :
                          inv.status === "open" ? "bg-yellow-100 text-yellow-700" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                          {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function DashboardClient({
  profile,
  subscription,
  invoices,
}: {
  profile: Profile
  subscription: Subscription
  invoices: { id: string; date: string; amount: string; status: string; description: string }[]
}) {
  return (
    <Suspense fallback={null}>
      <DashboardInner profile={profile} subscription={subscription} invoices={invoices} />
    </Suspense>
  )
}
