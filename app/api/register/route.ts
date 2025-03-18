import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { hash } from "bcrypt"
import { sql } from "@vercel/postgres"

// Schema for registration validation
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
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    const { username, email, password, securityQuestion, securityAnswer } = result.data

    // Check if username already exists
    const existingUser = await sql`
      SELECT username FROM users WHERE username = ${username}
    `

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 })
    }

    // Check if email already exists
    const existingEmail = await sql`
      SELECT email FROM users WHERE email = ${email}
    `

    if (existingEmail.rows.length > 0) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Insert user into database
    await sql`
      INSERT INTO users (
        username, 
        email, 
        password, 
        security_question, 
        security_answer
      ) VALUES (
        ${username}, 
        ${email}, 
        ${hashedPassword}, 
        ${securityQuestion}, 
        ${securityAnswer}
      )
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}

