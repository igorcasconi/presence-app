"use client";

import Image from "next/image";
import { CloseIcon } from "../icons";
import { useAuth } from "@/contexts/AuthContext";

interface MenuProps {
  handleClickMenu: () => void;
  isOpen: boolean;
}

const Menu = ({ handleClickMenu, isOpen }: MenuProps) => {
  const { userData } = useAuth();
  return (
    <div
      id="menu"
      className={`flex flex-col fixed top-0 right-0 w-[70%] md:max-w-[40%] h-full bg-zinc-950 transform transition-transform duration-300 ease-in-out z-20 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }
      `}
    >
      <div className="flex justify-between items-center px-2">
        <Image src="/logo-transparent.png" alt="logo" width={50} height={50} />

        <button onClick={handleClickMenu}>
          <CloseIcon />
        </button>
      </div>

      <div className="mt-2 px-4 opacity-100">
        <ul>
          <li className="mt-2 mb-4 text-md">
            <a href="/">Aulas da semana</a>
          </li>
        </ul>
        {(userData?.isAdmin || userData?.isTeacher) && (
          <>
            <p className="text-gray-500 font-medium text-md">Menu Professor</p>

            <div className="flex flex-col h-full">
              <ul>
                <li className="mt-2 text-md">
                  <a href="/admin/lessons">Aulas</a>
                </li>
                <li className="mt-2 text-md">
                  <a href="/admin/users">Alunos/Usuários</a>
                </li>
                <li className="mt-2 text-md">
                  <a href="/admin/modalities">Modalidades</a>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
