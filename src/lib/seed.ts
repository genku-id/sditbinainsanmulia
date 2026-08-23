"use client";

// Seeder data demo untuk keperluan uji coba & demonstrasi.
// Menulis ke Firestore dengan akun admin yang sedang login (aturan: butuh auth).
// Aman dijalankan berulang: setiap koleksi dilewati bila sudah berisi.

import {
  createClass,
  createSubject,
  createStudent,
  createSchedule,
  createScore,
  saveAttendance,
  createAnnouncement,
  createPpdbOpening,
  createUserProfile,
  listClasses,
  listStudents,
  listSubjects,
  listScores,
  listAttendances,
  listAnnouncements,
  listPpdbOpenings,
  listUsers,
  listSchedules,
} from "./firestore";
import type { Schedule } from "./types";

// Email akun demo. Agar bisa login, buat akun Firebase Auth dengan email
// sama di console (Password: Demo#1234). Profilnya sudah disiapkan di sini.
export const DEMO_GURU_EMAIL = "guru.demo@sditbinainsanmulia.sch.id";
export const DEMO_ORTU_EMAIL = "ortu.demo@sditbinainsanmulia.sch.id";
export const DEMO_PASSWORD = "Demo#1234";

export async function seedDemoData(): Promise<void> {
  // ---------- PPDB ----------
  const openings = await listPpdbOpenings();
  if (openings.length === 0) {
    await createPpdbOpening({
      name: "PPDB 2026/2027",
      jalur: "Reguler",
      quota: 60,
      startDate: "2026-01-01",
      endDate: "2026-06-30",
      isActive: true,
      notes: "Pendaftaran peserta didik baru tahun ajaran 2026/2027.",
    });
  }

  // ---------- Kelas ----------
  const classes = await listClasses();
  let classA = classes.find((c) => c.name === "Kelas 1A")?.id;
  let classB = classes.find((c) => c.name === "Kelas 2A")?.id;
  if (!classA) classA = await createClass({ name: "Kelas 1A" });
  if (!classB) classB = await createClass({ name: "Kelas 2A" });

  // ---------- Mapel ----------
  const subjects = await listSubjects();
  const subjNames = [
    "Matematika",
    "Bahasa Indonesia",
    "Bahasa Inggris",
    "IPA",
    "Pendidikan Agama Islam",
  ];
  const subjIds: Record<string, string> = {};
  for (const n of subjNames) {
    let id = subjects.find((s) => s.name === n)?.id;
    if (!id) id = await createSubject({ name: n });
    subjIds[n] = id!;
  }

  // ---------- Siswa ----------
  const students = await listStudents();
  const demoStudents = [
    { nis: "2026001", name: "Ahmad Fauzi", classId: classA!, parent: true },
    { nis: "2026002", name: "Siti Aminah", classId: classA!, parent: true },
    { nis: "2026003", name: "Budi Santoso", classId: classA!, parent: false },
    { nis: "2026004", name: "Nur Haliza", classId: classA!, parent: false },
    { nis: "2026005", name: "Rina Oktavia", classId: classB!, parent: true },
    { nis: "2026006", name: "Dimas Pratama", classId: classB!, parent: false },
  ];
  for (const s of demoStudents) {
    if (!students.find((x) => x.nis === s.nis)) {
      await createStudent({
        nis: s.nis,
        name: s.name,
        classId: s.classId,
        parentId: s.parent ? DEMO_ORTU_EMAIL : undefined,
      });
    }
  }

  const allStudents = await listStudents();
  const ortuStudentIds = allStudents
    .filter((s) => s.parentId === DEMO_ORTU_EMAIL)
    .map((s) => s.id!);

  // ---------- Pengguna demo (guru & orang tua) ----------
  const users = await listUsers();
  if (!users.find((u) => u.email === DEMO_GURU_EMAIL)) {
    await createUserProfile({
      uid: "",
      email: DEMO_GURU_EMAIL,
      name: "Bu Guru Demo",
      role: "guru",
      studentIds: [],
    });
  }
  if (!users.find((u) => u.email === DEMO_ORTU_EMAIL)) {
    await createUserProfile({
      uid: "",
      email: DEMO_ORTU_EMAIL,
      name: "Bapak Ortu Demo",
      role: "orang_tua",
      studentIds: ortuStudentIds,
    });
  }

  // ---------- Jadwal ----------
  const schedules = await listSchedules();
  if (schedules.length === 0) {
    const base: Omit<Schedule, "id">[] = [
      { day: "Senin", time: "07:30", subjectId: subjIds["Pendidikan Agama Islam"], classId: classA! },
      { day: "Senin", time: "08:15", subjectId: subjIds["Matematika"], classId: classA! },
      { day: "Selasa", time: "07:30", subjectId: subjIds["Bahasa Indonesia"], classId: classA! },
      { day: "Rabu", time: "09:00", subjectId: subjIds["IPA"], classId: classA! },
      { day: "Senin", time: "07:30", subjectId: subjIds["Matematika"], classId: classB! },
      { day: "Selasa", time: "08:15", subjectId: subjIds["Bahasa Inggris"], classId: classB! },
      { day: "Kamis", time: "09:00", subjectId: subjIds["IPA"], classId: classB! },
    ];
    for (const s of base) await createSchedule(s);
  }

  // ---------- Nilai ----------
  const scores = await listScores();
  if (scores.length === 0) {
    const sample = allStudents.slice(0, 4);
    const mapel = ["Matematika", "Bahasa Indonesia", "IPA"];
    let i = 0;
    for (const st of sample) {
      for (const m of mapel) {
        await createScore({
          studentId: st.id!,
          subjectId: subjIds[m],
          examName: "Ulangan Harian 1",
          score: 75 + ((i * 7) % 25),
          date: "2026-02-10",
        });
        i++;
      }
    }
  }

  // ---------- Absensi ----------
  const attendances = await listAttendances();
  if (attendances.length === 0) {
    const today = new Date().toISOString().slice(0, 10);
    const statuses = ["hadir", "hadir", "hadir", "sakit", "izin"] as const;
    allStudents.forEach((st, idx) => {
      saveAttendance({
        studentId: st.id!,
        classId: st.classId,
        date: today,
        status: statuses[idx % statuses.length],
      });
    });
  }

  // ---------- Berita ----------
  const berita = await listAnnouncements();
  if (berita.length === 0) {
    const contoh = [
      {
        title: "Penerimaan Peserta Didik Baru 2026/2027",
        body: "PPDB tahun ajaran 2026/2027 telah dibuka. Pendaftaran dapat dilakukan secara online melalui menu PPDB.",
        tag: "PPDB",
      },
      {
        title: "Kegiatan Tahfidz Semester Genap",
        body: "Siswa kelas 1 dan 2 mengikuti pembiasaan tahfidz Al-Qur'an setiap pagi sebelum pembelajaran dimulai.",
        tag: "Kegiatan",
      },
      {
        title: "Libur Semester",
        body: "Sekolah akan libur semester pada akhir Juni. Kegiatan belajar dilanjutkan awal Juli.",
        tag: "Pengumuman",
      },
    ];
    for (const b of contoh) {
      await createAnnouncement({
        title: b.title,
        body: b.body,
        tag: b.tag,
        publishedAt: new Date().toISOString().slice(0, 10),
        isPublished: true,
      });
    }
  }
}
