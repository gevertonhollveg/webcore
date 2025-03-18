"use server"

import { query } from "./db"
import { getAuthUser } from "./auth-actions"

interface PaymentRequest {
  userId: number
  packageId: string
  credits: number
  amount: number
  paymentMethod: string
}

export async function createPayment(request: PaymentRequest) {
  try {
    // Verificar autenticação
    const user = await getAuthUser()

    if (!user) {
      return { success: false, error: "Usuário não autenticado" }
    }

    // Verificar se o ID do usuário corresponde ao usuário autenticado
    if (user.id !== request.userId) {
      return { success: false, error: "Acesso não autorizado" }
    }

    // Inserir transação no banco de dados
    const result = (await query(
      `INSERT INTO transactions 
       (user_id, amount, credits, payment_method, payment_id, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        request.userId,
        request.amount,
        request.credits,
        request.paymentMethod,
        "pending", // Será atualizado após o pagamento
        "pending",
      ],
    )) as any

    const transactionId = result.insertId

    // Gerar URL de redirecionamento com base no método de pagamento
    let redirectUrl = ""

    switch (request.paymentMethod) {
      case "paypal":
        redirectUrl = await createPayPalPayment(transactionId, request)
        break
      case "mercadopago":
        redirectUrl = await createMercadoPagoPayment(transactionId, request)
        break
      case "credit_card":
        redirectUrl = `/dashboard/credits/checkout/${transactionId}`
        break
      default:
        return { success: false, error: "Método de pagamento não suportado" }
    }

    return {
      success: true,
      transactionId,
      redirectUrl,
    }
  } catch (error) {
    console.error("Erro ao criar pagamento:", error)
    return { success: false, error: "Ocorreu um erro ao processar o pagamento" }
  }
}

// Função para criar pagamento no PayPal
async function createPayPalPayment(transactionId: number, request: PaymentRequest) {
  try {
    // Verificar se o token de acesso está configurado
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      throw new Error("Configuração do PayPal incompleta")
    }

    // Obter token de acesso do PayPal
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64")
    const tokenResponse = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error("Falha ao obter token do PayPal")
    }

    // Criar ordem de pagamento no PayPal
    const orderResponse = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: transactionId.toString(),
            custom_id: request.userId.toString(),
            description: `${request.credits} créditos para Lorencia MMORPG`,
            amount: {
              currency_code: "BRL",
              value: request.amount.toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: "Lorencia MMORPG",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits/cancel`,
        },
      }),
    })

    const orderData = await orderResponse.json()

    if (!orderResponse.ok) {
      throw new Error("Falha ao criar ordem no PayPal")
    }

    // Atualizar ID de pagamento na transação
    await query("UPDATE transactions SET payment_id = ? WHERE id = ?", [orderData.id, transactionId])

    // Encontrar o link de aprovação
    const approveLink = orderData.links.find((link: any) => link.rel === "approve")

    if (!approveLink) {
      throw new Error("Link de aprovação não encontrado")
    }

    return approveLink.href
  } catch (error) {
    console.error("Erro ao criar pagamento no PayPal:", error)
    throw error
  }
}

// Função para criar pagamento no MercadoPago
async function createMercadoPagoPayment(transactionId: number, request: PaymentRequest) {
  try {
    // Verificar se o token de acesso está configurado
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error("Configuração do MercadoPago incompleta")
    }

    // Criar preferência de pagamento no MercadoPago
    const preferenceResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            title: `${request.credits} créditos para Lorencia MMORPG`,
            quantity: 1,
            unit_price: request.amount,
            currency_id: "BRL",
          },
        ],
        external_reference: transactionId.toString(),
        payer: {
          email: request.userId.toString(), // Idealmente, usar o email real do usuário
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits/cancel`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits/pending`,
        },
        auto_return: "approved",
        statement_descriptor: "LORENCIA MMORPG",
      }),
    })

    const preferenceData = await preferenceResponse.json()

    if (!preferenceResponse.ok) {
      throw new Error("Falha ao criar preferência no MercadoPago")
    }

    // Atualizar ID de pagamento na transação
    await query("UPDATE transactions SET payment_id = ? WHERE id = ?", [preferenceData.id, transactionId])

    return preferenceData.init_point
  } catch (error) {
    console.error("Erro ao criar pagamento no MercadoPago:", error)
    throw error
  }
}

