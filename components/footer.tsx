import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">GP</span>
              </div>
              <span className="font-semibold text-lg">GP Companion</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Free clinical tools for healthcare professionals with complete patient privacy.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gpccmp" className="text-muted-foreground hover:text-primary transition-colors">
                  GPCCMP Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-foreground">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Website
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/developer" className="text-muted-foreground hover:text-primary transition-colors">
                  Developer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-foreground">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Developer
                </Link>
              </li>
            </ul>
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                All data stays in your browser. No patient information is ever stored on our servers.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-xs text-muted-foreground">© 2024 GP Companion. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Designed for healthcare professionals with privacy in mind.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
