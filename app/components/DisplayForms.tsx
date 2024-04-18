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
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
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
  // const [opened, { open, close }] = useDisclosure(false);
  const [formData, setFormData] = useState(Forms);
  const supabase = createClient();
  const router = useRouter();

  const page = offset ?? "1";
  const per_page = limit ?? "10";

  useEffect(() => {
    const channel = supabase
      .channel("forms_realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
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
          <Text size="sm">{formFieldData.description}</Text>
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
      <Table>
        <TableThead>
          <TableTr>
            <TableTh>Form ID</TableTh>
            <TableTh>Form Name</TableTh>
            <TableTh>Form Description</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {Forms?.map((form: FormField, index: number) => {
            return (
              <TableTr key={index}>
                <TableTd>
                  <Anchor
                    onClick={() => {
                      openModal(form);
                    }}
                  >
                    {form.form_id}
                  </Anchor>
                </TableTd>
                <TableTd>{form.form_name}</TableTd>
                <TableTd>{form.form_description}</TableTd>
              </TableTr>
            );
          })}
        </TableTbody>
      </Table>
    </Container>
  );
}
