// app/api/upload-image/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { storage } from '@/lib/firebase-admin' // Importamos el objeto storage

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const path = formData.get("path") as string

    if (!file || !path) {
      return NextResponse.json({ error: "No file or path provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Obtiene una referencia al bucket de Storage
    const bucket = storage.bucket()

    // Crea una referencia al archivo en el bucket
    const fileRef = bucket.file(`${path}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`)
    
    // Sube el buffer de datos
    await fileRef.save(buffer, {
        metadata: {
            contentType: file.type,
        },
    })
    
    // Opcional: Para obtener una URL pública si las reglas de Storage lo permiten
    await fileRef.makePublic()
    const publicUrl = fileRef.publicUrl()

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
