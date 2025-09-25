// components/navbar.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Navbar() {
  return (
    <nav className="bg-white border-b border-indigo-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/gp-companion-logo.png"
              alt="GP Companion Logo"
              width={100}
              height={100}
              className="w-20 h-20"
            />
            <span className="font-bold text-xl text-indigo-800">GP Companion</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-indigo-700 hover:text-indigo-900 transition-colors px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <Link href="/gpccmp" className="text-indigo-700 hover:text-indigo-900 transition-colors px-3 py-2 text-sm font-medium">
              GPCCMP
            </Link>
            <Link href="/HealthAssessments" className="text-indigo-700 hover:text-indigo-900 transition-colors px-3 py-2 text-sm font-medium">
              Assessments
            </Link>
            
            <Link href="/about" className="text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-2 text-sm">
              About
            </Link>
            <Link href="/developer" className="text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-2 text-sm">
              Developer
            </Link>
            <Link href="/privacy" className="text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-2 text-sm">
              Privacy
            </Link>
            <Link href="/contact" className="text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-2 text-sm">
              Contact
            </Link>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-indigo-700">
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>  
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
