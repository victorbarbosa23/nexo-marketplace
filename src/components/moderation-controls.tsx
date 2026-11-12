"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ModerationControls({ productId }: { productId: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  async function moderate(status: "APROVADO" | "REJEITADO") {
    setBusy(true); setError("");
    const response = await fetch(`/api/products/${productId}/moderate`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const body = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) { setError(body.error ?? "Falha na moderação."); return; }
    router.refresh();
  }
  return <div className="inline-actions"><button className="button small" disabled={busy} onClick={() => moderate("APROVADO")}>Aprovar</button><button className="button small secondary" disabled={busy} onClick={() => moderate("REJEITADO")}>Rejeitar</button>{error && <small className="form-error">{error}</small>}</div>;
}
