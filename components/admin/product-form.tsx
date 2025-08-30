"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addMenuItem, updateMenuItem, uploadImage } from "@/lib/firebase-service"
import { CATEGORIES, type MenuItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, X, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ProductFormProps {
  product?: MenuItem
  isEditing?: boolean
}

export function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    category: product?.category || "",
    isAvailable: product?.isAvailable ?? true,
  })

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen debe ser menor a 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten archivos de imagen")
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim() || !formData.description.trim() || !formData.category) {
      setError("Por favor completa todos los campos requeridos")
      return
    }

    if (formData.price <= 0) {
      setError("El precio debe ser mayor a 0")
      return
    }

    setLoading(true)

    try {
      let imageUrl = product?.imageUrl || ""

      // Upload new image if selected
      if (imageFile) {
        setUploadingImage(true)
        const fileName = `${Date.now()}-${imageFile.name}`
        imageUrl = await uploadImage(imageFile, fileName)
        setUploadingImage(false)
      }

      const productData = {
        ...formData,
        imageUrl,
      }

      if (isEditing && product) {
        await updateMenuItem(product.id, productData)
      } else {
        await addMenuItem(productData)
      }

      router.push("/admin/products")
    } catch (error) {
      console.error("Error saving product:", error)
      setError("Error al guardar el producto. Intenta de nuevo.")
    } finally {
      setLoading(false)
      setUploadingImage(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Productos
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-foreground">{isEditing ? "Editar Producto" : "Nuevo Producto"}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>{isEditing ? "Editar Producto" : "Agregar Nuevo Producto"}</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Modifica la información del producto"
                  : "Completa la información para agregar un nuevo producto al menú"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Imagen del Producto</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6">
                    {imagePreview ? (
                      <div className="relative">
                        <div className="relative aspect-[4/3] w-full max-w-sm mx-auto overflow-hidden rounded-lg">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            fill
                            className="object-cover"
                            sizes="(max-width: 400px) 100vw, 400px"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="mt-4 text-center">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("image-upload")?.click()}
                            disabled={loading}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Cambiar Imagen
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Selecciona una imagen para el producto</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG hasta 5MB</p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("image-upload")?.click()}
                            disabled={loading}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Subir Imagen
                          </Button>
                        </div>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Producto *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ej: Café Americano"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Precio *d</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe el producto, ingredientes, características especiales..."
                    rows={4}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Availability */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => handleInputChange("isAvailable", checked)}
                    disabled={loading}
                  />
                  <Label htmlFor="available">Producto disponible</Label>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild>
                    <Link href="/admin/products">Cancelar</Link>
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading || uploadingImage}>
                    {loading || uploadingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {uploadingImage ? "Subiendo imagen..." : "Guardando..."}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {isEditing ? "Actualizar Producto" : "Crear Producto"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
