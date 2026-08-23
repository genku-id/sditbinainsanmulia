"use client";

import { useEffect, useState } from "react";
import {
  listStudents,
  listPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";
import { useAppUser } from "@/lib/useAppUser";
import type { Permission, Student } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function IzinPage() {
  const { profile, role } = useAppUser();
  const students = useCollection<Student>(() => listStudents());
  const permissions = useCollection<Permission>(() => listPermissions());
  const [form, setForm] = useState({
    studentId: "",
    type: "izin" as "izin" | "sakit",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [saved, setSaved] = useState(false);

  // Orang tua hanya boleh mengajukan & melihat izin anaknya sendiri.
  const visibleIds =
    role === "orang_tua" ? (profile?.studentIds ?? []) : null;
  const visibleStudents = (students.data ?? []).filter(
    (s) => !visibleIds || visibleIds.includes(s.id!),
  );

  // Orang tua hanya punya anak sendiri; pilih otomatis anak pertama
  // agar tak perlu memilih manual (apalagi bila hanya 1 anak).
  useEffect(() => {
    if (role === "orang_tua" && !form.studentId && visibleStudents.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((f) => ({ ...f, studentId: visibleStudents[0].id! }));
    }
  }, [role, form.studentId, visibleStudents]);

  async function submit() {
    if (!form.studentId || !form.startDate || !form.endDate) return;
    const student = (students.data ?? []).find((s) => s.id === form.studentId);
    await createPermission({
      studentId: form.studentId,
      studentName: student?.name ?? "—",
      parentId: profile?.email ?? "",
      startDate: form.startDate,
      endDate: form.endDate,
      type: form.type,
      reason: form.reason.trim(),
      status: "pending",
    });
    setForm({ studentId: "", type: "izin", startDate: "", endDate: "", reason: "" });
    permissions.refresh();
    setSaved(true);
  }

  const pending = (permissions.data ?? []).filter((p) => p.status === "pending");

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="font-heading text-xl font-bold text-stone-900">Izin & Sakit</h1>

      {role === "orang_tua" && (
        visibleStudents.length === 0 ? (
          <p className="mt-6 text-center text-sm text-stone-500">
            Data anak belum tersedia.
          </p>
        ) : (
          <div className="mt-4 space-y-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
            {visibleStudents.length > 1 ? (
              <select
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              >
                {visibleStudents.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-stone-600">Anak: {visibleStudents[0]?.name}</p>
            )}
            <div className="flex gap-2">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as "izin" | "sakit" })}
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
              >
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
              </select>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
            </div>
            <textarea
              placeholder="Alasan"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              rows={2}
            />
            <button onClick={submit} className="w-full rounded-full bg-brand-600 py-2.5 font-semibold text-white">
              {saved ? "Diajukan ✓" : "Ajukan"}
            </button>
          </div>
        )
      )}

      {role === "guru" && pending.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-2 text-sm font-semibold text-amber-700">Menunggu Persetujuan</h2>
          <ul className="space-y-2">
            {pending.map((p) => (
              <li key={p.id} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-stone-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-stone-800">
                    {p.studentName} · {p.type === "sakit" ? "Sakit" : "Izin"}
                  </p>
                </div>
                <p className="text-xs text-stone-500">{p.startDate} – {p.endDate} · {p.reason}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={async () => { await updatePermission(p.id!, { status: "approved" }); permissions.refresh(); }}
                    className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white"
                  >
                    Setuju
                  </button>
                  <button
                    onClick={async () => { await updatePermission(p.id!, { status: "rejected" }); permissions.refresh(); }}
                    className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white"
                  >
                    Tolak
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="mt-4 space-y-2">
        {(permissions.data ?? [])
          .filter((p) => !visibleIds || visibleIds.includes(p.studentId))
          .map((p) => (
          <li key={p.id} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-stone-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-stone-800">
                {p.studentName} · {p.type === "sakit" ? "Sakit" : "Izin"}
              </p>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                p.status === "pending" ? "bg-amber-100 text-amber-700"
                : p.status === "approved" ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700",
              )}>
                {p.status}
              </span>
            </div>
            <p className="text-xs text-stone-500">{p.startDate} – {p.endDate} · {p.reason}</p>
            {role === "guru" && (
              <button
                onClick={async () => { await deletePermission(p.id!); permissions.refresh(); }}
                className="mt-1 text-xs text-stone-400"
              >
                Hapus
              </button>
            )}
          </li>
        ))}
        {(permissions.data ?? []).length === 0 && (
          <li className="rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
            Belum ada pengajuan izin.
          </li>
        )}
      </ul>
    </div>
  );
}
