"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface Character {
  id: number
  name: string
  class: string
  level: number
  experience: number
  created_at: string
}

interface CharacterListProps {
  characters: Character[]
}

export default function CharacterList({ characters }: CharacterListProps) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null)

  // Filtrar personagens por classe, se selecionada
  const filteredCharacters = selectedClass ? characters.filter((char) => char.class === selectedClass) : characters

  // Obter classes únicas para o filtro
  const uniqueClasses = Array.from(new Set(characters.map((char) => char.class)))

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
      {characters.length === 0 ? (
        <div className="text-center py-8 bg-gray-900 rounded-sm">
          <p className="text-gray-400 mb-4">Você ainda não tem personagens.</p>
          <Link
            href="/dashboard/characters/create"
            className="bg-gradient-to-b from-amber-700 to-amber-900 py-2 px-4 text-center font-semibold hover:from-amber-600 hover:to-amber-800 transition-colors inline-block"
          >
            Criar Personagem
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedClass(null)}
                className={`px-3 py-1 text-sm ${
                  selectedClass === null ? "bg-amber-700 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Todos
              </button>
              {uniqueClasses.map((className) => (
                <button
                  key={className}
                  onClick={() => setSelectedClass(className)}
                  className={`px-3 py-1 text-sm ${
                    selectedClass === className
                      ? "bg-amber-700 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {className}
                </button>
              ))}
            </div>

            <Link
              href="/dashboard/characters/create"
              className="text-sm text-amber-500 hover:text-amber-400 flex items-center"
            >
              Criar Novo
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCharacters.map((character) => (
              <Link
                key={character.id}
                href={`/dashboard/characters/${character.id}`}
                className="bg-gray-900 p-4 rounded-sm flex items-center hover:bg-gray-800 transition-colors"
              >
                <div className="mr-4">
                  <Image
                    src={classImages[character.class] || "/placeholder.svg"}
                    alt={character.class}
                    width={60}
                    height={60}
                    className="rounded-full object-cover h-[60px] w-[60px]"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{character.name}</h3>
                  <div className="text-sm text-gray-400">
                    {character.class} • Nível {character.level}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

