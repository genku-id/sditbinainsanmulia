import { MapPin, Share2, Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { SITE } from "@/lib/site";

export default function KontakPage() {
  return (
    <>
      <PageHeader
        title="Kontak"
        subtitle="Hubungi kami untuk pertanyaan seputar pendaftaran dan sekolah."
      />
      <Container className="grid gap-8 py-12 md:grid-cols-2">
        <div className="space-y-4">
          {[
            { icon: MapPin, label: "Alamat", value: SITE.address },
            { icon: Share2, label: "Instagram", value: SITE.instagramHandle, href: SITE.instagram },
            { icon: Mail, label: "Email", value: SITE.email || "info@sditbim.sch.id" },
            { icon: Phone, label: "Telepon", value: SITE.phone || "(0274) 000-000" },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href ?? undefined}
              target={c.href ? "_blank" : undefined}
              rel="noreferrer"
              className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 hover:ring-brand-200"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <c.icon size={20} />
              </span>
              <span>
                <span className="block text-xs text-stone-500">{c.label}</span>
                <span className="font-medium text-stone-800">{c.value}</span>
              </span>
            </a>
          ))}
        </div>
        <div className="overflow-hidden rounded-2xl ring-1 ring-stone-100">
          <iframe
            title="Lokasi SDIT Bina Insan Mulia"
            src="https://www.google.com/maps?q=SDIT+Bina+Insan+Mulia+Kulon+Progo&output=embed"
            className="h-80 w-full border-0"
            loading="lazy"
          />
        </div>
      </Container>
    </>
  );
}
