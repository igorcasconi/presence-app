"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ArrowBackIcon, Menu, MenuIcon } from "@/components";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userData } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleBackPage = () => {
    router.back();
  };

  const handleClickMenu = () => {
    const menu = document.getElementById("menu");
    menu?.classList.toggle("translate-x-full");
    menu?.classList.toggle("translate-x-0");
    menu?.classList.toggle("opacity-0");
    menu?.classList.toggle("opacity-100");
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (!userData) return;

    if (!userData?.isAdmin && !userData?.isTeacher) {
      notFound();
    }
  }, [userData]);

  return (
    <div className="h-[100vh] relative">
      <div
        className={`h-12 w-full bg-zinc-950 shadow-xl flex justify-center items-center ${
          isMenuOpen && `opacity-30`
        }`}
      >
        <button className="absolute left-0" onClick={handleBackPage}>
          <ArrowBackIcon />
        </button>
        <p className="text-white font-medium text-lg">Painel Professor</p>
        <button
          className="flex items-center absolute right-0 mr-2"
          onClick={handleClickMenu}
        >
          <Image
            src="/logo-transparent.png"
            alt="logo"
            width={50}
            height={50}
          />
          <MenuIcon />
        </button>
      </div>
      <Menu handleClickMenu={handleClickMenu} />
      <div className={`h-full ${isMenuOpen && `opacity-30 `}`}>{children}</div>
    </div>
  );
}
