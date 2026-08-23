"use client";

import { useState } from "react";
import {
  listPpdbRegistrations,
  updatePpdbRegistration,
  enrollAcceptedRegistration,
  listClasses,
} from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";
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
  const [classMap, setClassMap] = useState<Record<string, string>>({});
  const [classError, setClassError] = useState<string | null>(null);

  async function accept(r: PpdbRegistration) {
    const classId = classMap[r.id ?? ""];
    if (!classId) {
      setClassError(r.id ?? "");
      return;
    }
    setBusyId(r.id ?? "");
    try {
      await enrollAcceptedRegistration(r, classId);
      await updatePpdbRegistration(r.id!, { status: "accepted", notes: notes[r.id ?? ""] || undefined });
      regs.refresh();
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
                <p>Email: {r.parentEmail}</p>
                <p>Ayah/Ibu: {r.fatherName} / {r.motherName}</p>
              </div>
              <input
                value={notes[r.id ?? ""] ?? ""}
                onChange={(e) => setNotes((s) => ({ ...s, [r.id ?? ""]: e.target.value }))}
                placeholder="Catatan (opsional)"
                className="mt-3 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
