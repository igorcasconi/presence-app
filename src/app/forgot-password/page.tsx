"use client";
import React, { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { Input, Button } from "@/components";

import { ForgotPasswordFormProps } from "@/shared/types/user";
import { forgotPasswordSchema } from "@/schemas/user";
import { forgotPasswordUser } from "@/firebase/auth/forgotpassword";

const ForgotPasswordView = () => {
  const router = useRouter();
  const [isSuccessSentEmail, setIsSuccessSentEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ForgotPasswordFormProps>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch("email");

  const handleSendEmail = async (values: ForgotPasswordFormProps) => {
    console.log("entrou");
    const { error } = await forgotPasswordUser(values.email);

    if (!!error) {
      toast.error(
        "Ocorreu um erro ao enviar o seu e-mail para recuperar a senha!"
      );
    }

    toast.success("O e-mail foi enviado com sucesso!");
    setIsSuccessSentEmail(true);
  };

  return (
    <div className="w-full h-full flex flex-col items-center md:max-w-[500px] m-auto px-4">
      <Image
        alt="logo-luayoga"
        src="/logo-login.png"
        width={150}
        height={150}
      />

      <h1 className="text-white text-center font-semibold mt-5 mb-10 text-[24px]">
        Esqueceu a senha?
      </h1>

      {isSuccessSentEmail ? (
        <>
          <p className="text-white text-center font-semibold text-[18px]">
            O e-mail foi enviado para{" "}
            <span className="text-secondary">{email}</span>, acesse sua caixa de
            entrada e clique no link para conseguir alterar sua senha!
          </p>
          <p className="text-white text-center font-semibold mt-4 text-[18px]">
            O e-mail possui destinatário{" "}
            <span className="text-terciary">
              noreply@{process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
            </span>
          </p>

          <p className="text-white text-center font-semibold mt-4 text-[18px]">
            Caso não encontre na caixa principal, verifique a pasta de spam do
            seu e-mail.
          </p>

          <Button
            text="Voltar para o login"
            type="button"
            onClick={() => router.back()}
            className="mb-10 mt-10"
          />
        </>
      ) : (
        <>
          <p className="text-gray-300 text-center font-semibold mt-5 mb-10 text-[18px]">
            Digite o seu e-mail de login abaixo para receber um link de
            alteração de senha!
          </p>

          <form onSubmit={handleSubmit(handleSendEmail)} className="w-full">
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

            <Button
              text="Enviar e-mail"
              type="submit"
              loading={isSubmitting}
              className="mb-10"
            />
          </form>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordView;
