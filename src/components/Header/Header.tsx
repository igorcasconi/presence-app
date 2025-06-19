"use client";

import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useState } from "react";
import Image from "next/image";

import { ArrowBackIcon, MenuIcon } from "../icons";
import { Menu } from "../Menu";
import { logout } from "@/firebase/auth/signin";

const notShowHeader = ["/login", "/sign-up"];
const Header = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleBackPage = () => {
    router.back();
  };

  const handleClickMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getTitlePage = () => {
    if (pathname.includes("/admin")) return "Painel Professor";
    else {
      if (pathname.includes("workout")) return "Treinos";
      if (pathname.includes("/edit-user")) return "Usuário";
      else return "Aulas da semana";
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout");
      await logout();
      setIsMenuOpen(false);
      router.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="h-full relative w-full">
      {!notShowHeader.includes(pathname) && (
        <>
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

            <p className="text-white font-medium text-lg">{getTitlePage()}</p>

            <button
              className="flex items-center absolute right-0 mr-2"
              onClick={handleClickMenu}
            >
              <Image src="/logo-menu.png" alt="logo" width={50} height={50} />
              <MenuIcon />
            </button>
          </div>
          <Menu
            handleClickMenu={handleClickMenu}
            isOpen={isMenuOpen}
            handleLogout={handleLogout}
          />
        </>
      )}
      <div className={`${isMenuOpen && `opacity-30`}`}>{children}</div>
    </div>
  );
};

export default Header;
