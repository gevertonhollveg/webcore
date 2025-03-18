"use server"

import { z } from "zod"
import { hash, compare } from "bcrypt"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { nanoid } from "nanoid"
import { query } from "./db"
import { redirect } from "next/navigation"
import { sendEmail } from "./email"

// Zod schema para validação de registro
const registerSchema = z.object({
  username: z
    .string()
    .min(4)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must include uppercase, lowercase, and numbers"),
  securityQuestion: z.string().min(1),
  securityAnswer: z.string().min(1),
  agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
})

// Função de login
export async function login(username: string, password: string) {
  try {
    // Sanitizar inputs para prevenir SQL injection
    const sanitizedUsername = username.replace(/[^\w]/g, "")

    // Usar query parametrizada para prevenir SQL injection
    const users = (await query("SELECT id, username, password FROM users WHERE username = ?", [
      sanitizedUsername,
    ])) as any[]

    if (users.length === 0) {
      return { success: false, error: "Nome de usuário ou senha inválidos" }
    }

    const user = users[0]

    // Comparar senha com hash no banco de dados
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return { success: false, error: "Nome de usuário ou senha inválidos" }
    }

    // Atualizar último login
    await query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id])

    // Criar token JWT
    const token = await createToken(user.id)

    // Criar ID de sessão
    const sessionId = nanoid()

    // Salvar sessão no banco de dados
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 dias

    await query("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)", [sessionId, user.id, expiresAt])

    // Definir o token em um cookie
    cookies().set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    })

    // Definir o ID da sessão em um cookie
    cookies().set({
      name: "session-id",
      value: sessionId,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    })

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
      },
    }
  } catch (error) {
    console.error("Erro de login:", error)
    return { success: false, error: "Ocorreu um erro durante o login" }
  }
}

// Função de registro
export async function registerUser(formData: any) {
  try {
    // Validar dados do formulário
    const validatedData = registerSchema.parse(formData)

    // Verificar se o nome de usuário já existe
    const existingUsers = (await query("SELECT username FROM users WHERE username = ?", [
      validatedData.username,
    ])) as any[]

    if (existingUsers.length > 0) {
      return { success: false, error: "Nome de usuário já existe" }
    }

    // Verificar se o email já existe
    const existingEmails = (await query("SELECT email FROM users WHERE email = ?", [validatedData.email])) as any[]

    if (existingEmails.length > 0) {
      return { success: false, error: "Email já está em uso" }
    }

    // Hash da senha
    const hashedPassword = await hash(validatedData.password, 10)

    // Inserir usuário no banco de dados
    await query(
      `INSERT INTO users (
        username, 
        email, 
        password, 
        security_question, 
        security_answer
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        validatedData.username,
        validatedData.email,
        hashedPassword,
        validatedData.securityQuestion,
        validatedData.securityAnswer,
      ],
    )

    // Enviar email de boas-vindas
    await sendEmail({
      to: validatedData.email,
      subject: "Bem-vindo ao Lorencia MMORPG",
      text: `Olá ${validatedData.username},\n\nBem-vindo ao Lorencia MMORPG! Sua conta foi criada com sucesso.\n\nDivirta-se jogando!`,
      html: `
        <h1>Bem-vindo ao Lorencia MMORPG!</h1>
        <p>Olá <strong>${validatedData.username}</strong>,</p>
        <p>Sua conta foi criada com sucesso. Agora você pode fazer login e começar sua aventura!</p>
        <p>Divirta-se jogando!</p>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error("Erro de registro:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validação falhou: " + error.errors.map((e) => e.message).join(", "),
      }
    }

    return { success: false, error: "Ocorreu um erro durante o registro" }
  }
}

// Função auxiliar para criar token JWT
async function createToken(userId: string | number) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_do_not_use_in_production")

  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)

  return token
}

// Função de logout
export async function logout() {
  const sessionId = cookies().get("session-id")?.value

  if (sessionId) {
    // Remover sessão do banco de dados
    await query("DELETE FROM sessions WHERE id = ?", [sessionId])
  }

  // Remover cookies
  cookies().delete("auth-token")
  cookies().delete("session-id")

  return { success: true }
}

// Função para verificar autenticação
export async function getAuthUser() {
  const token = cookies().get("auth-token")?.value

  if (!token) {
    return null
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_do_not_use_in_production")

    const { payload } = await jwtVerify(token, secret)

    if (!payload.userId) {
      return null
    }

    // Verificar se a sessão existe e é válida
    const sessionId = cookies().get("session-id")?.value

    if (!sessionId) {
      return null
    }

    const sessions = (await query("SELECT * FROM sessions WHERE id = ? AND user_id = ? AND expires_at > NOW()", [
      sessionId,
      payload.userId,
    ])) as any[]

    if (sessions.length === 0) {
      return null
    }

    // Buscar dados do usuário
    const users = (await query("SELECT id, username, email, role, credits FROM users WHERE id = ?", [
      payload.userId,
    ])) as any[]

    if (users.length === 0) {
      return null
    }

    return users[0]
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error)
    return null
  }
}

// Função para verificar autenticação e redirecionar se não estiver autenticado
export async function requireAuth() {
  const user = await getAuthUser()

  if (!user) {
    redirect("/")
  }

  return user
}

