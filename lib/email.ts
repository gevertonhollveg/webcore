import nodemailer from "nodemailer"

interface EmailOptions {
  to: string
  subject: string
  text: string
  html: string
}

// Configuração do transporte de email
const createTransporter = () => {
  // Usar SMTP se as variáveis de ambiente estiverem definidas
  if (process.env.EMAIL_SERVER && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: Number.parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  // Fallback para serviço de teste (ethereal.email)
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "ethereal.user@ethereal.email",
      pass: "ethereal_pass",
    },
  })
}

// Função para enviar email
export async function sendEmail(options: EmailOptions) {
  try {
    const transporter = createTransporter()

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@lorencia.com",
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    })

    console.log("Email enviado:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Erro ao enviar email:", error)
    throw error
  }
}

// Templates de email
export const emailTemplates = {
  welcome: (username: string) => ({
    subject: "Bem-vindo ao Lorencia MMORPG",
    text: `Olá ${username},\n\nBem-vindo ao Lorencia MMORPG! Sua conta foi criada com sucesso.\n\nDivirta-se jogando!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://lorencia.com/logo.png" alt="Lorencia Logo" style="max-width: 150px;">
        </div>
        <h1 style="color: #FFA000; text-align: center;">Bem-vindo ao Lorencia MMORPG!</h1>
        <p>Olá <strong>${username}</strong>,</p>
        <p>Sua conta foi criada com sucesso. Agora você pode fazer login e começar sua aventura!</p>
        <div style="background-color: #FFA000; color: white; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
          <a href="https://lorencia.com/login" style="color: white; text-decoration: none; font-weight: bold;">INICIAR JOGO</a>
        </div>
        <p>Divirta-se jogando!</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">
          © 2023 Lorencia MMORPG. Todos os direitos reservados.
        </p>
      </div>
    `,
  }),

  passwordReset: (username: string, resetToken: string) => ({
    subject: "Redefinição de Senha - Lorencia MMORPG",
    text: `Olá ${username},\n\nVocê solicitou a redefinição de sua senha. Use o seguinte link para redefinir sua senha: https://lorencia.com/reset-password?token=${resetToken}\n\nSe você não solicitou esta redefinição, ignore este email.\n\nAtenciosamente,\nEquipe Lorencia MMORPG`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://lorencia.com/logo.png" alt="Lorencia Logo" style="max-width: 150px;">
        </div>
        <h1 style="color: #FFA000; text-align: center;">Redefinição de Senha</h1>
        <p>Olá <strong>${username}</strong>,</p>
        <p>Você solicitou a redefinição de sua senha. Clique no botão abaixo para redefinir sua senha:</p>
        <div style="background-color: #FFA000; color: white; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
          <a href="https://lorencia.com/reset-password?token=${resetToken}" style="color: white; text-decoration: none; font-weight: bold;">REDEFINIR SENHA</a>
        </div>
        <p>Se você não solicitou esta redefinição, ignore este email.</p>
        <p>Atenciosamente,<br>Equipe Lorencia MMORPG</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">
          © 2023 Lorencia MMORPG. Todos os direitos reservados.
        </p>
      </div>
    `,
  }),

  paymentConfirmation: (username: string, amount: number, credits: number) => ({
    subject: "Confirmação de Pagamento - Lorencia MMORPG",
    text: `Olá ${username},\n\nSeu pagamento de R$ ${amount.toFixed(2)} foi confirmado. ${credits} créditos foram adicionados à sua conta.\n\nObrigado por apoiar o Lorencia MMORPG!\n\nAtenciosamente,\nEquipe Lorencia MMORPG`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://lorencia.com/logo.png" alt="Lorencia Logo" style="max-width: 150px;">
        </div>
        <h1 style="color: #FFA000; text-align: center;">Confirmação de Pagamento</h1>
        <p>Olá <strong>${username}</strong>,</p>
        <p>Seu pagamento foi confirmado com sucesso!</p>
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Valor:</strong> R$ ${amount.toFixed(2)}</p>
          <p><strong>Créditos adicionados:</strong> ${credits}</p>
        </div>
        <p>Obrigado por apoiar o Lorencia MMORPG!</p>
        <p>Atenciosamente,<br>Equipe Lorencia MMORPG</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">
          © 2023 Lorencia MMORPG. Todos os direitos reservados.
        </p>
      </div>
    `,
  }),
}

