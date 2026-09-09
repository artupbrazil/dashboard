import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NewAdAccountForm from "@/components/NewAdAccountForm";
import StatusDot from "@/components/StatusDot";

export const dynamic = "force-dynamic";

const PLATFORM_LABEL: Record<string, string> = {
  meta: "Meta Ads",
  google: "Google Ads",
};

export default async function ClienteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("id, name, slug, status, whatsapp_number, has_gbp, has_ga4")
    .eq("slug", slug)
    .single();

  if (!client) {
    notFound();
  }

  const { data: adAccounts } = await supabase
    .from("ad_accounts")
    .select("id, platform, external_account_id, account_name, currency")
    .eq("client_id", client.id)
    .order("platform");

  return (
    <div className="max-w-3xl">
      <a
        href="/clientes"
        className="mb-4 inline-block text-sm text-ink-muted hover:text-ink"
      >
        ← Clientes
      </a>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">{client.name}</h1>
          <div className="mt-1 text-sm text-ink-muted">
            <StatusDot status={client.status} />
          </div>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-ink-muted">
          Contas de anúncio
        </h2>

        {adAccounts && adAccounts.length > 0 ? (
          <div className="mb-4 overflow-hidden rounded-lg border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-ink-muted">
                  <th className="px-4 py-2.5 font-medium">Plataforma</th>
                  <th className="px-4 py-2.5 font-medium">Conta</th>
                  <th className="px-4 py-2.5 font-medium">ID</th>
                </tr>
              </thead>
              <tbody>
                {adAccounts.map((acc) => (
                  <tr
                    key={acc.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-2.5 text-ink">
                      {PLATFORM_LABEL[acc.platform] ?? acc.platform}
                    </td>
                    <td className="px-4 py-2.5 text-ink-muted">
                      {acc.account_name || "—"}
                    </td>
                    <td className="px-4 py-2.5 tabular text-ink-faint">
                      {acc.external_account_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mb-4 text-sm text-ink-muted">
            Nenhuma conta de anúncio vinculada ainda.
          </p>
        )}

        <NewAdAccountForm clientId={client.id} />
      </section>
    </div>
  );
}
