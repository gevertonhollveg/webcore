import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import LoginButton from "@/components/login-button"

export default function Home() {
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

        {/* Action Buttons */}
        <div className="flex justify-center -mt-16 relative z-10">
          <div className="grid grid-cols-3 gap-1 w-full max-w-3xl px-4">
            <Link
              href="/download"
              className="bg-gradient-to-b from-amber-700 to-amber-900 py-3 px-6 text-center font-semibold hover:from-amber-600 hover:to-amber-800 transition-colors"
            >
              GAME START
            </Link>
            <div className="bg-gray-900 py-3 px-6 text-center">
              <div className="text-xs text-gray-400">HONOR RANK</div>
              <div className="text-amber-500 font-semibold">NEW</div>
            </div>
            <div className="bg-gray-900 py-3 px-6 text-center">
              <div className="text-xs text-gray-400">FRIEND SERVER</div>
              <div className="text-red-500 font-semibold">OFF</div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="max-w-6xl mx-auto mt-8 px-4">
        <h2 className="flex items-center text-lg font-semibold mb-4">
          <ChevronRight className="h-5 w-5 text-amber-500" />
          NEWS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative overflow-hidden group">
            <Image
              src="/news-1.jpg"
              alt="News 1"
              width={400}
              height={200}
              className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-sm font-medium">New dungeon released: The Forgotten Depths</h3>
            </div>
          </div>
          <div className="relative overflow-hidden group">
            <Image
              src="/news-2.jpg"
              alt="News 2"
              width={400}
              height={200}
              className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-sm font-medium">Limited time event: Double XP weekend</h3>
            </div>
          </div>
          <div className="relative overflow-hidden group">
            <Image
              src="/news-3.jpg"
              alt="News 3"
              width={400}
              height={200}
              className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-sm font-medium">Season 17 part 3 now available!</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Links Section */}
      <section className="max-w-6xl mx-auto mt-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 p-4 flex items-center">
            <ChevronRight className="h-5 w-5 text-amber-500 mr-2" />
            <span className="font-medium">PATCH NOTES</span>
            <div className="ml-auto">
              <Image
                src="/character-1.jpg"
                alt="Patch Notes"
                width={60}
                height={60}
                className="rounded-full object-cover h-[60px] w-[60px]"
              />
            </div>
          </div>
          <div className="bg-gray-900 p-4 flex items-center">
            <ChevronRight className="h-5 w-5 text-amber-500 mr-2" />
            <span className="font-medium">DROP LIST</span>
            <div className="ml-auto">
              <Image
                src="/character-2.jpg"
                alt="Drop List"
                width={60}
                height={60}
                className="rounded-full object-cover h-[60px] w-[60px]"
              />
            </div>
          </div>
          <div className="bg-gray-900 p-4 flex items-center">
            <ChevronRight className="h-5 w-5 text-amber-500 mr-2" />
            <span className="font-medium">GAME RATES</span>
            <div className="ml-auto">
              <Image
                src="/character-3.jpg"
                alt="Game Rates"
                width={60}
                height={60}
                className="rounded-full object-cover h-[60px] w-[60px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Legends Section */}
      <section className="mt-16 relative">
        <div className="relative h-[400px] w-full overflow-hidden">
          <Image src="/legends-bg.jpg" alt="Legends Background" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-semibold mb-12 tracking-wider">LEGENDS OF LORENCIA</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-5xl mx-auto">
              {[
                { name: "BLADE KNIGHT", img: "/class-1.jpg" },
                { name: "SOUL MASTER", img: "/class-2.jpg" },
                { name: "MUSE ELF", img: "/class-3.jpg" },
                { name: "MAGIC GLADIATOR", img: "/class-4.jpg" },
                { name: "DARK LORD", img: "/class-5.jpg" },
              ].map((classInfo, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-amber-500"></div>
                    <div className="absolute inset-1 rounded-full border border-amber-700"></div>
                    <Image
                      src={classInfo.img || "/placeholder.svg"}
                      alt={classInfo.name}
                      width={80}
                      height={80}
                      className="rounded-full object-cover h-[80px] w-[80px]"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-amber-500 font-medium">{classInfo.name.split(" ")[0]}</div>
                    <div className="text-xs text-amber-500 font-medium">{classInfo.name.split(" ")[1]}</div>
                  </div>
                </div>
              ))}
            </div>
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
      </footer>
    </main>
  )
}

