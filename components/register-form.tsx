"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { registerUser } from "@/lib/auth-actions"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Username validation
    if (formData.username.length < 4) {
      newErrors.username = "Username must be at least 4 characters"
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores"
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must include uppercase, lowercase, and numbers"
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Security question
    if (!formData.securityQuestion) {
      newErrors.securityQuestion = "Please select a security question"
    }

    // Security answer
    if (!formData.securityAnswer) {
      newErrors.securityAnswer = "Please provide an answer to the security question"
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await registerUser(formData)

      if (result.success) {
        setSuccessMessage("Account created successfully! You can now log in.")
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          securityQuestion: "",
          securityAnswer: "",
          agreeToTerms: false,
        })
      } else {
        setErrors({ form: result.error || "Registration failed. Please try again." })
      }
    } catch (err) {
      setErrors({ form: "An unexpected error occurred. Please try again." })
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {successMessage ? (
        <div className="text-center p-6">
          <div className="mb-4 p-3 bg-green-900/50 border border-green-800 text-green-200 text-sm rounded-sm">
            {successMessage}
          </div>
          <p className="text-gray-300">
            You can now{" "}
            <button onClick={() => (window.location.href = "/")} className="text-amber-500 hover:underline">
              return to the homepage
            </button>{" "}
            or{" "}
            <button
              className="text-amber-500 hover:underline"
              onClick={() => {
                const loginButton = document.querySelector("[data-login-button]")
                if (loginButton) {
                  ;(loginButton as HTMLButtonElement).click()
                }
              }}
            >
              log in to your account
            </button>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.form && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-800 text-red-200 text-sm rounded-sm">
              {errors.form}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label htmlFor="securityQuestion" className="block text-sm font-medium text-gray-300 mb-1">
                Security Question
              </label>
              <select
                id="securityQuestion"
                name="securityQuestion"
                value={formData.securityQuestion}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="">Select a security question</option>
                <option value="pet">What was your first pet's name?</option>
                <option value="school">What was the name of your first school?</option>
                <option value="city">In which city were you born?</option>
                <option value="mother">What is your mother's maiden name?</option>
              </select>
              {errors.securityQuestion && <p className="mt-1 text-sm text-red-400">{errors.securityQuestion}</p>}
            </div>

            <div>
              <label htmlFor="securityAnswer" className="block text-sm font-medium text-gray-300 mb-1">
                Security Answer
              </label>
              <input
                id="securityAnswer"
                name="securityAnswer"
                type="text"
                value={formData.securityAnswer}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {errors.securityAnswer && <p className="mt-1 text-sm text-red-400">{errors.securityAnswer}</p>}
            </div>
          </div>

          <div className="flex items-start">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-700 rounded"
            />
            <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-300">
              I agree to the{" "}
              <Link href="/terms" className="text-amber-500 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-amber-500 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.agreeToTerms && <p className="mt-1 text-sm text-red-400">{errors.agreeToTerms}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-b from-amber-700 to-amber-900 py-3 px-6 text-center font-semibold hover:from-amber-600 hover:to-amber-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              className="text-amber-500 hover:underline"
              onClick={() => {
                const loginButton = document.querySelector("[data-login-button]")
                if (loginButton) {
                  ;(loginButton as HTMLButtonElement).click()
                }
              }}
            >
              Login
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

