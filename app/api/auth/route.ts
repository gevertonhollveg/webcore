import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { compare } from "bcrypt"
import { sql } from "@vercel/postgres"
import { SignJWT } from "jose"
import { cookies } from "next/headers"
import { nanoid } from "nanoid"

// Schema for login validation
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

// POST handler for login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    const { username, password } = result.data

    // Sanitize inputs to prevent SQL injection
    const sanitizedUsername = username.replace(/[^\w]/g, "")

    // Use parameterized query to prevent SQL injection
    const dbResult = await sql`
      SELECT id, username, password FROM users 
      WHERE username = ${sanitizedUsername}
    `

    if (dbResult.rows.length === 0) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    const user = dbResult.rows[0]

    // Compare password with hashed password in database
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // Create a JWT token
    const token = await createToken(user.id)

    // Set the token in a cookie
    cookies().set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}

// Helper function to create JWT token
async function createToken(userId: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_do_not_use_in_production")

  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)

  return token
}

// DELETE handler for logout
export async function DELETE() {
  cookies().delete("auth-token")
  return NextResponse.json({ success: true })
}

