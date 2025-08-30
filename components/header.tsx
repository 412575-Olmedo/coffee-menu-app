import Link from "next/link"
import { Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Coffee className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">CaféMenu</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Menú
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              Nosotros
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              Contacto
            </Link>
          </nav>

          <Button asChild variant="outline" className="hidden md:inline-flex bg-transparent">
            <Link href="/admin">Admin</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
