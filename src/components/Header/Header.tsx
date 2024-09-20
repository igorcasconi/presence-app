"use client";

import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useState } from "react";
import Image from "next/image";

import { ArrowBackIcon, MenuIcon } from "../icons";
import { Menu } from "../Menu";

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

  return (
    <div className="h-[100vh] relative">
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
        </>
      )}
      <div className={`h-full ${isMenuOpen && `opacity-30`}`}>{children}</div>
    </div>
  );
};

export default Header;
