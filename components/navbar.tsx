import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Navbar() {
  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/gp-companion-logo.png"
              alt="GP Companion Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="font-bold text-xl text-foreground">GP Companion</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About Website
            </Link>
            <Link href="/developer" className="text-muted-foreground hover:text-primary transition-colors">
              Developer
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact Developer
            </Link>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm">
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
