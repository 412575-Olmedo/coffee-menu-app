"use client"

import { useEffect, useState } from "react"
import { getMenuItems } from "@/lib/firebase-service"
import { type MenuItem, CATEGORIES } from "@/lib/types"
import { MenuCategory } from "./menu-category"
import { MenuItemCard } from "./menu-item-card"
import { Loader2 } from "lucide-react"

interface MenuDisplayProps {
  searchQuery?: string
}

export function MenuDisplay({ searchQuery = "" }: MenuDisplayProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await getMenuItems()
        setMenuItems(items.filter((item) => item.isAvailable))
      } catch (err) {
        setError("Error al cargar el menú. Por favor, intenta de nuevo.")
        console.error("Error fetching menu items:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando menú...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  // Filter items based on search query
  const filteredItems = searchQuery
    ? menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : menuItems

  // If searching, show all filtered results in one section
  if (searchQuery) {
    return (
      <div className="space-y-8">
        {filteredItems.length > 0 ? (
          <MenuCategory title={`Resultados para "${searchQuery}"`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </MenuCategory>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron resultados para "{searchQuery}"</p>
          </div>
        )}
      </div>
    )
  }

  // Group items by category for normal display
  const groupedItems = CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = filteredItems.filter((item) => item.category === category)
      return acc
    },
    {} as Record<string, MenuItem[]>,
  )

  return (
    <div className="space-y-12">
      {CATEGORIES.map((category) => {
        const items = groupedItems[category]
        if (!items || items.length === 0) return null

        return (
          <MenuCategory key={category} title={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </MenuCategory>
        )
      })}

      {filteredItems.length === 0 && !searchQuery && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hay elementos disponibles en el menú en este momento.</p>
        </div>
      )}
    </div>
  )
}
