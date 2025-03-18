import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth-actions"
import AdminLayout from "@/components/admin/admin-layout"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  // Verificar se o usuário é administrador
  const user = await getAuthUser()

  if (!user || user.role !== "admin") {
    redirect("/")
  }

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  )
}

