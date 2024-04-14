import "@mantine/core/styles.css";
import { Container, Button, Flex } from "@mantine/core";
import  Link  from "next/link";
export default function Home() {
  return (
    <Container h="100vh">
      <Flex
        mt="50vh"
        mih={50}
        direction="column"
        align="center"
        justify="center"
        gap="sm"
        wrap="wrap"
      >
        <Button color="teal">Create a new Account</Button>
        <Link href={`/login`}><Button variant="outline" color="teal">Login with an Account</Button></Link>
      </Flex>
    </Container>
  );
}