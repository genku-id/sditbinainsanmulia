import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/site/PageHeader";
import GalleryGrid from "@/components/site/GalleryGrid";

export default function GaleriPage() {
  return (
    <>
      <PageHeader
        title="Galeri"
        subtitle="Cuplikan kegiatan dan suasana belajar di sekolah kami."
      />
      <Container className="py-12">
        <GalleryGrid />
      </Container>
    </>
  );
}
