"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/galeri", label: "Galeri" },
  { href: "/berita", label: "Berita" },
  { href: "/ppdb", label: "PPDB" },
  { href: "/kontak", label: "Kontak" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={40} />
          <span className="font-heading text-base font-bold leading-tight text-stone-900">
            {SITE.shortName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/ppdb/daftar">
            <Button size="sm">Daftar PPDB</Button>
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-stone-700 hover:bg-stone-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-stone-200 bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/ppdb/daftar" className="flex-1">
                <Button size="sm" className="w-full">
                  Daftar PPDB
                </Button>
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
