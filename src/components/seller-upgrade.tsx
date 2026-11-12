"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SellerUpgrade() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function activate() {
    if (busy) return;
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/account/seller", { method: "POST" });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(body.error ?? "Não foi possível ativar o perfil.");
        return;
      }

      router.refresh();
    } catch {
      setError("Não foi possível ativar o perfil. Verifique sua conexão e tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel-card">
      <h2>Quer publicar seus produtos?</h2>
      <p>Ative seu perfil de vendedor para cadastrar produtos no Nexo. Seus anúncios passam por aprovação antes de aparecer no catálogo.</p>
      <button className="button" onClick={activate} disabled={busy}>{busy ? "Ativando…" : "Ativar perfil de vendedor"}</button>
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}
