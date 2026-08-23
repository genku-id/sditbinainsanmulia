"use client";

import { useState } from "react";
import Link from "next/link";
import {
  listStudents,
  listSubjects,
  listScores,
  createScore,
  deleteScore,
} from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";
import { useAppUser } from "@/lib/useAppUser";
import type { Score, Student, Subject } from "@/lib/types";

export default function NilaiPage() {
  const { profile, role } = useAppUser();
  const students = useCollection<Student>(() => listStudents());
  const subjects = useCollection<Subject>(() => listSubjects());
  const scores = useCollection<Score>(() => listScores());
  const [form, setForm] = useState({ studentId: "", subjectId: "", examName: "", score: 0 });
  const [saved, setSaved] = useState(false);

  // Orang tua hanya boleh melihat nilai anaknya sendiri.
  const visibleIds =
    role === "orang_tua" ? (profile?.studentIds ?? []) : null;
  const visibleScores = (scores.data ?? []).filter(
    (s) => !visibleIds || visibleIds.includes(s.studentId),
  );

  async function add() {
    if (!form.studentId || !form.subjectId || !form.examName.trim()) return;
    await createScore({
      studentId: form.studentId,
      subjectId: form.subjectId,
      examName: form.examName.trim(),
      score: Number(form.score),
      date: new Date().toISOString().slice(0, 10),
    });
    setForm({ studentId: "", subjectId: "", examName: "", score: 0 });
    scores.refresh();
    setSaved(true);
  }

  const ready = (students.data ?? []).length > 0 && (subjects.data ?? []).length > 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="font-heading text-xl font-bold text-stone-900">Nilai</h1>

      {role === "guru" &&
        (ready ? (
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
            <select
              value={form.subjectId}
              onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            >
              <option value="">Pilih Mapel</option>
              {(subjects.data ?? []).map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                placeholder="Nama Ulangan"
                value={form.examName}
                onChange={(e) => setForm({ ...form, examName: e.target.value })}
                className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
              <input
                type="number"
                value={form.score}
                onChange={(e) => setForm({ ...form, score: Number(e.target.value) })}
                className="w-24 rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
            <button
              onClick={add}
              className="w-full rounded-full bg-brand-600 py-2.5 font-semibold text-white"
            >
              {saved ? "Tersimpan ✓" : "Tambah Nilai"}
            </button>
          </div>
        ) : (
          <div className="mt-10 rounded-2xl bg-stone-50 p-6 text-center">
            <p className="text-sm text-stone-500">Butuh data siswa & mapel.</p>
            <Link href="/app/data" className="mt-3 inline-block rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
              Kelola Data Sekolah
            </Link>
          </div>
        ))}

      <ul className="mt-4 space-y-2">
        {visibleScores.map((s) => {
          const student = (students.data ?? []).find((x) => x.id === s.studentId);
          const subject = (subjects.data ?? []).find((x) => x.id === s.subjectId);
          return (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-stone-100"
            >
              <div>
                <p className="text-sm font-medium text-stone-800">
                  {student?.name ?? "—"} · {subject?.name ?? "—"}
                </p>
                <p className="text-xs text-stone-500">{s.examName}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-brand-700">{s.score}</span>
                {role === "guru" && (
                  <button
                    onClick={() => { deleteScore(s.id!); scores.refresh(); }}
                    className="text-xs text-red-600"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </li>
          );
        })}
        {visibleScores.length === 0 && (
          <li className="rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
            {role === "orang_tua" ? "Nilai anak belum tersedia." : "Belum ada nilai."}
          </li>
        )}
      </ul>
    </div>
  );
}
