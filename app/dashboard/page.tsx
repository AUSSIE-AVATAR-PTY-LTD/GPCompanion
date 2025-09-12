import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to GP Companion!</h1>
            <p className="text-muted-foreground">Access your clinical tools and resources</p>
          </div>

          <div className="grid md:grid-cols-1 gap-6 mb-8 max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>GPCCMP Tool</CardTitle>
                <CardDescription>Create GP Chronic Care Management Plans</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/gpccmp">Start GPCCMP</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Privacy Notice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All clinical tools maintain complete patient privacy by storing data locally in your browser. No patient
                information is ever transmitted to external servers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
