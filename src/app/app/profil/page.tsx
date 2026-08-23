"use client";

import { useAppUser } from "@/lib/useAppUser";
import { listStudents } from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";
import type { Student } from "@/lib/types";

export default function ProfilPage() {
  const { profile: prof } = useAppUser();
  const students = useCollection<Student>(() => listStudents());

  const children = (students.data ?? []).filter((s) =>
    prof?.studentIds?.includes(s.id!),
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="font-heading text-xl font-bold text-stone-900">Profil</h1>
      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
        <p className="text-sm text-stone-500">Nama</p>
        <p className="font-medium text-stone-800">{prof?.name ?? prof?.email}</p>
        <p className="mt-3 text-sm text-stone-500">Peran</p>
        <p className="font-medium text-stone-800">
          {prof?.role === "orang_tua" ? "Orang Tua" : prof?.role === "guru" ? "Guru" : "—"}
        </p>
      </div>

      {children.length > 0 && (
        <div className="mt-4">
          <h2 className="font-heading text-lg font-bold text-stone-900">Anak</h2>
          <ul className="mt-2 space-y-2">
            {children.map((c) => (
              <li key={c.id} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-stone-100">
                <p className="text-sm font-medium text-stone-800">{c.name}</p>
                <p className="text-xs text-stone-500">NIS: {c.nis}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
