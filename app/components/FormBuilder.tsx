"use client";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import {
  TextInput,
  Group,
  Select,
  Checkbox,
  Button,
  Modal,
} from "@mantine/core";
import { createForms } from "../auth/actions";
import { createClient } from "@/utils/supabase/client";
import { useDisclosure } from "@mantine/hooks";

export type FormField = {
  formName: string;
  formDescription: string;
  formfields: {
    label: string;
    type: "text" | "number" | "date" | "select" | "multiSelect";
    options?: string[];
    required: boolean;
  }[];
};

export default function FormBuilder() {
  const [opened, { open, close }] = useDisclosure(false);
  const { register, control, handleSubmit, watch, reset } = useForm<FormField>({
    defaultValues: {
      formfields: [{ label: "", type: "text", options: [""], required: false }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "formfields",
    control,
  });
  const onSubmit = (data: FormField) => {
    createForms(data);
    reset();
    close();
  };

  return (
    <div>
      <Group>
        <Button onClick={open}>Add a form</Button>
      </Group>
      <Modal opened={opened} onClose={close} title="create a form" size="xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            {...register("formName")}
            label="Form Name"
            placeholder="enter form name"
            required
          />
          <TextInput
            {...register("formDescription")}
            label="Form Description"
            placeholder="enter your form description"
            required
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
                    required
                  />
                  <Controller
                    name={`formfields.${index}.type` as const}
                    control={control}
                    defaultValue={field.type}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Type"
                        data={[
                          "text",
                          "number",
                          "date",
                          "select",
                          "multiSelect",
                        ]}
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
                options: [""],
                required: false,
              })
            }
          >
            APPEND
          </button>
          <input type="submit" />
        </form>
      </Modal>
    </div>
  );
}
