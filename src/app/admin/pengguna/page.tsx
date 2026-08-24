"use client";

import { useState } from "react";
import { getAuth } from "firebase/auth";
import {
  listUsers,
  createUserProfile,
  deleteUser,
} from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";
import { Button } from "@/components/ui/Button";
import type { AppRole, AppUser } from "@/lib/types";

export default function AdminPenggunaPage() {
  const users = useCollection<AppUser>(() => listUsers());
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<AppRole>("guru");
  const [note, setNote] = useState("");

  async function add() {
    if (!email) return;
    await createUserProfile({
      uid: "",
      email,
      name: name || email.split("@")[0],
      role,
      studentIds: [],
    });
    // Stemple custom claim `role` agar Firestore Rules bisa menerapkan RBAC.
    try {
      const token = await getAuth().currentUser?.getIdToken();
      if (token) {
        const r = await fetch("/api/set-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, role }),
        });
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          setNote(j.error || "Gagal menstempel role (claim).");
        } else {
          setNote("");
        }
      }
    } catch {
      setNote("Gagal menstempel role (claim).");
    }
    setEmail("");
    setName("");
    users.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="font-heading text-2xl font-bold text-stone-900">
        Manajemen Pengguna
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Daftarkan akun guru &amp; orang tua (email harus sama dengan akun login
        Firebase mereka).
      </p>

      <div className="mt-4 grid gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 sm:grid-cols-4">
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm sm:col-span-2"
        />
        <input
          placeholder="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as AppRole)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
        >
          <option value="guru">Guru</option>
          <option value="orang_tua">Orang Tua</option>
        </select>
        <Button onClick={add} className="sm:col-span-4">
          Tambah Pengguna
        </Button>
      </div>

      {note && (
        <p className="mt-2 text-xs text-amber-700">{note}</p>
      )}
      <p className="mt-2 text-xs text-stone-400">
        Akun harus sudah dibuat di Firebase Authentication (email sama). Role
        akan distempel otomatis ke token untuk pengamanan rules.
      </p>

      <ul className="mt-6 space-y-2">
        {users.data?.map((u) => (
          <li
            key={u.email}
            className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-100"
          >
            <div>
              <p className="font-medium text-stone-800">{u.name}</p>
              <p className="text-xs text-stone-500">{u.email}</p>
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
                  onClick={() => {
                    deleteUser(u.email);
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
