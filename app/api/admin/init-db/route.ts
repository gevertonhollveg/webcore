import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"
import { getAuthUser } from "@/lib/auth-actions"

// Rota para inicializar o banco de dados
// Somente administradores podem acessar
export async function POST() {
  try {
    // Verificar se o usuário é administrador
    const user = await getAuthUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 })
    }

    // Inicializar banco de dados
    await initializeDatabase()

    // Criar tabela de notícias se não existir
    await createNewsTable()

    return NextResponse.json({ success: true, message: "Banco de dados inicializado com sucesso" })
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// Função para criar tabela de notícias
async function createNewsTable() {
  const { query } = await import("@/lib/db")

  await query(`
    CREATE TABLE IF NOT EXISTS news (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      image_url VARCHAR(255),
      author VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

