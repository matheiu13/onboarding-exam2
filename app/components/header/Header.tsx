import createClient from "@/utils/supabase/server";
import { Avatar, Button, Container, Group, Text } from "@mantine/core";
import { redirect } from "next/navigation";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };
  return (
    <Container p={10} w="100vw">
      {user ? (
        <Group justify="end">
          <Text>{user.user_metadata.name}</Text>
          <Avatar
            src={user.user_metadata.picture}
            alt={`${user.user_metadata.name}'s avatar`}
          />
          <form action={signOut}>
            <Button type="submit">Logout</Button>
          </form>
        </Group>
      ) : (
        <Text c="green" size="lg" fw={500}>
          Sample App
        </Text>
      )}
    </Container>
  );
}
