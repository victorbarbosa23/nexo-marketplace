import Link from "next/link";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Search = { q?: string; category?: string; niche?: string; min?: string; max?: string };
const money = (value: Prisma.Decimal | number) => Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default async function Catalogo({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const q = params.q?.trim().slice(0, 100);
  const category = params.category?.trim().slice(0, 60);
  const niche = params.niche?.trim().slice(0, 60);
  const min = params.min ? Number(params.min) : 0;
  const max = params.max ? Number(params.max) : undefined;
  const validPrice = Number.isFinite(min) && min >= 0 && (max === undefined || (Number.isFinite(max) && max >= min));
  const where: Prisma.ProductWhereInput = { status: "APROVADO" };
  if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }];
  if (category) where.category = { equals: category, mode: "insensitive" };
  if (niche) where.niche = { equals: niche, mode: "insensitive" };
  if (validPrice && (min > 0 || max !== undefined)) where.price = { gte: min, ...(max !== undefined ? { lte: max } : {}) };
  const products = validPrice ? await prisma.product.findMany({
    where, include: { seller: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 100,
  }) : [];

  return <main className="page-shell">
    <header className="page-header"><Link className="logo" href="/">nexo<span>.</span></Link><nav><Link href="/">Início</Link><Link href="/painel">Meu painel</Link></nav></header>
    <section className="page-content">
      <p className="eyebrow">VITRINE NEXO</p><h1>Encontre sua próxima descoberta.</h1><p className="muted">Explore produtos digitais publicados por criadores independentes.</p>
      <form className="filter-form" action="/catalogo">
        <label>Buscar<input name="q" defaultValue={q} placeholder="Nome ou descrição" /></label>
        <label>Categoria<input name="category" defaultValue={category} placeholder="Ex.: Educação" /></label>
        <label>Nicho<input name="niche" defaultValue={niche} placeholder="Ex.: Idiomas" /></label>
        <label>Preço mínimo<input name="min" type="number" min="0" step="0.01" defaultValue={params.min} /></label>
        <label>Preço máximo<input name="max" type="number" min="0" step="0.01" defaultValue={params.max} /></label>
        <button className="button">Filtrar produtos</button>
      </form>
      {!validPrice && <p className="form-error">Confira a faixa de preço informada.</p>}
      <div className="section-heading"><h2>Produtos disponíveis</h2><span>{products.length} resultado(s)</span></div>
      {products.length ? <div className="product-grid">{products.map(product => <article className="product-card" key={product.id}>
        <p className="eyebrow">{product.category} · {product.niche}</p><h3>{product.name}</h3><p className="muted">{product.description.slice(0, 150)}{product.description.length > 150 ? "…" : ""}</p>
        <strong>{money(product.price)}</strong><small>por {product.seller.name}</small><Link className="text-link" href={`/produto/${product.id}`}>Ver detalhes →</Link>
      </article>)}</div> : <div className="empty-state"><h3>Nenhum produto encontrado</h3><p>Quando um vendedor publicar um produto aprovado, ele aparecerá aqui.</p><Link href="/criar-conta" className="text-link">Criar uma conta no Nexo →</Link></div>}
    </section>
  </main>;
}
