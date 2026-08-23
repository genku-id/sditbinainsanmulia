import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/site/Logo";
import { SITE } from "@/lib/site";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/galeri", label: "Galeri" },
  { href: "/berita", label: "Berita" },
  { href: "/ppdb", label: "PPDB" },
  { href: "/kontak", label: "Kontak" },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-white">
      <Container className="grid gap-10 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={44} />
            <div>
              <p className="font-heading text-lg font-bold text-stone-900">
                {SITE.name}
              </p>
              <p className="text-xs text-stone-500">Kulon Progo, DIY</p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm text-stone-600">
            {SITE.tagline}.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-stone-900">
            Tautan
          </h4>
          <ul className="space-y-2 text-sm text-stone-600">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brand-700">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-stone-900">
            Hubungi Kami
          </h4>
          <ul className="space-y-2 text-sm text-stone-600">
            <li>{SITE.address}</li>
            <li>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-700"
              >
                {SITE.instagramHandle}
              </a>
            </li>
            <li>
              <a
                href={SITE.maps}
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-700"
              >
                Lihat di Google Maps
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-stone-100 py-5 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} {SITE.name}. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
