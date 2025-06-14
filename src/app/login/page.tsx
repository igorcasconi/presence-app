"use client";
import React from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { Input, Button } from "@/components";
import { signIn } from "@/firebase/auth/signin";

import { loginSchema } from "@/schemas/user";
import { LoginFormProps } from "@/shared/types/user";

const SignUpView = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormProps>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const handleSignInUser = async (values: LoginFormProps) => {
    const { result, error } = await signIn(values.email, values.password);

    if (!!error) {
      toast.error("Ocorreu um erro ao logar com seu usuário!");
      return;
    }

    const token = await result?.user.getIdToken();

    await fetch("api/login", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return router.push("/");
  };

  const handleRouteSignUp = () => {
    router.push("/sign-up");
  };

  return (
    <div className="w-full h-full flex flex-col items-center md:max-w-[500px] m-auto px-4">
      <Image
        alt="logo-domovimento"
        src="/logo-login.png"
        width={250}
        height={250}
      />

      <h1 className="text-white text-center font-semibold mt-5 mb-10 text-[24px]">
        Login
      </h1>

      <form onSubmit={handleSubmit(handleSignInUser)} className="w-full">
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

        <Button
          text="Entrar"
          type="submit"
          loading={isSubmitting}
          className="mb-10"
        />
      </form>

      <div className="text-center mt-4 text-white w-[232px]">
        <p>Não possui um cadastro?</p>
        <Button
          text="Crie uma conta agora"
          className="h-8"
          textStyle="text-sm"
          onClick={handleRouteSignUp}
        />
      </div>
    </div>
  );
};

export default SignUpView;
