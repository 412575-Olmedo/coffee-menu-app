"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getMenuItems } from "@/lib/firebase-service"
import { CATEGORIES } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coffee, LogOut, Plus, Settings, BarChart3, Eye, TrendingUp } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalProducts: number
  activeProducts: number
  categoriesWithProducts: number
  productsByCategory: Record<string, number>
}

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    categoriesWithProducts: 0,
    productsByCategory: {},
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const menuItems = await getMenuItems()
        const activeItems = menuItems.filter((item) => item.isAvailable)

        const productsByCategory = CATEGORIES.reduce(
          (acc, category) => {
            acc[category] = menuItems.filter((item) => item.category === category).length
            return acc
          },
          {} as Record<string, number>,
        )

        const categoriesWithProducts = Object.values(productsByCategory).filter((count) => count > 0).length

        setStats({
          totalProducts: menuItems.length,
          activeProducts: activeItems.length,
          categoriesWithProducts,
          productsByCategory,
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coffee className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
                <p className="text-sm text-muted-foreground">Bienvenido, {user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 bg-transparent" asChild>
                <Link href="/" target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4" />
                  Ver Menú
                </Link>
              </Button>
              <Button onClick={handleLogout} variant="outline" className="gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Gestiona tu menú digital y revisa las estadísticas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Productos</CardTitle>
              <Coffee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{loading ? "..." : stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">productos en el menú</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{loading ? "..." : stats.activeProducts}</div>
              <p className="text-xs text-muted-foreground">productos disponibles</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorías Activas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.categoriesWithProducts}</div>
              <p className="text-xs text-muted-foreground">de {CATEGORIES.length} categorías</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponibilidad</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading
                  ? "..."
                  : stats.totalProducts > 0
                    ? Math.round((stats.activeProducts / stats.totalProducts) * 100)
                    : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">productos disponibles</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Productos por Categoría
              </CardTitle>
              <CardDescription>Distribución de productos en cada categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {CATEGORIES.map((category) => {
                  const count = stats.productsByCategory[category] || 0
                  const percentage = stats.totalProducts > 0 ? (count / stats.totalProducts) * 100 : 0

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{category}</span>
                        <span className="text-muted-foreground">{count} productos</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Estado del Menú
              </CardTitle>
              <CardDescription>Información general sobre el estado del menú</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Menú Completo</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.categoriesWithProducts === CATEGORIES.length
                        ? "Todas las categorías tienen productos"
                        : `${CATEGORIES.length - stats.categoriesWithProducts} categorías vacías`}
                    </p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      stats.categoriesWithProducts === CATEGORIES.length ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Productos Disponibles</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.activeProducts} de {stats.totalProducts} productos activos
                    </p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      stats.activeProducts === stats.totalProducts ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Gestión de Productos
              </CardTitle>
              <CardDescription>Agregar, editar o eliminar productos del menú</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/admin/products">Gestionar Productos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5" />
                Agregar Producto Rápido
              </CardTitle>
              <CardDescription>Crear un nuevo producto para el menú</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/admin/products/new">Nuevo Producto</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
