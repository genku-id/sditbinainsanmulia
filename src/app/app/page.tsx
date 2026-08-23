"use client";

import Link from "next/link";
import {
  ClipboardList,
  CalendarDays,
  Bell,
  Database,
  GraduationCap,
} from "lucide-react";
import { useAppUser } from "@/lib/useAppUser";

export default function AppHome() {
  const { profile: prof } = useAppUser();

  const isOrtu = prof?.role === "orang_tua";

  const cards = [
    { href: "/app/absensi", label: "Absensi", icon: ClipboardList },
    { href: "/app/nilai", label: "Nilai", icon: GraduationCap },
    { href: "/app/jadwal", label: "Jadwal", icon: CalendarDays },
    { href: "/app/pelanggaran", label: "Pelanggaran", icon: Bell },
    { href: "/app/izin", label: "Izin & Sakit", icon: Bell },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="rounded-3xl bg-gradient-to-r from-brand-700 to-brand-600 p-5 text-white">
        <p className="text-sm text-brand-100">
          {isOrtu ? "Halo Orang Tua" : "Halo Guru"}
        </p>
        <p className="mt-1 font-heading text-lg font-bold">{prof?.name ?? prof?.email}</p>
      </div>

      {!isOrtu && (
        <Link
          href="/app/data"
          className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100 text-gold-600">
            <Database size={20} />
          </span>
          <span>
            <span className="block font-heading font-bold text-stone-900">Data Sekolah</span>
            <span className="block text-xs text-stone-500">Kelas, mapel, dan siswa</span>
          </span>
        </Link>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="flex flex-col items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <c.icon size={20} />
            </span>
            <span className="font-heading font-bold text-stone-900">{c.label}</span>
          </Link>
        ))}
        {isOrtu && (
          <Link
            href="/app/profil"
            className="flex flex-col items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <GraduationCap size={20} />
            </span>
            <span className="font-heading font-bold text-stone-900">Profil Anak</span>
          </Link>
        )}
      </div>
    </div>
  );
}
