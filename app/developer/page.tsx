import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Developer</h1>
            <p className="text-muted-foreground">Meet the healthcare professional behind GP Companion</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/19211-025%20Lowres.jpg-pVkhRmVAUtIQjr0dBTmDOSd1TtLbEd.jpeg"
                      alt="Dr. Bobby Tork"
                      width={192}
                      height={192}
                      className="rounded-lg object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">Dr. Bobby Tork MD, FRACGP-RG</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-foreground leading-relaxed mb-6">
                      Dr. Bobby Tork MD, FRACGP-RG is a dedicated rural generalist and a graduate of the Melbourne
                      Medical School, who brings a dual focus to his practice. He combines his commitment to frontline
                      patient care with a deep professional interest in the systems that support healthcare delivery.
                    </p>

                    <p className="text-foreground leading-relaxed">
                      Dr. Tork applies his clinical insights toward the development of more effective and efficient care
                      models, with the goal of enhancing the quality, coordination, and accessibility of medical
                      services for all patients.
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-semibold text-sm text-muted-foreground mb-1">QUALIFICATION</h3>
                      <p className="text-foreground">MD, FRACGP-RG</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-semibold text-sm text-muted-foreground mb-1">SPECIALIZATION</h3>
                      <p className="text-foreground">Rural Generalist</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-semibold text-sm text-muted-foreground mb-1">EDUCATION</h3>
                      <p className="text-foreground">Melbourne Medical School</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-semibold text-sm text-muted-foreground mb-1">FOCUS</h3>
                      <p className="text-foreground">Healthcare Systems & Patient Care</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  With a strong foundation in rural general practice, Dr. Tork understands the unique challenges faced
                  by healthcare professionals in diverse settings. His experience in frontline patient care informs
                  every aspect of the tools and systems he develops.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Innovation in Healthcare</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  Dr. Tork's passion for improving healthcare delivery systems drives his commitment to creating
                  practical, efficient tools that enhance the quality and accessibility of medical services for both
                  practitioners and patients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
