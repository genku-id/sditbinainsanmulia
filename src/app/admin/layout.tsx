import AdminGuard from "@/components/admin/AdminGuard";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebarNav from "@/components/admin/AdminSidebarNav";
import { Logo } from "@/components/site/Logo";
import { SITE } from "@/lib/site";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-stone-50 md:flex">
        <aside className="border-b border-brand-200 bg-brand-50 md:w-64 md:border-b-0 md:border-r flex flex-col">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-brand-200">
            <Logo size={32} />
            <div>
              <span className="block font-heading text-sm font-bold leading-tight text-brand-900">
                Panel Admin
              </span>
              <span className="block text-xs font-medium text-brand-700">
                {SITE.shortName}
              </span>
            </div>
          </div>
          <AdminSidebarNav />
        </aside>
        <main className="flex-1">
          <AdminHeader />
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
