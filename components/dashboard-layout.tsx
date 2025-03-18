import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { getAuthUser, logout } from "@/lib/auth-actions"
import { User, Home, ShoppingCart, Settings, LogOut, CreditCard, Shield, Users } from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getAuthUser()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="mb-6">Você precisa estar logado para acessar esta página.</p>
          <Link
            href="/"
            className="bg-gradient-to-b from-amber-700 to-amber-900 py-2 px-4 text-center font-semibold hover:from-amber-600 hover:to-amber-800 transition-colors"
          >
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Barra de navegação superior */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center space-x-8">
          <Link href="/" className="mr-4">
            <Image src="/logo.png" alt="Lorencia Logo" width={30} height={30} className="brightness-0 invert" />
          </Link>
          <Link href="/" className="text-sm hover:text-gray-300">
            Home
          </Link>
          <Link href="/download" className="text-sm hover:text-gray-300">
            Download
          </Link>
          <Link href="/dashboard" className="text-sm hover:text-gray-300">
            Painel
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-amber-500">
            <span className="text-gray-400 mr-1">Créditos:</span>
            {user.credits}
          </div>
          <div className="text-sm">
            Olá, <span className="font-semibold">{user.username}</span>
          </div>
          <form action={logout}>
            <button type="submit" className="flex items-center text-sm text-gray-400 hover:text-white">
              <LogOut className="h-4 w-4 mr-1" />
              Sair
            </button>
          </form>
        </div>
      </nav>

      <div className="flex">
        {/* Barra lateral */}
        <aside className="w-64 bg-gray-900 min-h-screen p-4">
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
            >
              <Home className="h-5 w-5 mr-3" />
              Início
            </Link>
            <Link
              href="/dashboard/characters"
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
            >
              <Users className="h-5 w-5 mr-3" />
              Personagens
            </Link>
            <Link
              href="/dashboard/shop"
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
            >
              <ShoppingCart className="h-5 w-5 mr-3" />
              Loja
            </Link>
            <Link
              href="/dashboard/credits"
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
            >
              <CreditCard className="h-5 w-5 mr-3" />
              Comprar Créditos
            </Link>
            <Link
              href="/dashboard/account"
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
            >
              <User className="h-5 w-5 mr-3" />
              Minha Conta
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
            >
              <Settings className="h-5 w-5 mr-3" />
              Configurações
            </Link>
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center px-4 py-3 text-amber-500 hover:bg-gray-800 hover:text-amber-400 rounded-sm"
              >
                <Shield className="h-5 w-5 mr-3" />
                Painel Admin
              </Link>
            )}
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 bg-black">{children}</main>
      </div>
    </div>
  )
}

