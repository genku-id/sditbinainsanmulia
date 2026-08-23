import Link from "next/link";
import { CalendarCheck, FileText, Upload, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/site";
import PpdbOpeningsView from "@/components/site/PpdbOpeningsView";

const steps = [
  { icon: FileText, title: "Isi Data Pendaftaran", desc: "Lengkapi data calon siswa dan orang tua secara online." },
  { icon: Upload, title: "Unggah Berkas", desc: "Akte, KK, foto, dan dokumen pendukung melalui Cloudinary." },
  { icon: CalendarCheck, title: "Verifikasi", desc: "Admin sekolah meninjau dan memverifikasi berkas pendaftaran." },
  { icon: CheckCircle2, title: "Daftar Ulang", desc: "Calon siswa diterima dan resmi menjadi siswa SDIT BIM." },
];

export default function PpdbPage() {
  return (
    <>
      <PageHeader
        title="PPDB Online"
        subtitle={`Penerimaan Peserta Didik Baru Tahun Ajaran ${SITE.ppdbYear}.`}
      />
      <Container className="space-y-12 py-12">
        <section className="rounded-3xl bg-brand-50 p-8 text-center ring-1 ring-brand-100">
          <h2 className="mt-2 font-heading text-2xl font-bold text-stone-900">
            Pendaftaran Sedang Dibuka
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-600">
            Daftarkan putra-putri Anda melalui halaman pendaftaran online. Cek
            status secara mandiri kapan saja.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/ppdb/daftar">
              <Button size="lg">Daftar Sekarang</Button>
            </Link>
            <Link href="/ppdb/status">
              <Button variant="outline" size="lg">
                Cek Status
              </Button>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-stone-900">
            Gelombang Pendaftaran
          </h2>
          <div className="mt-6">
            <PpdbOpeningsView />
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-stone-900">
            Alur Pendaftaran
          </h2>
          <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="relative rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100"
              >
                <span className="absolute -top-3 left-5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <s.icon size={20} />
                </span>
                <h3 className="mt-3 font-heading font-bold text-stone-900">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm text-stone-600">{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>
      </Container>
    </>
  );
}
