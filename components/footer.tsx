import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-teal-950 text-teal-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-xl text-white block leading-tight">GP Companion</span>
                <span className="text-xs text-teal-400 tracking-wide">Clinical Tools Platform</span>
              </div>
            </div>
            <p className="text-teal-300 text-sm max-w-md leading-relaxed">
              Comprehensive medical tools and health assessments designed for healthcare professionals.
              Streamline your workflow with our secure, privacy-focused platform.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-teal-400">All patient data stays in your browser — never uploaded</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-xs uppercase tracking-widest">Platform</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-teal-300 hover:text-white transition-colors text-sm flex items-center gap-1.5">
                  <span className="text-teal-600">›</span> About Website
                </Link>
              </li>
              <li>
                <Link href="/developer" className="text-teal-300 hover:text-white transition-colors text-sm flex items-center gap-1.5">
                  <span className="text-teal-600">›</span> Developer
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-teal-300 hover:text-white transition-colors text-sm flex items-center gap-1.5">
                  <span className="text-teal-600">›</span> Pricing
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-teal-300 hover:text-white transition-colors text-sm flex items-center gap-1.5">
                  <span className="text-teal-600">›</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-teal-300 hover:text-white transition-colors text-sm flex items-center gap-1.5">
                  <span className="text-teal-600">›</span> Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-xs uppercase tracking-widest">Tools</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/gpccmp" className="text-teal-300 hover:text-white transition-colors text-sm flex items-center gap-1.5">
                  <span className="text-teal-600">›</span> GPCCMP Tool
                </Link>
              </li>
              <li>
                <Link href="/HealthAssessments" className="text-teal-300 hover:text-white transition-colors text-sm flex items-center gap-1.5">
                  <span className="text-teal-600">›</span> Health Assessments
                </Link>
              </li>
              <li>
                <Link href="/HealthAssessments" className="text-teal-300 hover:text-white transition-colors text-sm flex items-center gap-1.5">
                  <span className="text-teal-600">›</span> 75+ Health Assessment
                </Link>
              </li>
              <li>
                <Link href="/HealthAssessments" className="text-teal-300 hover:text-white transition-colors text-sm flex items-center gap-1.5">
                  <span className="text-teal-600">›</span> ATSI Health Assessment
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-teal-800/60 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-teal-400 text-sm">
            © 2024 GP Companion. All rights reserved.
          </p>
          <p className="text-teal-500 text-xs">
            Designed for Australian healthcare professionals
          </p>
        </div>
      </div>
    </footer>
  )
}
