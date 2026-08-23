"use client";

import { useState } from "react";
import {
  createPpdbOpening,
  deletePpdbOpening,
  listPpdbOpenings,
  updatePpdbOpening,
} from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";
import type { PpdbOpening } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export default function AdminPpdbPage() {
  const { data, loading, refresh } = useCollection(() => listPpdbOpenings());
  const [form, setForm] = useState<Partial<PpdbOpening>>({
    name: "",
    jalur: "",
    quota: 30,
    startDate: "",
    endDate: "",
    isActive: true,
    notes: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof PpdbOpening>(k: K, v: PpdbOpening[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const payload = {
      name: form.name ?? "",
      jalur: form.jalur ?? "",
      quota: Number(form.quota ?? 0),
      startDate: form.startDate ?? "",
      endDate: form.endDate ?? "",
      isActive: form.isActive ?? false,
      notes: form.notes,
    };
    try {
      if (editingId) await updatePpdbOpening(editingId, payload);
      else await createPpdbOpening(payload);
      setForm({ name: "", jalur: "", quota: 30, startDate: "", endDate: "", isActive: true });
      setEditingId(null);
      refresh();
    } finally {
      setBusy(false);
    }
  }

  function edit(o: PpdbOpening) {
    setEditingId(o.id ?? null);
    setForm(o);
  }

  async function remove(id: string) {
    if (!confirm("Hapus gelombang ini?")) return;
    await deletePpdbOpening(id);
    refresh();
  }

  if (loading && !data) return <div className="px-5 py-8 text-stone-500">Memuat…</div>;

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <h1 className="font-heading text-2xl font-bold text-stone-900">PPDB</h1>

      <form onSubmit={onSubmit} className="mt-4 grid gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100 sm:grid-cols-2">
        <input required placeholder="Nama gelombang" value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <input required placeholder="Jalur" value={form.jalur ?? ""} onChange={(e) => set("jalur", e.target.value)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <input type="number" placeholder="Kuota" value={form.quota ?? 0} onChange={(e) => set("quota", Number(e.target.value))} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <input type="date" value={form.startDate ?? ""} onChange={(e) => set("startDate", e.target.value)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <input type="date" value={form.endDate ?? ""} onChange={(e) => set("endDate", e.target.value)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 text-sm text-stone-600">
          <input type="checkbox" checked={form.isActive ?? false} onChange={(e) => set("isActive", e.target.checked)} />
          Aktif
        </label>
        <textarea placeholder="Catatan" value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm sm:col-span-2" rows={2} />
        <div className="flex gap-2 sm:col-span-2">
          <Button type="submit" disabled={busy}>{editingId ? "Update" : "Tambah"}</Button>
          {editingId && (
            <Button variant="outline" onClick={() => { setEditingId(null); setForm({ name: "", jalur: "", quota: 30, startDate: "", endDate: "", isActive: true }); }}>
              Batal
            </Button>
          )}
        </div>
      </form>

      <ul className="mt-6 space-y-2">
        {data?.map((o) => (
          <li key={o.id} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
            <div>
              <p className="font-medium text-stone-800">{o.name}</p>
              <p className="text-xs text-stone-500">{o.jalur} · kuota {o.quota} · {o.startDate}–{o.endDate}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => edit(o)}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => remove(o.id!)}>Hapus</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
