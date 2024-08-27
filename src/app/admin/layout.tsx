"use client";

import { ArrowBackIcon } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userData) return;

    if (!userData?.isAdmin && !userData?.isTeacher) {
      notFound();
    }
  }, [userData]);

  return (
    <div>
      <div className="h-12 w-full bg-zinc-950 shadow-xl flex justify-center items-center relative">
        <button className="absolute left-0" onClick={() => router.back()}>
          <ArrowBackIcon />
        </button>
        <p className="text-white font-medium text-lg">Painel Professor</p>
      </div>
      {children}
    </div>
  );
}
