"use client";

import { getSchoolProfile } from "@/lib/firestore";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import type { SchoolProfile } from "@/lib/types";

export default function ProfilView() {
  const [p, setP] = useState<SchoolProfile | null>(null);

  useEffect(() => {
    getSchoolProfile().then(setP).catch(() => setP(null));
  }, []);

  const profil: SchoolProfile = p ?? {
    name: SITE.name,
    shortName: SITE.shortName,
    tagline: SITE.tagline,
    description:
      "Sekolah Dasar Islam Terpadu yang menggabungkan kurikulum nasional dengan nilai-nilai Islam dalam kegiatan harian siswa.",
    address: SITE.address,
    email: SITE.email,
    phone: SITE.phone,
    instagram: SITE.instagram,
    instagramHandle: SITE.instagramHandle,
    maps: SITE.maps,
    ppdbYear: SITE.ppdbYear,
    visi: "Menjadi lembaga pendidikan unggulan yang mencetak generasi cerdas, berakhlak mulia, dan mandiri.",
    misi: [
      "Menanamkan nilai-nilai Islam dalam setiap aspek pembelajaran.",
      "Mengembangkan potensi akademik dan karakter siswa secara seimbang.",
      "Membangun kemitraan yang erat dengan orang tua dan masyarakat.",
    ],
    sejarah:
      "SDIT Bina Insan Mulia didirikan untuk memberikan pendidikan yang mengutamakan pembentukan karakter seiring dengan prestasi akademik.",
  };

  return (
    <div className="space-y-12">
      <section className="prose-stone max-w-none">
        <h2 className="font-heading text-2xl font-bold text-stone-900">Tentang Kami</h2>
        <p className="mt-3 leading-relaxed text-stone-600">{profil.description}</p>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-stone-900">Visi</h2>
        <p className="mt-3 rounded-2xl bg-brand-50 p-5 text-stone-700 ring-1 ring-brand-100">
          {profil.visi}
        </p>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-stone-900">Misi</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {profil.misi.map((m, i) => (
            <li
              key={i}
              className="rounded-2xl bg-white p-5 text-stone-700 shadow-sm ring-1 ring-stone-100"
            >
              {m}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-stone-900">Sejarah</h2>
        <p className="mt-3 leading-relaxed text-stone-600">{profil.sejarah}</p>
      </section>
    </div>
  );
}
