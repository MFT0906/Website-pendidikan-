import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "MAHASISWA" | "DOSEN" | "ADMIN";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "MAHASISWA" | "DOSEN" | "ADMIN";
    id: string;
  }
}
