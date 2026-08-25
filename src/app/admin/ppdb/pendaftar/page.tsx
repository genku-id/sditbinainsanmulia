"use client";

import { useState } from "react";
import { getAuth } from "firebase/auth";
import {
  listPpdbRegistrations,
  updatePpdbRegistration,
  enrollAcceptedRegistration,
  listClasses,
} from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";
import { ortuEmailFromPhone } from "@/lib/phone";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ClassRoom, PpdbRegistration, PpdbStatus } from "@/lib/types";

const STATUS_LABEL: Record<PpdbStatus, { text: string; cls: string }> = {
  pending: { text: "Menunggu", cls: "bg-amber-100 text-amber-700" },
  accepted: { text: "Diterima", cls: "bg-emerald-100 text-emerald-700" },
  rejected: { text: "Ditolak", cls: "bg-red-100 text-red-700" },
};

export default function PpdbPendaftarPage() {
  const regs = useCollection<PpdbRegistration>(() => listPpdbRegistrations());
  const classes = useCollection<ClassRoom>(() => listClasses());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [pwMap, setPwMap] = useState<Record<string, string>>({});
  const [classMap, setClassMap] = useState<Record<string, string>>({});
  const [classError, setClassError] = useState<string | null>(null);
  const [results, setResults] = useState<
    Record<string, { login: string; password: string; phone: boolean }>
  >({});

  async function accept(r: PpdbRegistration) {
    const classId = classMap[r.id ?? ""];
    if (!classId) {
      setClassError(r.id ?? "");
      return;
    }
    setBusyId(r.id ?? "");
    try {
      // 1) Daftarkan sebagai siswa (sekaligus profil ortu bila ada email).
      const studentId = await enrollAcceptedRegistration(r, classId);

      // 2) Buat akun login ortu otomatis (Auth + claim + tautkan anak).
      // Ortu diidentifikasi dari nomor HP (email turunan, tak ditampilkan).
      const ortuEmail = r.parentPhone ? ortuEmailFromPhone(r.parentPhone) : "";
      const password =
        pwMap[r.id ?? ""]?.trim() || `Sdit${Math.floor(1000 + Math.random() * 9000)}`;
      const token = await getAuth().currentUser?.getIdToken();
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: ortuEmail,
          password,
          name: r.fatherName || r.motherName || r.studentName,
          role: "orang_tua",
          studentId,
          phone: r.parentPhone,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Gagal membuat akun orang tua");
      }

      await updatePpdbRegistration(r.id!, { status: "accepted", notes: notes[r.id ?? ""] || undefined });
      setResults((s) => ({ ...s, [r.id ?? ""]: { login: r.parentPhone, password, phone: true } }));
      regs.refresh();
    } catch (e) {
      setResults((s) => ({ ...s, [r.id ?? ""]: { login: "", password: e instanceof Error ? e.message : "Gagal", phone: false } }));
    } finally {
      setBusyId(null);
    }
  }

  async function reject(r: PpdbRegistration) {
    setBusyId(r.id ?? "");
    try {
      await updatePpdbRegistration(r.id!, { status: "rejected", notes: notes[r.id ?? ""] || undefined });
      regs.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold text-stone-900">Pendaftar PPDB</h1>
        <Button variant="outline" size="sm" onClick={() => regs.refresh()}>Segarkan</Button>
      </div>

      {regs.loading ? (
        <p className="text-stone-500">Memuat…</p>
      ) : (regs.data ?? []).length === 0 ? (
        <p className="rounded-2xl bg-stone-50 p-6 text-center text-stone-500">Belum ada pendaftar.</p>
      ) : (
        <div className="space-y-3">
          {(regs.data ?? []).map((r) => (
            <div key={r.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-stone-900">{r.studentName}</p>
                  <p className="text-xs text-stone-500">
                    {r.registrationNumber} · {r.openingName || "—"} · {r.createdAt.slice(0, 10)}
                  </p>
                </div>
                <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", STATUS_LABEL[r.status].cls)}>
                  {STATUS_LABEL[r.status].text}
                </span>
              </div>
              <div className="mt-2 grid gap-x-6 gap-y-1 text-sm text-stone-600 sm:grid-cols-2">
                <p>NISN: {r.nisn || "—"}</p>
                <p>HP: {r.parentPhone}</p>
                <p>Ayah/Ibu: {r.fatherName} / {r.motherName}</p>
              </div>
              <input
                value={notes[r.id ?? ""] ?? ""}
                onChange={(e) => setNotes((s) => ({ ...s, [r.id ?? ""]: e.target.value }))}
                placeholder="Catatan (opsional)"
                className="mt-3 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
              {r.status !== "accepted" && (
                <input
                  value={pwMap[r.id ?? ""] ?? ""}
                  onChange={(e) => setPwMap((s) => ({ ...s, [r.id ?? ""]: e.target.value }))}
                  placeholder="Password akun ortu (opsional, auto-buat bila kosong)"
                  className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
                />
              )}
              {r.status !== "accepted" && (
                <label className="mt-3 block">
                  <span className="text-xs font-medium text-stone-600">Masukkan ke kelas</span>
                  <select
                    value={classMap[r.id ?? ""] ?? ""}
                    onChange={(e) => setClassMap((s) => ({ ...s, [r.id ?? ""]: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
                  >
                    <option value="">Pilih Kelas</option>
                    {(classes.data ?? []).map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </label>
              )}
              {classError === (r.id ?? "") && (
                <p className="mt-1 text-xs text-red-600">Pilih kelas terlebih dahulu.</p>
              )}
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  disabled={busyId === r.id || r.status === "accepted"}
                  onClick={() => accept(r)}
                >
                  Terima & Daftarkan
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  disabled={busyId === r.id || r.status === "rejected"}
                  onClick={() => reject(r)}
                >
                  Tolak
                </Button>
              </div>
              {results[r.id ?? ""] && (
                <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
                  {results[r.id ?? ""].login ? (
                    <>
                      <p className="font-semibold">Akun orang tua dibuat &amp; terhubung ke anak.</p>
                      <p>{results[r.id ?? ""].phone ? "Nomor HP" : "Login"}: <b>{results[r.id ?? ""].login}</b></p>
                      <p>Password: <b>{results[r.id ?? ""].password}</b> (beritahu ke orang tua)</p>
                    </>
                  ) : (
                    <p className="text-red-700">{results[r.id ?? ""].password}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
