"use client";

import { useState } from "react";
import { seedDemoData, DEMO_GURU_EMAIL, DEMO_ORTU_EMAIL, DEMO_PASSWORD } from "@/lib/seed";
import { Button } from "@/components/ui/Button";

export default function SeedPanel() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function run() {
    setBusy(true);
    try {
      await seedDemoData();
      setDone(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
      <h2 className="font-heading font-bold text-stone-900">Data Demo</h2>
      <p className="mt-1 text-sm text-stone-500">
        Isi contoh kelas, mapel, siswa, jadwal, nilai, absensi, berita, dan
        gelombang PPDB agar aplikasi siap didemokan. Aman dijalankan berulang.
      </p>
      <Button className="mt-3" size="sm" onClick={run} disabled={busy}>
        {busy ? "Mengisi…" : "Isi Data Demo"}
      </Button>

      {done && (
        <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          <p className="font-semibold">Data demo berhasil diisi.</p>
          <p className="mt-1">Akun untuk uji coba login (buat di Firebase console → Authentication, password: {DEMO_PASSWORD}):</p>
          <ul className="mt-1 list-inside list-disc">
            <li>Guru: {DEMO_GURU_EMAIL}</li>
            <li>Orang tua: {DEMO_ORTU_EMAIL}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
