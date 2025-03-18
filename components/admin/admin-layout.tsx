import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { getAuthUser, logout } from "@/lib/auth-actions"
import {
  Home,
  Settings,
  LogOut,
  Database,
  Mail,
  CreditCard,
  Download,
  FileText,
  Users,
  Award,
  Layout,
  Shield,
} from "lucide-react"

interface AdminLayoutProps {
  children: ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getAuthUser()

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="mb-6">Você não tem permissão para acessar o painel administrativo.</p>
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
            Site
          </Link>
          <Link href="/dashboard" className="text-sm hover:text-gray-300">
            Painel do Jogador
          </Link>
          <Link href="/admin" className="text-sm hover:text-gray-300">
            Painel Admin
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="text-amber-500 font-semibold">ADMINISTRADOR:</span> {user.username}
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
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-amber-500 mb-2">Painel Administrativo</h2>
            <p className="text-xs text-gray-400">Gerencie todas as configurações do sistema</p>
          </div>

          <nav>
            <div className="mb-2">
              <Link
                href="/admin"
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
              >
                <Home className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
            </div>

            {/* Módulo: Sistema */}
            <div className="mb-4">
              <h3 className="text-xs uppercase text-gray-500 font-semibold px-4 py-2">Sistema</h3>
              <div className="space-y-1">
                <Link
                  href="/admin/system/general"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Configurações Gerais
                </Link>
                <Link
                  href="/admin/system/database"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
                >
                  <Database className="h-4 w-4 mr-3" />
                  Banco de Dados
                </Link>
                <Link
                  href="/admin/system/email"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
                >
                  <Mail className="h-4 w-4 mr-3" />
                  Configuração de Email
                </Link>
              </div>
            </div>

            {/* Módulo: Conteúdo */}
            <div className="mb-4">
              <h3 className="text-xs uppercase text-gray-500 font-semibold px-4 py-2">Conteúdo</h3>
              <div className="space-y-1">
                <Link
                  href="/admin/content/news"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Notícias
                </Link>
                <Link
                  href="/admin/content/downloads"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
                >
                  <Download className="h-4 w-4 mr-3" />
                  Downloads
                </Link>
                <Link
                  href="/admin/content/appearance"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
                >
                  <Layout className="h-4 w-4 mr-3" />
                  Aparência
                </Link>
              </div>
            </div>

            {/* Módulo: Usuários */}
            <div className="mb-4">
              <h3 className="text-xs uppercase text-gray-500 font-semibold px-4 py-2">Usuários</h3>
              <div className="space-y-1">
                <Link
                  href="/admin/users/manage"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
                >
                  <Users className="h-4 w-4 mr-3" />
                  Gerenciar Usuários
                </Link>
                <Link
                  href="/admin/users/characters"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
                >
                  <Shield className="h-4 w-4 mr-3" />
                  Personagens
                </Link>
                <Link
                  href="/admin/users/ranking"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
                >
                  <Award className="h-4 w-4 mr-3" />
                  Ranking
                </Link>
              </div>
            </div>

            {/* Módulo: Financeiro */}
            <div className="mb-4">
              <h3 className="text-xs uppercase text-gray-500 font-semibold px-4 py-2">Financeiro</h3>
              <div className="space-y-1">
                <Link
                  href="/admin/finance/credits"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  Configuração de Créditos
                </Link>
                <Link
                  href="/admin/finance/transactions"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-sm"
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  Transações
                </Link>
              </div>
            </div>
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 bg-black p-6">{children}</main>
      </div>
    </div>
  )
}

