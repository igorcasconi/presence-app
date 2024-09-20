"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Loader, PencilIcon, Switch } from "@/components";
import {
  createUpdateModality,
  getModalityData,
} from "@/firebase/database/modality";

import { ModalityProps } from "@/shared/types/modality";

const UserDetails = () => {
  const [modalityDetailData, setModalityDetailData] = useState<
    ModalityProps | null | undefined
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ uid: string }>();
  const router = useRouter();

  const loadModalityData = async () => {
    try {
      const modalityDatabase = await getModalityData(params.uid);
      setModalityDetailData(modalityDatabase);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActiveModality = async (
    value: boolean | string,
    key: keyof ModalityProps
  ) => {
    setModalityDetailData({
      ...modalityDetailData,
      [key]: value,
    } as ModalityProps);
    await createUpdateModality(params.uid, {
      ...modalityDetailData,
      [key]: value,
    } as ModalityProps);
  };

  const handleEditUser = () => {
    router.push(`edit/${params?.uid}`);
  };

  useEffect(() => {
    loadModalityData();
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
            <h2 className="text-gray-300 text-md">Nome da modalidade</h2>
          </div>
          <div className="w-full mb-4 flex items-center">
            <h3 className="text-white text-xl mr-2">
              {modalityDetailData?.name}
            </h3>
            <button onClick={handleEditUser}>
              <PencilIcon />
            </button>
          </div>

          <div className="w-full mb-2 flex">
            <Switch
              checked={modalityDetailData?.isActive!}
              onChange={(event) =>
                handleActiveModality(event.target.checked, "isActive")
              }
            />
            <p className="text-gray-500 text-md ml-2">Modalidade está ativo?</p>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDetails;
