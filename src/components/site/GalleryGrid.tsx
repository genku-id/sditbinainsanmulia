"use client";

import { listGallery } from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/types";

const FALLBACK: GalleryItem[] = [
  { id: "g1", title: "Kegiatan Belajar", imageUrl: "", sortOrder: 1 },
  { id: "g2", title: "Tahfizh", imageUrl: "", sortOrder: 2 },
  { id: "g3", title: "Outing Class", imageUrl: "", sortOrder: 3 },
  { id: "g4", title: "Upacara", imageUrl: "", sortOrder: 4 },
  { id: "g5", title: "Olahraga", imageUrl: "", sortOrder: 5 },
  { id: "g6", title: "Kesenian", imageUrl: "", sortOrder: 6 },
];

export default function GalleryGrid() {
  const { data, loading } = useCollection(() => listGallery());
  const items = (data && data.length ? data : FALLBACK).slice(0, 9);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {loading && !data
        ? FALLBACK.map((g) => <Tile key={g.id} {...g} />)
        : items.map((g) => <Tile key={g.id} {...g} />)}
    </div>
  );
}

function Tile({ title, imageUrl }: GalleryItem) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl border border-stone-200 bg-emerald-50/60">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 33vw"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-emerald-300">
          <ImageOff className="h-8 w-8" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-2 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
        {title}
      </div>
    </div>
  );
}
