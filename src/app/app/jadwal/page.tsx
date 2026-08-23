"use client";

import { useState } from "react";
import Link from "next/link";
import {
  listSchedules,
  listSubjects,
  listClasses,
  listStudents,
  createSchedule,
} from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";
import { useAppUser } from "@/lib/useAppUser";
import type { ClassRoom, Schedule, Student, Subject } from "@/lib/types";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function JadwalPage() {
  const { profile, role } = useAppUser();
  const schedules = useCollection<Schedule>(() => listSchedules());
  const subjects = useCollection<Subject>(() => listSubjects());
  const classes = useCollection<ClassRoom>(() => listClasses());
  const students = useCollection<Student>(() => listStudents());
  const [form, setForm] = useState({ day: "Senin", time: "", subjectId: "", classId: "" });

  const subjectName = (id?: string) =>
    (subjects.data ?? []).find((s) => s.id === id)?.name ?? "—";
  const className = (id?: string) =>
    (classes.data ?? []).find((c) => c.id === id)?.name ?? "—";

  // Orang tua hanya melihat jadwal kelas anaknya.
  const childClassIds =
    role === "orang_tua"
      ? Array.from(
          new Set(
            (students.data ?? [])
              .filter((s) => profile?.studentIds?.includes(s.id!))
              .map((s) => s.classId),
          ),
        )
      : null;

  const byDay = DAYS.map((d) => ({
    day: d,
    items: (schedules.data ?? [])
      .filter((s) => s.day === d)
      .filter((s) => !childClassIds || childClassIds.includes(s.classId))
      .sort((a, b) => a.time.localeCompare(b.time)),
  })).filter((g) => g.items.length > 0);

  const ready = (subjects.data ?? []).length > 0 && (classes.data ?? []).length > 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="font-heading text-xl font-bold text-stone-900">Jadwal</h1>

      {role === "guru" &&
        (ready ? (
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
            <select
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
            >
              {DAYS.map((d) => (<option key={d}>{d}</option>))}
            </select>
            <input
              placeholder="Jam (07:00)"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
            />
            <select
              value={form.subjectId}
              onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
            >
              <option value="">Mapel</option>
              {(subjects.data ?? []).map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
            <select
              value={form.classId}
              onChange={(e) => setForm({ ...form, classId: e.target.value })}
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
            >
              <option value="">Kelas</option>
              {(classes.data ?? []).map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
            <button
              onClick={async () => {
                if (!form.time || !form.subjectId || !form.classId) return;
                await createSchedule({ ...form });
                setForm({ day: "Senin", time: "", subjectId: "", classId: "" });
                schedules.refresh();
              }}
              className="col-span-2 rounded-full bg-brand-600 py-2.5 font-semibold text-white"
            >
              Tambah Jadwal
            </button>
          </div>
        ) : (
          <div className="mt-10 rounded-2xl bg-stone-50 p-6 text-center">
            <p className="text-sm text-stone-500">Butuh data mapel & kelas.</p>
            <Link href="/app/data" className="mt-3 inline-block rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
              Kelola Data Sekolah
            </Link>
          </div>
        ))}

      <div className="mt-4 space-y-4">
        {byDay.length === 0 && (
          <p className="rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
            {role === "orang_tua" ? "Jadwal anak belum tersedia." : "Belum ada jadwal."}
          </p>
        )}
        {byDay.map((g) => (
          <div key={g.day}>
            <h2 className="mb-2 text-sm font-semibold text-brand-700">{g.day}</h2>
            <ul className="space-y-2">
              {g.items.map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-stone-100">
                  <div>
                    <p className="text-sm font-medium text-stone-800">{subjectName(s.subjectId)}</p>
                    <p className="text-xs text-stone-500">{className(s.classId)}</p>
                  </div>
                  <span className="text-sm font-semibold text-stone-600">{s.time}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
