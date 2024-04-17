import "@mantine/core/styles.css";
import {
  Container,
  Button,
  Flex,
  TextInput,
  Group,
  Modal,
} from "@mantine/core";
import createClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import readUserSession from "../lib";
import FormBuilder from "../components/FormBuilder";
import DisplayForms from "../components/DisplayForms";
import { useDisclosure } from "@mantine/hooks";
// import { greetPerson } from "../auth/actions";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await readUserSession();
  if (!session) {
    return redirect("/login?message=You must be logged in to do that.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  // console.log(user);
  // console.log(session);

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
      <FormBuilder />
      <DisplayForms />
    </Container>
  );
}
