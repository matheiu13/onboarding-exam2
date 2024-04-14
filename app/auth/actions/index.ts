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
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

export async function createForms(formData: FormField) {
  try {
    const supabase = await createClient();

    // Insert form metadata into 'forms' table
    const { data: newForm, error: formError } = await supabase
      .from('forms')
      .insert({
        formname: formData.formName,
        formdescription: formData.formDescription,
      });

    if (formError) {
      throw new Error(`Error inserting form metadata: ${formError.message}`);
    }

    const formId = newForm?.[0]?.id;

    if (!formId) {
      throw new Error('Failed to retrieve form ID');
    }

    // Prepare form fields data for insertion
    const fieldsToInsert = formData.formfields.map((field) => ({
      formid: formId, // Use 'formid' instead of 'formId' if that's the column name in your table
      label: field.label,
      type: field.type,
      options: field.options || '',
      required: field.required,
    }));

    // Insert form fields into 'form_fields' table
    const { data: newFields, error: fieldsError } = await supabase
      .from('form_fields')
      .insert(fieldsToInsert);

    if (fieldsError) {
      throw new Error(`Error inserting form fields: ${fieldsError.message}`);
    }

    console.log('Form data inserted successfully!');
  } catch (error) {
    console.error('Error inserting form data:', error.message);
  }
}
