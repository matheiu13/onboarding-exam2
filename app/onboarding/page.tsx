import createClient from "@/utils/supabase/server";
import { Box, Button, Center, Container, Flex, TextInput } from "@mantine/core";
import { redirect } from "next/navigation";
import UpdateUser from "./UpdateUser";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?message=You must be logged in to do that.");
  } else {
    console.log(user.user_metadata);
  }

  const metadata = { user };
  return (
    <Container>
      <h1>Welcome to onboarding!</h1>
      <Center>
        <UpdateUser user_info={metadata.user.user_metadata} />
      </Center>
    </Container>
  );
}
