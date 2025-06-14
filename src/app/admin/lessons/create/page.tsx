"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { Input, Button, Select, Switch } from "@/components";
import WeekDays from "@/components/WeekDays/WeekDays";
import { createLesson } from "@/firebase/database/lesson";
import { getModalitySelectList } from "@/firebase/database/modality";
import { getTeacherSelectList } from "@/firebase/database/user";

import { LessonFormProps, OptionProp } from "@/shared/types/lesson";
import { lessonSchema } from "@/schemas/lesson";
import { useAuth } from "@/contexts/AuthContext";

const CreateLesson = () => {
  const router = useRouter();
  const [modalityOptionList, setModalityOptionList] = useState<OptionProp[]>(
    []
  );
  const [teacherOptionList, setTeacherOptionList] = useState<OptionProp[]>([]);
  const { isUserLimitOnLesson } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LessonFormProps>({
    defaultValues: {
      time: "",
      isSingleLesson: false,
      isActive: true,
      userLimit: "10",
    },
    resolver: zodResolver(lessonSchema),
  });

  const isSingleLesson = watch("isSingleLesson");

  const handleCreateLesson = async (values: LessonFormProps) => {
    const uid = uuidv4();

    const payload = {
      time: values.time,
      modality: values.modality,
      isActive: true,
      teacher: values.teacher,
      isSingleLesson: values.isSingleLesson,
      ...(!!values.userLimit && { userLimit: values.userLimit }),
      ...(!!values.weekDays?.length && { weekDays: values.weekDays }),
      ...(!!values.date && { date: `${values.date}T00:00:00` }),
      ...(!!values.title && { title: values.title }),
    } as LessonFormProps;
    const { error } = await createLesson(uid, payload);

    if (!!error) {
      toast.error("Ocorreu um erro ao cadastrar a nova aula!");
      return;
    }

    toast.success("Aula criada com sucesso!");

    return router.push("/admin/lessons");
  };

  const loadOptions = async () => {
    try {
      const [modalitiesData, teachersData] = await Promise.all([
        getModalitySelectList(),
        getTeacherSelectList(),
      ]);

      const modalityOptionsData = modalitiesData
        ?.map((option) => {
          if (option.isActive)
            return { id: option.uid, label: option.name } as OptionProp;
        })
        .filter((option) => !!option);

      const teacherOptionsData = teachersData
        ?.map((option) => {
          if (option.isActive)
            return { id: option.uid, label: option.name } as OptionProp;
        })
        .filter((option) => !!option);

      setModalityOptionList(modalityOptionsData ?? []);
      setTeacherOptionList(teacherOptionsData ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectSingleLesson = (value: boolean) => {
    setValue("isSingleLesson", value);
    if (value) {
      setValue("date", undefined);
    } else {
      setValue("weekDays", undefined);
    }
  };

  const handleSelectWeekDays = (array: string[]) => {
    setValue("weekDays", array);
  };

  useEffect(() => {
    loadOptions();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center md:max-w-[500px] m-auto px-4">
      <h1 className="text-white text-center font-semibold mt-5 mb-10 text-[24px]">
        Criar nova aula
      </h1>

      <form onSubmit={handleSubmit(handleCreateLesson)} className="w-full">
        <div className="w-full mb-2 flex">
          <Switch
            checked={isSingleLesson!}
            onChange={(event) => handleSelectSingleLesson(event.target.checked)}
          />
          <p className="text-gray-500 text-md ml-2">Aula avulsa</p>
        </div>
        {isSingleLesson && (
          <div className="mb-5 w-full">
            <Input
              label="Título da aula"
              placeholder="Ex.: Aulão"
              register={register}
              name="title"
              error={!!errors?.title?.message}
              message={errors.title?.message}
              type="title"
            />
          </div>
        )}
        <div className="mb-5 w-full">
          <Input
            label="Horário"
            placeholder="Ex.: 07:00"
            register={register}
            name="time"
            error={!!errors?.time?.message}
            message={errors.time?.message}
            type="time"
          />
        </div>

        <div className="mb-5 w-full">
          <Select
            label="Professor"
            placeholder="Professor"
            error={!!errors?.teacher?.message}
            message={errors.teacher?.message}
            options={teacherOptionList}
            register={register}
            name="teacher"
          />
        </div>

        <div className="mb-5 w-full">
          <Select
            label="Modalidade"
            placeholder="Modalidade"
            error={!!errors?.modality?.message}
            message={errors.modality?.message}
            options={modalityOptionList}
            register={register}
            name="modality"
          />
        </div>

        <div className="mb-5 w-full">
          {isSingleLesson ? (
            <div className="mb-5 w-full">
              <Input
                label="Data"
                placeholder="DD/MM/AAAA"
                register={register}
                name="date"
                error={!!errors?.time?.message}
                message={errors.time?.message}
                type="date"
              />
            </div>
          ) : (
            <>
              <label className="text-base font-medium leading-4 mb-3">
                Dias da semana
              </label>
              <WeekDays onChange={handleSelectWeekDays} />
            </>
          )}
        </div>

        {isUserLimitOnLesson && (
          <div className="mb-5 w-full">
            <Input
              label="Quantidade limite de aluno"
              placeholder="10"
              register={register}
              name="userLimit"
              error={!!errors?.userLimit?.message}
              message={errors.userLimit?.message}
            />
          </div>
        )}

        <Button
          text="Criar aula"
          type="submit"
          loading={isSubmitting}
          className="mb-10"
        />
      </form>
    </div>
  );
};

export default CreateLesson;
