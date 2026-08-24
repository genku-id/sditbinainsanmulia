"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  listClasses,
  createClass,
  deleteClass,
  listSubjects,
  createSubject,
  deleteSubject,
  listStudents,
  createStudent,
  deleteStudent,
} from "@/lib/firestore";
import { useCollection } from "@/lib/hooks";
import { useAppUser } from "@/lib/useAppUser";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ClassRoom, Student, Subject } from "@/lib/types";

type Tab = "kelas" | "mapel" | "siswa";

export default function DataPage() {
  const { profile, loading } = useAppUser();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("kelas");

  useEffect(() => {
    if (loading) return;
    if (!profile || (profile.role !== "guru" && profile.role !== "admin")) {
      router.replace("/app");
    }
  }, [loading, profile, router]);

  if (loading || !profile || (profile.role !== "guru" && profile.role !== "admin")) {
    return (
      <div className="flex min-h-screen items-center justify-center text-stone-500">
        Memeriksa akses…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="font-heading text-xl font-bold text-stone-900">Data Sekolah</h1>
      <p className="mt-1 text-sm text-stone-500">
        Kelola kelas, mata pelajaran, dan siswa.
      </p>

      <div className="mt-4 flex gap-2">
        {(["kelas", "mapel", "siswa"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-full py-2 text-sm font-medium capitalize",
              tab === t ? "bg-brand-600 text-white" : "bg-stone-100 text-stone-600",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "kelas" && <ClassSection />}
        {tab === "mapel" && <SubjectSection />}
        {tab === "siswa" && <StudentSection />}
      </div>
    </div>
  );
}

function ClassSection() {
  const classes = useCollection<ClassRoom>(() => listClasses());
  const [name, setName] = useState("");
  async function add() {
    if (!name.trim()) return;
    await createClass({ name: name.trim() });
    setName("");
    classes.refresh();
  }
  return (
    <Section
      title="Daftar Kelas"
      form={
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama kelas (mis. 1A)"
            className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
          <Button onClick={add}>Tambah</Button>
        </div>
      }
      items={classes.data ?? []}
      empty="Belum ada kelas."
      render={(c) => c.name}
      onDelete={async (c) => {
        await deleteClass(c.id!);
        classes.refresh();
      }}
    />
  );
}

function SubjectSection() {
  const subjects = useCollection<Subject>(() => listSubjects());
  const [name, setName] = useState("");
  async function add() {
    if (!name.trim()) return;
    await createSubject({ name: name.trim() });
    setName("");
    subjects.refresh();
  }
  return (
    <Section
      title="Daftar Mata Pelajaran"
      form={
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama mapel (mis. Matematika)"
            className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
          <Button onClick={add}>Tambah</Button>
        </div>
      }
      items={subjects.data ?? []}
      empty="Belum ada mata pelajaran."
      render={(s) => s.name}
      onDelete={async (s) => {
        await deleteSubject(s.id!);
        subjects.refresh();
      }}
    />
  );
}

function StudentSection() {
  const students = useCollection<Student>(() => listStudents());
  const classes = useCollection<ClassRoom>(() => listClasses());
  const [form, setForm] = useState({ nis: "", name: "", classId: "" });
  async function add() {
    if (!form.nis.trim() || !form.name.trim() || !form.classId) return;
    await createStudent({
      nis: form.nis.trim(),
      name: form.name.trim(),
      classId: form.classId,
    });
    setForm({ nis: "", name: "", classId: "" });
    students.refresh();
  }
  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
        <input
          value={form.nis}
          onChange={(e) => setForm({ ...form, nis: e.target.value })}
          placeholder="NIS"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nama siswa"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <select
          value={form.classId}
          onChange={(e) => setForm({ ...form, classId: e.target.value })}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        >
          <option value="">Pilih Kelas</option>
          {(classes.data ?? []).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <Button onClick={add} className="w-full">Tambah Siswa</Button>
      </div>

      <ul className="space-y-2">
        {(students.data ?? []).map((s) => {
          const cls = (classes.data ?? []).find((c) => c.id === s.classId);
          return (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-stone-100"
            >
              <div>
                <p className="text-sm font-medium text-stone-800">{s.name}</p>
                <p className="text-xs text-stone-500">NIS {s.nis} · {cls?.name ?? "—"}</p>
              </div>
              <button
                onClick={async () => { await deleteStudent(s.id!); students.refresh(); }}
                className="text-xs text-red-600"
              >
                Hapus
              </button>
            </li>
          );
        })}
        {(students.data ?? []).length === 0 && (
          <li className="rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
            Belum ada siswa.
          </li>
        )}
      </ul>
    </div>
  );
}

function Section<T extends { id?: string }>({
  title,
  form,
  items,
  empty,
  render,
  onDelete,
}: {
  title: string;
  form: React.ReactNode;
  items: T[];
  empty: string;
  render: (item: T) => string;
  onDelete: (item: T) => void | Promise<void>;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">{form}</div>
      <div>
        <h2 className="mb-2 text-sm font-semibold text-stone-600">{title}</h2>
        <ul className="space-y-2">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-stone-100"
            >
              <span className="text-sm text-stone-800">{render(it)}</span>
              <button onClick={() => onDelete(it)} className="text-xs text-red-600">
                Hapus
              </button>
            </li>
          ))}
          {items.length === 0 && (
            <li className="rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
              {empty}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
