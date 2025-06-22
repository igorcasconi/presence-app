"use client";

import { Button, Loader } from "@/components";
import { DECREASE_LIMIT_PAGE } from "@/constants";
import { getUserList } from "@/firebase/database/user";
import { UserProps } from "@/shared/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10;

const Users = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const router = useRouter();

  const loadUserList = async () => {
    try {
      const data = await getUserList(lastKey, ITEMS_PER_PAGE);

      if (data) {
        const keys = Object.keys(data);
        if (!!keys.length) {
          const lastItemKey = keys[keys.length - DECREASE_LIMIT_PAGE];

          setUsers((prevUsers) => [
            ...prevUsers,
            ...keys
              .map((user) => {
                const existUser = (prevUsers || [])?.findIndex(
                  (prevUser) => user === prevUser.uid
                );

                if (existUser === -1) return { uid: user, ...data[user] };
                else return {} as UserProps;
              })
              .filter((user) => !!user.uid),
          ]);

          setLastKey(lastItemKey);
          setHasMore(keys.length > ITEMS_PER_PAGE - DECREASE_LIMIT_PAGE);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMore(false);
      setIsLoading(false);
    }
  };

  const handleRouteUserDetails = (uid?: string) => {
    router.push(`users/${uid}`);
  };

  useEffect(() => {
    loadUserList();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full px-4 md:max-w-[500px] m-auto flex flex-col items-center">
      <div className="py-4 flex justify-center">
        <h2 className="text-white text-lg">Usuários/Alunos</h2>
      </div>
      {isLoading ? (
        <div className="items-center mt-10">
          <Loader />
        </div>
      ) : (
        <div className="w-full mb-[150px]">
          <ul>
            {users.map((item) => (
              <li
                key={item.uid}
                className="border-b-[1px] py-2 px-4 flex justify-between cursor-pointer"
                onClick={() => handleRouteUserDetails(item.uid)}
              >
                <p className="text-white text-md">{item.name}</p>
                <p
                  className={`text-md ${
                    item.isActive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {item.isActive ? "Ativo" : "Inativo"}
                </p>
              </li>
            ))}
          </ul>
          {hasMore && !isLoading && (
            <Button
              onClick={loadUserList}
              text="Carregar mais usuários"
              className="h-8 mt-4"
              loading={isLoadingMore}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
