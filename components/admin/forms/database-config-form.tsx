"use client"

import type React from "react"

import { useState } from "react"
import { saveConfig } from "@/lib/admin-actions"
import { AlertCircle, Save, RefreshCw } from "lucide-react"

interface DatabaseConfigFormProps {
  initialData: {
    host: string
    user: string
    password: string
    database: string
    port: number
  }
}

export default function DatabaseConfigForm({ initialData }: DatabaseConfigFormProps) {
  const [formData, setFormData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseInt(value) : value,
    }))
  }

  const testConnection = async () => {
    setIsTesting(true)
    setMessage(null)

    try {
      // Simular teste de conexão
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setMessage({ type: "success", text: "Conexão com o banco de dados estabelecida com sucesso!" })
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao conectar ao banco de dados. Verifique as configurações." })
      console.error(error)
    } finally {
      setIsTesting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await saveConfig("database", formData)

      if (result.success) {
        setMessage({ type: "success", text: "Configurações de banco de dados salvas com sucesso!" })
      } else {
        setMessage({ type: "error", text: result.error || "Erro ao salvar configurações." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Ocorreu um erro ao salvar as configurações." })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 p-6 rounded-sm">
      {message && (
        <div
          className={`mb-6 p-4 rounded-sm flex items-start ${
            message.type === "success"
              ? "bg-green-900/30 border border-green-800 text-green-200"
              : "bg-red-900/30 border border-red-800 text-red-200"
          }`}
        >
          <AlertCircle className="h-5 w-5 mr-3 mt-0.5" />
          <p>{message.text}</p>
        </div>
      )}

      <div className="mb-6 p-4 bg-amber-900/30 border border-amber-800 text-amber-200 rounded-sm">
        <p className="text-sm">
          <strong>Atenção:</strong> Alterar as configurações de banco de dados pode afetar o funcionamento do sistema.
          Certifique-se de que as informações estão corretas antes de salvar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="host" className="block text-sm font-medium text-gray-300 mb-1">
              Host
            </label>
            <input
              id="host"
              name="host"
              type="text"
              value={formData.host}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label htmlFor="port" className="block text-sm font-medium text-gray-300 mb-1">
              Porta
            </label>
            <input
              id="port"
              name="port"
              type="number"
              value={formData.port}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="database" className="block text-sm font-medium text-gray-300 mb-1">
              Nome do Banco de Dados
            </label>
            <input
              id="database"
              name="database"
              type="text"
              value={formData.database}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label htmlFor="user" className="block text-sm font-medium text-gray-300 mb-1">
              Usuário
            </label>
            <input
              id="user"
              name="user"
              type="text"
              value={formData.user}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            required
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={testConnection}
            disabled={isTesting}
            className="flex items-center bg-gray-800 py-2 px-4 text-center font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Testando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Testar Conexão
              </>
            )}
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center bg-gradient-to-b from-amber-700 to-amber-900 py-2 px-4 text-center font-semibold hover:from-amber-600 hover:to-amber-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

