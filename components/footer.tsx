// components/footer.tsx
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-indigo-950 text-indigo-100 border-t border-indigo-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">GP</span>
              </div>
              <span className="font-bold text-xl text-white">GP Companion</span>
            </div>
            <p className="text-indigo-200 text-sm max-w-md">
              Comprehensive medical tools and health assessments designed for healthcare professionals. 
              Streamline your workflow with our secure, privacy-focused platform.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-indigo-200 hover:text-white transition-colors text-sm block">
                  About Website
                </Link>
              </li>
              <li>
                <Link href="/developer" className="text-indigo-200 hover:text-white transition-colors text-sm block">
                  Developer
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-indigo-200 hover:text-white transition-colors text-sm block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-indigo-200 hover:text-white transition-colors text-sm block">
                  Contact Developer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/gpccmp" className="text-indigo-200 hover:text-white transition-colors text-sm block">
                  GPCCMP Tool
                </Link>
              </li>
              <li>
                <Link href="/HealthAssessments" className="text-indigo-200 hover:text-white transition-colors text-sm block">
                  Health Assessments
                </Link>
              </li>
              <li>
                <Link href="/HealthAssessments" className="text-indigo-200 hover:text-white transition-colors text-sm block">
                  75+ Health Assessment
                </Link>
              </li>
              <li>
                <Link href="/HealthAssessments" className="text-indigo-200 hover:text-white transition-colors text-sm block">
                  ATSI Health Assessment
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-indigo-800 mt-8 pt-8 text-center">
          <p className="text-indigo-300 text-sm">
            © 2024 GP Companion. All rights reserved. Designed for healthcare professionals.
          </p>
        </div>
      </div>
    </footer>
  )
}
