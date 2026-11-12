import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";

export async function GET() {
  const auth = await requireUser(["VENDEDOR"]);
  if (auth.response) return auth.response;
  const products = await prisma.product.findMany({
    where: { sellerId: auth.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}
