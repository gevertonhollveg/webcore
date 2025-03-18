import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth-actions"
import AdminLayout from "@/components/admin/admin-layout"
import DatabaseConfigForm from "@/components/admin/forms/database-config-form"
import { loadConfig } from "@/lib/admin-actions"

export default async function DatabaseConfigPage() {
  // Verificar se o usuário é administrador
  const user = await getAuthUser()

  if (!user || user.role !== "admin") {
    redirect("/")
  }

  // Carregar configurações atuais
  const config = await loadConfig()

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Configurações de Banco de Dados</h1>
        <DatabaseConfigForm initialData={config.database} />
      </div>
    </AdminLayout>
  )
}

