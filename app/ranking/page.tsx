import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { getRanking } from "@/lib/admin-actions"
import { loadConfig } from "@/lib/admin-actions"
import RankingTable from "@/components/ranking-table"
import LoginButton from "@/components/login-button"

export default async function RankingPage() {
  // Carregar configurações
  const config = await loadConfig()
  const rankingConfig = config.ranking

  // Carregar dados do ranking
  const rankingData = await getRanking()

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
          <Link href="/ranking" className="text-sm hover:text-gray-300">
            Ranking
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
          <Image src="/ranking-bg.jpg" alt="Ranking Background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-4xl font-bold text-center">RANKING</h1>
          </div>
        </div>
      </section>

      {/* Ranking Section */}
      <section className="max-w-6xl mx-auto -mt-16 relative z-10 bg-gray-900 p-8 rounded-sm">
        <Suspense fallback={<div className="text-center py-8">Carregando ranking...</div>}>
          <div className="mb-4 text-sm text-gray-400 text-right">
            Última atualização: {rankingData.lastUpdated ? new Date(rankingData.lastUpdated).toLocaleString() : "N/A"}
          </div>

          {rankingConfig.categories.map((category: any) => (
            <div key={category.id} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
              <RankingTable data={rankingData.data?.[category.id] || []} category={category.id} />
            </div>
          ))}
        </Suspense>
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

