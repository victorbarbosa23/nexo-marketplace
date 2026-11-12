"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function signOut() {
    setBusy(true);
    await authClient.signOut();
    router.replace("/");
    router.refresh();
  }
  return <button className="button small secondary" onClick={signOut} disabled={busy}>{busy ? "Saindo…" : "Sair"}</button>;
}
