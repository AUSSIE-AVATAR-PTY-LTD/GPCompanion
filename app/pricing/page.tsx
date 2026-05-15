import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    id: "weekly",
    label: "Weekly",
    price: "$20",
    period: "/ week",
    description: "Billed every 7 days. Full access to all tools.",
    saving: null,
    highlight: false,
  },
  {
    id: "monthly",
    label: "Monthly",
    price: "$81",
    period: "/ month",
    description: "Billed monthly. Save 5% vs weekly.",
    saving: "Save 6%",
    highlight: true,
  },
  {
    id: "yearly",
    label: "Yearly",
    price: "$936",
    period: "/ year",
    description: "Billed annually. Best value — save 10%.",
    saving: "Save 10%",
    highlight: false,
  },
]

const features = [
  "GPCCMP Tool — GP Chronic Care Management Plans",
  "Health Assessments — all 12+ templates included",
  "All patient data stays in your browser — never uploaded",
  "Unlimited plan generations",
  "New templates added at no extra cost",
  "Email support",
]

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-teal-50 to-white py-20 border-b border-teal-100 text-center px-4">
          <span className="inline-block text-teal-600 text-xs font-semibold tracking-widest uppercase mb-4 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100">Pricing</span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8">
            Start with a full-featured <strong className="text-teal-700">2-month free trial</strong> — no credit card required.
            Then choose the plan that suits you.
          </p>
          <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-10 h-12 rounded-xl shadow-sm">
            <Link href="/signup">Start Free Trial</Link>
          </Button>
        </section>

        {/* Plans */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`rounded-2xl border-2 transition-all overflow-hidden ${
                  plan.highlight
                    ? "border-teal-500 shadow-xl shadow-teal-100"
                    : "border-slate-200 hover:border-teal-200 hover:shadow-md"
                }`}
              >
                {plan.highlight && (
                  <div className="bg-teal-600 text-white text-xs font-semibold text-center py-2 tracking-wider uppercase">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center pb-2 pt-8">
                  <CardTitle className="text-2xl text-slate-900">{plan.label}</CardTitle>
                  <div className="text-4xl font-bold text-slate-900 mt-4">
                    {plan.price}
                    <span className="text-base font-normal text-slate-400">{plan.period}</span>
                  </div>
                  {plan.saving && (
                    <span className="inline-block mt-2 bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {plan.saving}
                    </span>
                  )}
                  <CardDescription className="mt-2 text-slate-500 text-sm">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 pb-8">
                  <Button
                    asChild
                    className={`w-full rounded-lg h-11 font-medium ${
                      plan.highlight
                        ? "bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                        : "bg-slate-800 hover:bg-slate-900 text-white"
                    }`}
                  >
                    <Link href="/signup">Start Free Trial</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-slate-400 mt-6">
            All prices are in AUD and include GST. Cancel anytime.
          </p>
        </section>

        {/* Features */}
        <section className="bg-teal-50/50 py-16 px-4 border-y border-teal-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Everything included in every plan</h2>
            <p className="text-slate-500 mb-10 text-sm">No hidden fees. No feature tiers. Just full access.</p>
            <ul className="space-y-3 text-left inline-block">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-slate-700">
                  <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-center mb-10 text-sm">Everything you need to know about pricing and billing.</p>
            <div className="space-y-4">
              {[
                {
                  q: "Do I need a credit card to start the free trial?",
                  a: "No. Your 2-month free trial starts immediately when you create an account. We only ask for payment details when you choose to subscribe.",
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Yes. You can cancel your subscription at any time from your dashboard. You will retain access until the end of your current billing period.",
                },
                {
                  q: "Is patient data safe?",
                  a: "Absolutely. All clinical data entered into our tools stays entirely within your browser and is never transmitted to our servers.",
                },
                {
                  q: "Can I switch plans?",
                  a: "Yes. You can upgrade or change your plan at any time from your account dashboard.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="bg-white border border-teal-100 rounded-xl p-6 hover:border-teal-200 transition-colors">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-start gap-2">
                    <span className="text-teal-500 font-bold mt-0.5">Q.</span>
                    {q}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed pl-5">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
