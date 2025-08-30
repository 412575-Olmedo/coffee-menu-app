import { ProtectedRoute } from "@/components/auth/protected-route"
import { ProductForm } from "@/components/admin/product-form"

export default function NewProductPage() {
  return (
    <ProtectedRoute>
      <ProductForm />
    </ProtectedRoute>
  )
}
