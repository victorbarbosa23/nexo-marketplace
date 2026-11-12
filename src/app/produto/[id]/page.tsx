import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { PurchaseButton } from "@/components/purchase-button";
import { ReportForm } from "@/components/report-form";

export const dynamic = "force-dynamic";

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, user] = await Promise.all([
    prisma.product.findFirst({ where: { id, status: "APROVADO" }, include: { seller: { select: { name: true } } } }),
    getCurrentUser(),
  ]);
  if (!product) notFound();
  return <main className="page-shell">
    <header className="page-header"><Link className="logo" href="/">nexo<span>.</span></Link><nav><Link href="/catalogo">Catálogo</Link><Link href="/painel">Meu painel</Link></nav></header>
    <section className="page-content detail-layout">
      <div><p className="eyebrow">{product.category} · {product.niche}</p><h1>{product.name}</h1><p className="muted">Publicado por {product.seller.name}</p><div className="detail-description">{product.description}</div></div>
      <aside className="panel-card"><p className="eyebrow">VALOR DO PRODUTO</p><h2>{Number(product.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</h2><p className="muted">A compra é demonstrativa e não realiza cobrança ou pagamento.</p><PurchaseButton productId={product.id} signedIn={Boolean(user)} canPurchase={user?.role === "COMPRADOR"} /></aside>
    </section>
    <section className="page-content report-area"><ReportForm productId={product.id} signedIn={Boolean(user)} canReport={user?.role === "COMPRADOR" || user?.role === "VENDEDOR"} /></section>
  </main>;
}
