"use client"

import type React from "react"

import { useState } from "react"
import { saveConfig } from "@/lib/admin-actions"
import { AlertCircle, Save } from "lucide-react"

interface GeneralConfigFormProps {
  initialData: {
    siteName: string
    siteDescription: string
    maintenanceMode: boolean
    maintenanceMessage: string
    allowRegistration: boolean
    requireEmailVerification: boolean
    maxCharactersPerUser: number
  }
}

export default function GeneralConfigForm({ initialData }: GeneralConfigFormProps) {
  const [formData, setFormData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? Number.parseInt(value)
            : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await saveConfig("general", formData)

      if (result.success) {
        setMessage({ type: "success", text: "Configurações salvas com sucesso!" })
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-gray-300 mb-1">
              Nome do Site
            </label>
            <input
              id="siteName"
              name="siteName"
              type="text"
              value={formData.siteName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-300 mb-1">
              Descrição do Site
            </label>
            <input
              id="siteDescription"
              name="siteDescription"
              type="text"
              value={formData.siteDescription}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-4">
              <input
                id="maintenanceMode"
                name="maintenanceMode"
                type="checkbox"
                checked={formData.maintenanceMode}
                onChange={handleChange}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-700 rounded"
              />
              <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-300">
                Modo de Manutenção
              </label>
            </div>

            {formData.maintenanceMode && (
              <div>
                <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-300 mb-1">
                  Mensagem de Manutenção
                </label>
                <textarea
                  id="maintenanceMessage"
                  name="maintenanceMessage"
                  value={formData.maintenanceMessage}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center mb-4">
              <input
                id="allowRegistration"
                name="allowRegistration"
                type="checkbox"
                checked={formData.allowRegistration}
                onChange={handleChange}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-700 rounded"
              />
              <label htmlFor="allowRegistration" className="ml-2 block text-sm text-gray-300">
                Permitir Registro de Novos Usuários
              </label>
            </div>

            <div className="flex items-center mb-4">
              <input
                id="requireEmailVerification"
                name="requireEmailVerification"
                type="checkbox"
                checked={formData.requireEmailVerification}
                onChange={handleChange}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-700 rounded"
              />
              <label htmlFor="requireEmailVerification" className="ml-2 block text-sm text-gray-300">
                Exigir Verificação de Email
              </label>
            </div>

            <div>
              <label htmlFor="maxCharactersPerUser" className="block text-sm font-medium text-gray-300 mb-1">
                Máximo de Personagens por Usuário
              </label>
              <input
                id="maxCharactersPerUser"
                name="maxCharactersPerUser"
                type="number"
                min="1"
                max="10"
                value={formData.maxCharactersPerUser}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
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

