import type { DefaultSession } from "next-auth";

import type { AdminRole } from "@/lib/roles";

declare module "next-auth" {
  interface User {
    role?: AdminRole;
    accessExpiresAt?: string | null;
  }

  interface Session {
    user: {
      role?: AdminRole;
      accessExpiresAt?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: AdminRole;
    accessExpiresAt?: string | null;
  }
}
