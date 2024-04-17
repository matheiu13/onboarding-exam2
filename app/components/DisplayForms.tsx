"use client";

import createClient from "@/utils/supabase/server";
import {
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
// import { FormField } from "./FormBuilder";
type FormField = {
  form_id: string;
  form_name: string;
  form_description: string;
};

export default function DisplayForms() {
  const [forms, setForms] = useState<FormField[]>([]);
  const [error, setError] = useState<string | null>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = await createClient();

        // Fetch initial data
        const { data, error } = await supabase
          .from("form_table")
          .select("form_id, form_name, form_description");
        if (data) {
          const formData: FormField[] = data.map((item: any) => ({
            form_id: item.form_id,
            form_name: item.form_name,
            form_description: item.form_description,
          }));
          setForms(formData);
          console.log(forms);
        }
        const subscription = supabase
          .channel("form_table")
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "form_table" },
            (payload) => {
              setForms((prevForms) => [
                ...prevForms,
                {
                  form_id: payload.new.form_id,
                  form_name: payload.new.form_name,
                  form_description: payload.new.form_description,
                },
              ]);
            }
          )
          .subscribe();

        return () => {
          // Unsubscribe from the subscription when component unmounts
          subscription.unsubscribe();
        };
      } catch (error) {
        setError("Failed to connect to Supabase");
      }
    };

    fetchData();
  }, []);

  return (
    <Table>
      <TableThead>
        <TableTr>
          <TableTh>Form ID</TableTh>
          <TableTh>Form Name</TableTh>
          <TableTh>Form Description</TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>
        {forms?.map((form, index) => {
          return (
            <TableTr key={index}>
              <TableTd>{form.form_id}</TableTd>
              <TableTd>{form.form_name}</TableTd>
              <TableTd>{form.form_description}</TableTd>
            </TableTr>
          );
        })}
      </TableTbody>
    </Table>
  );
}

// {forms?.map((form, index) => {
//     return (
//       <div key={index}>
//         <h3>{form.form_name}</h3>
//         <p>{form.form_description}</p>
//         {form.form_form_field_table.map((field, index) => {
//           return (
//             <div key={index}>
//               <TextInput
//                 label={`${field.label}`}
//                 type={field.type}
//                 required={field.required}
//               />
//             </div>
//           );
//         })}
//       </div>
//     );
//   })}
