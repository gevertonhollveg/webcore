import Image from "next/image"
import Link from "next/link"
import LoginButton from "@/components/login-button"

export default function Download() {
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
        <div className="relative h-[500px] w-full overflow-hidden">
          <Image src="/hero-banner.jpg" alt="Lorencia Heroes" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Image src="/logo-large.png" alt="Lorencia Logo" width={300} height={100} className="brightness-0 invert" />
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="max-w-3xl mx-auto -mt-16 relative z-10 bg-gray-900 p-8 rounded-sm">
        <h2 className="text-2xl font-semibold text-center mb-8">DOWNLOAD</h2>

        <p className="text-sm text-gray-400 mb-4 text-center">Choose the best option for your download:</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button className="bg-blue-800 hover:bg-blue-700 py-3 text-center font-medium transition-colors">
            GOOGLE DRIVE
          </button>
          <button className="bg-blue-800 hover:bg-blue-700 py-3 text-center font-medium transition-colors">
            GOOGLE DRIVE 2
          </button>
          <button className="bg-blue-800 hover:bg-blue-700 py-3 text-center font-medium transition-colors">
            TORRENT
          </button>
        </div>

        <h3 className="text-xl font-semibold text-center mb-6">SYSTEM REQUIREMENTS</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-gray-400 mb-4">Minimum</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span>Windows 7</span>
              </li>
              <li className="flex justify-between">
                <span>CPU: Pentium 4 700Mhz</span>
              </li>
              <li className="flex justify-between">
                <span>RAM: 512 MB</span>
              </li>
              <li className="flex justify-between">
                <span>GPU: 3D graphics processor, 32 MB</span>
              </li>
              <li className="flex justify-between">
                <span>HD: Around 2 GB</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-400 mb-4">Recommended</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span>Windows 10</span>
              </li>
              <li className="flex justify-between">
                <span>CPU: Pentium 4 2.0GHz or higher</span>
              </li>
              <li className="flex justify-between">
                <span>RAM: 1 GB or higher</span>
              </li>
              <li className="flex justify-between">
                <span>GPU: 3D graphics processor, 128 MB or higher</span>
              </li>
              <li className="flex justify-between">
                <span>HD: Around 4 GB or higher</span>
              </li>
            </ul>
          </div>
        </div>
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
        <div className="mt-8 text-xs text-gray-600">
          <p>Warning! This is a visual copy of the Lorencia presentation.</p>
          <p>Not related with © 2023</p>
        </div>
        <div className="mt-4">
          <Image
            src="/logo.png"
            alt="Footer Logo"
            width={30}
            height={30}
            className="mx-auto brightness-0 invert opacity-50"
          />
        </div>
      </footer>
    </main>
  )
}

