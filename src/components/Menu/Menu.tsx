"use client";

import Image from "next/image";
import { CloseIcon } from "../icons";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "../Button";
import { usePathname } from "next/navigation";
import MenuItem from "./MenuItem";

interface MenuProps {
  handleClickMenu: () => void;
  isOpen: boolean;
  handleLogout: () => void;
}

const Menu = ({ handleClickMenu, isOpen, handleLogout }: MenuProps) => {
  const { userData } = useAuth();
  const pathname = usePathname();

  return (
    <div
      id="menu"
      className={`flex flex-col fixed top-0 right-0 w-[70%] md:max-w-[40%] h-full bg-zinc-950 transform transition-transform duration-300 ease-in-out z-20 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }
      `}
    >
      <div className="flex justify-between items-center px-2">
        <Image src="/logo-menu.png" alt="logo" width={50} height={50} />

        <button onClick={handleClickMenu}>
          <CloseIcon />
        </button>
      </div>

      <div className="mt-2 px-4 opacity-100">
        <ul>
          <MenuItem
            text="Aulas da semana"
            href="/"
            isActive={pathname === "/"}
          />
        </ul>
        {(userData?.isAdmin || userData?.isTeacher) && (
          <>
            <p className="text-gray-500 font-medium text-md mt-4">
              Menu Professor
            </p>

            <div className="flex flex-col">
              <ul>
                <MenuItem
                  text="Aulas"
                  href="/admin/lessons"
                  isActive={pathname.includes("/admin/lessons")}
                />
                <MenuItem
                  text="Alunos/Usuários"
                  href="/admin/users"
                  isActive={pathname.includes("/admin/users")}
                />
                <MenuItem
                  text="Modalidades"
                  href="/admin/modalities"
                  isActive={pathname.includes("/admin/modalities")}
                />
              </ul>
            </div>
          </>
        )}
        <div className="opacity-100 mt-8">
          <p className="text-gray-500 font-medium text-md">
            Usuário {userData?.name}
          </p>
          <Button
            text="Sair"
            className="!bg-red-500 h-8 md:max-w-[150px]"
            textStyle="text-sm"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};

export default Menu;
