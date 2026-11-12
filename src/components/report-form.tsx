"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";

export function ReportForm({ productId, signedIn }: { productId: string; signedIn: boolean }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, reason: String(form.get("reason") ?? ""), description: String(form.get("description") ?? "") }),
    });
    const body = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) { setError(body.error ?? "Não foi possível registrar a denúncia."); return; }
    event.currentTarget.reset();
    setMessage("Denúncia registrada. A equipe responsável fará a análise.");
  }
  if (!signedIn) return <p className="muted"><Link href="/entrar">Entre na sua conta</Link> para denunciar este produto.</p>;
  return <form className="form-card" onSubmit={submit}>
    <h3>Denunciar produto</h3>
    <label>Motivo<input name="reason" required minLength={3} maxLength={100} /></label>
    <label>Descreva o problema<textarea name="description" required minLength={10} maxLength={1500} rows={3} /></label>
    {error && <p className="form-error">{error}</p>}{message && <p className="form-success">{message}</p>}
    <button className="button secondary" disabled={busy}>{busy ? "Enviando…" : "Enviar denúncia"}</button>
  </form>;
}
