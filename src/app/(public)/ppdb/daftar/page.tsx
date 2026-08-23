"use client";

import { useState } from "react";
import Link from "next/link";
import {
  listPpdbOpenings,
  createPpdbRegistration,
} from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";
import { uploadImage } from "@/lib/cloudinary";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/ui/Container";
import type { PpdbOpening } from "@/lib/types";

function makeRegNumber() {
  const y = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `PPDB-${y}-${rand}`;
}

export default function PpdbDaftarPage() {
  const openings = useCollection<PpdbOpening>(() => listPpdbOpenings());
  const active = (openings.data ?? []).filter((o) => o.isActive);
  const [form, setForm] = useState({
    openingId: "",
    studentName: "",
    nisn: "",
    birthPlace: "",
    birthDate: "",
    gender: "L" as "L" | "P",
    address: "",
    fatherName: "",
    motherName: "",
    parentPhone: "",
    parentEmail: "",
  });
  const [files, setFiles] = useState<{ foto?: File; kk?: File; akta?: File }>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regNumber, setRegNumber] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function uploadIfAny(file?: File) {
    return file ? await uploadImage(file) : undefined;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.openingId) {
      setError("Pilih gelombang pendaftaran.");
      return;
    }
    setBusy(true);
    try {
      const opening = active.find((o) => o.id === form.openingId);
      const [photoUrl, kkUrl, aktaUrl] = await Promise.all([
        uploadIfAny(files.foto),
        uploadIfAny(files.kk),
        uploadIfAny(files.akta),
      ]);
      const reg = makeRegNumber();
      await createPpdbRegistration({
        registrationNumber: reg,
        openingId: form.openingId,
        openingName: opening?.name ?? "",
        studentName: form.studentName,
        nisn: form.nisn,
        birthPlace: form.birthPlace,
        birthDate: form.birthDate,
        gender: form.gender,
        address: form.address,
        fatherName: form.fatherName,
        motherName: form.motherName,
        parentPhone: form.parentPhone,
        parentEmail: form.parentEmail,
        photoUrl,
        kkUrl,
        aktaUrl,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      setRegNumber(reg);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim pendaftaran.");
    } finally {
      setBusy(false);
    }
  }

  if (regNumber) {
    return (
      <Container className="py-12">
        <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-stone-100">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
            ✓
          </div>
          <h1 className="font-heading text-xl font-bold text-stone-900">
            Pendaftaran Terkirim
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Simpan nomor pendaftaran Anda untuk mengecek status.
          </p>
          <p className="mt-4 rounded-xl bg-stone-50 py-3 font-mono text-lg font-bold text-brand-700">
            {regNumber}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/ppdb/status">
              <Button>Cek Status</Button>
            </Link>
            <Link href="/ppdb">
              <Button variant="outline">Kembali</Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <>
      <PageHeader title="Daftar PPDB" subtitle="Isi data calon siswa dengan lengkap." />
      <Container className="py-10">
        {active.length === 0 ? (
          <p className="rounded-2xl bg-stone-50 p-6 text-center text-stone-500">
            Pendaftaran PPDB belum dibuka. Silakan cek kembali saat gelombang pendaftaran dibuka.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-8">
            {/* Gelombang */}
            <section className="space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
              <h2 className="font-heading font-bold text-stone-900">Gelombang</h2>
              <select
                value={form.openingId}
                onChange={(e) => set("openingId", e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              >
                <option value="">Pilih Gelombang</option>
                {active.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </section>

            {/* Data calon siswa */}
            <section className="space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
              <h2 className="font-heading font-bold text-stone-900">Data Calon Siswa</h2>
              <Input label="Nama Lengkap" value={form.studentName} onChange={(v) => set("studentName", v)} />
              <Input label="NISN" value={form.nisn} onChange={(v) => set("nisn", v)} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Tempat Lahir" value={form.birthPlace} onChange={(v) => set("birthPlace", v)} />
                <Input label="Tanggal Lahir" type="date" value={form.birthDate} onChange={(v) => set("birthDate", v)} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={form.gender}
                  onChange={(e) => set("gender", e.target.value as "L" | "P")}
                  className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
                <Input label="No. HP Orang Tua" value={form.parentPhone} onChange={(v) => set("parentPhone", v)} />
              </div>
              <Textarea label="Alamat" value={form.address} onChange={(v) => set("address", v)} />
              <Input label="Email Orang Tua" type="email" value={form.parentEmail} onChange={(v) => set("parentEmail", v)} />
            </section>

            {/* Orang tua */}
            <section className="space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
              <h2 className="font-heading font-bold text-stone-900">Data Orang Tua</h2>
              <Input label="Nama Ayah" value={form.fatherName} onChange={(v) => set("fatherName", v)} />
              <Input label="Nama Ibu" value={form.motherName} onChange={(v) => set("motherName", v)} />
            </section>

            {/* Berkas */}
            <section className="space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
              <h2 className="font-heading font-bold text-stone-900">Berkas (foto)</h2>
              <FileField label="Pas Foto" onChange={(f) => setFiles((s) => ({ ...s, foto: f }))} />
              <FileField label="Kartu Keluarga" onChange={(f) => setFiles((s) => ({ ...s, kk: f }))} />
              <FileField label="Akta Kelahiran" onChange={(f) => setFiles((s) => ({ ...s, akta: f }))} />
            </section>

            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? "Mengirim…" : "Kirim Pendaftaran"}
            </Button>
          </form>
        )}
      </Container>
    </>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
      />
    </label>
  );
}

function Textarea({
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
        rows={2}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
      />
    </label>
  );
}

function FileField({
  label,
  onChange,
}: {
  label: string;
  onChange: (f: File) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && onChange(e.target.files[0])}
        className="mt-1 block text-sm"
      />
    </label>
  );
}
