"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function onLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-6">
      <Link href="/" className="text-sm font-semibold text-stone-600 hover:text-brand-700">
        &larr; Website Publik
      </Link>
      <div className="flex items-center gap-4 text-sm">
        {user?.email && (
          <span className="hidden text-stone-500 sm:block">{user.email}</span>
        )}
        <button
          onClick={onLogout}
          className="rounded-lg bg-stone-100 px-3 py-2 font-medium text-stone-700 hover:bg-stone-200"
        >
          Keluar
        </button>
      </div>
    </header>
  );
}
