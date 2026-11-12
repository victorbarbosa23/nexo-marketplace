"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Values = { id: string; name: string; description: string; category: string; niche: string; price: string | number };
export function ProductEditForm({ product }: { product: Values }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const data = new FormData(formElement);
    setBusy(true); setError(""); setMessage("");
    const response = await fetch(`/api/products/${product.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(data.get("name") ?? ""),
        description: String(data.get("description") ?? ""),
        category: String(data.get("category") ?? ""),
        niche: String(data.get("niche") ?? ""),
        price: Number(data.get("price")),
      }),
    });
    const body = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) { setError(body.error ?? "Não foi possível atualizar o produto."); return; }
    setMessage("Produto atualizado e enviado novamente para aprovação.");
    setOpen(false);
    router.refresh();
  }
  return <div><button type="button" className="button small secondary" onClick={() => setOpen(!open)}>{open ? "Cancelar edição" : "Editar produto"}</button>{open && <form className="form-card" onSubmit={submit}>
    <label>Nome<input name="name" defaultValue={product.name} required minLength={3} maxLength={100}/></label>
    <label>Descrição<textarea name="description" defaultValue={product.description} required minLength={10} maxLength={3000} rows={4}/></label>
    <div className="form-row"><label>Categoria<input name="category" defaultValue={product.category} required minLength={2} maxLength={60}/></label><label>Nicho<input name="niche" defaultValue={product.niche} required minLength={2} maxLength={60}/></label></div>
    <label>Preço (R$)<input name="price" type="number" defaultValue={Number(product.price)} min="0.01" max="100000" step="0.01" required/></label>
    {error && <p className="form-error">{error}</p>}<button className="button" disabled={busy}>{busy ? "Salvando…" : "Salvar e reenviar para aprovação"}</button>
  </form>}{message && <p className="form-success">{message}</p>}</div>;
}
