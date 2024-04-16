"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FormField } from "@/app/components/FormBuilder";

import createClient from "@/utils/supabase/server";

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
    const supabase = await createClient();

    const { data: newForm, error: formError } = await supabase
      .from("forms")
      .insert({
        formname: formData.formName,
        formdescription: formData.formDescription,
      })
      .single();
    // if (newForm) {
    //   console.log("this is your submitted data: ", newForm);
    // } else {
    //   console.log("can't retrieve the data you entered.");
    // }
    if (formError) {
      throw new Error(
        `Insert to forms, Error inserting form metadata: ${formError.message}`
      );
    }
    const { data: formId } = await supabase
      .from("forms")
      .select("id")
      .eq("formname", formData.formName)
      .single();

    if (!formId) {
      console.log("Failed fetching form ID");
    } else {
      console.log("your form ID: ", formId.id);
    }

    const fieldsToInsert = formData.formfields.map((field) => ({
      formid: formId?.id,
      label: field.label,
      type: field.type,
      options: field.options || "",
      required: field.required,
    }));

    console.log(fieldsToInsert);
    const { data: newFields, error: fieldsError } = await supabase
      .from("form_fields")
      .insert(fieldsToInsert);

    if (fieldsError) {
      throw new Error(
        `Insert to form_fields, Error inserting form fields: ${fieldsError.message}`
      );
    }

    console.log("Form data inserted successfully!");
  } catch (error) {
    console.error("Error inserting form data to relationship:", error);
  }
}
