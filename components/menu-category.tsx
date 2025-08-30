import type { ReactNode } from "react"

interface MenuCategoryProps {
  title: string
  children: ReactNode
}

export function MenuCategory({ title, children }: MenuCategoryProps) {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2 text-balance">{title}</h2>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
      </div>
      {children}
    </section>
  )
}
