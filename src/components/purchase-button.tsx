"use client";

import { useState } from "react";
import Link from "next/link";

export function PurchaseButton({ productId, signedIn }: { productId: string; signedIn: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function buy() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(body.error ?? "Não foi possível registrar a compra.");
        return;
      }

      setMessage("Compra demonstrativa registrada! Consulte seu histórico no painel.");
    } catch {
      setError("Não foi possível registrar a compra. Verifique sua conexão e tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  if (!signedIn) return <p><Link className="button" href="/entrar">Entre para registrar uma compra demonstrativa</Link></p>;

  return (
    <div>
      <button className="button" onClick={buy} disabled={busy}>{busy ? "Registrando…" : "Registrar compra demonstrativa"}</button>
      {message && <p className="form-success" role="status">{message}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}
