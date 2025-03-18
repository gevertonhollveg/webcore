"use client"

import { useState } from "react"
import Image from "next/image"
import { createPayment } from "@/lib/payment-actions"

interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  popular?: boolean
}

interface PaymentOptionsProps {
  userId: number
  creditPackages: CreditPackage[]
}

export default function PaymentOptions({ userId, creditPackages }: PaymentOptionsProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>(creditPackages[0].id)
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Encontrar o pacote selecionado
  const selectedPackageDetails = creditPackages.find((pkg) => pkg.id === selectedPackage)

  // Processar pagamento
  const handlePayment = async () => {
    if (!selectedPackageDetails) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await createPayment({
        userId,
        packageId: selectedPackage,
        credits: selectedPackageDetails.credits,
        amount: selectedPackageDetails.price,
        paymentMethod,
      })

      if (result.success) {
        // Redirecionar para a página de pagamento
        window.location.href = result.redirectUrl
      } else {
        setError(result.error || "Ocorreu um erro ao processar o pagamento. Tente novamente.")
      }
    } catch (err) {
      setError("Ocorreu um erro ao processar o pagamento. Tente novamente.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-800 text-red-200 text-sm rounded-sm">{error}</div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Pacote Selecionado</label>
        <select
          value={selectedPackage}
          onChange={(e) => setSelectedPackage(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          {creditPackages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name} - {pkg.credits} créditos - R$ {pkg.price.toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Método de Pagamento</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`border p-4 rounded-sm flex items-center cursor-pointer ${
              paymentMethod === "credit_card" ? "border-amber-500 bg-gray-800" : "border-gray-700 hover:border-gray-600"
            }`}
            onClick={() => setPaymentMethod("credit_card")}
          >
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "credit_card"}
              onChange={() => setPaymentMethod("credit_card")}
              className="mr-3"
            />
            <div className="flex items-center">
              <Image src="/credit-card.png" alt="Cartão de Crédito" width={32} height={32} className="mr-2" />
              <span>Cartão de Crédito</span>
            </div>
          </div>

          <div
            className={`border p-4 rounded-sm flex items-center cursor-pointer ${
              paymentMethod === "paypal" ? "border-amber-500 bg-gray-800" : "border-gray-700 hover:border-gray-600"
            }`}
            onClick={() => setPaymentMethod("paypal")}
          >
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
              className="mr-3"
            />
            <div className="flex items-center">
              <Image src="/paypal.png" alt="PayPal" width={32} height={32} className="mr-2" />
              <span>PayPal</span>
            </div>
          </div>

          <div
            className={`border p-4 rounded-sm flex items-center cursor-pointer ${
              paymentMethod === "mercadopago" ? "border-amber-500 bg-gray-800" : "border-gray-700 hover:border-gray-600"
            }`}
            onClick={() => setPaymentMethod("mercadopago")}
          >
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "mercadopago"}
              onChange={() => setPaymentMethod("mercadopago")}
              className="mr-3"
            />
            <div className="flex items-center">
              <Image src="/mercadopago.png" alt="MercadoPago" width={32} height={32} className="mr-2" />
              <span>MercadoPago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-sm mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-400">Pacote:</span>
          <span>{selectedPackageDetails?.name}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-400">Créditos:</span>
          <span>{selectedPackageDetails?.credits}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>R$ {selectedPackageDetails?.price.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-gradient-to-b from-amber-700 to-amber-900 py-3 px-6 text-center font-semibold hover:from-amber-600 hover:to-amber-800 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Processando..." : "Finalizar Compra"}
      </button>
    </div>
  )
}

