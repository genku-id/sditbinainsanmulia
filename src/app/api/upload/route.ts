import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Konfigurasi dari CLOUDINARY_URL (server-only, berisi api_secret).
const raw = process.env.CLOUDINARY_URL || "";
const m = raw.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
if (m) {
  cloudinary.config({ cloud_name: m[3], api_key: m[1], api_secret: m[2] });
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Menerima data URL gambar dari client, mengunggah ke Cloudinary, mengembalikan
// URL aman. Secret tidak pernah dikirim ke browser.
export async function POST(req: NextRequest) {
  try {
    const { dataUrl } = await req.json();
    if (!dataUrl || typeof dataUrl !== "string") {
      return NextResponse.json({ error: "Berkas tidak valid" }, { status: 400 });
    }
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: "sditbinainsanmulia",
      resource_type: "image",
      overwrite: false,
    });
    return NextResponse.json({ url: result.secure_url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Gagal mengunggah gambar";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
