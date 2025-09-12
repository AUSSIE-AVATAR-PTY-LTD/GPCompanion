import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function DeveloperPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Developer</h1>
            <p className="text-xl text-muted-foreground">Meet the healthcare professional behind GP Companion</p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-48 h-48 flex-shrink-0">
                  <Image
                    src="/images/dr-bobby-tork.jpeg"
                    alt="Dr. Bobby Tork"
                    width={192}
                    height={192}
                    className="w-48 h-48 rounded-lg object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-foreground mb-4">Dr. Bobby Tork MD, FRACGP-RG</h2>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Dr. Bobby Tork MD, FRACGP-RG is a dedicated rural generalist and a graduate of the Melbourne Medical
                    School, who brings a dual focus to his practice. He combines his commitment to frontline patient
                    care with a deep professional interest in the systems that support healthcare delivery.
                  </p>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Dr. Tork applies his clinical insights toward the development of more effective and efficient care
                    models, with the goal of enhancing the quality, coordination, and accessibility of medical services
                    for all patients.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">QUALIFICATION</h3>
                      <p className="text-muted-foreground">MD, FRACGP-RG</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">SPECIALIZATION</h3>
                      <p className="text-muted-foreground">Rural Generalist</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">EDUCATION</h3>
                      <p className="text-muted-foreground">Melbourne Medical School</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">FOCUS</h3>
                      <p className="text-muted-foreground">Healthcare Systems & Patient Care</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Clinical Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  With a strong foundation in rural general practice, Dr. Tork understands the unique challenges faced
                  by healthcare professionals in diverse settings. His experience in frontline patient care informs
                  every aspect of the tools and systems he develops.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Innovation in Healthcare</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Dr. Tork's passion for improving healthcare delivery systems drives his commitment to creating
                  practical, efficient tools that enhance the quality and accessibility of medical services for both
                  practitioners and patients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
