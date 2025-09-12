import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">GP</span>
              </div>
              <span className="font-bold text-xl text-foreground">GP Companion</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              Comprehensive medical tools and health assessments designed for healthcare professionals. Streamline your
              workflow with our secure, privacy-focused platform.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About Website
                </Link>
              </li>
              <li>
                <Link href="/developer" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Developer
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact Developer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Tools</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground text-sm">GPCCMP Tool</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">Health Assessments</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">75+ Health Assessment</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">ATSI Health Assessment</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 GP Companion. All rights reserved. Designed for healthcare professionals.
          </p>
        </div>
      </div>
    </footer>
  )
}
