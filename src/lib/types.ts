export interface SchoolProfile {
  id?: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  instagram: string;
  instagramHandle: string;
  maps: string;
  ppdbYear: string;
  visi: string;
  misi: string[];
  sejarah: string;
  logoUrl?: string;
}

export interface Announcement {
  id?: string;
  title: string;
  body: string;
  tag: string;
  publishedAt: string;
  coverUrl?: string;
  isPublished: boolean;
}

export interface GalleryItem {
  id?: string;
  title: string;
  imageUrl: string;
  sortOrder: number;
}

export interface PpdbOpening {
  id?: string;
  name: string;
  jalur: string;
  quota: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  notes?: string;
}

export type AppRole = "admin" | "guru" | "orang_tua";

export interface AppUser {
  uid: string;
  email: string;
  name: string;
  role: AppRole;
  studentIds: string[];
  // Nomor HP orang tua (struktur persiapan migrasi login ortu ke nomor HP).
  phone?: string;
}

export interface ClassRoom {
  id?: string;
  name: string;
}

export interface Subject {
  id?: string;
  name: string;
}

export interface Student {
  id?: string;
  nis: string;
  name: string;
  classId: string;
  parentId?: string;
}

export type AttendanceStatus = "hadir" | "izin" | "sakit" | "alpha";

export interface Attendance {
  id?: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
}

export interface Score {
  id?: string;
  studentId: string;
  subjectId: string;
  examName: string;
  score: number;
  date: string;
}

export interface Violation {
  id?: string;
  studentId: string;
  classId: string;
  date: string;
  type: string;
  note: string;
}

export type PermissionStatus = "pending" | "approved" | "rejected";

export interface Permission {
  id?: string;
  studentId: string;
  studentName: string;
  parentId?: string;
  startDate: string;
  endDate: string;
  type: "sakit" | "izin";
  reason: string;
  status: PermissionStatus;
}

export interface Schedule {
  id?: string;
  day: string;
  time: string;
  subjectId: string;
  classId: string;
}

export type PpdbStatus = "pending" | "accepted" | "rejected";

export interface PpdbRegistration {
  id?: string;
  registrationNumber: string;
  openingId: string;
  openingName: string;
  // Data calon siswa
  studentName: string;
  nisn: string;
  birthPlace: string;
  birthDate: string;
  gender: "L" | "P";
  address: string;
  // Data orang tua
  fatherName: string;
  motherName: string;
  parentPhone: string;
  parentEmail: string;
  // Berkas (URL Cloudinary)
  photoUrl?: string;
  kkUrl?: string;
  aktaUrl?: string;
  status: PpdbStatus;
  notes?: string;
  createdAt: string;
}

