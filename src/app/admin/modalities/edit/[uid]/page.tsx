"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { Input, Button } from "@/components";
import {
  createUpdateModality,
  getModalityData,
} from "@/firebase/database/modality";

import { ModalityFormProps, ModalityProps } from "@/shared/types/modality";
import { modalitySchema } from "@/schemas/modality";

const EditModality = () => {
  const router = useRouter();
  const params = useParams<{ uid: string }>();
  const [modalityDetailData, setModalityDetailData] = useState<
    ModalityProps | null | undefined
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ModalityFormProps>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(modalitySchema),
  });

  const handleEditModality = async (values: ModalityFormProps) => {
    const { error } = await createUpdateModality(params.uid, {
      name: values.name,
      isActive: modalityDetailData?.isActive,
    });

    if (!!error) {
      toast.error("Ocorreu um erro ao cadastrar a nova modalidade!");
      return;
    }

    return router.push(`/admin/modalities/${params.uid}`);
  };

  const loadModalityData = async () => {
    try {
      const modalityDatabase = await getModalityData(params.uid);
      setModalityDetailData(modalityDatabase);
      reset({ name: modalityDatabase?.name });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadModalityData();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center md:max-w-[500px] m-auto px-4">
      <h1 className="text-white text-center font-semibold mt-5 mb-10 text-[24px]">
        Editar nova modalidade
      </h1>

      <form onSubmit={handleSubmit(handleEditModality)} className="w-full">
        <div className="mb-5 w-full">
          <Input
            label="Nome da modalidade"
            placeholder="Nome da modalidade"
            register={register}
            name="name"
            error={!!errors?.name?.message}
            message={errors.name?.message}
          />
        </div>

        <Button
          text="Editar"
          type="submit"
          loading={isSubmitting}
          className="mb-10"
        />
      </form>
    </div>
  );
};

export default EditModality;
