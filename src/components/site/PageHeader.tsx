import { Container } from "@/components/ui/Container";

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-stone-200 bg-gradient-to-b from-brand-50 to-white">
      <Container className="py-12">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-700">
          SDIT Bina Insan Mulia
        </p>
        <h1 className="font-heading text-3xl font-bold text-stone-900 sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-stone-600">{subtitle}</p>
        )}
      </Container>
    </section>
  );
}
