"use client";
import { Box, Button, Center, Container, Flex, TextInput } from "@mantine/core";
import { createClient as Client } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { redirect, useRouter } from "next/navigation";
import createClient from "@/utils/supabase/server";

type UserInfo = {
  full_name: string;
  username: string;
};
export default function Page({ user_info }: any) {
  const { register, handleSubmit } = useForm<UserInfo>();
  const supabase = Client();
  const router = useRouter();
  async function updateProfile(user_update_details: UserInfo) {
    try {
      //   const supabase = await createClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user_info,
          full_name: user_update_details.full_name,
          user_name: user_update_details.username,
        },
      });
      if (error) console.log(error);
      alert("Profile updated!");
      router.push("/home");
    } catch (error) {
      alert("Error updating the data!");
      //   console.log(error);
    }
  }

  const testSubmit = (data: any) => {
    console.log(data);
    console.log("it works");
  };
  return (
    <Box w="50%">
      <form onSubmit={handleSubmit(updateProfile)}>
        <TextInput
          {...register("full_name")}
          label="Full name"
          placeholder="John Doe"
          required
        />
        <TextInput
          {...register("username")}
          label="user name"
          placeholder="Andre3000"
          required
        />
        <Flex w="100%" mt={10} justify="end">
          <Button color="green" type="submit">
            Submit
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
