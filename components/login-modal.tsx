"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { login } from "@/lib/auth-actions"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(username, password)

      if (result.success) {
        onClose()
        // Redirect or update UI as needed
        window.location.reload()
      } else {
        setError(result.error || "Login failed. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md bg-gray-900 p-6 rounded-sm border border-gray-800">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <Image
            src="/logo-large.png"
            alt="Lorencia Logo"
            width={150}
            height={50}
            className="mx-auto brightness-0 invert"
          />
          <h2 className="text-xl font-semibold mt-4">LOGIN</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-800 text-red-200 text-sm rounded-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-b from-amber-700 to-amber-900 py-2 px-4 text-center font-semibold hover:from-amber-600 hover:to-amber-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-amber-500 hover:underline">
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

