import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import Stripe from "stripe"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { differenceInDays, format } from "date-fns"

function getSupabaseAdmin() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    trialing: "bg-teal-100 text-teal-800",
    active: "bg-green-100 text-green-800",
    past_due: "bg-yellow-100 text-yellow-800",
    canceled: "bg-red-100 text-red-800",
    expired: "bg-slate-100 text-slate-700",
  }
  return (
    <Badge className={`${map[status] ?? "bg-slate-100 text-slate-700"} font-medium`}>
      {status.replace("_", " ")}
    </Badge>
  )
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const supabaseAdmin = getSupabaseAdmin()
  const { data: currentProfile } = await supabaseAdmin
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!currentProfile?.is_admin) redirect("/")

  const { data: users } = await supabaseAdmin
    .from("profiles")
    .select(`
      id, first_name, last_name, email, clinic_name, position, phone_number, created_at,
      subscriptions (
        plan, status, trial_start, trial_end, current_period_end, stripe_subscription_id, stripe_customer_id
      )
    `)
    .order("created_at", { ascending: false })

  // Normalise subscriptions to always be an array regardless of Supabase relationship mode
  const asSubs = (raw: unknown): any[] =>
    Array.isArray(raw) ? raw : raw ? [raw] : []

  // Fetch paid invoice totals from Stripe for each customer
  const stripe = getStripe()
  const revenueByCustomer: Record<string, number> = {}

  const customerIds = (users ?? [])
    .flatMap(u => asSubs(u.subscriptions).map((s: any) => s.stripe_customer_id).filter(Boolean))

  await Promise.all(
    customerIds.map(async (customerId: string) => {
      try {
        const invoices = await stripe.invoices.list({ customer: customerId, limit: 100 })
        revenueByCustomer[customerId] = invoices.data
          .filter(inv => inv.status === "paid")
          .reduce((sum, inv) => sum + (inv.amount_paid / 100), 0)
      } catch {
        revenueByCustomer[customerId] = 0
      }
    })
  )

  const now = new Date()

  const total = users?.length ?? 0
  const trialing = users?.filter((u) => asSubs(u.subscriptions)[0]?.status === "trialing").length ?? 0
  const active = users?.filter((u) => asSubs(u.subscriptions)[0]?.status === "active").length ?? 0
  const canceled = users?.filter((u) =>
    ["canceled", "expired"].includes(asSubs(u.subscriptions)[0]?.status ?? "")
  ).length ?? 0
  const totalRevenue = Object.values(revenueByCustomer).reduce((sum, v) => sum + v, 0)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: "Total Users", value: total, color: "text-slate-900", bg: "bg-white border-teal-100" },
              { label: "On Trial", value: trialing, color: "text-teal-700", bg: "bg-teal-50 border-teal-200" },
              { label: "Active Subscribers", value: active, color: "text-green-700", bg: "bg-green-50 border-green-200" },
              { label: "Canceled / Expired", value: canceled, color: "text-red-700", bg: "bg-red-50 border-red-200" },
              { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
            ].map((stat) => (
              <Card key={stat.label} className={`${stat.bg} border rounded-2xl shadow-sm text-center`}>
                <CardContent className="pt-6 pb-5">
                  <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Users table */}
          <Card className="border border-teal-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-teal-600 to-teal-400" />
            <CardHeader className="pt-6">
              <CardTitle className="text-lg text-slate-900">All Users</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto pb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-teal-100 text-left text-slate-400 text-xs uppercase tracking-wide">
                    <th className="pb-3 pr-4 font-medium">Name</th>
                    <th className="pb-3 pr-4 font-medium">Email</th>
                    <th className="pb-3 pr-4 font-medium">Clinic</th>
                    <th className="pb-3 pr-4 font-medium">Position</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Plan</th>
                    <th className="pb-3 pr-4 font-medium">Trial Ends / Renews</th>
                    <th className="pb-3 pr-4 font-medium">Total Paid</th>
                    <th className="pb-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users?.map((u) => {
                    const sub = asSubs(u.subscriptions)[0]
                    const trialEnd = sub?.trial_end ? new Date(sub.trial_end) : null
                    const renewDate = sub?.current_period_end
                      ? new Date(sub.current_period_end)
                      : null
                    const trialDaysLeft = trialEnd ? differenceInDays(trialEnd, now) : null
                    const amountPaid = sub?.stripe_customer_id
                      ? (revenueByCustomer[sub.stripe_customer_id] ?? 0)
                      : 0

                    return (
                      <tr key={u.id} className="hover:bg-teal-50/30 transition-colors">
                        <td className="py-3 pr-4 font-medium text-slate-900">
                          {u.first_name} {u.last_name}
                        </td>
                        <td className="py-3 pr-4 text-slate-500">{u.email}</td>
                        <td className="py-3 pr-4 text-slate-500">{u.clinic_name}</td>
                        <td className="py-3 pr-4 text-slate-500">{u.position}</td>
                        <td className="py-3 pr-4">
                          {sub ? <StatusBadge status={sub.status} /> : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="py-3 pr-4 capitalize text-slate-500">{sub?.plan ?? "—"}</td>
                        <td className="py-3 pr-4 text-slate-500">
                          {sub?.status === "trialing" && trialEnd
                            ? `${format(trialEnd, "d MMM yyyy")} (${Math.max(0, trialDaysLeft ?? 0)}d left)`
                            : renewDate
                            ? format(renewDate, "d MMM yyyy")
                            : "—"}
                        </td>
                        <td className="py-3 pr-4 text-slate-700 font-medium">
                          {amountPaid > 0 ? `$${amountPaid.toFixed(2)}` : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="py-3 text-slate-400">
                          {format(new Date(u.created_at), "d MMM yyyy")}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
