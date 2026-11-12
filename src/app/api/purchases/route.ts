import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";

const schema = z.object({ productId: z.string().min(1).max(64) });

export async function GET() {
  const auth = await requireUser(["COMPRADOR"]);
  if (auth.response) return auth.response;
  const purchases = await prisma.purchase.findMany({
    where: { buyerId: auth.user.id },
    include: { product: { select: { id: true, name: true, category: true, niche: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(purchases);
}

export async function POST(request: Request) {
  const auth = await requireUser(["COMPRADOR"]);
  if (auth.response) return auth.response;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Produto inválido." }, { status: 400 });

  const product = await prisma.product.findFirst({
    where: { id: parsed.data.productId, status: "APROVADO", sellerId: { not: auth.user.id } },
    select: { id: true, price: true },
  });
  if (!product) return NextResponse.json({ error: "Produto indisponível para compra." }, { status: 404 });

  const purchase = await prisma.purchase.create({
    data: { buyerId: auth.user.id, productId: product.id, priceAtPurchase: product.price, status: "SIMULADA" },
  });
  return NextResponse.json(purchase, { status: 201 });
}
