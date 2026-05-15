"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NavbarMobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <div className="md:hidden relative">
      <Button
        variant="ghost"
        size="sm"
        className="text-teal-700"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-teal-100 shadow-xl z-50 overflow-hidden">
          <nav className="p-2 space-y-0.5">
            {[
              { href: "/", label: "Home" },
              { href: "/pricing", label: "Pricing" },
              { href: "/about", label: "About" },
              { href: "/developer", label: "Developer" },
              { href: "/privacy", label: "Privacy" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className="block px-3 py-2 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg text-sm font-medium transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-teal-100 p-3 space-y-2">
            {isLoggedIn ? (
              <Link href="/dashboard" onClick={close}>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg">
                  My Account
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={close}>
                  <Button variant="ghost" className="w-full text-teal-700 hover:bg-teal-50 rounded-lg">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={close}>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg">
                    Start Free Trial
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
