"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dasbor" },
  { href: "/admin/profil", label: "Profil Sekolah" },
  { href: "/admin/berita", label: "Berita" },
  { href: "/admin/galeri", label: "Galeri" },
  { href: "/admin/ppdb", label: "PPDB" },
  { href: "/admin/ppdb/pendaftar", label: "Pendaftar" },
  { href: "/admin/pengguna", label: "Pengguna" },
];

export default function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 gap-1 overflow-x-auto px-3 py-4 md:flex-col md:overflow-visible">
      {nav.map((n) => {
        const active =
          n.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(n.href);

        return (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-brand-700 text-white shadow-sm"
                : "text-brand-700 hover:bg-brand-100 hover:text-brand-900"
            )}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
