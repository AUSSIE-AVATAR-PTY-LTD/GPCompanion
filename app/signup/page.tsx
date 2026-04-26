import { Navbar } from "@/components/navbar"
import { SignUpForm } from "./SignUpForm"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 to-white">
      <Navbar />
      <main className="flex-1 py-12 px-4 flex items-start justify-center">
        <SignUpForm />
      </main>
    </div>
  )
}
