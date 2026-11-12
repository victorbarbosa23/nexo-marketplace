import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";

export async function POST() {
  const auth = await requireUser(["COMPRADOR", "VENDEDOR"]);
  if (auth.response) return auth.response;
  const user = await prisma.user.update({
    where: { id: auth.user.id },
    data: { role: "VENDEDOR" },
    select: { id: true, name: true, role: true },
  });
  return NextResponse.json(user);
}
