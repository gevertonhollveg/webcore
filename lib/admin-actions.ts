"use server"

import { revalidatePath } from "next/cache"
import { query } from "./db"
import { getAuthUser } from "./auth-actions"
import fs from "fs/promises"
import path from "path"
import { z } from "zod"

// Função para verificar se o usuário é administrador
async function requireAdmin() {
  const user = await getAuthUser()

  if (!user || user.role !== "admin") {
    throw new Error("Acesso não autorizado")
  }

  return user
}

// Função para obter estatísticas para o dashboard administrativo
export async function getAdminStats() {
  await requireAdmin()

  try {
    // Total de usuários
    const totalUsersResult = (await query("SELECT COUNT(*) as count FROM users")) as any[]
    const totalUsers = totalUsersResult[0].count

    // Usuários ativos nas últimas 24 horas
    const activeUsersResult = (await query(
      "SELECT COUNT(*) as count FROM users WHERE last_login > DATE_SUB(NOW(), INTERVAL 24 HOUR)",
    )) as any[]
    const activeUsers = activeUsersResult[0].count

    // Total de personagens
    const totalCharactersResult = (await query("SELECT COUNT(*) as count FROM characters")) as any[]
    const totalCharacters = totalCharactersResult[0].count

    // Total de transações
    const totalTransactionsResult = (await query("SELECT COUNT(*) as count FROM transactions")) as any[]
    const totalTransactions = totalTransactionsResult[0].count

    // Total de créditos vendidos
    const totalCreditsResult = (await query(
      "SELECT SUM(credits) as total FROM transactions WHERE status = 'completed'",
    )) as any[]
    const totalCredits = totalCreditsResult[0].total || 0

    // Transações recentes
    const recentTransactions = (await query(
      `SELECT t.id, t.amount, t.credits, t.status, t.created_at, u.username 
       FROM transactions t 
       JOIN users u ON t.user_id = u.id 
       ORDER BY t.created_at DESC LIMIT 5`,
    )) as any[]

    // Status do servidor (simulado)
    const serverStatus = {
      status: "online",
      message: "Servidor está online e funcionando normalmente.",
    }

    return {
      totalUsers,
      activeUsers,
      totalCharacters,
      totalTransactions,
      totalCredits,
      recentTransactions,
      serverStatus,
    }
  } catch (error) {
    console.error("Erro ao obter estatísticas administrativas:", error)
    throw error
  }
}

// Caminho para o arquivo de configurações
const CONFIG_FILE_PATH = path.join(process.cwd(), "data", "config.json")

// Esquema de validação para configurações gerais
const generalConfigSchema = z.object({
  siteName: z.string().min(1, "Nome do site é obrigatório"),
  siteDescription: z.string(),
  maintenanceMode: z.boolean().default(false),
  maintenanceMessage: z.string().default("O site está em manutenção. Voltaremos em breve."),
  allowRegistration: z.boolean().default(true),
  requireEmailVerification: z.boolean().default(false),
  maxCharactersPerUser: z.number().int().positive().default(5),
})

// Esquema de validação para configurações de banco de dados
const databaseConfigSchema = z.object({
  host: z.string().min(1, "Host é obrigatório"),
  user: z.string().min(1, "Usuário é obrigatório"),
  password: z.string(),
  database: z.string().min(1, "Nome do banco de dados é obrigatório"),
  port: z.number().int().positive().default(3306),
})

// Esquema de validação para configurações de email
const emailConfigSchema = z.object({
  server: z.string().min(1, "Servidor SMTP é obrigatório"),
  port: z.number().int().positive().default(587),
  secure: z.boolean().default(false),
  user: z.string().min(1, "Usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
  from: z.string().email("Email de origem inválido"),
})

// Esquema de validação para configurações de créditos
const creditsConfigSchema = z.object({
  packages: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      credits: z.number().int().positive(),
      price: z.number().positive(),
      popular: z.boolean().optional(),
    }),
  ),
  paymentMethods: z.object({
    paypal: z.boolean().default(true),
    mercadopago: z.boolean().default(true),
    creditCard: z.boolean().default(true),
  }),
})

