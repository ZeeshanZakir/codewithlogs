export type IdentityClient = {
  auth: { getUser(): Promise<{ data: { user: { id: string } | null }; error: unknown }> };
};

export class AuthenticationRequired extends Error {}

export async function requireUser(client: IdentityClient) {
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new AuthenticationRequired("Authentication required.");
  return data.user;
}

