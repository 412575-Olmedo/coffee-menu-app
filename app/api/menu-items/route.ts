// app/api/menu-items/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin'; // Este archivo usa firebase-admin

// Maneja la solicitud POST para crear un producto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("POST /api/menu-items", body);

    if (!body.name?.trim() || body.price === undefined || !body.category?.trim()) {
      return NextResponse.json({ error: "Campos incompletos" }, { status: 400 });
    }

    // Usar los métodos del SDK de Firebase Admin
    const docRef = await db.collection("menuItems").add({
      name: body.name,
      description: body.description ?? "",
      price: Number(body.price),
      category: body.category,
      isAvailable: body.isAvailable ?? true,
      imageUrl: body.imageUrl ?? "",
      createdAt: new Date(),
    });

    return NextResponse.json({ id: docRef.id });
  } catch (error) {
    console.error("Error saving menu item:", error);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}

// Maneja la solicitud PUT para actualizar un producto
export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }
    
    // Usar los métodos del SDK de Firebase Admin
    const docRef = db.collection("menuItems").doc(id);
    await docRef.update(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

// Maneja la solicitud GET para obtener productos
export async function GET() {
  try {
    const menuRef = db.collection("menuItems");
    const snapshot = await menuRef.orderBy("category").orderBy("name").get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json({ message: "Error fetching menu items" }, { status: 500 });
  }
}

// Maneja la solicitud DELETE para eliminar un producto
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await db.collection("menuItems").doc(id).delete();
    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json({ message: "Error deleting item" }, { status: 500 });
  }
}