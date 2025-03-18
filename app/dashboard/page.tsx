import { requireAuth } from "@/lib/auth-actions"
import DashboardLayout from "@/components/dashboard-layout"
import UserStats from "@/components/user-stats"
import CharacterList from "@/components/character-list"
import { query } from "@/lib/db"

export default async function Dashboard() {
  // Verificar autenticação e obter dados do usuário
  const user = await requireAuth()

  // Buscar personagens do usuário
  const characters = (await query("SELECT * FROM characters WHERE user_id = ? ORDER BY level DESC", [user.id])) as any[]

  // Buscar estatísticas do usuário
  const stats = {
    totalCharacters: characters.length,
    highestLevel: characters.length > 0 ? Math.max(...characters.map((c: any) => c.level)) : 0,
    totalExperience: characters.reduce((sum: number, c: any) => sum + c.experience, 0),
    credits: user.credits,
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Painel do Jogador</h1>

        <UserStats user={user} stats={stats} />

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Seus Personagens</h2>
          <CharacterList characters={characters} />
        </div>

        <div className="mt-12 bg-gray-900 p-6 rounded-sm">
          <h2 className="text-2xl font-semibold mb-4">Loja de Créditos</h2>
          <p className="text-gray-300 mb-4">Compre créditos para desbloquear itens exclusivos e vantagens no jogo.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <a
              href="/dashboard/shop/credits?package=small"
              className="bg-gradient-to-b from-amber-700 to-amber-900 p-4 text-center hover:from-amber-600 hover:to-amber-800 transition-colors"
            >
              <div className="text-xl font-bold">100 Créditos</div>
              <div className="text-amber-300 text-2xl font-bold my-2">R$ 10,00</div>
              <div className="text-sm text-gray-300">Pacote Básico</div>
            </a>
            <a
              href="/dashboard/shop/credits?package=medium"
              className="bg-gradient-to-b from-amber-700 to-amber-900 p-4 text-center hover:from-amber-600 hover:to-amber-800 transition-colors relative"
            >
              <div className="absolute top-0 right-0 bg-amber-500 text-black px-2 py-1 text-xs font-bold">POPULAR</div>
              <div className="text-xl font-bold">300 Créditos</div>
              <div className="text-amber-300 text-2xl font-bold my-2">R$ 25,00</div>
              <div className="text-sm text-gray-300">Pacote Intermediário</div>
            </a>
            <a
              href="/dashboard/shop/credits?package=large"
              className="bg-gradient-to-b from-amber-700 to-amber-900 p-4 text-center hover:from-amber-600 hover:to-amber-800 transition-colors"
            >
              <div className="text-xl font-bold">700 Créditos</div>
              <div className="text-amber-300 text-2xl font-bold my-2">R$ 50,00</div>
              <div className="text-sm text-gray-300">Pacote Premium</div>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

