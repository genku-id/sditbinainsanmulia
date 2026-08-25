"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavChild = { href: string; label: string };
type NavItem = { href: string; label: string } | { label: string; children: NavChild[] };

const nav: NavItem[] = [
  { href: "/admin", label: "Dasbor" },
  { href: "/admin/profil", label: "Profil Sekolah" },
  { href: "/admin/berita", label: "Berita" },
  { href: "/admin/galeri", label: "Galeri" },
  {
    label: "PPDB",
    children: [
      { href: "/admin/ppdb", label: "Gelombang" },
      { href: "/admin/ppdb/pendaftar", label: "Pendaftar" },
    ],
  },
  { href: "/admin/pengguna", label: "Pengguna" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export default function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {nav.map((item) => {
        if ("children" in item) {
          const groupActive = item.children.some((c) => isActive(pathname, c.href));
          return (
            <div key={item.label} className="mt-2 first:mt-0">
              <p
                className={cn(
                  "px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide",
                  groupActive ? "text-brand-700" : "text-stone-400",
                )}
              >
                {item.label}
              </p>
              <div className="flex flex-col gap-1 pl-2">
                {item.children.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className={cn(
                      "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive(pathname, c.href)
                        ? "bg-brand-700 text-white shadow-sm"
                        : "text-brand-700 hover:bg-brand-100 hover:text-brand-900",
                    )}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(pathname, item.href)
                ? "bg-brand-700 text-white shadow-sm"
                : "text-brand-700 hover:bg-brand-100 hover:text-brand-900",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
