import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    trialing: "bg-green-100 text-green-800",
    active: "bg-indigo-100 text-indigo-800",
    past_due: "bg-yellow-100 text-yellow-800",
    canceled: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
  }
  return (
    <Badge className={map[status] ?? "bg-gray-100 text-gray-800"}>
      {status.replace("_", " ")}
    </Badge>
  )
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!currentProfile?.is_admin) redirect("/")

  const supabaseAdmin = getSupabaseAdmin()

  // Fetch all users with their subscriptions using service role
  const { data: users } = await supabaseAdmin
    .from("profiles")
    .select(`
      id, first_name, last_name, email, clinic_name, position, phone_number, created_at,
      subscriptions (
        plan, status, trial_start, trial_end, current_period_end, stripe_subscription_id
      )
    `)
    .order("created_at", { ascending: false })

  const now = new Date()

  // Aggregate stats
  const total = users?.length ?? 0
  const trialing = users?.filter((u) => u.subscriptions?.[0]?.status === "trialing").length ?? 0
  const active = users?.filter((u) => u.subscriptions?.[0]?.status === "active").length ?? 0
  const canceled = users?.filter((u) =>
    ["canceled", "expired"].includes(u.subscriptions?.[0]?.status ?? "")
  ).length ?? 0

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Users", value: total, color: "text-slate-900" },
              { label: "On Trial", value: trialing, color: "text-green-700" },
              { label: "Active Subscribers", value: active, color: "text-indigo-700" },
              { label: "Canceled / Expired", value: canceled, color: "text-red-700" },
            ].map((stat) => (
              <Card key={stat.label} className="border-gray-200 text-center">
                <CardContent className="pt-6">
                  <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Users table */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">All Users</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-slate-500">
                    <th className="pb-3 pr-4 font-medium">Name</th>
                    <th className="pb-3 pr-4 font-medium">Email</th>
                    <th className="pb-3 pr-4 font-medium">Clinic</th>
                    <th className="pb-3 pr-4 font-medium">Position</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Plan</th>
                    <th className="pb-3 pr-4 font-medium">Trial Ends / Renews</th>
                    <th className="pb-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users?.map((u) => {
                    const sub = u.subscriptions?.[0]
                    const trialEnd = sub?.trial_end ? new Date(sub.trial_end) : null
                    const renewDate = sub?.current_period_end
                      ? new Date(sub.current_period_end)
                      : null
                    const trialDaysLeft = trialEnd ? differenceInDays(trialEnd, now) : null

                    return (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4 font-medium text-slate-900">
                          {u.first_name} {u.last_name}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">{u.email}</td>
                        <td className="py-3 pr-4 text-slate-600">{u.clinic_name}</td>
                        <td className="py-3 pr-4 text-slate-600">{u.position}</td>
                        <td className="py-3 pr-4">
                          {sub ? <StatusBadge status={sub.status} /> : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="py-3 pr-4 capitalize text-slate-600">{sub?.plan ?? "—"}</td>
                        <td className="py-3 pr-4 text-slate-600">
                          {sub?.status === "trialing" && trialEnd
                            ? `${format(trialEnd, "d MMM yyyy")} (${Math.max(0, trialDaysLeft ?? 0)}d left)`
                            : renewDate
                            ? format(renewDate, "d MMM yyyy")
                            : "—"}
                        </td>
                        <td className="py-3 text-slate-500">
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
