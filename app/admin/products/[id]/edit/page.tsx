"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import type { MenuItem } from "@/lib/types"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ProductForm } from "@/components/admin/product-form"
import { Loader2 } from "lucide-react"

export default function EditProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = params.id as string
        const docRef = doc(db, "menuItems", productId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          setProduct({
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
          } as MenuItem)
        } else {
          setError("Producto no encontrado")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Error al cargar el producto")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Cargando producto...</span>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !product) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Error</h2>
            <p className="text-muted-foreground">{error || "Producto no encontrado"}</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <ProductForm product={product} isEditing={true} />
    </ProtectedRoute>
  )
}
