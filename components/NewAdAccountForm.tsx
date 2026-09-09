"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewAdAccountForm({
  clientId,
}: {
  clientId: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<"meta" | "google">("meta");
  const [accountId, setAccountId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const raw = accountId.trim();
    const externalId =
      platform === "meta"
        ? raw.startsWith("act_")
          ? raw
          : `act_${raw}`
        : raw.replace(/\D/g, "");

    const { error } = await supabase.from("ad_accounts").insert({
      client_id: clientId,
      platform,
      external_account_id: externalId,
      account_name: accountName || null,
    });

    setSaving(false);

    if (error) {
      setError(
        error.code === "23505"
          ? "Essa conta já está cadastrada."
          : "Não foi possível salvar. Tente de novo."
      );
      return;
    }

    setAccountId("");
    setAccountName("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-accent hover:text-accent-strong"
      >
        + Vincular conta de anúncio
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-surface p-4"
    >
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">
            Plataforma
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as "meta" | "google")}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          >
            <option value="meta">Meta Ads</option>
            <option value="google">Google Ads</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">
            {platform === "meta" ? "ID da conta (act_...)" : "Customer ID"}
          </label>
          <input
            required
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            placeholder={platform === "meta" ? "act_123456789" : "123-456-7890"}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="mb-1.5 block text-sm text-ink-muted">
          Nome da conta (opcional)
        </label>
        <input
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          placeholder="CA - Nome do cliente"
        />
      </div>

      {error && (
        <p className="mb-3 text-sm text-down" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md px-3.5 py-2 text-sm text-ink-muted hover:bg-paper"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-white hover:bg-accent-strong disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Vincular conta"}
        </button>
      </div>
    </form>
  );
}
