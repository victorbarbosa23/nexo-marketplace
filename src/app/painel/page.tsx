import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { SellerUpgrade } from "@/components/seller-upgrade";
import { ProductCreateForm } from "@/components/product-create-form";
import { ModerationControls } from "@/components/moderation-controls";
import { ReportStatusControl } from "@/components/report-status-control";
import { ProductEditForm } from "@/components/product-edit-form";
import { SignOutButton } from "@/components/sign-out-button";

export const dynamic = "force-dynamic";
const date = (value: Date) => new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(value);

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");
  const role = user.role;

  if (role === "ADMIN") {
    const [pending, reports] = await Promise.all([
      prisma.product.findMany({ where: { status: "PENDENTE" }, include: { seller: { select: { name: true } } }, orderBy: { createdAt: "asc" } }),
      prisma.report.findMany({ include: { product: { select: { name: true } }, reporter: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" }, take: 100 }),
    ]);
    return <main className="page-shell"><header className="page-header"><Link className="logo" href="/">nexo<span>.</span></Link><nav><Link href="/catalogo">Catálogo</Link><SignOutButton /></nav></header><section className="page-content">
      <p className="eyebrow">PAINEL ADMINISTRATIVO</p><h1>Olá, {user.name}.</h1><p className="muted">Gerencie a publicação de produtos e as denúncias da comunidade.</p>
      <div className="section-heading"><h2>Produtos aguardando aprovação</h2><span>{pending.length} pendente(s)</span></div>
      {pending.length ? <div className="stack">{pending.map(product => <article className="panel-card" key={product.id}><p className="eyebrow">{product.category} · {product.niche}</p><h3>{product.name}</h3><p>{product.description}</p><small>Vendedor: {product.seller.name} · {date(product.createdAt)}</small><strong>{Number(product.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong><ModerationControls productId={product.id} /></article>)}</div> : <p className="empty-state">Não há produtos aguardando aprovação.</p>}
      <div className="section-heading"><h2>Denúncias recebidas</h2><span>{reports.length} registro(s)</span></div>
      {reports.length ? <div className="stack">{reports.map(report => <article className="panel-card" key={report.id}><h3>{report.reason}</h3><p>{report.description}</p><small>Produto: {report.product.name} · Enviada por {report.reporter.name} ({report.reporter.email}) · {date(report.createdAt)}</small><ReportStatusControl reportId={report.id} status={report.status} /></article>)}</div> : <p className="empty-state">Nenhuma denúncia registrada.</p>}
    </section></main>;
  }

  if (role === "VENDEDOR") {
    const products = await prisma.product.findMany({ where: { sellerId: user.id }, orderBy: { createdAt: "desc" } });
    return <main className="page-shell"><header className="page-header"><Link className="logo" href="/">nexo<span>.</span></Link><nav><Link href="/catalogo">Catálogo</Link><SignOutButton /></nav></header><section className="page-content">
      <p className="eyebrow">PAINEL DO VENDEDOR</p><h1>Olá, {user.name}.</h1><p className="muted">Cadastre seus produtos e acompanhe o status de cada publicação.</p>
      <ProductCreateForm />
      <div className="section-heading"><h2>Meus produtos</h2><span>{products.length} produto(s)</span></div>
      {products.length ? <div className="product-grid">{products.map(product => <article className="product-card" key={product.id}><p className="eyebrow">{product.category} · {product.niche}</p><h3>{product.name}</h3><p className="muted">{product.description.slice(0, 120)}</p><strong>{Number(product.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong><span className="status-pill">{product.status}</span><small>Criado em {date(product.createdAt)}</small><ProductEditForm product={{id:product.id,name:product.name,description:product.description,category:product.category,niche:product.niche,price:Number(product.price)}} /></article>)}</div> : <p className="empty-state">Você ainda não cadastrou produtos.</p>}
    </section></main>;
  }

  const purchases = await prisma.purchase.findMany({ where: { buyerId: user.id }, include: { product: { select: { id: true, name: true, category: true, niche: true } } }, orderBy: { createdAt: "desc" } });
  return <main className="page-shell"><header className="page-header"><Link className="logo" href="/">nexo<span>.</span></Link><nav><Link href="/catalogo">Explorar produtos</Link><SignOutButton /></nav></header><section className="page-content">
    <p className="eyebrow">PAINEL DO COMPRADOR</p><h1>Olá, {user.name}.</h1><p className="muted">Acompanhe suas descobertas e compras demonstrativas.</p>
    <div className="dashboard-actions"><Link className="button" href="/catalogo">Explorar catálogo</Link><SellerUpgrade /></div>
    <div className="section-heading"><h2>Meu histórico</h2><span>{purchases.length} compra(s)</span></div>
    {purchases.length ? <div className="stack">{purchases.map(purchase => <article className="panel-card" key={purchase.id}><p className="eyebrow">{purchase.product.category} · {purchase.product.niche}</p><h3>{purchase.product.name}</h3><strong>{Number(purchase.priceAtPurchase).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong><small>Registro demonstrativo em {date(purchase.createdAt)}</small></article>)}</div> : <p className="empty-state">Você ainda não possui compras. Explore o catálogo para conhecer os produtos.</p>}
  </section></main>;
}
