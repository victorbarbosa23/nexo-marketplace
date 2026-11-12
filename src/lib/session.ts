import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export type AppRole = "COMPRADOR" | "VENDEDOR" | "ADMIN";

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) return null;

  return {
    ...session.user,
    role: (session.user as typeof session.user & { role?: string }).role ?? "COMPRADOR",
  };
}
