"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ModerationControls({ productId }: { productId: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function moderate(status: "APROVADO" | "REJEITADO") {
    if (busy) return;
    setBusy(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${productId}/moderate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(body.error ?? "Falha na moderação.");
        return;
      }

      router.refresh();
    } catch {
      setError("Não foi possível atualizar o produto. Verifique sua conexão e tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inline-actions">
      <button className="button small" disabled={busy} onClick={() => moderate("APROVADO")}>Aprovar</button>
      <button className="button small secondary" disabled={busy} onClick={() => moderate("REJEITADO")}>Rejeitar</button>
      {error && <small className="form-error" role="alert">{error}</small>}
    </div>
  );
}
