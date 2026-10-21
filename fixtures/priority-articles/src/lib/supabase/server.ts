import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfig } from "./config";

export async function createClient(writable = false) {
  const cookieStore = await cookies();
  const { url, key } = supabaseConfig();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(values) {
        if (writable) {
          values.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          return;
        }
        // Server Components cannot set cookies. Proxy performs refresh before rendering.
        // Writable actions/handlers pass true so write errors are never swallowed there.
      },
    },
  });
}
