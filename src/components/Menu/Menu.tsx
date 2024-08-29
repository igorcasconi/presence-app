"use client";

import Image from "next/image";
import { CloseIcon } from "../icons";

interface MenuProps {
  handleClickMenu: () => void;
}

const Menu = ({ handleClickMenu }: MenuProps) => {
  return (
    <div
      id="menu"
      className={`flex flex-col absolute top-0 right-0 w-[70%] h-full bg-zinc-950 menu-transition transform translate-x-full opacity-0 z-20`}
    >
      <div className="flex justify-between items-center px-2">
        <Image src="/logo-transparent.png" alt="logo" width={50} height={50} />

        <button onClick={handleClickMenu}>
          <CloseIcon />
        </button>
      </div>

      <div className="mt-2 px-4 opacity-100">
        <p className="text-gray-500 font-medium text-md">Menu Professor</p>

        <div className="flex flex-col h-full mt-4">
          <ul>
            <li className="mt-2 text-md">
              <a href="/">Lista de presença</a>
            </li>
            <li className="mt-2 text-md">
              <a href="/admin/users">Alunos/Usuários</a>
            </li>
            <li className="mt-2 text-md">
              <a href="/admin/modalities">Modalidades</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Menu;