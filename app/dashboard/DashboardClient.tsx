"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"
import { differenceInDays, format } from "date-fns"
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
    saving: "Save 5%",
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
    trialing: { label: "Free Trial", className: "bg-green-100 text-green-800" },
    active: { label: "Active", className: "bg-indigo-100 text-indigo-800" },
    past_due: { label: "Payment Due", className: "bg-yellow-100 text-yellow-800" },
    canceled: { label: "Canceled", className: "bg-red-100 text-red-800" },
    expired: { label: "Expired", className: "bg-gray-100 text-gray-800" },
  }
  const { label, className } = map[status] ?? { label: status, className: "bg-gray-100 text-gray-800" }
  return <Badge className={className}>{label}</Badge>
}

type Invoice = { id: string; date: string; amount: string; status: string; description: string }

function DashboardInner({ profile, subscription, invoices }: { profile: Profile; subscription: Subscription; invoices: Invoice[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  const paymentStatus = searchParams.get("payment")
  const upgradePrompt = searchParams.get("upgrade") === "true"

  const now = new Date()
  const trialEnd = new Date(subscription.trial_end)
  const trialDaysLeft = Math.max(0, differenceInDays(trialEnd, now))
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
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    })
    const { url, error } = await res.json()
    if (error) {
      setCheckoutLoading(null)
      return
    }
    window.location.href = url
  }

  const handlePortal = async () => {
    setPortalLoading(true)
    const res = await fetch("/api/stripe/portal", { method: "POST" })
    const { url, error } = await res.json()
    if (error) { setPortalLoading(false); return }
    window.location.href = url
  }

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You will lose access at the end of the current billing period.")) return
    setCancelLoading(true)
    await fetch("/api/stripe/cancel", { method: "POST" })
    router.refresh()
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
            Welcome back, {profile.first_name}
          </h1>
          <p className="text-slate-600 mt-1">{profile.clinic_name}</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="text-slate-600">
          Sign Out
        </Button>
      </div>

      {/* Payment status alerts */}
      {paymentStatus === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">
          Payment successful — your subscription is now active.
        </div>
      )}
      {paymentStatus === "canceled" && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg px-4 py-3 text-sm">
          Checkout was canceled. You can subscribe below when you&apos;re ready.
        </div>
      )}
      {upgradePrompt && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm">
          Your trial has expired. Please choose a plan below to continue using GP Companion.
        </div>
      )}

      {/* Subscription Status Card */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-slate-900">Subscription Status</CardTitle>
            <StatusBadge status={subscription.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isTrialing && (
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.max(5, (trialDaysLeft / 60) * 100)}%` }}
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
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
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
          {isActive && (
            <div className="flex items-center gap-4 mt-1">
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                className="text-xs text-indigo-600 hover:underline"
              >
                {portalLoading ? "Loading..." : "Payment history"}
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="text-xs text-red-500 hover:underline"
              >
                {cancelLoading ? "Canceling..." : "Cancel subscription"}
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tools — only shown during valid access */}
      {(isTrialing || isActive) && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Your Tools</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="/api/tools?tool=gpccmp">
              <div className="border border-indigo-100 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-slate-900">GPCCMP Tool</h3>
                <p className="text-sm text-slate-600 mt-1">Create GP Chronic Care Management Plans</p>
              </div>
            </a>
            <a href="/HealthAssessments">
              <div className="border border-indigo-100 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-slate-900">Health Assessments</h3>
                <p className="text-sm text-slate-600 mt-1">Access health assessment tools</p>
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
                className={`border-2 transition-all ${
                  plan.id === "monthly"
                    ? "border-indigo-500 shadow-md"
                    : "border-gray-200 hover:border-indigo-200"
                }`}
              >
                <CardHeader className="text-center pb-2">
                  {plan.id === "monthly" && (
                    <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
                      Most Popular
                    </div>
                  )}
                  <CardTitle className="text-slate-900">{plan.label}</CardTitle>
                  <div className="text-3xl font-bold text-slate-900 mt-2">
                    {plan.price}
                    <span className="text-base font-normal text-slate-500">{plan.period}</span>
                  </div>
                  {plan.saving && (
                    <Badge className="bg-green-100 text-green-700 mx-auto mt-1">{plan.saving}</Badge>
                  )}
                  <CardDescription className="text-slate-500 mt-1">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
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
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
          <div><span className="text-slate-500">Name: </span>{profile.first_name} {profile.last_name}</div>
          <div><span className="text-slate-500">Position: </span>{profile.position}</div>
          <div><span className="text-slate-500">Clinic: </span>{profile.clinic_name}</div>
          <div><span className="text-slate-500">Address: </span>{profile.clinic_address}</div>
          <div><span className="text-slate-500">Phone: </span>{profile.phone_number}</div>
          <div><span className="text-slate-500">Email: </span>{profile.email}</div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-slate-500">No payments yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-700">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-slate-500">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Description</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-2">{inv.date}</td>
                      <td className="py-2">{inv.description}</td>
                      <td className="py-2 font-medium">{inv.amount}</td>
                      <td className="py-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          inv.status === "paid" ? "bg-green-100 text-green-700" :
                          inv.status === "open" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-600"
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

type Invoice = { id: string; date: string; amount: string; status: string; description: string }

export function DashboardClient({
  profile,
  subscription,
  invoices,
}: {
  profile: Profile
  subscription: Subscription
  invoices: Invoice[]
}) {
  return (
    <Suspense fallback={null}>
      <DashboardInner profile={profile} subscription={subscription} invoices={invoices} />
    </Suspense>
  )
}
