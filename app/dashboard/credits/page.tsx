"use client"

import { requireAuth } from "@/lib/auth-actions"
import DashboardLayout from "@/components/dashboard-layout"
import PaymentOptions from "@/components/payment-options"

export default async function CreditsPage() {
  // Verificar autenticação e obter dados do usuário
  const user = await requireAuth()

  // Pacotes de créditos disponíveis
  const creditPackages = [
    { id: "small", name: "Pacote Básico", credits: 100, price: 10.0 },
    { id: "medium", name: "Pacote Intermediário", credits: 300, price: 25.0, popular: true },
    { id: "large", name: "Pacote Premium", credits: 700, price: 50.0 },
    { id: "xlarge", name: "Pacote Ultimate", credits: 1500, price: 100.0 },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Comprar Créditos</h1>

        <div className="bg-gray-900 p-6 rounded-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Seus Créditos Atuais</h2>
          <div className="flex items-center">
            <div className="text-4xl font-bold text-amber-500">{user.credits}</div>
            <div className="ml-3 text-gray-400">créditos disponíveis</div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Escolha um Pacote</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {creditPackages.map((pkg) => (
            <div key={pkg.id} className="bg-gray-900 p-6 rounded-sm text-center relative">
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-amber-500 text-black px-2 py-1 text-xs font-bold">
                  POPULAR
                </div>
              )}
              <div className="text-xl font-bold mb-2">{pkg.name}</div>
              <div className="text-amber-300 text-3xl font-bold my-3">
                {pkg.credits} <span className="text-sm text-gray-400">créditos</span>
              </div>
              <div className="text-2xl font-bold mb-4">R$ {pkg.price.toFixed(2)}</div>
              <button
                onClick={() => document.getElementById("payment-section")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full bg-gradient-to-b from-amber-700 to-amber-900 py-2 px-4 text-center font-semibold hover:from-amber-600 hover:to-amber-800 transition-colors"
                data-package={pkg.id}
              >
                Selecionar
              </button>
            </div>
          ))}
        </div>

        <div id="payment-section" className="bg-gray-900 p-6 rounded-sm">
          <h2 className="text-2xl font-semibold mb-6">Método de Pagamento</h2>
          <PaymentOptions userId={user.id} creditPackages={creditPackages} />
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-sm">
          <h3 className="text-lg font-semibold mb-3">Informações Importantes</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
            <li>Os créditos são adicionados à sua conta imediatamente após a confirmação do pagamento.</li>
            <li>Os créditos não expiram e podem ser usados a qualquer momento.</li>
            <li>Em caso de problemas com o pagamento, entre em contato com o suporte.</li>
            <li>Não realizamos reembolsos para créditos já adicionados à conta.</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}

