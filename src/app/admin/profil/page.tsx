"use client";

import { useEffect, useState } from "react";
import { getSchoolProfile, saveSchoolProfile } from "@/lib/firestore";
import { SITE } from "@/lib/site";
import type { SchoolProfile } from "@/lib/types";
import { Button } from "@/components/ui/Button";

const EMPTY: SchoolProfile = {
  name: SITE.name,
  shortName: SITE.shortName,
  tagline: SITE.tagline,
  description: "",
  address: SITE.address,
  email: SITE.email,
  phone: SITE.phone,
  instagram: SITE.instagram,
  instagramHandle: SITE.instagramHandle,
  maps: SITE.maps,
  ppdbYear: SITE.ppdbYear,
  visi: "",
  misi: [],
  sejarah: "",
};

export default function AdminProfilPage() {
  const [form, setForm] = useState<SchoolProfile>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSchoolProfile()
      .then((p) => p && setForm(p))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof SchoolProfile>(key: K, value: SchoolProfile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await saveSchoolProfile(form);
    setSaved(true);
  }

  if (loading) return <div className="px-5 py-8 text-stone-500">Memuat…</div>;

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="font-heading text-2xl font-bold text-stone-900">
        Profil Sekolah
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Konten ini tampil di halaman Profil & Kontak website.
      </p>

      <div className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-100">
        <Field label="Nama Sekolah" value={form.name} onChange={(v) => set("name", v)} />
        <Field label="Nama Singkat" value={form.shortName} onChange={(v) => set("shortName", v)} />
        <Field label="Tagline" value={form.tagline} onChange={(v) => set("tagline", v)} />
        <TextArea label="Deskripsi" value={form.description} onChange={(v) => set("description", v)} />
        <Field label="Alamat" value={form.address} onChange={(v) => set("address", v)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" value={form.email} onChange={(v) => set("email", v)} />
          <Field label="Telepon" value={form.phone} onChange={(v) => set("phone", v)} />
        </div>
        <Field label="Instagram (URL)" value={form.instagram} onChange={(v) => set("instagram", v)} />
        <Field label="Handle Instagram" value={form.instagramHandle} onChange={(v) => set("instagramHandle", v)} />
        <Field label="Google Maps URL" value={form.maps} onChange={(v) => set("maps", v)} />
        <Field label="Tahun PPDB" value={form.ppdbYear} onChange={(v) => set("ppdbYear", v)} />
        <TextArea label="Visi" value={form.visi} onChange={(v) => set("visi", v)} />
        <TextArea
          label="Misi (pisahkan dengan baris baru)"
          value={form.misi.join("\n")}
          onChange={(v) => set("misi", v.split("\n").map((s) => s.trim()).filter(Boolean))}
        />
        <TextArea label="Sejarah" value={form.sejarah} onChange={(v) => set("sejarah", v)} />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button type="submit">Simpan</Button>
        {saved && <span className="text-sm text-emerald-600">Tersimpan ✓</span>}
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <textarea
        value={value}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
    </label>
  );
}
