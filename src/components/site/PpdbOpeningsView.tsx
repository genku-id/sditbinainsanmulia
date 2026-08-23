"use client";

import { listPpdbOpenings } from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";
import { SITE } from "@/lib/site";

export default function PpdbOpeningsView() {
  const { data, loading } = useCollection(() => listPpdbOpenings());

  if (loading && !data) {
    return <p className="text-stone-500">Memuat gelombang PPDB…</p>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl bg-stone-50 p-6 text-center text-stone-500 ring-1 ring-stone-100">
        Informasi gelombang PPDB {SITE.ppdbYear} akan segera diumumkan.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {data.map((o) => (
        <div
          key={o.id}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-100"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-stone-900">
              {o.name}
            </h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                o.isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-stone-100 text-stone-500"
              }`}
            >
              {o.isActive ? "Aktif" : "Tutup"}
            </span>
          </div>
          <p className="mt-1 text-sm text-stone-500">Jalur: {o.jalur}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-stone-400">Kuota</dt>
              <dd className="font-semibold text-stone-800">{o.quota} siswa</dd>
            </div>
            <div>
              <dt className="text-stone-400">Periode</dt>
              <dd className="font-semibold text-stone-800">
                {o.startDate} – {o.endDate}
              </dd>
            </div>
          </dl>
          {o.notes && (
            <p className="mt-3 text-sm text-stone-600">{o.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}
