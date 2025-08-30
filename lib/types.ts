export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  isAvailable: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  displayOrder: number
}

export const CATEGORIES = ["Desayunos", "Bebidas Calientes", "Bebidas Frías", "Postres"] as const

export type CategoryType = (typeof CATEGORIES)[number]
