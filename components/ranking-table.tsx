"use client"

import { useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"

interface RankingTableProps {
  data: any[]
  category: string
}

export default function RankingTable({ data, category }: RankingTableProps) {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filtrar dados com base na pesquisa
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.username && item.username.toLowerCase().includes(search.toLowerCase())),
  )

  // Calcular páginas
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Mapear classes para imagens
  const classImages: Record<string, string> = {
    "BLADE KNIGHT": "/class-1.jpg",
    "SOUL MASTER": "/class-2.jpg",
    "MUSE ELF": "/class-3.jpg",
    "MAGIC GLADIATOR": "/class-4.jpg",
    "DARK LORD": "/class-5.jpg",
  }

  return (
    <div>
      <div className="mb-4 flex">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Buscar por nome..."
            className="w-full pl-10 px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {currentData.length === 0 ? (
        <div className="text-center py-8 bg-gray-800 rounded-sm">
          <p className="text-gray-400">Nenhum resultado encontrado.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Posição
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Personagem
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Classe
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {category === "resets" ? "Resets" : "Level"}
                  </th>
                  {category === "resets" && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Level
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Jogador
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {currentData.map((item, index) => {
                  const position = (currentPage - 1) * itemsPerPage + index + 1
                  const isTopThree = position <= 3

                  return (
                    <tr key={index} className={position % 2 === 0 ? "bg-gray-800/50" : ""}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${
                            position === 1
                              ? "text-amber-500"
                              : position === 2
                                ? "text-gray-300"
                                : position === 3
                                  ? "text-amber-700"
                                  : ""
                          }`}
                        >
                          {isTopThree && (
                            <span className="inline-block mr-1">
                              {position === 1 ? "🥇" : position === 2 ? "🥈" : "🥉"}
                            </span>
                          )}
                          {position}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 mr-3">
                            <Image
                              src={classImages[item.class] || "/placeholder.svg?height=32&width=32"}
                              alt={item.class}
                              width={32}
                              height={32}
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div className="text-sm font-medium">{item.name}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm">{item.class}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium">{category === "resets" ? item.resets : item.level}</div>
                      </td>
                      {category === "resets" && (
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm">{item.level}</div>
                        </td>
                      )}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-400">{item.username}</div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-400">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} resultados
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Lógica para mostrar páginas ao redor da página atual
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm ${
                        currentPage === pageNum ? "bg-amber-700 text-white" : "bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

