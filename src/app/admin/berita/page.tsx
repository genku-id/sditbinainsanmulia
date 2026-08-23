"use client";

import { useState } from "react";
import {
  createAnnouncement,
  deleteAnnouncement,
  listAnnouncements,
  updateAnnouncement,
} from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";
import type { Announcement } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export default function AdminBeritaPage() {
  const { data, loading, refresh } = useCollection(() => listAnnouncements(false));
  const [form, setForm] = useState<Partial<Announcement>>({
    title: "",
    body: "",
    tag: "Pengumuman",
    publishedAt: new Date().toISOString().slice(0, 10),
    isPublished: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof Announcement>(k: K, v: Announcement[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const payload = {
      title: form.title ?? "",
      body: form.body ?? "",
      tag: form.tag ?? "Pengumuman",
      publishedAt: form.publishedAt ?? new Date().toISOString(),
      coverUrl: form.coverUrl,
      isPublished: form.isPublished ?? true,
    };
    try {
      if (editingId) await updateAnnouncement(editingId, payload);
      else await createAnnouncement(payload);
      setForm({ title: "", body: "", tag: "Pengumuman", isPublished: true });
      setEditingId(null);
      refresh();
    } finally {
      setBusy(false);
    }
  }

  function edit(a: Announcement) {
    setEditingId(a.id ?? null);
    setForm(a);
  }

  async function remove(id: string) {
    if (!confirm("Hapus berita ini?")) return;
    await deleteAnnouncement(id);
    refresh();
  }

  if (loading && !data) return <div className="px-5 py-8 text-stone-500">Memuat…</div>;

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <h1 className="font-heading text-2xl font-bold text-stone-900">Berita</h1>

      <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
        <input
          required
          placeholder="Judul"
          value={form.title ?? ""}
          onChange={(e) => set("title", e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <textarea
          required
          placeholder="Isi berita"
          rows={3}
          value={form.body ?? ""}
          onChange={(e) => set("body", e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            placeholder="Tag"
            value={form.tag ?? ""}
            onChange={(e) => set("tag", e.target.value)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={(form.publishedAt ?? "").slice(0, 10)}
            onChange={(e) => set("publishedAt", e.target.value)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={form.isPublished ?? false}
              onChange={(e) => set("isPublished", e.target.checked)}
            />
            Publikasikan
          </label>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={busy}>
            {editingId ? "Update" : "Tambah"}
          </Button>
          {editingId && (
            <Button
              variant="outline"
              onClick={() => {
                setEditingId(null);
                setForm({ title: "", body: "", tag: "Pengumuman", isPublished: true });
              }}
            >
              Batal
            </Button>
          )}
        </div>
      </form>

      <ul className="mt-6 space-y-2">
        {data?.map((a) => (
          <li
            key={a.id}
            className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-100"
          >
            <div>
              <p className="font-medium text-stone-800">{a.title}</p>
              <p className="text-xs text-stone-500">
                {a.tag} · {a.isPublished ? "Publik" : "Draft"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => edit(a)}>
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => remove(a.id!)}>
                Hapus
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
