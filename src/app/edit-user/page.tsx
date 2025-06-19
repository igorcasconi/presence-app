"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Input, Button, Loader } from "@/components";

import { UserProps } from "@/shared/types/user";
import { editUserSchema } from "@/schemas/user";
import { useAuth } from "@/contexts/AuthContext";
import { updateUser } from "@/firebase/database/user";

const EditUserView = () => {
  const { userData, setUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Pick<UserProps, "name">>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(editUserSchema),
  });

  const handleEditUser = async (values: Pick<UserProps, "name">) => {
    try {
      setUserData({ ...userData, name: values.name } as UserProps);
      await updateUser(userData?.uid!, {
        ...userData,
        name: values.name,
      } as UserProps);

      toast.success("Usuário atualizado com sucesso!");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    reset({ name: userData?.name });
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [userData?.name, reset]);

  return (
    <div className="w-full h-full flex flex-col items-center md:max-w-[500px] m-auto px-4">
      <h1 className="text-white text-center font-semibold mt-5 mb-10 text-[24px]">
        Editar usuário
      </h1>

      {isLoading ? (
        <div className="justify-center mt-[10%]">
          <Loader />
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleEditUser)} className="w-full">
          <div className="mb-5 w-full">
            <Input
              label="Nome"
              placeholder="Nome"
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
      )}
    </div>
  );
};

export default EditUserView;
