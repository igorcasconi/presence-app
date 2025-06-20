"use client";

import { Button, Input, Loader, Modal, ModalAlert, Switch } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { getUserData, updateUser } from "@/firebase/database/user";
import { validateRegistrationDate } from "@/helpers/date";
import { userRegistrationDateSchema } from "@/schemas/user";
import { UserProps, UserRegistrationDateProps } from "@/shared/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns/format";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const UserDetails = () => {
  const [userDetailData, setUserDetailData] = useState<
    UserProps | null | undefined
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalAlertVisible, setModalAlertVisible] = useState(false);
  const [isSubmitRegistrationDate, setSubmitRegistrationDate] = useState(false);
  const [isModalRegistrationDateVisiblie, setModalRegistrationDateVisible] =
    useState(false);
  const params = useParams<{ uid: string }>();
  const { userData } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserRegistrationDateProps>({
    defaultValues: {
      registrationDate: "",
    },
    resolver: zodResolver(userRegistrationDateSchema),
  });

  const loadUserData = async () => {
    try {
      const userDatabase = await getUserData(params.uid);
      setUserDetailData(userDatabase);

      if (
        !!userDatabase?.registrationDate &&
        validateRegistrationDate(userDatabase?.registrationDate)
      ) {
        setModalAlertVisible(true);
      }
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
    setSubmitRegistrationDate(true);
    try {
      setUserDetailData({ ...userDetailData, [key]: value } as UserProps);
      await updateUser(params.uid, {
        ...userDetailData,
        [key]: value,
      } as UserProps);

      toast.success("Usuário atualizado com sucesso!");
    } catch (error) {
      console.log(error);
    } finally {
      setModalRegistrationDateVisible(false);
      setModalRegistrationDateVisible(false);
    }
  };

  const handleSubmitRegistrationDate = (values: UserRegistrationDateProps) => {
    handleUpdateUser(`${values.registrationDate}T00:00:00`, "registrationDate");
  };

  const handleOpenModalRegistrationDate = () => {
    setModalRegistrationDateVisible(true);
    reset({
      registrationDate:
        format(userDetailData?.registrationDate!, "yyyy-MM-dd") ?? "",
    });
  };

  useEffect(() => {
    loadUserData();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full pt-4 px-4 md:max-w-[500px] m-auto flex flex-col items-center">
      {isLoading ? (
        <div className="justify-center mt-[50%]">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex w-full flex-row justify-between items-start">
            <div>
              <div className="w-full mb-[-2px] justify-center">
                <h2 className="text-gray-300 text-md">Aluno/Usuário</h2>
              </div>
              <div className="w-full mb-4">
                <h3 className="text-white text-xl">{userDetailData?.name}</h3>
              </div>
            </div>

            <Button
              text="Alterar data de matrícula"
              className="!bg-secondary h-8 max-w-32 ml-2"
              textStyle="text-xs"
              onClick={handleOpenModalRegistrationDate}
            />
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

          <div className="w-full mb-[-2px] justify-center">
            <h2 className="text-gray-300 text-md">Data de matrícula</h2>
          </div>
          <div className="w-full mb-4">
            <h3 className="text-white text-xl">
              {!!userDetailData?.registrationDate
                ? format(userDetailData?.registrationDate!, "dd/MM/yyyy")
                : "Sem data definida!"}
            </h3>
          </div>

          {isModalRegistrationDateVisiblie && (
            <Modal
              title="Alterar data de matrícula"
              onCloseModal={() => setModalRegistrationDateVisible(false)}
            >
              <form
                onSubmit={handleSubmit(handleSubmitRegistrationDate)}
                className="w-full"
              >
                <div className="mt-4 px-4">
                  <h2 className="text-gray-300 text-md mb-4">
                    Data de matrícula
                  </h2>
                  <Input
                    label="Data"
                    placeholder="Ex.: 10/10/2025"
                    register={register}
                    name="registrationDate"
                    error={!!errors?.registrationDate?.message}
                    message={errors.registrationDate?.message}
                    type="date"
                  />

                  <Button
                    text="Alterar"
                    type="submit"
                    loading={isSubmitRegistrationDate}
                    className="my-8"
                  />
                </div>
              </form>
            </Modal>
          )}

          {isModalAlertVisible && (
            <ModalAlert
              title={`Data de mensalidade ${format(
                userDetailData?.registrationDate!,
                "dd"
              )}/${format(new Date(), "MM/yyyy")}`}
              message="A data de mensalidade desse aluno já venceu!"
              confirmButtonLabel="Fechar"
              onConfirmButton={() => setModalAlertVisible(false)}
              onCloseModal={() => setModalAlertVisible(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserDetails;
