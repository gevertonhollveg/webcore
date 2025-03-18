"use client"

import { useState } from "react"
import { User } from "lucide-react"
import LoginModal from "./login-modal"

export default function LoginButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        className="rounded-full bg-gray-800 p-1 hover:bg-gray-700 transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        <User className="h-6 w-6 text-gray-300" />
      </button>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

