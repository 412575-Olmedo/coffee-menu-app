import { ProtectedRoute } from "@/components/auth/protected-route"
import { ProductManagement } from "@/components/admin/product-management"

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <ProductManagement />
    </ProtectedRoute>
  )
}
