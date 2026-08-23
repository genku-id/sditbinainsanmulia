"use client";

import { useState } from "react";
import Link from "next/link";
import { getPpdbRegistrationByNumber } from "@/lib/firestore";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import type { PpdbRegistration, PpdbStatus } from "@/lib/types";

const STATUS_LABEL: Record<PpdbStatus, { text: string; cls: string }> = {
  pending: { text: "Menunggu Verifikasi", cls: "bg-amber-100 text-amber-700" },
  accepted: { text: "Diterima", cls: "bg-emerald-100 text-emerald-700" },
  rejected: { text: "Tidak Diterima", cls: "bg-red-100 text-red-700" },
};

export default function PpdbStatusPage() {
  const [number, setNumber] = useState("");
  const [data, setData] = useState<PpdbRegistration | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    if (!number.trim()) return;
    setBusy(true);
    setNotFound(false);
    setData(null);
    try {
      const res = await getPpdbRegistrationByNumber(number);
      if (res) setData(res);
      else setNotFound(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="Cek Status PPDB" subtitle="Masukkan nomor pendaftaran Anda." />
      <Container className="py-10">
        <form onSubmit={check} className="mx-auto max-w-md flex gap-2">
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value.toUpperCase())}
            placeholder="PPDB-2026-ABCDE"
            className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm font-mono"
          />
          <Button type="submit" disabled={busy}>
            {busy ? "…" : "Cek"}
          </Button>
        </form>

        {notFound && (
          <p className="mx-auto mt-6 max-w-md rounded-2xl bg-stone-50 p-4 text-center text-sm text-stone-500">
            Nomor pendaftaran tidak ditemukan.
          </p>
        )}

        {data && (
          <div className="mx-auto mt-6 max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-100">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-stone-500">{data.registrationNumber}</span>
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", STATUS_LABEL[data.status].cls)}>
                {STATUS_LABEL[data.status].text}
              </span>
            </div>
            <h2 className="mt-3 font-heading text-lg font-bold text-stone-900">{data.studentName}</h2>
            <p className="text-sm text-stone-500">Gelombang: {data.openingName || "—"}</p>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between"><dt className="text-stone-500">NISN</dt><dd>{data.nisn || "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-stone-500">Orang Tua</dt><dd>{data.fatherName || data.motherName || "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-stone-500">Kontak</dt><dd>{data.parentPhone || "—"}</dd></div>
            </dl>
            {data.notes && (
              <p className="mt-3 rounded-xl bg-stone-50 p-3 text-sm text-stone-600">{data.notes}</p>
            )}
          </div>
        )}

        <div className="mx-auto mt-6 max-w-md text-center">
          <Link href="/ppdb" className="text-sm font-semibold text-brand-700 hover:underline">
            ← Kembali ke PPDB
          </Link>
        </div>
      </Container>
    </>
  );
}
