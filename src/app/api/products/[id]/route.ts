import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";

const schema = z.object({
  name: z.string().trim().min(3).max(100),
  description: z.string().trim().min(10).max(3000),
  category: z.string().trim().min(2).max(60),
  niche: z.string().trim().min(2).max(60),
  price: z.coerce.number().positive().max(100000).finite(),
});

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(["VENDEDOR"]);
  if (auth.response) return auth.response;
  const { id } = await context.params;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const existing = await prisma.product.findFirst({
    where: { id, sellerId: auth.user.id },
    select: { id: true },
  });
  if (!existing) return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });

  const product = await prisma.product.update({
    where: { id },
    data: { ...parsed.data, status: "PENDENTE" },
  });
  return NextResponse.json(product);
}
