import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth-actions"
import AdminLayout from "@/components/admin/admin-layout"
import NewsManager from "@/components/admin/news-manager"
import { getNews } from "@/lib/admin-actions"

export default async function NewsManagementPage() {
  // Verificar se o usuário é administrador
  const user = await getAuthUser()

  if (!user || user.role !== "admin") {
    redirect("/")
  }

  // Carregar notícias
  const news = await getNews()

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Gerenciar Notícias</h1>
        <NewsManager initialNews={news} />
      </div>
    </AdminLayout>
  )
}

