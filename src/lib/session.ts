import { headers } from "next/headers";
import type { Role } from "@prisma/client";
import { auth } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;
  const role = ((session.user as typeof session.user & { role?: string }).role ?? "COMPRADOR") as Role;
  return { ...session.user, role };
}
