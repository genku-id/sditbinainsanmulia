"use client";

import { useState } from "react";
import Link from "next/link";
import {
  listStudents,
  listViolations,
  createViolation,
  deleteViolation,
} from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";

export default function PelanggaranPage() {
  const students = useCollection(() => listStudents());
  const violations = useCollection(() => listViolations());
  const [form, setForm] = useState({ studentId: "", type: "", note: "" });
  const [saved, setSaved] = useState(false);

  async function add() {
    if (!form.studentId || !form.type.trim()) return;
    const student = (students.data ?? []).find((s) => s.id === form.studentId);
    await createViolation({
      studentId: form.studentId,
      classId: student?.classId ?? "",
      date: new Date().toISOString().slice(0, 10),
      type: form.type.trim(),
      note: form.note.trim(),
    });
    setForm({ studentId: "", type: "", note: "" });
    violations.refresh();
    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="font-heading text-xl font-bold text-stone-900">Pelanggaran</h1>

      {(students.data ?? []).length === 0 ? (
        <div className="mt-10 rounded-2xl bg-stone-50 p-6 text-center">
          <p className="text-sm text-stone-500">Butuh data siswa.</p>
          <Link href="/app/data" className="mt-3 inline-block rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
            Kelola Data Sekolah
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-4 space-y-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
            <select
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            >
              <option value="">Pilih Siswa</option>
              {(students.data ?? []).map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <input
              placeholder="Jenis pelanggaran"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Catatan"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              rows={2}
            />
            <button
              onClick={add}
              className="w-full rounded-full bg-brand-600 py-2.5 font-semibold text-white"
            >
              {saved ? "Tersimpan ✓" : "Catat Pelanggaran"}
            </button>
          </div>

          <ul className="mt-4 space-y-2">
            {(violations.data ?? []).map((v) => {
              const student = (students.data ?? []).find((s) => s.id === v.studentId);
              return (
                <li key={v.id} className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-stone-100">
                  <div>
                    <p className="text-sm font-medium text-stone-800">{student?.name ?? "—"} — {v.type}</p>
                    {v.note && <p className="text-xs text-stone-500">{v.note}</p>}
                  </div>
                  <button onClick={async () => { await deleteViolation(v.id!); violations.refresh(); }} className="text-xs text-red-600">
                    Hapus
                  </button>
                </li>
              );
            })}
            {(violations.data ?? []).length === 0 && (
              <li className="rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
                Belum ada catatan.
              </li>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
