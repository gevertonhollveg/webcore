"use client"

import type React from "react"

import { useState } from "react"
import { createNews, updateNews, deleteNews } from "@/lib/admin-actions"
import { Plus, Edit, Trash2, Save, X, AlertCircle } from "lucide-react"
import Image from "next/image"

interface News {
  id: number
  title: string
  content: string
  image_url: string
  author: string
  created_at: string
}

interface NewsManagerProps {
  initialNews: News[]
}

export default function NewsManager({ initialNews }: NewsManagerProps) {
  const [news, setNews] = useState<News[]>(initialNews)
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    author: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      imageUrl: "",
      author: "",
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEdit = (newsItem: News) => {
    setIsEditing(newsItem.id)
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      imageUrl: newsItem.image_url,
      author: newsItem.author,
    })
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await createNews(formData)

      if (result.success) {
        // Adicionar nova notícia à lista
        const newNewsItem = {
          id: result.id,
          title: formData.title,
          content: formData.content,
          image_url: formData.imageUrl,
          author: formData.author,
          created_at: new Date().toISOString(),
        }

        setNews([newNewsItem, ...news])
        setIsCreating(false)
        resetForm()
        setMessage({ type: "success", text: "Notícia criada com sucesso!" })
      } else {
        setMessage({ type: "error", text: result.error || "Erro ao criar notícia." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Ocorreu um erro ao criar a notícia." })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing === null) return

    setIsLoading(true)
    setMessage(null)

    try {
      const result = await updateNews(isEditing, formData)

      if (result.success) {
        // Atualizar notícia na lista
        setNews(
          news.map((item) =>
            item.id === isEditing
              ? {
                  ...item,
                  title: formData.title,
                  content: formData.content,
                  image_url: formData.imageUrl,
                }
              : item,
          ),
        )

        setIsEditing(null)
        resetForm()
        setMessage({ type: "success", text: "Notícia atualizada com sucesso!" })
      } else {
        setMessage({ type: "error", text: result.error || "Erro ao atualizar notícia." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Ocorreu um erro ao atualizar a notícia." })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta notícia?")) return

    setIsLoading(true)
    setMessage(null)

    try {
      const result = await deleteNews(id)

      if (result.success) {
        // Remover notícia da lista
        setNews(news.filter((item) => item.id !== id))
        setMessage({ type: "success", text: "Notícia excluída com sucesso!" })
      } else {
        setMessage({ type: "error", text: result.error || "Erro ao excluir notícia." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Ocorreu um erro ao excluir a notícia." })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
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

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Lista de Notícias</h2>
        <button
          onClick={() => {
            setIsCreating(true)
            setIsEditing(null)
            resetForm()
          }}
          className="flex items-center bg-gradient-to-b from-amber-700 to-amber-900 py-2 px-4 text-center font-semibold hover:from-amber-600 hover:to-amber-800 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Notícia
        </button>
      </div>

      {(isCreating || isEditing !== null) && (
        <div className="bg-gray-900 p-6 rounded-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{isCreating ? "Criar Nova Notícia" : "Editar Notícia"}</h3>
            <button
              onClick={() => {
                setIsCreating(false)
                setIsEditing(null)
              }}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={isCreating ? handleCreate : handleUpdate} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Título
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-1">
                URL da Imagem
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="text"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-1">
                Autor
              </label>
              <input
                id="author"
                name="author"
                type="text"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                Conteúdo
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={6}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
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
                    {isCreating ? "Criando..." : "Atualizando..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isCreating ? "Criar Notícia" : "Atualizar Notícia"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {news.length === 0 ? (
        <div className="bg-gray-900 p-6 rounded-sm text-center">
          <p className="text-gray-400">Nenhuma notícia encontrada.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="bg-gray-900 p-4 rounded-sm">
              <div className="flex items-start">
                <div className="relative h-20 w-20 mr-4">
                  <Image
                    src={item.image_url || "/placeholder.svg?height=80&width=80"}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="object-cover rounded-sm"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Por {item.author} • {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-2 line-clamp-2">{item.content}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button onClick={() => handleEdit(item)} className="p-1 text-gray-400 hover:text-white">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1 text-gray-400 hover:text-red-500">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

