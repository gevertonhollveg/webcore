"use client"

import { useState, useEffect } from "react"
import { BarChart, Activity, Users, CreditCard, AlertTriangle } from "lucide-react"
import { getAdminStats } from "@/lib/admin-actions"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCharacters: 0,
    totalTransactions: 0,
    totalCredits: 0,
    recentTransactions: [],
    serverStatus: {
      status: "loading",
      message: "Verificando status do servidor...",
    },
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAdminStats()
        setStats(data)
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Administrativo</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <>
          {/* Status do Servidor */}
          <div
            className={`mb-8 p-4 rounded-sm ${
              stats.serverStatus.status === "online"
                ? "bg-green-900/30 border border-green-800"
                : stats.serverStatus.status === "offline"
                  ? "bg-red-900/30 border border-red-800"
                  : "bg-yellow-900/30 border border-yellow-800"
            }`}
          >
            <div className="flex items-center">
              {stats.serverStatus.status === "online" ? (
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              ) : stats.serverStatus.status === "offline" ? (
                <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
              ) : (
                <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
              )}
              <h2 className="text-lg font-semibold">Status do Servidor</h2>
            </div>
            <p className="mt-2">{stats.serverStatus.message}</p>
          </div>

          {/* Estatísticas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 p-6 rounded-sm">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-amber-500 mr-3" />
                <h2 className="text-lg font-semibold">Usuários</h2>
              </div>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <div className="text-sm text-gray-400 mt-2">{stats.activeUsers} ativos nas últimas 24h</div>
            </div>

            <div className="bg-gray-900 p-6 rounded-sm">
              <div className="flex items-center mb-4">
                <Activity className="h-6 w-6 text-amber-500 mr-3" />
                <h2 className="text-lg font-semibold">Personagens</h2>
              </div>
              <div className="text-3xl font-bold">{stats.totalCharacters}</div>
              <div className="text-sm text-gray-400 mt-2">
                {(stats.totalCharacters / Math.max(1, stats.totalUsers)).toFixed(2)} média por usuário
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-sm">
              <div className="flex items-center mb-4">
                <CreditCard className="h-6 w-6 text-amber-500 mr-3" />
                <h2 className="text-lg font-semibold">Transações</h2>
              </div>
              <div className="text-3xl font-bold">{stats.totalTransactions}</div>
              <div className="text-sm text-gray-400 mt-2">{stats.totalCredits} créditos vendidos</div>
            </div>

            <div className="bg-gray-900 p-6 rounded-sm">
              <div className="flex items-center mb-4">
                <BarChart className="h-6 w-6 text-amber-500 mr-3" />
                <h2 className="text-lg font-semibold">Ranking</h2>
              </div>
              <div className="text-3xl font-bold">Atualizado</div>
              <div className="text-sm text-gray-400 mt-2">Última atualização: 15 min atrás</div>
            </div>
          </div>

          {/* Alertas */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Alertas do Sistema</h2>
            <div className="bg-gray-900 p-4 rounded-sm">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">Lembrete de Configuração</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Configure todas as seções do painel administrativo para garantir o funcionamento correto do sistema.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/admin/content/news" className="bg-gray-900 p-4 rounded-sm hover:bg-gray-800 transition-colors">
                <h3 className="font-medium">Gerenciar Notícias</h3>
                <p className="text-sm text-gray-400 mt-1">Adicionar ou editar notícias do site</p>
              </a>
              <a href="/admin/users/manage" className="bg-gray-900 p-4 rounded-sm hover:bg-gray-800 transition-colors">
                <h3 className="font-medium">Gerenciar Usuários</h3>
                <p className="text-sm text-gray-400 mt-1">Administrar contas de usuários</p>
              </a>
              <a
                href="/admin/system/general"
                className="bg-gray-900 p-4 rounded-sm hover:bg-gray-800 transition-colors"
              >
                <h3 className="font-medium">Configurações</h3>
                <p className="text-sm text-gray-400 mt-1">Ajustar configurações do sistema</p>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

