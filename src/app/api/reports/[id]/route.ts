import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";

const schema = z.object({ status: z.enum(["EM_ANALISE", "RESOLVIDA"]) });

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(["ADMIN"]);
  if (auth.response) return auth.response;
  const { id } = await context.params;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Status inválido." }, { status: 400 });

  const report = await prisma.report.update({ where: { id }, data: { status: parsed.data.status } }).catch(() => null);
  if (!report) return NextResponse.json({ error: "Denúncia não encontrada." }, { status: 404 });
  return NextResponse.json(report);
}
