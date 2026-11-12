import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";

type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
type GuardResult =
  | { user: CurrentUser; response: null }
  | { user: null; response: NextResponse };

export async function requireUser(roles?: Role[]): Promise<GuardResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, response: NextResponse.json({ error: "Faça login para continuar." }, { status: 401 }) };
  }
  if (roles && !roles.includes(user.role)) {
    return { user: null, response: NextResponse.json({ error: "Você não tem permissão para realizar esta ação." }, { status: 403 }) };
  }
  return { user, response: null };
}
