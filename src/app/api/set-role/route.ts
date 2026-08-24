import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebaseAdmin";

const ADMIN_EMAIL = "admin@sditbinainsanmulia.sch.id";
const ROLES = ["admin", "guru", "orang_tua"] as const;

// Memberikan custom claim `role` pada akun Firebase Auth agar Firestore
// Rules bisa menerapkan RBAC per-role. Hanya admin yang boleh memanggil.
// (Ortu akan diidentifikasi dari nomor HP di tahap migrasi berikutnya.)
export async function POST(req: NextRequest) {
  try {
    const auth = getAdminAuth();
    const header = req.headers.get("authorization") || "";
    const token = header.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let decoded;
    try {
      decoded = await auth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
    }

    const callerRole = (decoded as Record<string, unknown>).role;
    const callerEmail = (decoded.email || "").toLowerCase();
    const isAdmin =
      callerRole === "admin" || callerEmail === ADMIN_EMAIL;
    if (!isAdmin) {
      return NextResponse.json({ error: "Hanya admin" }, { status: 403 });
    }

    const body = await req.json();
    const email = String(body.email || "").toLowerCase().trim();
    const role = String(body.role || "");
    if (!ROLES.includes(role as (typeof ROLES)[number])) {
      return NextResponse.json({ error: "Role tidak valid" }, { status: 400 });
    }

    let uid: string;
    try {
      uid = (await auth.getUserByEmail(email)).uid;
    } catch {
      return NextResponse.json(
        {
          error:
            "Akun Firebase Auth untuk email ini belum ada. Buat dulu di Authentication.",
        },
        { status: 404 },
      );
    }

    await auth.setCustomUserClaims(uid, { role });

    // Jaga agar field role di dokumen users tetap sinkron (UI membaca dari sini).
    try {
      await getAdminDb().collection("users").doc(email).set({ role }, { merge: true });
    } catch {
      // Firestore bisa ditangani terpisah; claim sudah terpasang.
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json(
      { error: `${msg} (Admin SDK sudah dikonfigurasi?)` },
      { status: 500 },
    );
  }
}
