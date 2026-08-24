import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type {
  Announcement,
  AppUser,
  Attendance,
  ClassRoom,
  GalleryItem,
  Permission,
  PpdbOpening,
  PpdbRegistration,
  Schedule,
  Score,
  SchoolProfile,
  Student,
  Subject,
  Violation,
} from "./types";

// Mengembalikan instance Firestore atau melempar error bila belum terinisialisasi.
// Berguna agar semua fungsi di bawah hanya dipanggil dari sisi klien.
function requireDb() {
  if (!db) throw new Error("Firestore belum terinisialisasi (perlu NEXT_PUBLIC_FIREBASE_*).");
  return db;
}

// ---------- School Profile (single doc "main") ----------
export async function getSchoolProfile(): Promise<SchoolProfile | null> {
  const d = await getDoc(doc(requireDb(), "schoolProfile", "main"));
  return d.exists() ? (d.data() as SchoolProfile) : null;
}

export async function saveSchoolProfile(data: SchoolProfile): Promise<void> {
  await setDocSafe("schoolProfile", "main", data);
}

// ---------- Announcements ----------
export async function listAnnouncements(publishedOnly = false): Promise<Announcement[]> {
  const q = publishedOnly
    ? query(
        collection(requireDb(), "announcements"),
        where("isPublished", "==", true),
        orderBy("publishedAt", "desc"),
      )
    : query(collection(requireDb(), "announcements"), orderBy("publishedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Announcement) }));
}

export async function createAnnouncement(
  data: Omit<Announcement, "id">,
): Promise<string> {
  const ref = await addDoc(collection(requireDb(), "announcements"), data);
  return ref.id;
}

export async function updateAnnouncement(
  id: string,
  data: Partial<Announcement>,
): Promise<void> {
  await updateDoc(doc(requireDb(), "announcements", id), data);
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), "announcements", id));
}

// ---------- Gallery ----------
export async function listGallery(): Promise<GalleryItem[]> {
  const q = query(collection(requireDb(), "galleryItems"), orderBy("sortOrder", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as GalleryItem) }));
}

export async function createGalleryItem(
  data: Omit<GalleryItem, "id">,
): Promise<string> {
  const ref = await addDoc(collection(requireDb(), "galleryItems"), data);
  return ref.id;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), "galleryItems", id));
}

// ---------- PPDB Openings ----------
export async function listPpdbOpenings(): Promise<PpdbOpening[]> {
  const snap = await getDocs(collection(requireDb(), "ppdbOpenings"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as PpdbOpening) }));
}

export async function createPpdbOpening(
  data: Omit<PpdbOpening, "id">,
): Promise<string> {
  const ref = await addDoc(collection(requireDb(), "ppdbOpenings"), data);
  return ref.id;
}

export async function updatePpdbOpening(
  id: string,
  data: Partial<PpdbOpening>,
): Promise<void> {
  await updateDoc(doc(requireDb(), "ppdbOpenings", id), data);
}

export async function deletePpdbOpening(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), "ppdbOpenings", id));
}

// ---------- PPDB Registrations ----------
export async function createPpdbRegistration(
  data: Omit<PpdbRegistration, "id">,
): Promise<string> {
  const ref = await addDoc(collection(requireDb(), "ppdbRegistrations"), data);
  return ref.id;
}

export async function getPpdbRegistrationByNumber(
  registrationNumber: string,
): Promise<PpdbRegistration | null> {
  const q = query(
    collection(requireDb(), "ppdbRegistrations"),
    where("registrationNumber", "==", registrationNumber.trim().toUpperCase()),
  );
  const snap = await getDocs(q);
  return snap.empty ? null : (snap.docs[0].data() as PpdbRegistration);
}

export async function listPpdbRegistrations(): Promise<PpdbRegistration[]> {
  const snap = await getDocs(collection(requireDb(), "ppdbRegistrations"));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as PpdbRegistration) }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updatePpdbRegistration(
  id: string,
  data: Partial<PpdbRegistration>,
): Promise<void> {
  await updateDoc(doc(requireDb(), "ppdbRegistrations", id), data);
}

// Internal helper untuk menyimpan dokumen tunggal (pakai id tetap).
async function setDocSafe(
  col: string,
  id: string,
  data: object,
): Promise<void> {
  await setDoc(doc(requireDb(), col, id), data);
}

// ---------- App Users (role) ----------
// Dokumen users di-key oleh email (lowercase) agar admin mudah mendaftarkan
// guru & orang tua tanpa perlu tahu uid. Tidak ada lagi auto-create "guru"
// untuk sembarang akun.
const ADMIN_EMAIL = "admin@sditbinainsanmulia.sch.id";

export async function getUserProfile(email: string): Promise<AppUser | null> {
  const d = await getDoc(doc(requireDb(), "users", email.toLowerCase()));
  return d.exists() ? (d.data() as AppUser) : null;
}

// Hanya akun dengan email admin yang di-bootstrap otomatis menjadi admin
// saat pertama login. Akun lain wajib didaftarkan via Manajemen Pengguna.
export async function bootstrapAdminIfNeeded(
  email: string,
  uid: string,
): Promise<AppUser | null> {
  if (email.toLowerCase() !== ADMIN_EMAIL) return null;
  const existing = await getUserProfile(email);
  if (existing) return existing;
  const profile: AppUser = {
    uid,
    email: email.toLowerCase(),
    name: email.split("@")[0],
    role: "admin",
    studentIds: [],
  };
  await setDoc(doc(requireDb(), "users", email.toLowerCase()), profile);
  return profile;
}

