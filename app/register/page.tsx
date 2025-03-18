import Image from "next/image"
import Link from "next/link"
import RegisterForm from "@/components/register-form"
import LoginButton from "@/components/login-button"

export default function Register() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center space-x-8">
          <Link href="/" className="mr-4">
            <Image src="/logo.png" alt="Lorencia Logo" width={30} height={30} className="brightness-0 invert" />
          </Link>
          <Link href="/" className="text-sm hover:text-gray-300">
            Home
          </Link>
          <Link href="/download" className="text-sm hover:text-gray-300">
            Download the Game
          </Link>
          <Link href="/register" className="text-sm hover:text-gray-300">
            Create Account
          </Link>
          <Link href="/events" className="text-sm hover:text-gray-300">
            Events & Item Shop
          </Link>
          <Link href="/community" className="text-sm hover:text-gray-300 flex items-center">
            <Image src="/discord.png" alt="Discord" width={16} height={16} className="mr-1 brightness-0 invert" />
            Discord Community
          </Link>
        </div>
        <div>
          <LoginButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[300px] w-full overflow-hidden">
          <Image src="/register-bg.jpg" alt="Register Background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-4xl font-bold text-center">CREATE ACCOUNT</h1>
          </div>
        </div>
      </section>

      {/* Register Form Section */}
      <section className="max-w-3xl mx-auto -mt-16 relative z-10 bg-gray-900 p-8 rounded-sm">
        <RegisterForm />
      </section>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-800 text-center">
        <div className="mb-6">
          <Image
            src="/logo-large.png"
            alt="Lorencia Logo"
            width={150}
            height={50}
            className="mx-auto brightness-0 invert"
          />
        </div>
        <div className="flex justify-center space-x-4 text-sm text-gray-400">
          <Link href="/terms" className="hover:text-gray-300">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-gray-300">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </main>
  )
}

