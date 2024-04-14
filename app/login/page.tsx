import "@mantine/core/styles.css";
import { Container, Button, Flex, TextInput, Group } from "@mantine/core";
import { login } from "../auth/actions";
import OAuthForm from "./oauthLogin";
import Link from "next/link";
export default function Page({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <Container h="100vh">
      <h1>Hello this is login page.</h1>
      <Flex
        mih={50}
        justify="center"
        align="center"
        direction="column"
        gap="sm"
        wrap="wrap"
      >
        <form
          action={login}
          style={{
            width: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            justifyContent: "flex-center",
          }}
        >
          <TextInput
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@email.com"
            required
          />
          <TextInput
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="********"
            required
          />
          <Button color="teal" type="submit">
            Login
          </Button>
        </form>
        <Flex justify="center" gap="sm" direction="column" w="300px">
          <Link href={`/signup`}>
            <Button w="100%" variant="outline" color="teal">
              Create a new Account
            </Button>
          </Link>
          <OAuthForm />
        </Flex>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </Flex>
    </Container>
  );
}
