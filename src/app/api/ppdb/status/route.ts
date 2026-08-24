import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

// Cek status PPDB lewat server (Admin SDK) sehingga data pendaftar tidak
// perlu dibuka untuk publik di Firestore Rules.
export async function GET(req: NextRequest) {
  const number = (req.nextUrl.searchParams.get("number") || "").trim().toUpperCase();
  if (!number) {
    return NextResponse.json({ error: "Nomor wajib" }, { status: 400 });
  }
  try {
    const snap = await getAdminDb()
      .collection("ppdbRegistrations")
      .where("registrationNumber", "==", number)
      .limit(1)
      .get();
    if (snap.empty) return NextResponse.json({ registration: null }, { status: 404 });
    return NextResponse.json({ registration: snap.docs[0].data() });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
