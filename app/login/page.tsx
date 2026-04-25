import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { LoginForm } from "./LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  )
}
