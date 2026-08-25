"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, bootstrapAdminIfNeeded } from "@/lib/firestore";
import { ortuEmailFromPhone } from "@/lib/phone";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/site";

export default function LoginPage() {
  const { login, logout } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const loginEmail =
        mode === "phone" ? ortuEmailFromPhone(phone) : email.toLowerCase();
      await login(loginEmail, password);
      const u = auth.currentUser;
      if (!u || !u.email) throw new Error("no-user");
      const emailLower = u.email.toLowerCase();
      let prof = await getUserProfile(emailLower);
      if (!prof) prof = await bootstrapAdminIfNeeded(emailLower, u.uid);
      if (!prof) {
        await logout();
        setError("Akun belum terdaftar. Hubungi admin sekolah.");
        router.replace("/login");
        return;
      }
      router.replace(prof.role === "admin" ? "/admin" : "/app");
    } catch {
      setError(
        mode === "phone"
          ? "Nomor HP atau kata sandi salah."
          : "Email atau kata sandi salah.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50 to-white px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-lg ring-1 ring-stone-100"
      >
        <div className="flex flex-col items-center text-center">
          <Logo size={64} />
          <h1 className="mt-4 font-heading text-xl font-bold text-stone-900">
            Masuk
          </h1>
          <p className="mt-1 text-sm text-stone-500">{SITE.name}</p>
        </div>

        <div className="mt-5 flex rounded-full bg-stone-100 p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode("email")}
            className={`flex-1 rounded-full py-1.5 font-medium ${
              mode === "email" ? "bg-white text-stone-900 shadow" : "text-stone-500"
            }`}
          >
            Guru / Admin
          </button>
          <button
            type="button"
            onClick={() => setMode("phone")}
            className={`flex-1 rounded-full py-1.5 font-medium ${
              mode === "phone" ? "bg-white text-stone-900 shadow" : "text-stone-500"
            }`}
          >
            Orang Tua
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {mode === "phone" ? (
            <input
              type="tel"
              required
              placeholder="Nomor HP (cth. 08123...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          ) : (
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          )}
          <input
            type="password"
            required
            placeholder="Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <Button type="submit" className="mt-5 w-full" disabled={busy}>
          {busy ? "Memproses…" : "Masuk"}
        </Button>
        <p className="mt-3 text-center text-xs text-stone-400">
          Orang tua login dengan nomor HP + kata sandi dari sekolah.
        </p>
      </form>
    </div>
  );
}
