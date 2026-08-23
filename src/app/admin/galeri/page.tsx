"use client";

import { useState } from "react";
import {
  createGalleryItem,
  deleteGalleryItem,
  listGallery,
} from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";
import { uploadImage } from "@/lib/cloudinary";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function AdminGaleriPage() {
  const { data, loading, refresh } = useCollection(() => listGallery());
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Pilih gambar terlebih dahulu.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      await createGalleryItem({
        title: title || file.name,
        imageUrl: url,
        sortOrder: (data?.length ?? 0) + 1,
      });
      setTitle("");
      setFile(null);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Hapus foto ini?")) return;
    await deleteGalleryItem(id);
    refresh();
  }

  if (loading && !data) return <div className="px-5 py-8 text-stone-500">Memuat…</div>;

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <h1 className="font-heading text-2xl font-bold text-stone-900">Galeri</h1>
      <p className="mt-1 text-sm text-stone-500">
        Unggah foto kegiatan (disimpan di Cloudinary).
      </p>

      <form onSubmit={onSubmit} className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
        <label className="block text-sm font-medium text-stone-700">
          Judul
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-48 rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-stone-700">
          Gambar
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1 block text-sm"
          />
        </label>
        <Button type="submit" disabled={busy}>
          {busy ? "Mengunggah…" : "Unggah"}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {data?.map((g) => (
          <div key={g.id} className="overflow-hidden rounded-xl ring-1 ring-stone-100">
            <div className="relative aspect-square">
              <Image src={g.imageUrl} alt={g.title} fill className="object-cover" sizes="(max-width: 640px) 50vw, 33vw" />
            </div>
            <div className="flex items-center justify-between gap-2 bg-white p-2">
              <span className="truncate text-xs text-stone-600">{g.title}</span>
              <Button variant="danger" size="sm" onClick={() => remove(g.id!)}>
                Hapus
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
