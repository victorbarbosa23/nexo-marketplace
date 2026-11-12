"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReportStatusControl({ reportId, status }: { reportId: string; status: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  async function update(nextStatus: "EM_ANALISE" | "RESOLVIDA") {
    setBusy(true); setError("");
    const response = await fetch(`/api/reports/${reportId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: nextStatus }) });
    const body = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) { setError(body.error ?? "Falha ao atualizar denúncia."); return; }
    router.refresh();
  }
  if (status === "RESOLVIDA") return <span className="status-pill">Resolvida</span>;
  return <div className="inline-actions">{status === "ABERTA" && <button className="button small secondary" disabled={busy} onClick={() => update("EM_ANALISE")}>Em análise</button>}<button className="button small" disabled={busy} onClick={() => update("RESOLVIDA")}>Resolver</button>{error && <small className="form-error">{error}</small>}</div>;
}
