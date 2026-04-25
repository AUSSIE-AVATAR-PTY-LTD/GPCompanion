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
    saving: "Save 5%",
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
  "Health Assessments — all templates included",
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
        <section className="bg-gradient-to-br from-indigo-50/50 to-white py-20 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-6">
            Start with a full-featured <strong>2-month free trial</strong> — no credit card required.
            Then choose the plan that suits you.
          </p>
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href="/signup">Start Free Trial</Link>
          </Button>
        </section>

        {/* Plans */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`border-2 transition-all ${
                  plan.highlight
                    ? "border-indigo-500 shadow-lg"
                    : "border-gray-200 hover:border-indigo-200"
                }`}
              >
                <CardHeader className="text-center pb-2">
                  {plan.highlight && (
                    <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">
                      Most Popular
                    </div>
                  )}
                  <CardTitle className="text-2xl text-slate-900">{plan.label}</CardTitle>
                  <div className="text-4xl font-bold text-slate-900 mt-3">
                    {plan.price}
                    <span className="text-base font-normal text-slate-500">{plan.period}</span>
                  </div>
                  {plan.saving && (
                    <Badge className="bg-green-100 text-green-700 mx-auto mt-2">{plan.saving}</Badge>
                  )}
                  <CardDescription className="mt-2 text-slate-500">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <Button
                    asChild
                    className={`w-full ${
                      plan.highlight
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-slate-800 hover:bg-slate-900 text-white"
                    }`}
                  >
                    <Link href="/signup">Start Free Trial</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            All prices are in AUD and include GST. Cancel anytime.
          </p>
        </section>

        {/* Features */}
        <section className="bg-indigo-50/40 py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Everything included in every plan</h2>
            <ul className="space-y-3 text-left inline-block">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-slate-700">
                  <svg
                    className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
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
                <div key={q}>
                  <h3 className="font-semibold text-slate-900 mb-1">{q}</h3>
                  <p className="text-slate-600 text-sm">{a}</p>
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
