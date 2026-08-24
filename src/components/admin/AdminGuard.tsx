"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppUser } from "@/lib/useAppUser";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, role, loading } = useAppUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!profile) {
      router.replace("/login");
    } else if (role !== "admin") {
      router.replace("/app");
    }
  }, [loading, profile, role, router]);

  if (loading || !profile || role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center text-stone-500">
        Memeriksa akses…
      </div>
    );
  }

  return <>{children}</>;
}
