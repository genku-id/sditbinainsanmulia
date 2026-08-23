import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/site/PageHeader";
import ProfilView from "@/components/site/ProfilView";

export default function ProfilPage() {
  return (
    <>
      <PageHeader
        title="Profil Sekolah"
        subtitle="Mengenal lebih dekat SDIT Bina Insan Mulia."
      />
      <Container className="py-12">
        <ProfilView />
      </Container>
    </>
  );
}
