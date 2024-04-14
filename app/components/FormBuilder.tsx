"use client";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { TextInput, Group, Select, Checkbox } from "@mantine/core";
import { createForms } from "../auth/actions";

export type FormField = {
  formName: string;
  formDescription: string;
  formfields: {
    label: string;
    type: "text" | "number" | "date" | "select" | "multiSelect";
    options?: string;
    required: boolean;
  }[];
};

export default function FormBuilder() {
  const { register, control, handleSubmit, watch } = useForm<FormField>({
    defaultValues: {
      formfields: [
        { label: "test", type: "text", options: "", required: false },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "formfields",
    control,
  });
  const onSubmit = (data: FormField) => {
    console.log(data);
    createForms(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput {...register("formName")} placeholder="form name" />
        <TextInput
          {...register("formDescription")}
          placeholder="form description"
        />
        {fields.map((field, index) => {
          return (
            <div key={field.id}>
              <Group key={field.id}>
                <TextInput
                  placeholder="name"
                  label="label"
                  {...register(`formfields.${index}.label` as const)}
                  defaultValue={field.label}
                />
                <Controller
                  name={`formfields.${index}.type` as const}
                  control={control}
                  defaultValue={field.type}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Type"
                      data={["text", "number", "date", "select", "multiSelect"]}
                    />
                  )}
                />
                {(watch(`formfields.${index}.type`) === "select" ||
                  watch(`formfields.${index}.type`) === "multiSelect") && (
                  <TextInput
                    {...register(`formfields.${index}.options` as const)}
                    label="Options (comma-separated)"
                  />
                )}
                <Checkbox
                  {...register(`formfields.${index}.required` as const)}
                  label="Required"
                />
                <button type="button" onClick={() => remove(index)}>
                  DELETE
                </button>
              </Group>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() =>
            append({
              label: "",
              type: "text",
              options: "",
              required: false,
            })
          }
        >
          APPEND
        </button>
        <input type="submit" />
      </form>
    </div>
  );
}
