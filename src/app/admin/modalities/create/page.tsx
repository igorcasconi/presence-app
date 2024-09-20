"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { Input, Button } from "@/components";
import { createUpdateModality } from "@/firebase/database/modality";

import { ModalityFormProps } from "@/shared/types/modality";
import { modalitySchema } from "@/schemas/modality";

const CreateModality = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ModalityFormProps>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(modalitySchema),
  });

  const handleCreateModality = async (values: ModalityFormProps) => {
    const uid = uuidv4();
    const { error } = await createUpdateModality(uid, {
      name: values.name,
      isActive: true,
    });

    if (!!error) {
      toast.error("Ocorreu um erro ao cadastrar a nova modalidade!");
      return;
    }

    return router.push("/admin/modalities");
  };

  return (
    <div className="w-full h-full flex flex-col items-center md:max-w-[500px] m-auto px-4">
      <h1 className="text-white text-center font-semibold mt-5 mb-10 text-[24px]">
        Criar nova modalidade
      </h1>

      <form onSubmit={handleSubmit(handleCreateModality)} className="w-full">
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
          text="Criar"
          type="submit"
          loading={isSubmitting}
          className="mb-10"
        />
      </form>
    </div>
  );
};

export default CreateModality;
