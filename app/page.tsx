"use client"

import { useState } from "react"
import { MenuDisplay } from "@/components/menu-display"
import { SearchMenu } from "@/components/search-menu"
import { Header } from "@/components/header"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance">Nuestro Menú</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty mb-8">
            Descubre nuestra selección de cafés artesanales, desayunos frescos y postres deliciosos
          </p>
          <SearchMenu onSearch={setSearchQuery} />
        </div>
        <MenuDisplay searchQuery={searchQuery} />
      </main>
    </div>
  )
}
