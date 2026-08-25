// Unggah gambar melalui route server (/api/upload) yang memakai credential
// Cloudinary di sisi server — secret tidak diekspos ke browser.
export async function uploadImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Gagal membaca berkas."));
    reader.readAsDataURL(file);
  });

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataUrl }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error || "Gagal mengunggah gambar ke Cloudinary.");
  }
  const data = await res.json();
  return data.url as string;
}
