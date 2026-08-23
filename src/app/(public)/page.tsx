import Link from "next/link";
import {
  BookOpen,
  Users,
  HeartHandshake,
  Smartphone,
  MapPin,
  Share2,
  CalendarCheck,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/site/Logo";
import { SITE } from "@/lib/site";
import BeritaList from "@/components/site/BeritaList";

const keunggulan = [
  {
    icon: BookOpen,
    title: "Kurikulum Islam Terpadu",
    desc: "Perpaduan kurikulum nasional dan nilai Islam dalam kegiatan harian siswa.",
  },
  {
    icon: Users,
    title: "Guru yang Peduli",
    desc: "Pendidik profesional yang mengutamakan akhlak dan perkembangan tiap anak.",
  },
  {
    icon: HeartHandshake,
    title: "Kemitraan Orang Tua",
    desc: "Aplikasi khusus agar orang tua selalu terhubung dengan progres anak.",
  },
  {
    icon: Smartphone,
    title: "PPDB & Layanan Online",
    desc: "Pendaftaran hingga informasi nilai dan izin dapat diakses dari gawai.",
  },
];

const program = [
  { title: "Tahfidz & Tahsin", desc: "Pembiasaan membaca dan menghafal Al-Qur'an sejak dini." },
  { title: "Akademik Berbasis Karakter", desc: "Literasi, numerasi, dan sains dengan pendekatan menyenangkan." },
  { title: "Bahasa Arab & Inggris", desc: "Pengenalan bahasa asing sebagai bekal komunikasi global." },
  { title: "Ekstrakurikuler", desc: "Pramuka, seni, olahraga, dan kegiatan kepemimpinan siswa." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl"
        />
        <Container className="grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100">
              <Sparkles size={14} /> PPDB {SITE.ppdbYear} Dibuka
            </span>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-stone-900 sm:text-5xl">
              {SITE.name}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-stone-600">
              {SITE.tagline}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/ppdb/daftar">
                <Button size="lg">
                  Daftar PPDB <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/profil">
                <Button variant="outline" size="lg">
                  Kenali Sekolah
                </Button>
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                { k: "Siswa", v: "200+" },
                { k: "Guru", v: "20+" },
                { k: "Tahun", v: "2015" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
                  <dt className="text-2xl font-bold text-brand-700">{s.v}</dt>
                  <dd className="text-xs text-stone-500">{s.k}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-900/5 ring-1 ring-stone-100">
              <div className="flex items-center gap-4">
                <Logo size={72} />
                <div>
                  <p className="font-heading text-xl font-bold text-stone-900">
                    {SITE.name}
                  </p>
                  <p className="text-sm text-stone-500">Kulon Progo, DIY</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-brand-50 p-3">
                  <p className="font-semibold text-brand-700">Islam Terpadu</p>
                  <p className="text-stone-500">Kurikulum unggulan</p>
                </div>
                <div className="rounded-xl bg-gold-50 p-3">
                  <p className="font-semibold text-gold-600">Akhlak Mulia</p>
                  <p className="text-stone-500">Fokus karakter</p>
                </div>
              </div>
              <Link
                href="/ppdb"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700"
              >
                <CalendarCheck size={18} /> Cek Gelombang PPDB
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Keunggulan */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-stone-900">
              Mengapa Memilih Kami
            </h2>
            <p className="mt-3 text-stone-600">
              Kami menyiapkan lingkungan yang mendidik secara intelektual dan
              spiritual.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {keunggulan.map((k) => (
              <div
                key={k.title}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-100 transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <k.icon size={22} />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-stone-900">
                  {k.title}
                </h3>
                <p className="mt-2 text-sm text-stone-600">{k.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Program */}
      <section className="bg-stone-50 py-16">
        <Container className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-heading text-3xl font-bold text-stone-900">
              Program Unggulan
            </h2>
            <p className="mt-3 max-w-md text-stone-600">
              Pembelajaran dirancang utuh agar anak tumbuh cerdas, mandiri, dan
              berakhlak.
            </p>
            <Link href="/profil" className="mt-6 inline-block">
              <Button variant="outline">Pelajari Profil Sekolah</Button>
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {program.map((p) => (
              <li
                key={p.title}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100"
              >
                <h3 className="font-heading font-bold text-stone-900">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-stone-600">{p.desc}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* PPDB CTA */}
      <section className="py-16">
        <Container>
          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 to-brand-600 px-8 py-12 text-center text-white shadow-lg">
            <GraduationCap className="mx-auto" size={36} />
            <h2 className="mt-4 font-heading text-3xl font-bold">
              Siapkan Masa Depan Putra-Putri Anda
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-50">
              Pendaftaran peserta didik baru {SITE.ppdbYear} telah dibuka.
              Daftar sekarang secara online.
            </p>
            <div className="mt-7 flex justify-center gap-3">
              <Link href="/ppdb/daftar">
                <Button size="lg" variant="secondary">
                  Daftar Sekarang
                </Button>
              </Link>
              <Link href="/ppdb">
                <Button
                  size="lg"
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  Info PPDB
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Berita */}
      <section className="bg-stone-50 py-16">
        <Container>
          <div className="flex items-end justify-between">
            <h2 className="font-heading text-3xl font-bold text-stone-900">
              Berita & Pengumuman
            </h2>
            <Link
              href="/berita"
              className="text-sm font-semibold text-brand-700 hover:underline"
            >
              Lihat semua
            </Link>
          </div>
          <div className="mt-8">
            <BeritaList limit={3} />
          </div>
        </Container>
      </section>

      {/* Maps + IG */}
      <section className="py-16">
        <Container className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold text-stone-900">
              Kunjungi Kami
            </h2>
            <p className="mt-3 text-stone-600">{SITE.address}</p>
            <div className="mt-5 flex flex-col gap-3">
              <a
                href={SITE.maps}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-brand-700 hover:underline"
              >
                <MapPin size={18} /> Buka di Google Maps
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-brand-700 hover:underline"
              >
                <Share2 size={18} /> {SITE.instagramHandle}
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl ring-1 ring-stone-100">
            <iframe
              title="Lokasi SDIT Bina Insan Mulia"
              src="https://www.google.com/maps?q=SDIT+Bina+Insan+Mulia+Kulon+Progo&output=embed"
              className="h-72 w-full border-0"
              loading="lazy"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
