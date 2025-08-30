// lib/firebase-service.ts

// lib/firebase-service.ts

export const getMenuItems = async () => {
  const response = await fetch("/api/menu-items");
  if (!response.ok) {
    throw new Error("Failed to fetch menu items");
  }
  return response.json();
};

export const deleteMenuItem = async (id: string) => {
  const response = await fetch("/api/menu-items", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    throw new Error("Failed to delete menu item");
  }
  return response.json();
};

export const addMenuItem = async (menuItem: any) => {
  const response = await fetch("/api/menu-items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(menuItem),
  });
  if (!response.ok) {
    throw new Error("Failed to add menu item");
  }
  return response.json();
};

export const updateMenuItem = async (id: string, menuItem: any) => {
  const response = await fetch("/api/menu-items", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...menuItem }),
  });
  if (!response.ok) {
    throw new Error("Failed to update menu item");
  }
  return response.json();
};


// Image upload functions
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    console.log("[v0] Starting image upload via API:", { fileName: file.name, size: file.size, path });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload image");
    }

    const { url } = await response.json();
    console.log("[v0] Image uploaded successfully via API:", url);

    return url;
  } catch (error) {
    console.error("[v0] Error uploading image:", error);
    throw new Error(`Error al subir la imagen: ${error instanceof Error ? error.message : "Error desconocido"}`);
  }
};
