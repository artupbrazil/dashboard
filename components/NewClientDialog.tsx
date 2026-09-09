"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewClientDialog() {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const { error } = await supabase.from("clients").insert({
      name,
      slug: slugify(name),
      whatsapp_number: whatsapp || null,
    });

    setSaving(false);

    if (error) {
      setError(
        error.code === "23505"
          ? "Já existe um cliente com um nome muito parecido."
          : "Não foi possível salvar. Tente de novo."
      );
      return;
    }

    setName("");
    setWhatsapp("");
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-white hover:bg-accent-strong"
      >
        Novo cliente
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 px-4">
          <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-lg">
            <h2 className="mb-4 text-base font-semibold text-ink">
              Novo cliente
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-ink-muted">
                  Nome do cliente
                </label>
                <input
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                  placeholder="Campero Burguer"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-ink-muted">
                  WhatsApp (opcional)
                </label>
                <input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                  placeholder="5551999999999"
                />
              </div>

              {error && (
                <p className="text-sm text-down" role="alert">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-1">
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
                  {saving ? "Salvando…" : "Salvar cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
