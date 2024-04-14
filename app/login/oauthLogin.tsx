"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@mantine/core";

export default function OAuthForm() {
  const loginWithGoogle = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Button variant="outline" color="teal" onClick={loginWithGoogle}>
      Login with google
    </Button>
  );
}
