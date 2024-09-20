"use client";

import { notFound } from "next/navigation";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userData } = useAuth();

  useEffect(() => {
    if (!userData) return;

    if (!userData?.isAdmin && !userData?.isTeacher) {
      notFound();
    }
  }, [userData]);

  return <div>{children}</div>;
}
