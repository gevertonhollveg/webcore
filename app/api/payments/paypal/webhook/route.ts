import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { sendEmail, emailTemplates } from "@/lib/email"
import crypto from "crypto"

// Função para verificar a assinatura do webhook do PayPal
function verifyPayPalSignature(
  body: string,
  transmissionId: string,
  timestamp: string,
  webhookId: string,
  actualSignature: string,
) {
  try {
    const data = `${transmissionId}|${timestamp}|${webhookId}|${crypto.createHash("sha256").update(body).digest("hex")}`
    const signature = crypto
      .createHmac("sha256", process.env.PAYPAL_WEBHOOK_SECRET || "")
      .update(data)
      .digest("base64")

    return signature === actualSignature
  } catch (error) {
    console.error("Erro ao verificar assinatura do PayPal:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Obter o corpo da requisição como texto para verificação de assinatura
    const bodyText = await request.text()
    const body = JSON.parse(bodyText)

    // Obter cabeçalhos para verificação de assinatura
    const transmissionId = request.headers.get("paypal-transmission-id")
    const timestamp = request.headers.get("paypal-transmission-time")
    const webhookId = process.env.PAYPAL_WEBHOOK_ID
    const signature = request.headers.get("paypal-transmission-sig")

    // Verificar se todos os cabeçalhos necessários estão presentes
    if (!transmissionId || !timestamp || !webhookId || !signature) {
      console.error("Cabeçalhos de assinatura do PayPal ausentes")
      return NextResponse.json({ error: "Cabeçalhos de assinatura ausentes" }, { status: 400 })
    }

    // Verificar a assinatura
    const isSignatureValid = verifyPayPalSignature(bodyText, transmissionId, timestamp, webhookId, signature)

    if (!isSignatureValid) {
      console.error("Assinatura do PayPal inválida")
      return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 })
    }

    // Processar o evento
    const eventType = body.event_type

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const paymentId = body.resource.id
      const customId = body.resource.custom_id // ID do usuário
      const amount = Number.parseFloat(body.resource.amount.value)

      // Calcular créditos (exemplo: 1 USD = 100 créditos)
      const credits = Math.floor(amount * 100)

      // Atualizar a transação no banco de dados
      await query(
        `UPDATE transactions 
         SET status = 'completed', updated_at = NOW() 
         WHERE payment_id = ? AND payment_method = 'paypal'`,
        [paymentId],
      )

      // Adicionar créditos ao usuário
      await query(
        `UPDATE users 
         SET credits = credits + ? 
         WHERE id = ?`,
        [credits, customId],
      )

      // Buscar informações do usuário para enviar email
      const users = (await query("SELECT username, email FROM users WHERE id = ?", [customId])) as any[]

      if (users.length > 0) {
        const user = users[0]

        // Enviar email de confirmação
        const emailTemplate = emailTemplates.paymentConfirmation(user.username, amount, credits)
        await sendEmail({
          to: user.email,
          subject: emailTemplate.subject,
          text: emailTemplate.text,
          html: emailTemplate.html,
        })
      }

      return NextResponse.json({ success: true })
    }

    // Para outros tipos de eventos, apenas confirmar recebimento
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao processar webhook do PayPal:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

