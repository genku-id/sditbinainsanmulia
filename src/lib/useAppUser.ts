"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./auth";
import { getUserProfile } from "./firestore";
import type { AppUser } from "./types";

// Hook untuk mengambil profil aplikasi (role) user yang sedang login.
// Menggantikan pengulangan getUserProfile di banyak halaman app.
export function useAppUser() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile(null);
      setLoading(false);
      return;
    }
    // Profil di-key oleh email (lihat firestore.ts).
    getUserProfile(user.email ?? "")
      .then((p) => {
        if (active) setProfile(p);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  return { profile, role: profile?.role ?? "guru", loading };
}
