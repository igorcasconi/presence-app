"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button, Loader } from "@/components";
import { getModalityList } from "@/firebase/database/modality";

import { UserProps } from "@/shared/types/user";
import { DECREASE_LIMIT_PAGE } from "@/constants";

const ITEMS_PER_PAGE = 10;

const Modalities = () => {
  const [modalities, setModalities] = useState<UserProps[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const router = useRouter();

  const loadModalities = async () => {
    try {
      const data = await getModalityList(lastKey, ITEMS_PER_PAGE);

      if (data) {
        const keys = Object.keys(data);
        if (!!keys.length) {
          const lastItemKey = keys[keys.length - DECREASE_LIMIT_PAGE];

          setModalities((prevModalities) => [
            ...prevModalities,
            ...keys
              .map((modality) => {
                const existModality = (prevModalities || [])?.findIndex(
                  (prevModalities) => modality === prevModalities.uid
                );

                if (existModality === -1)
                  return { uid: modality, ...data[modality] };
                else return {} as UserProps;
              })
              .filter((modality) => !!modality.uid),
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
    router.push(`modalities/${uid}`);
  };

  const handleRouteCreateModality = () => {
    router.push("modalities/create");
  };

  useEffect(() => {
    loadModalities();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full px-4 md:max-w-[500px] m-auto flex flex-col items-center">
      <div className="w-full py-4 flex flex-col justify-center items-center">
        <h2 className="text-white text-lg">Modalidades</h2>
        <Button
          text="Adicionar"
          className="mt-2 h-8"
          textStyle="text-xs"
          onClick={handleRouteCreateModality}
        />
      </div>
      {isLoading ? (
        <div className="items-center mt-10">
          <Loader />
        </div>
      ) : (
        <div className="w-full">
          <ul>
            {modalities.map((item) => (
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
              onClick={loadModalities}
              text="Carregar mais modalidades..."
              className="h-8 mt-4"
              loading={isLoadingMore}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Modalities;
