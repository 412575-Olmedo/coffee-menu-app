import Image from "next/image"
import type { MenuItem } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 bg-card/80 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <Image
            src={
              item.imageUrl ||
              `/placeholder.svg?height=240&width=320&query=${encodeURIComponent(item.name + " " + item.category)}`
            }
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors text-balance">
              {item.name}
            </h3>
            <span className="text-xl font-bold text-primary shrink-0">€{item.price.toFixed(2)}</span>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed text-pretty">{item.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
