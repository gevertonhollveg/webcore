import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { startRankingCron } from "@/lib/cron"

// Iniciar cron job para atualização do ranking
// Isso será executado apenas no servidor
if (process.env.NODE_ENV === "production") {
  startRankingCron().catch(console.error)
}

export const metadata: Metadata = {
  title: "Lorencia - Season 17",
  description: "Fantasy MMORPG Game",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-black">{children}</body>
    </html>
  )
}



import './globals.css'