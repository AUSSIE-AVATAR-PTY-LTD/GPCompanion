import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="bg-white border-b border-teal-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/images/gp-companion-logo.png"
              alt="GP Companion Logo"
              width={100}
              height={100}
              className="w-14 h-14"
            />
            <div>
              <span className="font-bold text-xl text-teal-800 block leading-tight">GP Companion</span>
              <span className="text-xs text-teal-500 font-medium tracking-wide hidden sm:block">Clinical Tools Platform</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link href="/pricing" className="text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors px-3 py-2 rounded-md text-sm font-medium">
              Pricing
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link href="/developer" className="text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors px-3 py-2 rounded-md text-sm font-medium">
              Developer
            </Link>
            <Link href="/privacy" className="text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors px-3 py-2 rounded-md text-sm font-medium">
              Privacy
            </Link>
            <Link href="/contact" className="text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </Link>

            <div className="w-px h-5 bg-slate-200 mx-2" />

            {user ? (
              <Button asChild size="sm" className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
                <Link href="/dashboard">My Account</Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="text-teal-700 hover:bg-teal-50 hover:text-teal-800">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-teal-700">
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
