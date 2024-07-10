"use client";
import React from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input, Button } from "@/components";
import { signUpUser, updateUserData } from "@/firebase/auth/signup";

import { SignUpFormProps } from "@/shared/types/user";
import { signUpSchema } from "@/schemas/user";
import router from "next/router";
import { toast } from "react-toastify";

const SignUpView = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormProps>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  const handleSignUpUser = async (values: SignUpFormProps) => {
    const { error } = await signUpUser(values.email, values.password);

    if (!!error) {
      toast.error("Ocorreu um erro ao cadastrar o seu usuário!");
    }

    await updateUserData(values.name);
    return router.push("/");
  };

  return (
    <div className="w-full h-full flex flex-col items-center md:max-w-[500px] m-auto">
      <Image
        alt="logo-domovimento"
        src="/logo-transparent.png"
        width={150}
        height={150}
      />

      <h1 className="text-white text-center font-semibold mt-5 mb-10 text-[24px]">
        Cadastre-se
      </h1>

      <form onSubmit={handleSubmit(handleSignUpUser)} className="w-full">
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

        <div className="mb-5 w-full">
          <Input
            label="email"
            placeholder="usuario@email.com"
            register={register}
            name="email"
            error={!!errors?.email?.message}
            message={errors.email?.message}
          />
        </div>

        <div className="mb-5 w-full">
          <Input
            label="Senha"
            placeholder="*******"
            type="password"
            register={register}
            name="password"
            error={!!errors?.password?.message}
            message={errors.password?.message}
          />
        </div>

        <div className="mb-10 w-full">
          <Input
            label="Confirme a senha"
            placeholder="*******"
            type="password"
            register={register}
            name="confirmPassword"
            error={!!errors?.confirmPassword?.message}
            message={errors.confirmPassword?.message}
          />
        </div>

        <Button
          text="Cadastrar"
          type="submit"
          loading={isSubmitting}
          className="mb-10"
        />
      </form>
    </div>
  );
};

export default SignUpView;
