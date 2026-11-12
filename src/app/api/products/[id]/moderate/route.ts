import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";

const schema = z.object({ status: z.enum(["APROVADO", "REJEITADO"]) });

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(["ADMIN"]);
  if (auth.response) return auth.response;
  const { id } = await context.params;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Status inválido." }, { status: 400 });

  const exists = await prisma.product.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  const product = await prisma.product.update({ where: { id }, data: { status: parsed.data.status } });
  return NextResponse.json(product);
}
