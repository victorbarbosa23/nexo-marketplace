"use client";
import { useState } from "react";
import Link from "next/link";

export function PurchaseButton({ productId, canPurchase, signedIn }: { productId: string; canPurchase: boolean; signedIn: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function buy() {
    setBusy(true); setMessage(""); setError("");
    const response = await fetch("/api/purchases", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId }) });
    const body = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) { setError(body.error ?? "Não foi possível registrar a compra."); return; }
    setMessage("Compra demonstrativa registrada! Consulte seu histórico no painel.");
  }
  if (!signedIn) return <p><Link className="button" href="/entrar">Entre para registrar uma compra demonstrativa</Link></p>;
  if (!canPurchase) return <p className="muted">A compra demonstrativa está disponível para contas de comprador.</p>;
  return <div><button className="button" onClick={buy} disabled={busy}>{busy ? "Registrando…" : "Registrar compra demonstrativa"}</button>{message && <p className="form-success">{message}</p>}{error && <p className="form-error">{error}</p>}</div>;
}
