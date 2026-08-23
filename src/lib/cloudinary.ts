export async function uploadImage(file: File): Promise<string> {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !preset) {
    throw new Error("Cloudinary belum dikonfigurasi (NEXT_PUBLIC_CLOUDINARY_*).");
  }
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
    { method: "POST", body: form },
  );
  if (!res.ok) throw new Error("Gagal mengunggah gambar ke Cloudinary.");
  const data = await res.json();
  return data.secure_url as string;
}
