"use server";

import createClient from "@/utils/supabase/server";

export default async function readUserSession(){
    const supabase = await createClient();

    return supabase.auth.getSession();
}