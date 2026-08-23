import AppGuard from "@/components/app/AppGuard";
import AppShell from "@/components/app/AppShell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppGuard>
      <AppShell>{children}</AppShell>
    </AppGuard>
  );
}
