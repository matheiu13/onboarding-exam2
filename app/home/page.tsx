import "@mantine/core/styles.css";
import { Container, Button, Group } from "@mantine/core";
import createClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import FormBuilder from "../components/FormBuilder";
import DisplayForms from "../components/DisplayForms";
import Header from "../components/header/Header";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams["page"] ?? "1";
  const per_page = searchParams["per_page"] ?? "10";
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login?message=You must be logged in to do that.");
  }

  const { data: forms, error } = await supabase.rpc("get_form_and_form_field", {
    start: per_page,
    en: start,
  });
  if (error) {
    console.log(error.message);
  } else {
    console.log(forms);
  }

  return (
    <Container h="100vh">
      <FormBuilder />
      <br />
      <DisplayForms
        Forms={forms}
        offset={page}
        limit={per_page}
        length={forms?.length}
      />
    </Container>
  );
}