// Esquema de validação para configurações de download
const downloadsConfigSchema = z.object({
  files: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      url: z.string().url("URL inválida"),
      size: z.string(),
      type: z.string(),
    }),
  ),
  systemRequirements: z.object({
    minimum: z.record(z.string()),
    recommended: z.record(z.string()),
  }),
})

// Esquema de validação para configurações de aparência
const appearanceConfigSchema = z.object({
  logo: z.string(),
  favicon: z.string(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Cor inválida"),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Cor inválida"),
  heroImage: z.string(),
  footerText: z.string(),
})

// Esquema de validação para configurações de ranking
const rankingConfigSchema = z.object({
  enabled: z.boolean().default(true),
  updateInterval: z.number().int().positive().default(15), // em minutos
  categories: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      query: z.string().min(1),
      limit: z.number().int().positive().default(100),
    }),
  ),
})

// Função para garantir que o diretório de dados existe
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch (error) {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Função para carregar configurações
export async function loadConfig() {
  await requireAdmin()
  await ensureDataDirectory()

  try {
    const configData = await fs.readFile(CONFIG_FILE_PATH, "utf-8")
    return JSON.parse(configData)
  } catch (error) {
    // Se o arquivo não existir, retornar configurações padrão
    return {
      general: {
        siteName: "Lorencia MMORPG",
        siteDescription: "Fantasy MMORPG Game",
        maintenanceMode: false,
        maintenanceMessage: "O site está em manutenção. Voltaremos em breve.",
        allowRegistration: true,
        requireEmailVerification: false,
        maxCharactersPerUser: 5,
      },
      database: {
        host: process.env.MYSQL_HOST || "localhost",
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "",
        database: process.env.MYSQL_DATABASE || "lorencia",
        port: 3306,
      },
      email: {
        server: process.env.EMAIL_SERVER || "",
        port: Number.parseInt(process.env.EMAIL_PORT || "587"),
        secure: process.env.EMAIL_SECURE === "true",
        user: process.env.EMAIL_USER || "",
        password: process.env.EMAIL_PASSWORD || "",
        from: process.env.EMAIL_FROM || "noreply@lorencia.com",
      },
      credits: {
        packages: [
          { id: "small", name: "Pacote Básico", credits: 100, price: 10.0 },
          { id: "medium", name: "Pacote Intermediário", credits: 300, price: 25.0, popular: true },
          { id: "large", name: "Pacote Premium", credits: 700, price: 50.0 },
        ],
        paymentMethods: {
          paypal: true,
          mercadopago: true,
          creditCard: true,
        },
      },
      downloads: {
        files: [
          {
            id: "client",
            name: "Cliente do Jogo",
            url: "https://storage.lorencia.com/downloads/client.zip",
            size: "1.2 GB",
            type: "client",
          },
          {
            id: "patch",
            name: "Patch Atualização v1.5",
            url: "https://storage.lorencia.com/downloads/patch_v1.5.zip",
            size: "250 MB",
            type: "patch",
          },
        ],
        systemRequirements: {
          minimum: {
            "Sistema Operacional": "Windows 7",
            Processador: "Pentium 4 700Mhz",
            "Memória RAM": "512 MB",
            "Placa de Vídeo": "3D graphics processor, 32 MB",
            "Espaço em Disco": "2 GB",
          },
          recommended: {
            "Sistema Operacional": "Windows 10",
            Processador: "Pentium 4 2.0GHz ou superior",
            "Memória RAM": "1 GB ou superior",
            "Placa de Vídeo": "3D graphics processor, 128 MB ou superior",
            "Espaço em Disco": "4 GB ou superior",
          },
        },
      },
      appearance: {
        logo: "/logo.png",
        favicon: "/favicon.ico",
        primaryColor: "#FFA000",
        secondaryColor: "#121212",
        heroImage: "/hero-banner.jpg",
        footerText: "© 2023 Lorencia MMORPG. Todos os direitos reservados.",
      },
      ranking: {
        enabled: true,
        updateInterval: 15, // em minutos
        categories: [
          {
            id: "level",
            name: "Top Level",
            query:
              "SELECT c.name, c.level, c.class, u.username FROM characters c JOIN users u ON c.user_id = u.id ORDER BY c.level DESC, c.experience DESC",
            limit: 100,
          },
          {
            id: "resets",
            name: "Top Resets",
            query:
              "SELECT c.name, c.resets, c.level, c.class, u.username FROM characters c JOIN users u ON c.user_id = u.id ORDER BY c.resets DESC, c.level DESC",
            limit: 100,
          },
        ],
      },
    }
  }
}

// Função para salvar configurações
export async function saveConfig(section: string, data: any) {
  await requireAdmin()
  await ensureDataDirectory()

  try {
    // Carregar configuração atual
    const config = await loadConfig()

    // Validar dados de acordo com o esquema apropriado
    let validatedData

    switch (section) {
      case "general":
        validatedData = generalConfigSchema.parse(data)
        break
      case "database":
        validatedData = databaseConfigSchema.parse(data)
        break
      case "email":
        validatedData = emailConfigSchema.parse(data)
        break
      case "credits":
        validatedData = creditsConfigSchema.parse(data)
        break
      case "downloads":
        validatedData = downloadsConfigSchema.parse(data)
        break
      case "appearance":
        validatedData = appearanceConfigSchema.parse(data)
        break
      case "ranking":
        validatedData = rankingConfigSchema.parse(data)
        break
      default:
        throw new Error(`Seção de configuração inválida: ${section}`)
    }

    // Atualizar a seção específica
    config[section] = validatedData

    // Salvar configuração atualizada
    await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), "utf-8")

    // Atualizar variáveis de ambiente em tempo de execução se necessário
    if (section === "database" || section === "email") {
      updateEnvironmentVariables(section, validatedData)
    }

    // Revalidar caminhos relevantes
    revalidatePath("/admin")
    revalidatePath(`/admin/system/${section}`)

    return { success: true }
  } catch (error) {
    console.error(`Erro ao salvar configurações de ${section}:`, error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validação falhou: " + error.errors.map((e) => e.message).join(", "),
      }
    }

    return { success: false, error: "Ocorreu um erro ao salvar as configurações" }
  }
}

