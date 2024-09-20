"use client";

import { Loader, Switch } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { getUserData, updateUser } from "@/firebase/database/user";
import { UserProps } from "@/shared/types/user";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const UserDetails = () => {
  const [userDetailData, setUserDetailData] = useState<
    UserProps | null | undefined
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ uid: string }>();
  const { userData } = useAuth();

  const loadUserData = async () => {
    try {
      const userDatabase = await getUserData(params.uid);
      setUserDetailData(userDatabase);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (
    value: boolean | string,
    key: keyof UserProps
  ) => {
    setUserDetailData({ ...userDetailData, [key]: value } as UserProps);
    await updateUser(params.uid, {
      ...userDetailData,
      [key]: value,
    } as UserProps);
  };

  useEffect(() => {
    loadUserData();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full p-4 md:max-w-[500px] m-auto flex flex-col items-center">
      {isLoading ? (
        <div className="justify-center mt-[50%]">
          <Loader />
        </div>
      ) : (
        <>
          <div className="w-full mb-[-2px] justify-center">
            <h2 className="text-gray-300 text-md">Aluno/Usuário</h2>
          </div>
          <div className="w-full mb-4">
            <h3 className="text-white text-xl">{userDetailData?.name}</h3>
          </div>

          <div className="w-full mb-2 flex">
            <Switch
              checked={userDetailData?.isActive!}
              onChange={(event) =>
                handleUpdateUser(event.target.checked, "isActive")
              }
            />
            <p className="text-gray-500 text-md ml-2">Cadastro está ativo?</p>
          </div>

          {userData?.isAdmin && (
            <div className="w-full mb-2 flex">
              <Switch
                checked={userDetailData?.isAdmin!}
                onChange={(event) =>
                  handleUpdateUser(event.target.checked, "isAdmin")
                }
              />
              <p className="text-gray-500 text-md ml-2">Administrador</p>
            </div>
          )}

          <div className="w-full mb-2 flex">
            <Switch
              checked={userDetailData?.isStudent!}
              onChange={(event) =>
                handleUpdateUser(event.target.checked, "isStudent")
              }
            />
            <p className="text-gray-500 text-md ml-2">Aluno</p>
          </div>

          <div className="w-full mb-2 flex">
            <Switch
              checked={userDetailData?.isTeacher!}
              onChange={(event) =>
                handleUpdateUser(event.target.checked, "isTeacher")
              }
            />
            <p className="text-gray-500 text-md ml-2">Professor</p>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDetails;
