import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-2xl border border-teal-100 shadow-sm overflow-hidden">
      <CardHeader className="pt-6">
        <CardTitle className="text-lg text-slate-900 flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center text-xs font-bold">
            {number}
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-600 leading-relaxed space-y-3 text-sm pb-6">
        {children}
      </CardContent>
    </Card>
  )
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-teal-50 to-white py-16 border-b border-teal-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-teal-600 text-xs font-semibold tracking-widest uppercase mb-4 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100">Legal</span>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
            <p className="text-slate-500">Effective Date: 25 April 2026</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <Section number="1" title="Our Commitment to Your Privacy">
              <p>
                Welcome to GPCOMPANION ("we," "us," or "our"). We provide tools to help General Practitioners (GPs)
                and healthcare professionals create GP Management Plans and Health Assessments. Access to these tools
                requires a user account and an active subscription following a 2-month free trial period.
              </p>
              <p>
                Your privacy and the privacy of your patients are of the utmost importance to us. This Privacy Policy
                explains what personal and anonymised data we collect, why we collect it, how we use it, and how we
                protect it.
              </p>
              <p>
                We are committed to complying with the <strong>Privacy Act 1988 (Cth)</strong> and the{" "}
                <strong>Australian Privacy Principles (APPs)</strong>.
              </p>
            </Section>

            <Section number="2" title="Personal Information We Collect">
              <p>
                When you create an account, we collect the following personal information to verify your identity,
                manage your subscription, and provide access to our platform:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>First Name and Last Name</li>
                <li>Clinic Name</li>
                <li>Clinic Address</li>
                <li>Position / Role</li>
                <li>Phone Number</li>
                <li>Email Address</li>
              </ul>
              <p>
                Your email address is used to verify your account and communicate important subscription and service
                information. Your phone number and clinic information are collected to help us verify that registrations
                are genuine and to prevent misuse of the free trial period.
              </p>
              <p>
                We collect and handle this personal information in accordance with the Australian Privacy Principles.
                You have the right to access and correct your personal information at any time via your account
                dashboard.
              </p>
            </Section>

            <Section number="3" title="Clinical Data — What We Do NOT Collect">
              <p>
                Our commitment to clinical confidentiality remains absolute. We are explicit about what we{" "}
                <strong>never</strong> collect or store:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>
                  <strong>Patient PII:</strong> We do not collect patient names, addresses, Medicare numbers, or any
                  other patient-identifying information.
                </li>
                <li>
                  <strong>Protected Health Information (PHI):</strong> We do not collect, view, or store any clinical
                  data entered into management plans or assessments — including diagnoses, medications, clinical notes,
                  or any sensitive health information.
                </li>
              </ul>
              <p>
                All clinical data entered into our tools exists exclusively within your local browser session and is
                never transmitted to our servers. You can create detailed health assessments and management plans with
                complete confidence that patient confidentiality is protected at every step.
              </p>
            </Section>

            <Section number="4" title="Anonymised Usage Data We Collect">
              <p>
                In addition to your account information, we collect aggregated and strictly anonymous data to maintain
                and improve our service. This data cannot be linked to any specific individual.
              </p>
              <p className="font-medium text-slate-700">a) Usage and Engagement Data</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Referring source (how you found our website)</li>
                <li>Geographic location (country, state/territory, city)</li>
                <li>Pages visited, visit duration, and new vs. returning user status</li>
              </ul>
              <p className="font-medium text-slate-700">b) Tool Interaction Data</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Tool initiation and completion counts</li>
                <li>Average time to complete a plan or assessment</li>
              </ul>
              <p className="font-medium text-slate-700">c) Technical Data</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Device type and web browser</li>
                <li>Page load speed and performance metrics</li>
              </ul>
            </Section>

            <Section number="5" title="Subscriptions and Billing">
              <p>
                GPCOMPANION operates on a subscription model with a <strong>2-month free trial</strong> for new
                accounts. Following the trial period, continued access requires an active paid subscription.
              </p>
              <p>
                Subscription payments are processed securely by <strong>Stripe</strong>, a certified PCI-compliant
                payment processor. We do not store your credit card or payment details on our servers. All billing
                information is handled exclusively by Stripe. You can view Stripe's privacy policy at{" "}
                <a href="https://stripe.com/au/privacy" className="text-teal-600 underline hover:text-teal-700" target="_blank" rel="noopener noreferrer">
                  stripe.com/au/privacy
                </a>
                .
              </p>
              <p>
                Your subscription status, plan type, and billing history are stored in our secure database and are
                accessible at any time from your account dashboard.
              </p>
            </Section>

            <Section number="6" title="How We Use Your Information">
              <p>Your personal information is used exclusively for the following purposes:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Creating and managing your user account</li>
                <li>Verifying your identity and eligibility for a free trial</li>
                <li>Processing and managing your subscription and billing</li>
                <li>Sending important account, subscription, and service notifications</li>
                <li>Preventing misuse of the platform (e.g., multiple free-trial registrations)</li>
                <li>Improving our service through anonymous usage analytics</li>
              </ul>
              <p>We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
            </Section>

            <Section number="7" title="Data Storage and Security">
              <p>
                Your account data is stored securely using <strong>Supabase</strong>, a cloud database platform with
                industry-standard encryption at rest and in transit. Access to your data is restricted to authorised
                personnel and systems only.
              </p>
              <p>
                We retain your personal information for as long as your account is active or as required to fulfil the
                purposes outlined in this policy. You may request deletion of your account and associated personal data
                at any time by contacting us.
              </p>
            </Section>

            <Section number="8" title="Cookies and Tracking Technologies">
              <p>
                We use cookies and similar technologies to manage authentication sessions and collect the anonymous
                usage data described in Section 4. We use <strong>Google Analytics</strong> for traffic and behaviour
                analysis. You can view Google's privacy policy at{" "}
                <a href="https://policies.google.com/privacy" className="text-teal-600 underline hover:text-teal-700" target="_blank" rel="noopener noreferrer">
                  policies.google.com/privacy
                </a>
                .
              </p>
              <p>
                You can refuse cookies via your browser settings, though this may affect certain platform functionality
                including login sessions.
              </p>
            </Section>

            <Section number="9" title="Third-Party Services">
              <ul className="space-y-3">
                {[
                  { name: "Supabase", desc: "Secure cloud database and authentication infrastructure.", url: "https://supabase.com/privacy", label: "supabase.com/privacy" },
                  { name: "Stripe", desc: "PCI-compliant payment processing.", url: "https://stripe.com/au/privacy", label: "stripe.com/au/privacy" },
                  { name: "Google Analytics", desc: "Anonymous website usage analytics.", url: "https://policies.google.com/privacy", label: "policies.google.com/privacy" },
                  { name: "Vercel", desc: "Website hosting and delivery infrastructure.", url: "https://vercel.com/legal/privacy-policy", label: "vercel.com/legal/privacy-policy" },
                ].map(({ name, desc, url, label }) => (
                  <li key={name} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0" />
                    <span><strong>{name}</strong> — {desc}{" "}
                      <a href={url} className="text-teal-600 underline hover:text-teal-700" target="_blank" rel="noopener noreferrer">{label}</a>
                    </span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section number="10" title="Changes to This Privacy Policy">
              <p>
                We may update this Privacy Policy from time to time. We will notify registered users of material
                changes via email and will post the updated policy on this page with a revised effective date. We
                encourage you to review this policy periodically.
              </p>
            </Section>

            <Section number="11" title="Contact Us">
              <p>
                If you have any questions about this Privacy Policy or wish to access, correct, or delete your personal
                information, please contact us via our{" "}
                <a href="/contact" className="text-teal-600 underline hover:text-teal-700">
                  Contact page
                </a>
                .
              </p>
            </Section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
