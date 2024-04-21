"use client";

import { createClient } from "@/utils/supabase/client";
import {
  Container,
  Group,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Pagination,
  Anchor,
  Modal,
  Text,
  TextInput,
  Select,
  MultiSelect,
  Box,
  Button,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedValue } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { deleteForms } from "../auth/actions";
// import Pagination from "./Pagination";

type FormField = {
  form_id: string;
  form_name: string;
  form_description: string;
  form_form_field_table: {}[];
};

export default function DisplayForms({
  Forms,
  offset,
  limit,
  length,
}: {
  Forms: FormField[] | null;
  offset: string | string[] | undefined;
  limit: string | string[] | undefined;
  length: number | undefined;
}) {
  const [form, setForm] = useState<any>(Forms);
  const [value, setValue] = useState("");
  const [debounced] = useDebouncedValue(value, 600);
  const supabase = createClient();
  const router = useRouter();

  const page = offset ?? "1";
  const per_page = limit ?? "10";

  const start = (Number(page) - 1) * Number(per_page);
  const end = start + (Number(per_page) - 1);

  // const entries = form.slice(start, end);
  const deleteFormSingle = async (form_id: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('form_table').delete().eq('form_id', form_id);
      if (error) {
        console.log("there's an error deleting your data: ", error);
      } else {
        console.log("response: ", data);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  useEffect(() => {
    const channel = supabase
      .channel("forms_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "form_table",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  useEffect(() => {
    const fetchForms = async () => {
      if (debounced.trim() === "") {
        setForm(Forms);
      } else {
        const { data: form_table, error } = await supabase
          .from("form_table")
          .select("*", {
            count: "exact",
            head: true,
          })
          .ilike("form_name", `%${debounced}%`);
        // .range(start, end);
        // console.log("your form: ", form_table); form_id, form_name, form_description,  form_form_field_table(label, type, options, required)
        if (error) console.log(error);
        console.log(form_table);

        setForm(form_table);
      }
    };

    fetchForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  useEffect(() => {
    setForm(Forms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Forms]);

  const valueHandler = (options: string) => {
    const arrayFromInput = options.split(",").map((item) => item.trim());
    return arrayFromInput;
  };
  const openModal = (formFieldData: any) =>
    modals.openConfirmModal({
      title: formFieldData.form_name,
      size: "lg",
      children: (
        <Container>
          <Text size="sm">{formFieldData.form_description}</Text>
          {formFieldData.form_form_field_table.map(
            (field: any, index: number) => {
              return (
                <Container key={index}>
                  {field.type === "select" ? (
                    <Select
                      label={field.label}
                      placeholder="choose one"
                      data={valueHandler(field.options)}
                    />
                  ) : field.type === "multiSelect" ? (
                    <MultiSelect
                      label={field.label}
                      placeholder="choose all that applies"
                      data={valueHandler(field.options)}
                      clearable
                    />
                  ) : (
                    <TextInput label={field.label} required={field.required} />
                  )}
                </Container>
              );
            }
          )}
        </Container>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => console.log("Confirmed"),
    });

  return (
    <Container>
      {/* <ModalsProvider /> */}
      <Group>
        {length && (
          <Pagination
            total={Math.ceil(length / Number(per_page))}
            onPreviousPage={() => {
              router.push(
                `/home/?page=${Number(page) - 1}&per_page=${per_page}`
              );
            }}
            value={Number(page)}
            onNextPage={() => {
              router.push(
                `/home/?page=${Number(page) + 1}&per_page=${per_page}`
              );
            }}
            onChange={(page) => {
              router.push(`/home/?page=${Number(page)}&per_page=${per_page}`);
            }}
          />
          // <Pagination hasNextPage={end < length} hasPrevPage={start > 0} />
        )}
      </Group>
      <TextInput
        label="search for a form"
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      <Table>
        <TableThead>
          <TableTr>
            <TableTh>Form ID</TableTh>
            <TableTh>Form Name</TableTh>
            <TableTh>Form Description</TableTh>
            <TableTh>Action</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {form?.map((form: FormField, index: number) => {
            return (
              <TableTr key={index}>
                <TableTd>
                  <Anchor
                    onClick={() => {
                      console.log("test");

                      console.log(form);

                      openModal(form);
                    }}
                  >
                    {form.form_id}
                  </Anchor>
                </TableTd>
                <TableTd>{form.form_name}</TableTd>
                <TableTd>{form.form_description}</TableTd>
                <TableTd>
                  <Button
                    onClick={() => {
                      deleteFormSingle(form.form_id);
                    }}
                  >
                    Delete
                  </Button>
                </TableTd>
              </TableTr>
            );
          })}
        </TableTbody>
      </Table>
    </Container>
  );
}
