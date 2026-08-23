import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/site/PageHeader";
import BeritaList from "@/components/site/BeritaList";

export default function BeritaPage() {
  return (
    <>
      <PageHeader
        title="Berita & Pengumuman"
        subtitle="Informasi terbaru seputar kegiatan dan program sekolah."
      />
      <Container className="py-12">
        <BeritaList />
      </Container>
    </>
  );
}