export async function createUserProfile(profile: AppUser): Promise<void> {
  const id = profile.email.toLowerCase();
  await setDoc(doc(requireDb(), "users", id), { ...profile, email: id });
}

export async function listUsers(): Promise<AppUser[]> {
  const snap = await getDocs(collection(requireDb(), "users"));
  return snap.docs.map((d) => d.data() as AppUser);
}

export async function deleteUser(email: string): Promise<void> {
  await deleteDoc(doc(requireDb(), "users", email.toLowerCase()));
}

// ---------- Classes & Subjects ----------
export async function listClasses(): Promise<ClassRoom[]> {
  const snap = await getDocs(collection(requireDb(), "classes"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as ClassRoom) }));
}
export async function createClass(data: Omit<ClassRoom, "id">): Promise<string> {
  const ref = await addDoc(collection(requireDb(), "classes"), data);
  return ref.id;
}
export async function deleteClass(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), "classes", id));
}

export async function listSubjects(): Promise<Subject[]> {
  const snap = await getDocs(collection(requireDb(), "subjects"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Subject) }));
}
export async function createSubject(data: Omit<Subject, "id">): Promise<string> {
  const ref = await addDoc(collection(requireDb(), "subjects"), data);
  return ref.id;
}
export async function deleteSubject(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), "subjects", id));
}

// ---------- Students ----------
export async function listStudents(): Promise<Student[]> {
  const snap = await getDocs(collection(requireDb(), "students"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Student) }));
}
export async function createStudent(
  data: Omit<Student, "id">,
): Promise<string> {
  const ref = await addDoc(collection(requireDb(), "students"), data);
  return ref.id;
}
export async function deleteStudent(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), "students", id));
}

// Mendaftarkan calon siswa yang diterima menjadi siswa di Data Sekolah
// dan (bila ada email orang tua) membuat profil orang tua yang menautkan
// siswa tersebut, sehingga langsung muncul di aplikasi orang tua.
export async function enrollAcceptedRegistration(
  reg: PpdbRegistration,
  classId: string,
): Promise<string> {
  const studentId = await createStudent({
    nis: reg.nisn,
    name: reg.studentName,
    classId,
    parentId: reg.parentEmail || undefined,
  });

  if (reg.parentEmail) {
    const existing = await getUserProfile(reg.parentEmail);
    const studentIds = Array.from(
      new Set([...(existing?.studentIds ?? []), studentId]),
    );
    // Pertahankan role & data lain yang sudah ada; hanya tambahkan anak
    // yang terhubung agar akun (mis. guru yang juga jadi orang tua) tak
    // berubah jadi orang_tua.
    await createUserProfile({
      uid: existing?.uid ?? "",
      email: reg.parentEmail,
      name: existing?.name ?? reg.fatherName ?? reg.motherName,
      role: existing?.role ?? "orang_tua",
      studentIds,
    });
  }

  return studentId;
}

// ---------- Attendance ----------
export async function listAttendances(): Promise<Attendance[]> {
  const snap = await getDocs(collection(requireDb(), "attendances"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Attendance) }));
}
// Menyimpan/absen satu siswa untuk satu tanggal. Id dokumen memakai
// kombinasi studentId_date agar update berikutnya menimpa (upsert) bukan
// menambah baris baru.
export async function saveAttendance(data: Omit<Attendance, "id">): Promise<void> {
  const id = `${data.studentId}_${data.date}`;
  await setDoc(doc(requireDb(), "attendances", id), data);
}

// ---------- Scores ----------
export async function listScores(): Promise<Score[]> {
  const snap = await getDocs(collection(requireDb(), "scores"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Score) }));
}
export async function createScore(data: Omit<Score, "id">): Promise<string> {
  const ref = await addDoc(collection(requireDb(), "scores"), data);
  return ref.id;
}
export async function deleteScore(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), "scores", id));
}

// ---------- Violations ----------
export async function listViolations(): Promise<Violation[]> {
  const snap = await getDocs(collection(requireDb(), "violations"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Violation) }));
}
export async function createViolation(
  data: Omit<Violation, "id">,
): Promise<string> {
  const ref = await addDoc(collection(requireDb(), "violations"), data);
  return ref.id;
}
export async function deleteViolation(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), "violations", id));
}

// ---------- Permissions ----------
export async function listPermissions(): Promise<Permission[]> {
  const snap = await getDocs(collection(requireDb(), "permissions"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Permission) }));
}
export async function createPermission(
  data: Omit<Permission, "id">,
): Promise<string> {
  const ref = await addDoc(collection(requireDb(), "permissions"), data);
  return ref.id;
}
export async function updatePermission(
  id: string,
  data: Partial<Permission>,
): Promise<void> {
  await updateDoc(doc(requireDb(), "permissions", id), data);
}
export async function deletePermission(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), "permissions", id));
}

// ---------- Schedules ----------
export async function listSchedules(): Promise<Schedule[]> {
  const snap = await getDocs(collection(requireDb(), "schedules"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Schedule) }));
}
export async function createSchedule(
  data: Omit<Schedule, "id">,
): Promise<string> {
  const ref = await addDoc(collection(requireDb(), "schedules"), data);
  return ref.id;
}
