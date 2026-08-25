import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebaseAdmin";

const ADMIN_EMAIL = "admin@sditbinainsanmulia.sch.id";
const ROLES = ["admin", "guru", "orang_tua"] as const;

// Membuat akun login (Firebase Auth) sekaligus profil Firestore dan menautkan
// anak bila role orang_tua. Semua dari UI admin — tidak perlu buka console.
export async function POST(req: NextRequest) {
  try {
    const auth = getAdminAuth();
    const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let decoded;
    try {
      decoded = await auth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
    }
    const callerRole = (decoded as Record<string, unknown>).role;
    const callerEmail = (decoded.email || "").toLowerCase();
    if (callerRole !== "admin" && callerEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Hanya admin" }, { status: 403 });
    }

    const body = await req.json();
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");
    const name = String(body.name || "").trim() || email.split("@")[0];
    const role = String(body.role || "");
    const studentId = String(body.studentId || "").trim() || "";

    if (!ROLES.includes(role as (typeof ROLES)[number])) {
      return NextResponse.json({ error: "Role tidak valid" }, { status: 400 });
    }
    if (!email || !password) {
      return NextResponse.json({ error: "Email & password wajib" }, { status: 400 });
    }

    // Ambil & validasi siswa bila orang tua disambungkan ke anak.
    let student: { id: string; name: string } | null = null;
    if (role === "orang_tua" && studentId) {
      const sd = await getAdminDb().collection("students").doc(studentId).get();
      if (!sd.exists) {
        return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });
      }
      const data = sd.data() as { name?: string };
      student = { id: sd.id, name: data.name || sd.id };
    }

    // Buat akun Auth (atau pakai yang sudah ada).
    let uid: string;
    try {
      uid = (await auth.createUser({ email, password, displayName: name })).uid;
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code === "auth/email-already-exists") {
        const u = await auth.getUserByEmail(email);
        uid = u.uid;
        if (password) {
          try {
            await auth.updateUser(uid, { password });
          } catch {
            // abaikan
          }
        }
      } else {
        throw e;
      }
    }

    // Stemple custom claim role (untuk Firestore Rules RBAC).
    await auth.setCustomUserClaims(uid, { role });

    // Susun studentIds (gabung bila ortu sudah punya anak lain).
    const existingSnap = await getAdminDb().collection("users").doc(email).get();
    const existing = existingSnap.exists ? (existingSnap.data() as { studentIds?: string[]; name?: string }) : null;
    const studentIds =
      role === "orang_tua"
        ? Array.from(new Set([...(existing?.studentIds ?? []), ...(student ? [student.id] : [])]))
        : [];

    await getAdminDb()
      .collection("users")
      .doc(email)
      .set(
        {
          uid,
          email,
          name: existing?.name || name,
          role,
          studentIds,
        },
        { merge: true },
      );

    // Tautkan di dokumen siswa.
    if (student) {
      await getAdminDb().collection("students").doc(student.id).set({ parentId: email }, { merge: true });
    }

    return NextResponse.json({ ok: true, uid });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