// Função para atualizar variáveis de ambiente em tempo de execução
function updateEnvironmentVariables(section: string, data: any) {
  if (section === "database") {
    process.env.MYSQL_HOST = data.host
    process.env.MYSQL_USER = data.user
    process.env.MYSQL_PASSWORD = data.password
    process.env.MYSQL_DATABASE = data.database
  } else if (section === "email") {
    process.env.EMAIL_SERVER = data.server
    process.env.EMAIL_PORT = data.port.toString()
    process.env.EMAIL_SECURE = data.secure.toString()
    process.env.EMAIL_USER = data.user
    process.env.EMAIL_PASSWORD = data.password
    process.env.EMAIL_FROM = data.from
  }
}

// Função para gerenciar notícias
export async function getNews() {
  await requireAdmin()

  try {
    const news = (await query("SELECT * FROM news ORDER BY created_at DESC")) as any[]

    return news
  } catch (error) {
    console.error("Erro ao obter notícias:", error)
    throw error
  }
}

export async function createNews(data: any) {
  await requireAdmin()

  try {
    const result = (await query("INSERT INTO news (title, content, image_url, author) VALUES (?, ?, ?, ?)", [
      data.title,
      data.content,
      data.imageUrl,
      data.author,
    ])) as any

    revalidatePath("/")
    revalidatePath("/admin/content/news")

    return { success: true, id: result.insertId }
  } catch (error) {
    console.error("Erro ao criar notícia:", error)
    return { success: false, error: "Ocorreu um erro ao criar a notícia" }
  }
}

export async function updateNews(id: number, data: any) {
  await requireAdmin()

  try {
    await query("UPDATE news SET title = ?, content = ?, image_url = ? WHERE id = ?", [
      data.title,
      data.content,
      data.imageUrl,
      id,
    ])

    revalidatePath("/")
    revalidatePath("/admin/content/news")

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar notícia:", error)
    return { success: false, error: "Ocorreu um erro ao atualizar a notícia" }
  }
}

