"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  listStudents,
  listClasses,
  listAttendances,
  saveAttendance,
} from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";
import { useAppUser } from "@/lib/useAppUser";
import type { AttendanceStatus, ClassRoom, Student } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS: { key: AttendanceStatus; label: string; cls: string }[] = [
  { key: "hadir", label: "Hadir", cls: "bg-emerald-100 text-emerald-700" },
  { key: "izin", label: "Izin", cls: "bg-sky-100 text-sky-700" },
  { key: "sakit", label: "Sakit", cls: "bg-amber-100 text-amber-700" },
  { key: "alpha", label: "Alpha", cls: "bg-red-100 text-red-700" },
];

export default function AbsensiPage() {
  const { profile, role } = useAppUser();
  const classes = useCollection<ClassRoom>(() => listClasses());
  const students = useCollection<Student>(() => listStudents());
  const attendances = useCollection(() => listAttendances());
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [state, setState] = useState<Record<string, AttendanceStatus>>({});
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const isParent = role === "orang_tua";

  const children = useMemo(
    () =>
      isParent
        ? (students.data ?? []).filter((s) => profile?.studentIds?.includes(s.id!))
        : (students.data ?? []),
    [students.data, isParent, profile],
  );

  const list = useMemo(
    () => children.filter((s) => !classId || s.classId === classId),
    [children, classId],
  );

  const statusMap = useMemo(() => {
    const map: Record<string, AttendanceStatus> = {};
    for (const a of attendances.data ?? []) {
      if (a.date === date) map[a.studentId] = a.status;
    }
    return map;
  }, [attendances.data, date]);

  useEffect(() => {
    if (isParent) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(statusMap);
    setSaved(false);
  }, [statusMap, isParent]);

  function set(sid: string, st: AttendanceStatus) {
    setState((s) => ({ ...s, [sid]: st }));
    setSaved(false);
  }

  async function save() {
    setBusy(true);
    try {
      for (const s of list) {
        await saveAttendance({
          studentId: s.id!,
          classId: s.classId,
          date,
          status: state[s.id!] ?? "hadir",
        });
      }
      attendances.refresh();
      setSaved(true);
    } finally {
      setBusy(false);
    }
  }

  // Tampilan orang tua: baca saja untuk anaknya.
  if (isParent) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="font-heading text-xl font-bold text-stone-900">Absensi</h1>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-4 rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        {children.length === 0 ? (
          <p className="mt-6 text-center text-sm text-stone-500">Data anak belum tersedia.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {children.map((s) => {
              const st = statusMap[s.id!];
              return (
                <li key={s.id} className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-stone-100">
                  <span className="text-sm text-stone-800">{s.name}</span>
                  <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", st ? STATUS.find((x) => x.key === st)!.cls : "bg-stone-100 text-stone-400")}>
                    {st ? STATUS.find((x) => x.key === st)!.label : "—"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="font-heading text-xl font-bold text-stone-900">Absensi</h1>

      {(classes.data ?? []).length === 0 ? (
        <EmptyState href="/app/data" label="Tambah kelas & siswa dulu" />
      ) : (
        <>
          <div className="mt-4 flex gap-2">
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
            >
              <option value="">Pilih Kelas</option>
              {(classes.data ?? []).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
            />
          </div>

          {classId === "" ? (
            <p className="mt-6 text-center text-sm text-stone-500">
              Pilih kelas untuk mulai absen.
            </p>
          ) : (
            <>
              <ul className="mt-4 space-y-2">
                {list.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-stone-100"
                  >
                    <span className="text-sm text-stone-800">{s.name}</span>
                    <div className="flex gap-1">
                      {STATUS.map((st) => (
                        <button
                          key={st.key}
                          onClick={() => set(s.id!, st.key)}
                          className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-medium",
                            state[s.id!] === st.key
                              ? cn(st.cls, "ring-2 ring-brand-500")
                              : "bg-stone-100 text-stone-500",
                          )}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="fixed inset-x-0 bottom-16 z-10 px-4">
                <button
                  onClick={save}
                  disabled={busy}
                  className="mx-auto block w-full max-w-2xl rounded-full bg-brand-600 py-3 font-semibold text-white disabled:opacity-60"
                >
                  {busy ? "Menyimpan…" : saved ? "Tersimpan ✓" : "Simpan Absensi"}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-10 rounded-2xl bg-stone-50 p-6 text-center">
      <p className="text-sm text-stone-500">Belum ada data kelas/siswa.</p>
      <Link href={href} className="mt-3 inline-block rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
        {label}
      </Link>
    </div>
  );
}
