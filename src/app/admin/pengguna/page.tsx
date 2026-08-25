"use client";

import { useMemo, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  listUsers,
  deleteUser,
  listStudents,
} from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";
import { Button } from "@/components/ui/Button";
import type { AppRole, AppUser, Student } from "@/lib/types";

export default function AdminPenggunaPage() {
  const users = useCollection<AppUser>(() => listUsers());
  const students = useCollection<Student>(() => listStudents());

  const [role, setRole] = useState<AppRole>("guru");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [studentQuery, setStudentQuery] = useState("");
  const [pickedStudent, setPickedStudent] = useState<Student | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const filteredStudents = useMemo(() => {
    if (!studentQuery.trim() || pickedStudent) return [];
    const q = studentQuery.toLowerCase();
    return (students.data ?? [])
      .filter((s) => s.name.toLowerCase().includes(q) || (s.nis || "").includes(q))
      .slice(0, 6);
  }, [studentQuery, pickedStudent, students.data]);

  async function submit() {
    setMsg(null);
    if (!email || !password) {
      setMsg({ ok: false, text: "Email & password wajib diisi." });
      return;
    }
    if (role === "orang_tua" && !pickedStudent) {
      setMsg({ ok: false, text: "Pilih anak yang akan disambungkan ke orang tua." });
      return;
    }
    setBusy(true);
    try {
      const token = await getAuth().currentUser?.getIdToken();
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: role === "orang_tua" ? "" : email,
          password,
          name: name || (role === "orang_tua" ? phone : email.split("@")[0]),
          role,
          studentId: pickedStudent?.id ?? "",
          phone: role === "orang_tua" ? phone : "",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMsg({ ok: false, text: json.error || "Gagal membuat akun." });
      } else {
        setMsg({
          ok: true,
          text: `Akun ${role === "guru" ? "guru" : "orang tua"} dibuat. ${
            pickedStudent ? `Tersambung ke ${pickedStudent.name}.` : ""
          } ${role === "orang_tua" ? `Login: ${phone}` : `Login: ${email}`}`,
        });
        setEmail("");
        setPassword("");
        setName("");
        setPhone("");
        setStudentQuery("");
        setPickedStudent(null);
        users.refresh();
      }
    } catch {
      setMsg({ ok: false, text: "Terjadi kesalahan jaringan." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="font-heading text-2xl font-bold text-stone-900">Manajemen Pengguna</h1>
      <p className="mt-1 text-sm text-stone-500">
        Buat akun guru &amp; orang tua langsung dari sini. Akun login (password) dibuat
        otomatis — beritahu password ke yang bersangkutan.
      </p>

      <div className="mt-4 grid gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
        <div className="flex gap-2">
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value as AppRole);
              setPickedStudent(null);
            }}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
          >
            <option value="guru">Guru</option>
            <option value="orang_tua">Orang Tua</option>
          </select>
          <input
            placeholder="Nama lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <input
          placeholder={role === "orang_tua" ? "Nomor HP orang tua" : "Email login"}
          value={role === "orang_tua" ? phone : email}
          onChange={(e) =>
            role === "orang_tua" ? setPhone(e.target.value) : setEmail(e.target.value)
          }
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Password (min. 6 karakter)"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />

        {role === "orang_tua" && (
          <div className="relative">
            {pickedStudent ? (
              <div className="flex items-center justify-between rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-800">
                <span>
                  Anak: <b>{pickedStudent.name}</b> ({pickedStudent.nis || "—"})
                </span>
                <button
                  onClick={() => setPickedStudent(null)}
                  className="text-xs text-sky-600 underline"
                >
                  ganti
                </button>
              </div>
            ) : (
              <>
                <input
                  placeholder="Cari anak (nama / NIS) lalu pilih"
                  value={studentQuery}
                  onChange={(e) => setStudentQuery(e.target.value)}
                  className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                />
                {filteredStudents.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-stone-200 bg-white shadow">
                    {filteredStudents.map((s) => (
                      <li key={s.id}>
                        <button
                          onClick={() => {
                            setPickedStudent(s);
                            setStudentQuery("");
                          }}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-stone-50"
                        >
                          {s.name} <span className="text-stone-400">({s.nis || "—"})</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        )}

        <Button onClick={submit} disabled={busy}>
          {busy ? "Membuat…" : "Buat Akun"}
        </Button>

        {msg && (
          <p className={`text-xs ${msg.ok ? "text-emerald-700" : "text-red-600"}`}>{msg.text}</p>
        )}
      </div>

      <ul className="mt-6 space-y-2">
        {users.data?.map((u) => (
          <li
            key={u.email}
            className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-100"
          >
            <div>
              <p className="font-medium text-stone-800">{u.name}</p>
              <p className="text-xs text-stone-500">{u.phone || u.email}</p>
              {u.studentIds?.length > 0 && (
                <p className="text-xs text-sky-600">{u.studentIds.length} anak terhubung</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  u.role === "admin"
                    ? "bg-brand-100 text-brand-700"
                    : u.role === "guru"
                      ? "bg-gold-100 text-gold-600"
                      : "bg-sky-100 text-sky-700"
                }`}
              >
                {u.role}
              </span>
              {u.role !== "admin" && (
                <button
                  onClick={async () => {
                    await deleteUser(u.email);
                    users.refresh();
                  }}
                  className="text-xs text-red-600"
                >
                  Hapus
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
