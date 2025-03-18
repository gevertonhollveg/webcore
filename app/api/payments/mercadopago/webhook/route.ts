import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { sendEmail, emailTemplates } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verificar tipo de notificação
    if (body.type !== "payment") {
      return NextResponse.json({ success: true })
    }

    // Obter ID do pagamento
    const paymentId = body.data.id

    // Verificar se o token de acesso está presente
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      console.error("Token de acesso do MercadoPago não configurado")
      return NextResponse.json({ error: "Configuração incompleta" }, { status: 500 })
    }

    // Buscar detalhes do pagamento na API do MercadoPago
    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    })

    if (!paymentResponse.ok) {
      console.error("Erro ao buscar detalhes do pagamento no MercadoPago")
      return NextResponse.json({ error: "Erro ao verificar pagamento" }, { status: 500 })
    }

    const paymentData = await paymentResponse.json()

    // Verificar status do pagamento
    if (paymentData.status === "approved") {
      // Extrair informações do pagamento
      const externalReference = paymentData.external_reference // ID da transação no nosso sistema
      const amount = paymentData.transaction_amount

      // Buscar transação no banco de dados
      const transactions = (await query("SELECT * FROM transactions WHERE id = ?", [externalReference])) as any[]

      if (transactions.length === 0) {
        console.error("Transação não encontrada:", externalReference)
        return NextResponse.json({ error: "Transação não encontrada" }, { status: 404 })
      }

      const transaction = transactions[0]

      // Atualizar status da transação
      await query(
        `UPDATE transactions 
         SET status = 'completed', payment_id = ?, updated_at = NOW() 
         WHERE id = ?`,
        [paymentId.toString(), externalReference],
      )

      // Adicionar créditos ao usuário
      await query(
        `UPDATE users 
         SET credits = credits + ? 
         WHERE id = ?`,
        [transaction.credits, transaction.user_id],
      )

      // Buscar informações do usuário para enviar email
      const users = (await query("SELECT username, email FROM users WHERE id = ?", [transaction.user_id])) as any[]

      if (users.length > 0) {
        const user = users[0]

        // Enviar email de confirmação
        const emailTemplate = emailTemplates.paymentConfirmation(
          user.username,
          Number.parseFloat(transaction.amount),
          transaction.credits,
        )

        await sendEmail({
          to: user.email,
          subject: emailTemplate.subject,
          text: emailTemplate.text,
          html: emailTemplate.html,
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao processar webhook do MercadoPago:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

