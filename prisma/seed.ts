import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

async function main() {
  console.log("🌱 Seeding database...");

  // Hapus data lama
  await prisma.quizAttempt.deleteMany();
  await prisma.soalQuiz.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.tugasSubmission.deleteMany();
  await prisma.tugas.deleteMany();
  await prisma.materi.deleteMany();
  await prisma.pengumuman.deleteMany();
  await prisma.jadwal.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.mataKuliah.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Buat Admin
  await prisma.user.create({
    data: {
      email: "admin@learnmate.ac.id",
      password: hashedPassword,
      name: "Administrator Kampus",
      role: Role.ADMIN,
    },
  });

  // Buat Dosen
  const dosen1 = await prisma.user.create({
    data: {
      email: "dr.ahmad@learnmate.ac.id",
      password: hashedPassword,
      name: "Dr. Ahmad Fauzi, M.Kom",
      role: Role.DOSEN,
      nip: "198501012010011001",
    },
  });

  const dosen2 = await prisma.user.create({
    data: {
      email: "prof.siti@learnmate.ac.id",
      password: hashedPassword,
      name: "Prof. Siti Nurhaliza, Ph.D",
      role: Role.DOSEN,
      nip: "197803152005012001",
    },
  });

  // Buat Mahasiswa
  const mhs1 = await prisma.user.create({
    data: {
      email: "budi@student.learnmate.ac.id",
      password: hashedPassword,
      name: "Budi Santoso",
      role: Role.MAHASISWA,
      nim: "2024001001",
    },
  });

  const mhs2 = await prisma.user.create({
    data: {
      email: "ani@student.learnmate.ac.id",
      password: hashedPassword,
      name: "Ani Wijaya",
      role: Role.MAHASISWA,
      nim: "2024001002",
    },
  });

  // Buat Mata Kuliah
  const mk1 = await prisma.mataKuliah.create({
    data: {
      kode: "IF2101",
      nama: "Struktur Data",
      sks: 3,
      semester: 3,
      deskripsi: "Mempelajari konsep dan implementasi struktur data seperti array, linked list, stack, queue, tree, dan graph.",
      warna: "#3B82F6",
      dosenId: dosen1.id,
    },
  });

  const mk2 = await prisma.mataKuliah.create({
    data: {
      kode: "IF2201",
      nama: "Basis Data",
      sks: 3,
      semester: 3,
      deskripsi: "Mempelajari konsep basis data relasional, SQL, normalisasi, dan perancangan database.",
      warna: "#10B981",
      dosenId: dosen1.id,
    },
  });

  const mk3 = await prisma.mataKuliah.create({
    data: {
      kode: "IF2301",
      nama: "Pemrograman Web",
      sks: 3,
      semester: 4,
      deskripsi: "Mempelajari pengembangan aplikasi web menggunakan HTML, CSS, JavaScript, dan framework modern.",
      warna: "#8B5CF6",
      dosenId: dosen2.id,
    },
  });

  const mk4 = await prisma.mataKuliah.create({
    data: {
      kode: "IF2401",
      nama: "Algoritma & Pemrograman",
      sks: 4,
      semester: 2,
      deskripsi: "Mempelajari dasar-dasar algoritma, logika pemrograman, dan teknik problem solving.",
      warna: "#F59E0B",
      dosenId: dosen2.id,
    },
  });

  // Enrollment
  await prisma.enrollment.createMany({
    data: [
      { userId: mhs1.id, mataKuliahId: mk1.id },
      { userId: mhs1.id, mataKuliahId: mk2.id },
      { userId: mhs1.id, mataKuliahId: mk3.id },
      { userId: mhs1.id, mataKuliahId: mk4.id },
      { userId: mhs2.id, mataKuliahId: mk1.id },
      { userId: mhs2.id, mataKuliahId: mk2.id },
      { userId: mhs2.id, mataKuliahId: mk3.id },
    ],
  });

  // Jadwal
  await prisma.jadwal.createMany({
    data: [
      { hari: "SENIN", jamMulai: "08:00", jamSelesai: "10:30", ruangan: "Lab Komputer 1", mataKuliahId: mk1.id },
      { hari: "SELASA", jamMulai: "10:00", jamSelesai: "12:30", ruangan: "Ruang 301", mataKuliahId: mk2.id },
      { hari: "RABU", jamMulai: "13:00", jamSelesai: "15:30", ruangan: "Lab Komputer 2", mataKuliahId: mk3.id },
      { hari: "KAMIS", jamMulai: "08:00", jamSelesai: "11:00", ruangan: "Ruang 201", mataKuliahId: mk4.id },
    ],
  });

  // Materi untuk Struktur Data
  await prisma.materi.createMany({
    data: [
      { judul: "Pengenalan Struktur Data", deskripsi: "Konsep dasar struktur data dan kompleksitas algoritma", pertemuan: 1, selesai: true, mataKuliahId: mk1.id },
      { judul: "Array dan Linked List", deskripsi: "Implementasi array dan linked list dalam pemrograman", pertemuan: 2, selesai: true, mataKuliahId: mk1.id },
      { judul: "Stack dan Queue", deskripsi: "Konsep LIFO dan FIFO, implementasi stack dan queue", pertemuan: 3, selesai: true, mataKuliahId: mk1.id },
      { judul: "Tree dan Binary Search Tree", deskripsi: "Struktur data tree, BST, traversal", pertemuan: 4, selesai: false, mataKuliahId: mk1.id },
      { judul: "Graph dan Algoritma Graph", deskripsi: "Representasi graph, BFS, DFS", pertemuan: 5, selesai: false, mataKuliahId: mk1.id },
      { judul: "Sorting Algorithms", deskripsi: "Bubble sort, merge sort, quick sort", pertemuan: 6, selesai: false, mataKuliahId: mk1.id },
      { judul: "Hashing", deskripsi: "Hash table, hash function, collision handling", pertemuan: 7, selesai: false, mataKuliahId: mk1.id },
    ],
  });

  // Tugas
  const tugas1 = await prisma.tugas.create({
    data: {
      judul: "Implementasi Linked List",
      deskripsi: "Buat implementasi single linked list dengan operasi insert, delete, dan search",
      deadline: new Date("2026-10-15"),
      mataKuliahId: mk1.id,
    },
  });

  const tugas2 = await prisma.tugas.create({
    data: {
      judul: "Implementasi Stack Calculator",
      deskripsi: "Buat kalkulator menggunakan stack untuk evaluasi ekspresi matematika",
      deadline: new Date("2026-10-20"),
      mataKuliahId: mk1.id,
    },
  });

  await prisma.tugas.create({
    data: {
      judul: "Desain ERD Sistem Perpustakaan",
      deskripsi: "Rancang Entity Relationship Diagram untuk sistem perpustakaan digital",
      deadline: new Date("2026-10-18"),
      mataKuliahId: mk2.id,
    },
  });

  // Submission tugas
  await prisma.tugasSubmission.create({
    data: {
      userId: mhs1.id,
      tugasId: tugas1.id,
      catatan: "Implementasi menggunakan TypeScript",
      nilai: 85,
    },
  });

  // Quiz
  const quiz1 = await prisma.quiz.create({
    data: {
      judul: "Quiz 1: Array & Linked List",
      deskripsi: "Quiz tentang konsep array dan linked list",
      durasi: 30,
      jumlahSoal: 5,
      mataKuliahId: mk1.id,
      deadline: new Date("2026-10-10"),
    },
  });

  const quiz2 = await prisma.quiz.create({
    data: {
      judul: "Quiz 2: Stack & Queue",
      deskripsi: "Quiz tentang konsep stack dan queue",
      durasi: 25,
      jumlahSoal: 5,
      mataKuliahId: mk1.id,
      deadline: new Date("2026-10-25"),
    },
  });

  await prisma.quiz.create({
    data: {
      judul: "Quiz 1: SQL Dasar",
      deskripsi: "Quiz tentang perintah SQL dasar",
      durasi: 20,
      jumlahSoal: 5,
      mataKuliahId: mk2.id,
      deadline: new Date("2026-10-12"),
    },
  });

  // Soal Quiz
  await prisma.soalQuiz.createMany({
    data: [
      { pertanyaan: "Apa kompleksitas waktu akses elemen array berdasarkan index?", opsiA: "O(1)", opsiB: "O(n)", opsiC: "O(log n)", opsiD: "O(n²)", jawaban: "A", quizId: quiz1.id },
      { pertanyaan: "Linked list mana yang memiliki pointer ke node sebelumnya?", opsiA: "Single Linked List", opsiB: "Double Linked List", opsiC: "Circular Linked List", opsiD: "Array List", jawaban: "B", quizId: quiz1.id },
      { pertanyaan: "Operasi apa yang menambahkan elemen di akhir linked list?", opsiA: "Push", opsiB: "Pop", opsiC: "Append", opsiD: "Insert", jawaban: "C", quizId: quiz1.id },
      { pertanyaan: "Berapa kompleksitas pencarian pada linked list?", opsiA: "O(1)", opsiB: "O(log n)", opsiC: "O(n)", opsiD: "O(n²)", jawaban: "C", quizId: quiz1.id },
      { pertanyaan: "Keuntungan linked list dibanding array adalah?", opsiA: "Akses random cepat", opsiB: "Ukuran dinamis", opsiC: "Cache friendly", opsiD: "Penggunaan memori lebih sedikit", jawaban: "B", quizId: quiz1.id },
    ],
  });

  await prisma.soalQuiz.createMany({
    data: [
      { pertanyaan: "Stack menggunakan prinsip?", opsiA: "FIFO", opsiB: "LIFO", opsiC: "Random", opsiD: "Priority", jawaban: "B", quizId: quiz2.id },
      { pertanyaan: "Queue menggunakan prinsip?", opsiA: "FIFO", opsiB: "LIFO", opsiC: "Random", opsiD: "Priority", jawaban: "A", quizId: quiz2.id },
      { pertanyaan: "Operasi menambah elemen ke stack disebut?", opsiA: "Enqueue", opsiB: "Dequeue", opsiC: "Push", opsiD: "Pop", jawaban: "C", quizId: quiz2.id },
      { pertanyaan: "Operasi menghapus elemen dari queue disebut?", opsiA: "Push", opsiB: "Pop", opsiC: "Enqueue", opsiD: "Dequeue", jawaban: "D", quizId: quiz2.id },
      { pertanyaan: "Contoh penggunaan stack dalam kehidupan nyata?", opsiA: "Antrian bank", opsiB: "Tumpukan piring", opsiC: "Daftar belanja", opsiD: "Jadwal kereta", jawaban: "B", quizId: quiz2.id },
    ],
  });

  // Quiz Attempts
  await prisma.quizAttempt.create({
    data: {
      userId: mhs1.id,
      quizId: quiz1.id,
      nilai: 80,
      benar: 4,
      salah: 1,
    },
  });

  // Pengumuman
  await prisma.pengumuman.createMany({
    data: [
      { judul: "UTS Struktur Data", isi: "UTS akan dilaksanakan pada minggu ke-8. Materi mencakup pertemuan 1-7.", mataKuliahId: mk1.id },
      { judul: "Perubahan Jadwal", isi: "Perkuliahan minggu depan dipindahkan ke hari Jumat jam 10:00.", mataKuliahId: mk1.id },
      { judul: "Pengumpulan Tugas", isi: "Deadline pengumpulan tugas ERD diperpanjang hingga 20 Oktober.", mataKuliahId: mk2.id },
    ],
  });

  console.log("✅ Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
