import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { ResetPasswordConfirmForm } from "./ResetPasswordConfirmForm"

export default function ResetPasswordConfirmPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 to-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Suspense fallback={null}>
          <ResetPasswordConfirmForm />
        </Suspense>
      </main>
    </div>
  )
}
