import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";

const schema = z.object({
  productId: z.string().min(1).max(64),
  reason: z.string().trim().min(3).max(100),
  description: z.string().trim().min(10).max(1500),
});

export async function POST(request: Request) {
  const auth = await requireUser(["COMPRADOR", "VENDEDOR"]);
  if (auth.response) return auth.response;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const product = await prisma.product.findFirst({
    where: { id: parsed.data.productId, status: "APROVADO" },
    select: { id: true },
  });
  if (!product) return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });

  const report = await prisma.report.create({
    data: { ...parsed.data, reporterId: auth.user.id, status: "ABERTA" },
  });
  return NextResponse.json(report, { status: 201 });
}

export async function GET() {
  const auth = await requireUser(["ADMIN"]);
  if (auth.response) return auth.response;
  const reports = await prisma.report.findMany({
    include: {
      product: { select: { id: true, name: true } },
      reporter: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reports);
}
