"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  Bell,
  UserCircle2,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useAppUser } from "@/lib/useAppUser";
import { cn } from "@/lib/utils";

const GURU = [
  { href: "/app/absensi", label: "Absensi", icon: ClipboardList },
  { href: "/app/nilai", label: "Nilai", icon: ClipboardList },
  { href: "/app/jadwal", label: "Jadwal", icon: CalendarDays },
  { href: "/app/pelanggaran", label: "Pelanggaran", icon: Bell },
  { href: "/app/izin", label: "Izin", icon: Bell },
];

const ORTU = [
  { href: "/app/jadwal", label: "Jadwal", icon: CalendarDays },
  { href: "/app/nilai", label: "Nilai", icon: ClipboardList },
  { href: "/app/absensi", label: "Absensi", icon: ClipboardList },
  { href: "/app/izin", label: "Izin", icon: Bell },
  { href: "/app/profil", label: "Profil", icon: UserCircle2 },
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { role } = useAppUser();

  const items = role === "orang_tua" ? ORTU : GURU;

  async function onLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3">
        <span className="font-heading text-sm font-bold text-stone-800">
          Aplikasi Sekolah
        </span>
        <div className="flex items-center gap-3">
          {role === "guru" && (
            <Link href="/app/data" aria-label="Data Sekolah" className="text-stone-500 hover:text-brand-700">
              <Settings size={18} />
            </Link>
          )}
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-brand-700"
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </header>

      <main className="flex-1 pb-20">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 grid grid-cols-5 border-t border-stone-200 bg-white">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + "/");
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 text-[11px]",
                active ? "text-brand-700" : "text-stone-400",
              )}
            >
              <it.icon size={20} />
              {it.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
