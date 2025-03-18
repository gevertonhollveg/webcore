"use client"

import { useState } from "react"
import { User, BarChart2 } from "lucide-react"

interface UserStatsProps {
  user: {
    id: number
    username: string
    email: string
    role: string
    credits: number
  }
  stats: {
    totalCharacters: number
    highestLevel: number
    totalExperience: number
    credits: number
  }
}

export default function UserStats({ user, stats }: UserStatsProps) {
  const [showEmail, setShowEmail] = useState(false)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-900 p-6 rounded-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-amber-500" />
          Informações da Conta
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Nome de Usuário:</span>
            <span className="font-medium">{user.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Email:</span>
            <button
              onClick={() => setShowEmail(!showEmail)}
              className="font-medium hover:text-amber-500 transition-colors"
            >
              {showEmail ? user.email : user.email.replace(/(.{3})(.*)(@.*)/, "$1***$3")}
            </button>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Tipo de Conta:</span>
            <span className={`font-medium ${user.role === "admin" ? "text-amber-500" : ""}`}>
              {user.role === "admin" ? "Administrador" : "Jogador"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Créditos:</span>
            <span className="font-medium text-amber-500">{user.credits}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-amber-500" />
          Estatísticas do Jogador
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Total de Personagens:</span>
            <span className="font-medium">{stats.totalCharacters}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Nível Mais Alto:</span>
            <span className="font-medium">{stats.highestLevel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Experiência Total:</span>
            <span className="font-medium">{stats.totalExperience.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status:</span>
            <span className="font-medium text-green-500">Ativo</span>
          </div>
        </div>
      </div>
    </div>
  )
}