export async function deleteNews(id: number) {
  await requireAdmin()

  try {
    await query("DELETE FROM news WHERE id = ?", [id])

    revalidatePath("/")
    revalidatePath("/admin/content/news")

    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir notícia:", error)
    return { success: false, error: "Ocorreu um erro ao excluir a notícia" }
  }
}

// Função para gerenciar usuários
export async function getUsers(page = 1, limit = 20, search = "") {
  await requireAdmin()

  try {
    let queryStr = "SELECT id, username, email, role, credits, created_at, last_login FROM users"
    let countQueryStr = "SELECT COUNT(*) as count FROM users"
    let params: any[] = []

    if (search) {
      queryStr += " WHERE username LIKE ? OR email LIKE ?"
      countQueryStr += " WHERE username LIKE ? OR email LIKE ?"
      params = [`%${search}%`, `%${search}%`]
    }

    queryStr += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    params.push(limit, (page - 1) * limit)

    const users = (await query(queryStr, params)) as any[]
    const countResult = (await query(countQueryStr, search ? [`%${search}%`, `%${search}%`] : [])) as any[]

    return {
      users,
      total: countResult[0].count,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].count / limit),
    }
  } catch (error) {
    console.error("Erro ao obter usuários:", error)
    throw error
  }
}

export async function updateUser(id: number, data: any) {
  await requireAdmin()

  try {
    // Verificar se o email já existe (exceto para o usuário atual)
    if (data.email) {
      const existingUsers = (await query("SELECT id FROM users WHERE email = ? AND id != ?", [data.email, id])) as any[]

      if (existingUsers.length > 0) {
        return { success: false, error: "Email já está em uso por outro usuário" }
      }
    }

    const updateFields = []
    const params = []

    if (data.email) {
      updateFields.push("email = ?")
      params.push(data.email)
    }

    if (data.role) {
      updateFields.push("role = ?")
      params.push(data.role)
    }

    if (data.credits !== undefined) {
      updateFields.push("credits = ?")
      params.push(data.credits)
    }

    if (updateFields.length === 0) {
      return { success: false, error: "Nenhum campo para atualizar" }
    }

    params.push(id)

    await query(`UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`, params)

    revalidatePath("/admin/users/manage")

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    return { success: false, error: "Ocorreu um erro ao atualizar o usuário" }
  }
}

// Função para gerenciar ranking
export async function generateRanking() {
  await requireAdmin()
  await ensureDataDirectory()

  try {
    const config = await loadConfig()
    const rankingConfig = config.ranking

    if (!rankingConfig.enabled) {
      return { success: false, error: "Ranking está desativado nas configurações" }
    }

    const rankingData: Record<string, any[]> = {}

    // Executar consultas para cada categoria de ranking
    for (const category of rankingConfig.categories) {
      const results = (await query(category.query + ` LIMIT ${category.limit}`)) as any[]
      rankingData[category.id] = results
    }

    // Salvar dados do ranking em arquivo
    const rankingFilePath = path.join(process.cwd(), "data", "ranking.json")
    await fs.writeFile(
      rankingFilePath,
      JSON.stringify(
        {
          data: rankingData,
          lastUpdated: new Date().toISOString(),
        },
        null,
        2,
      ),
      "utf-8",
    )

    revalidatePath("/ranking")

    return { success: true }
  } catch (error) {
    console.error("Erro ao gerar ranking:", error)
    return { success: false, error: "Ocorreu um erro ao gerar o ranking" }
  }
}

// Função para obter dados do ranking
export async function getRanking() {
  try {
    const rankingFilePath = path.join(process.cwd(), "data", "ranking.json")

    try {
      const rankingData = await fs.readFile(rankingFilePath, "utf-8")
      return JSON.parse(rankingData)
    } catch (error) {
      // Se o arquivo não existir, gerar o ranking
      if (await getAuthUser()) {
        return await generateRanking()
      } else {
        return {
          data: {},
          lastUpdated: null,
          error: "Dados de ranking não disponíveis",
        }
      }
    }
  } catch (error) {
    console.error("Erro ao obter ranking:", error)
    throw error
  }
}

