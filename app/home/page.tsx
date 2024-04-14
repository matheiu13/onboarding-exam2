import "@mantine/core/styles.css";
import { Container, Button, Flex, TextInput, Group } from "@mantine/core";
import createClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import readUserSession from "../lib";
import FormBuilder from "../components/FormBuilder";

export default async function Page() {
  const {
    data: { session },
  } = await readUserSession();
  if (!session) {
    return redirect("/login?message=You must be logged in to do that.");
  } 
  // else {
  //   console.log(session);
  // }
  // const supabase = await createClient();

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  // if (!user) {
  //   return redirect("/login?message=You must be logged in to do that.");
  // } else {
  //   console.log(user);
  // }
  const signOut = async () => {
    "use server";

    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };
  return (
    <Container h="100vh">
      <Group>
        <h1>Hello the this is home page.</h1>
        <form action={signOut}>
          <Button type="submit">Logout</Button>
        </form>
      </Group>
      <FormBuilder/>
    </Container>
  );
}