import Link from "next/link";
import { Button } from "@/components/ui/Button";
import SeedPanel from "@/components/admin/SeedPanel";

const menu = [
  { href: "/admin/profil", label: "Profil Sekolah", desc: "Edit visi, misi, sejarah, kontak." },
  { href: "/admin/berita", label: "Berita & Pengumuman", desc: "Tambah, edit, dan hapus berita." },
  { href: "/admin/galeri", label: "Galeri", desc: "Unggah foto kegiatan via Cloudinary." },
  { href: "/admin/ppdb", label: "PPDB", desc: "Kelola gelombang pendaftaran." },
  { href: "/admin/ppdb/pendaftar", label: "Pendaftar PPDB", desc: "Verifikasi & terima/tolak calon siswa." },
  { href: "/admin/pengguna", label: "Pengguna", desc: "Daftarkan akun guru & orang tua." },
];

export default function AdminHome() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <h1 className="font-heading text-2xl font-bold text-stone-900">
        Dasbor Admin
      </h1>
      <p className="mt-2 text-stone-600">
        Kelola konten website dari satu tempat.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {menu.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100 hover:ring-brand-200"
          >
            <p className="font-heading font-bold text-stone-900">{m.label}</p>
            <p className="mt-1 text-sm text-stone-500">{m.desc}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Link href="/">
          <Button variant="outline" size="sm">
            Buka Website Publik
          </Button>
        </Link>
      </div>
      <div className="mt-6">
        <SeedPanel />
      </div>
    </div>
  );
}
