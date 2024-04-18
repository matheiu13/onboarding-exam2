"use client";
import { Container, Button, Flex, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { signup } from "../auth/actions";

type userRegisterData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const schema = yup
  .object({
    email: yup.string().required(),
    password: yup.string().required(),
    confirmPassword: yup
      .string()
      .required()
      .oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();

export default function Page() {
  const { register, handleSubmit } = useForm<userRegisterData>({
    resolver: yupResolver(schema),
  });
  return (
    <Container h="100vh">
      <h1>Register page</h1>
      <Flex
        mih={50}
        justify="center"
        align="center"
        direction="column"
        gap="sm"
        wrap="wrap"
      >
        <form
          action={signup}
          style={{
            width: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <TextInput
            {...register("email")}
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@email.com"
            required
          />
          <TextInput
            {...register("password")}
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="********"
            required
          />
          <TextInput
            {...register("confirmPassword")}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="confirmPassword"
            placeholder="********"
            required
          />
          <Button color="teal" type="submit">
            Register
          </Button>
        </form>
        <Link href={`/login`}>
          <Button variant="outline" color="teal">
            Login with an existing account
          </Button>
        </Link>
      </Flex>
    </Container>
  );
}
