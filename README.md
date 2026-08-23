# SDIT Bina Insan Mulia — Sekolah & PPDB

Aplikasi web sekolah dasar Islam terpadu: website publik (profil, berita, galeri,
kontak, **PPDB online**) + **PWA** untuk guru & orang tua (jadwal, nilai ulangan,
absensi, pelanggaran, izin) + panel **admin** tunggal. Semua dalam satu Next.js App.

## Tech Stack
- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Firebase** — Auth (email/kata sandi) + **Firestore** (database)
- **Cloudinary** — penyimpanan foto (galeri, berkas PPDB, foto siswa/guru)
- **YouTube** (unlisted) — video, hanya URL yang disimpan di Firestore
- **PWA** — manifest + service worker (installable, offline-shell)
- **Deploy** — GitHub Actions → **Vercel** (atau Netlify)

## Struktur
```
src/
  app/
    (public)/        # website publik: /, /profil, /galeri, /berita, /kontak, /ppdb/*
    login/           # login guru & orang tua
    app/             # PWA: dashboard guru & orang tua
    admin/           # panel admin
    manifest.ts      # PWA manifest
  components/
    ui/              # Container, Button
    site/            # Header, Footer, Logo, PageHeader
  lib/
    firebase.ts      # init Firebase (client)
    site.ts          # konstanta sekolah
    utils.ts         # cn()
legacy/              # kode lama (Laravel + Flutter) — tidak dipakai
```

## Menjalankan Lokal
```bash
cp .env.example .env.local   # isi Firebase & Cloudinary
npm install
npm run dev                  # http://localhost:3000
```

## Roadmap
- M0 ✅ Scaffold + design system + PWA + deploy skeleton
- M1 Website publik lengkap (konten dinamis dari Firestore)
- M2 Auth (Firebase) + admin shell
- M3 PPDB (form publik + review/daftar ulang)
- M4 Master data (tahun ajaran, guru, kelas, mapel, siswa, orang tua)
- M5 App: jadwal, absensi, nilai
- M6 App: pelanggaran, izin
- M7 PWA polish + offline + deploy
