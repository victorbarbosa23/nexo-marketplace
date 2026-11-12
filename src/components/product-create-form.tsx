"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function ProductCreateForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    // Preserve the form element before awaiting: currentTarget is only
    // guaranteed while the event handler is running synchronously.
    const formElement = event.currentTarget;
    setBusy(true);
    setMessage("");
    setError("");

    try {
      const form = new FormData(formElement);
      const payload = {
        name: String(form.get("name") ?? ""),
        description: String(form.get("description") ?? ""),
        category: String(form.get("category") ?? ""),
        niche: String(form.get("niche") ?? ""),
        price: Number(form.get("price")),
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(body.error ?? "Não foi possível cadastrar o produto.");
        return;
      }

      formElement.reset();
      setMessage(
        "Produto enviado para análise. Ele aparecerá no catálogo após a aprovação.",
      );
      router.refresh();
    } catch {
      setError("Não foi possível concluir o cadastro. Verifique sua conexão e tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <h2>Cadastrar produto</h2>
      <label>
        Nome do produto
        <input name="name" required minLength={3} maxLength={100} />
      </label>
      <label>
        Descrição
        <textarea name="description" required minLength={10} maxLength={3000} rows={4} />
      </label>
      <div className="form-row">
        <label>
          Categoria
          <input name="category" required minLength={2} maxLength={60} placeholder="Ex.: Educação" />
        </label>
        <label>
          Nicho
          <input name="niche" required minLength={2} maxLength={60} placeholder="Ex.: Idiomas" />
        </label>
      </div>
      <label>
        Preço (R$)
        <input name="price" type="number" required min="0.01" max="100000" step="0.01" />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      {message && <p className="form-success" role="status">{message}</p>}
      <button className="button" disabled={busy}>
        {busy ? "Enviando…" : "Enviar para aprovação"}
      </button>
    </form>
  );
}
