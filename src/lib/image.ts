// Converts any uploaded image File to a WebP data URL using canvas.
// Falls back to original data URL if WebP encoding fails (e.g. SVG).
export async function fileToWebp(file: File, quality = 0.85, maxDim = 1920): Promise<string> {
  if (typeof window === "undefined") return "";
  if (file.type === "image/svg+xml") return readAsDataURL(file);
  const dataUrl = await readAsDataURL(file);
  try {
    const img = await loadImage(dataUrl);
    let { width, height } = img;
    const scale = Math.min(1, maxDim / Math.max(width, height));
    width = Math.round(width * scale);
    height = Math.round(height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, width, height);
    const webp = canvas.toDataURL("image/webp", quality);
    if (webp && webp.startsWith("data:image/webp")) return webp;
    return dataUrl;
  } catch {
    return dataUrl;
  }
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Upload an image to the API and return a public URL.
// First converts to webp (for smaller payload), then sends as multipart/form-data.
// On failure, returns the data URL as a fallback so the UI still works locally.
import { supabase } from "@/integrations/supabase/client";

export async function uploadImage(file: File, bucket = "avatars"): Promise<string> {
  try {
    const dataUrl = await fileToWebp(file);
    const blob = await (await fetch(dataUrl)).blob();
    const ext = (blob.type.split("/")[1] || "webp").replace("jpeg", "jpg");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, blob, {
      contentType: blob.type || "image/webp",
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl || dataUrl;
  } catch {
    try { return await fileToWebp(file); } catch { return ""; }
  }
}