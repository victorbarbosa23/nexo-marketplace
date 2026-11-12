import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";

const productSchema = z.object({
  name: z.string().trim().min(3).max(100),
  description: z.string().trim().min(10).max(3000),
  category: z.string().trim().min(2).max(60),
  niche: z.string().trim().min(2).max(60),
  price: z.coerce.number().positive().max(100000).finite(),
});

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const q = params.get("q")?.trim().slice(0, 100);
  const category = params.get("category")?.trim().slice(0, 60);
  const niche = params.get("niche")?.trim().slice(0, 60);
  const min = params.has("min") ? Number(params.get("min")) : 0;
  const max = params.has("max") ? Number(params.get("max")) : undefined;

  if (!Number.isFinite(min) || min < 0 || (max !== undefined && (!Number.isFinite(max) || max < min))) {
    return NextResponse.json({ error: "Faixa de preço inválida." }, { status: 400 });
  }

  const where: Prisma.ProductWhereInput = { status: "APROVADO" };
  if (q) where.OR = [
    { name: { contains: q, mode: "insensitive" } },
    { description: { contains: q, mode: "insensitive" } },
  ];
  if (category) where.category = { equals: category, mode: "insensitive" };
  if (niche) where.niche = { equals: niche, mode: "insensitive" };
  if (min > 0 || max !== undefined) where.price = { gte: min, ...(max !== undefined ? { lte: max } : {}) };

  const products = await prisma.product.findMany({
    where,
    select: {
      id: true, name: true, description: true, category: true, niche: true,
      price: true, createdAt: true, seller: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const auth = await requireUser(["VENDEDOR"]);
  if (auth.response) return auth.response;
  const parsed = productSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Confira os campos do produto.", details: parsed.error.flatten() }, { status: 400 });
  }
  const product = await prisma.product.create({
    data: { ...parsed.data, sellerId: auth.user.id },
    select: { id: true, name: true, status: true, price: true, createdAt: true },
  });
  return NextResponse.json(product, { status: 201 });
}
