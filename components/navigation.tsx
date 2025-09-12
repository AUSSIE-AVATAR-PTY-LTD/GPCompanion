"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const navigationItems = [
  { name: "About Website", href: "/about" },
  { name: "Developer", href: "/developer" },
  { name: "Privacy", href: "/privacy" },
  { name: "Contact Developer", href: "/contact" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/gp-companion-logo.png"
              alt="GP Companion Logo"
              width={80}
              height={80}
              className="h-20 w-auto"
            />
            <span className="font-semibold text-xl">GP Companion</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/gpccmp">GPCCMP</Link>
            </Button>
          </div>

          {/* Mobile menu button - simplified for now */}
          <div className="md:hidden">
            <button className="text-muted-foreground hover:text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
