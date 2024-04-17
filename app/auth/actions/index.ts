"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FormField } from "@/app/components/FormBuilder";
import createClient from "@/utils/supabase/server";
import { createClient as createClientClient } from "@/utils/supabase/client";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/login?message=Could not authenticate user");
  }
  redirect("/home");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error);
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

export async function createForms(formData: FormField) {
  try {
    const supabase = createClientClient();
    const { data, error } = await supabase.rpc("insert_form", {
      form_name: formData.formName,
      form_description: formData.formDescription,
      form_fields: formData.formfields,
    });
    if (error) {
      console.log("there's an error inserting your data: ", error);
    } else {
      console.log("response: ", data);
    }
  } catch (error) {
    console.error("Error inserting form data to relationship:", error);
  }
}
