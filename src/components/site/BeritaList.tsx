"use client";

import { listAnnouncements } from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";
import { CalendarDays, Newspaper } from "lucide-react";
import Image from "next/image";
import type { Announcement } from "@/lib/types";

const FALLBACK: Announcement[] = [
  {
    id: "f1",
    title: "Penerimaan Peserta Didik Baru 2026/2027",
    body: "Pendaftaran dibuka untuk jenjang SDIT. Kuota terbatas, silakan daftar melalui menu PPDB.",
    tag: "PPDB",
    publishedAt: new Date().toISOString(),
    isPublished: true,
  },
  {
    id: "f2",
    title: "Kegiatan Tahfizh & Character Building",
    body: "Siswa dibimbing menghafal Al-Qur'an serta membangun karakter islami setiap hari.",
    tag: "Kegiatan",
    publishedAt: new Date().toISOString(),
    isPublished: true,
  },
];

export default function BeritaList({ limit }: { limit?: number }) {
  const { data, loading } = useCollection(() => listAnnouncements(true));
  const items = (data && data.length ? data : FALLBACK).slice(0, limit ?? 6);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {loading && !data
        ? FALLBACK.slice(0, limit ?? 3).map((b) => <BeritaCard key={b.id} {...b} />)
        : items.map((b) => <BeritaCard key={b.id} {...b} />)}
    </div>
  );
}

function BeritaCard({
  title,
  body,
  tag,
  publishedAt,
  coverUrl,
}: Announcement) {
  return (
    <article className="group rounded-2xl border border-stone-200 bg-white/70 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-40 overflow-hidden rounded-t-2xl bg-emerald-50">
        {coverUrl ? (
          <Image src={coverUrl} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="flex h-full items-center justify-center text-emerald-300">
            <Newspaper className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-emerald-700">
          <span className="rounded-full bg-emerald-100 px-2 py-1">{tag}</span>
          <span className="flex items-center gap-1 text-stone-500">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(publishedAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <h3 className="font-serif text-lg font-semibold text-stone-800">{title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-stone-600">{body}</p>
      </div>
    </article>
  );
}
