import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600">Effective Date: 25 April 2026</p>
          </div>

          {/* Section 1 */}
          <Card className="mb-6 rounded-xl border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">1. Our Commitment to Your Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-3">
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
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card className="mb-6 rounded-xl border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">2. Personal Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-3">
              <p>
                When you create an account, we collect the following personal information to verify your identity,
                manage your subscription, and provide access to our platform:
              </p>
              <ul className="list-disc list-inside space-y-1">
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
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card className="mb-6 rounded-xl border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">2. Clinical Data — What We Do NOT Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-3">
              <p>
                Our commitment to clinical confidentiality remains absolute. We are explicit about what we{" "}
                <strong>never</strong> collect or store:
              </p>
              <ul className="list-disc list-inside space-y-1">
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
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card className="mb-6 rounded-xl border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">4. Anonymised Usage Data We Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-3">
              <p>
                In addition to your account information, we collect aggregated and strictly anonymous data to maintain
                and improve our service. This data cannot be linked to any specific individual.
              </p>
              <p className="font-medium">a) Usage and Engagement Data</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Referring source (how you found our website)</li>
                <li>Geographic location (country, state/territory, city)</li>
                <li>Pages visited, visit duration, and new vs. returning user status</li>
              </ul>
              <p className="font-medium">b) Tool Interaction Data</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Tool initiation and completion counts (e.g., how many GPMPs were started and completed)</li>
                <li>Average time to complete a plan or assessment</li>
              </ul>
              <p className="font-medium">c) Technical Data</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Device type and web browser</li>
                <li>Page load speed and performance metrics</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card className="mb-6 rounded-xl border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">5. Subscriptions and Billing</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-3">
              <p>
                GPCOMPANION operates on a subscription model with a <strong>2-month free trial</strong> for new
                accounts. Following the trial period, continued access requires an active paid subscription.
              </p>
              <p>
                Subscription payments are processed securely by <strong>Stripe</strong>, a certified PCI-compliant
                payment processor. We do not store your credit card or payment details on our servers. All billing
                information is handled exclusively by Stripe. You can view Stripe's privacy policy at{" "}
                <a
                  href="https://stripe.com/au/privacy"
                  className="text-indigo-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  stripe.com/au/privacy
                </a>
                .
              </p>
              <p>
                Your subscription status, plan type, and billing history are stored in our secure database and are
                accessible at any time from your account dashboard.
              </p>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card className="mb-6 rounded-xl border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">6. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-3">
              <p>Your personal information is used exclusively for the following purposes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Creating and managing your user account</li>
                <li>Verifying your identity and eligibility for a free trial</li>
                <li>Processing and managing your subscription and billing</li>
                <li>Sending important account, subscription, and service notifications</li>
                <li>Preventing misuse of the platform (e.g., multiple free-trial registrations)</li>
                <li>Improving our service through anonymous usage analytics</li>
              </ul>
              <p>We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card className="mb-6 rounded-xl border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">7. Data Storage and Security</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-3">
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
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card className="mb-6 rounded-xl border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">8. Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-3">
              <p>
                We use cookies and similar technologies to manage authentication sessions and collect the anonymous
                usage data described in Section 4. We use <strong>Google Analytics</strong> for traffic and behaviour
                analysis. You can view Google's privacy policy at{" "}
                <a
                  href="https://policies.google.com/privacy"
                  className="text-indigo-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  policies.google.com/privacy
                </a>
                .
              </p>
              <p>
                You can refuse cookies via your browser settings, though this may affect certain platform functionality
                including login sessions.
              </p>
            </CardContent>
          </Card>

          {/* Section 9 */}
          <Card className="mb-6 rounded-xl border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">9. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-3">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Supabase</strong> — Secure cloud database and authentication infrastructure.{" "}
                  <a
                    href="https://supabase.com/privacy"
                    className="text-indigo-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    supabase.com/privacy
                  </a>
                </li>
                <li>
                  <strong>Stripe</strong> — PCI-compliant payment processing.{" "}
                  <a
                    href="https://stripe.com/au/privacy"
                    className="text-indigo-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    stripe.com/au/privacy
                  </a>
                </li>
                <li>
                  <strong>Google Analytics</strong> — Anonymous website usage analytics.{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    className="text-indigo-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    policies.google.com/privacy
                  </a>
                </li>
                <li>
                  <strong>Vercel</strong> — Website hosting and delivery infrastructure.{" "}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    className="text-indigo-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    vercel.com/legal/privacy-policy
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 10 */}
          <Card className="mb-6 rounded-xl border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">10. Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
              <p>
                We may update this Privacy Policy from time to time. We will notify registered users of material
                changes via email and will post the updated policy on this page with a revised effective date. We
                encourage you to review this policy periodically.
              </p>
            </CardContent>
          </Card>

          {/* Section 11 */}
          <Card className="mb-8 rounded-xl border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">11. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
              <p>
                If you have any questions about this Privacy Policy or wish to access, correct, or delete your personal
                information, please contact us via our{" "}
                <a href="/contact" className="text-indigo-600 underline">
                  Contact page
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
