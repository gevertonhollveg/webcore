import { NextResponse } from "next/server"
import { generateRanking } from "@/lib/admin-actions"

// Esta rota pode ser chamada por um serviço de cron externo (como o Vercel Cron)
// para atualizar o ranking periodicamente
export async function GET() {
  try {
    const result = await generateRanking()

    if (result.success) {
      return NextResponse.json({ success: true, message: "Ranking atualizado com sucesso" })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Erro ao atualizar ranking via API:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}

