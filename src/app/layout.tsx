"use client";

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ToastContainer } from "react-toastify";
import Image from "next/image";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { ArrowBackIcon, Menu, MenuIcon } from "@/components";

const inter = Montserrat({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Presence App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleBackPage = () => {
    router.back();
  };

  const handleClickMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <div className="h-[100vh] relative">
            <div
              className={`h-12 w-full bg-zinc-950 shadow-xl flex justify-center items-center ${
                isMenuOpen && `opacity-30`
              }`}
            >
              {pathname !== "/" && (
                <button className="absolute left-0" onClick={handleBackPage}>
                  <ArrowBackIcon />
                </button>
              )}

              <p className="text-white font-medium text-lg">
                {pathname.includes("/admin")
                  ? "Painel Professor"
                  : "Aulas da semana"}
              </p>

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
            <Menu handleClickMenu={handleClickMenu} isOpen={isMenuOpen} />
            <div className={`h-full ${isMenuOpen && `opacity-30`}`}>
              {children}
            </div>
          </div>
          <ToastContainer position="top-center" />
        </AuthContextProvider>
      </body>
    </html>
  );
}
