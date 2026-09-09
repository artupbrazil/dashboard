import { createClient } from "@/lib/supabase/server";
import NewClientDialog from "@/components/NewClientDialog";
import StatusDot from "@/components/StatusDot";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const supabase = await createClient();

  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, name, slug, status, whatsapp_number, ad_accounts(count)")
    .order("name");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Clientes</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {clients?.length ?? 0} cliente{clients?.length === 1 ? "" : "s"}{" "}
            cadastrado{clients?.length === 1 ? "" : "s"}
          </p>
        </div>
        <NewClientDialog />
      </div>

      {error && (
        <p className="text-sm text-down">
          Não foi possível carregar os clientes ({error.message}).
        </p>
      )}

      {clients && clients.length === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center">
          <p className="text-sm text-ink-muted">
            Nenhum cliente cadastrado ainda.
          </p>
        </div>
      )}

      {clients && clients.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-ink-muted">
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">WhatsApp</th>
                <th className="px-4 py-3 font-medium tabular">Contas de anúncio</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => {
                const accountCount =
                  (client.ad_accounts as unknown as { count: number }[])?.[0]
                    ?.count ?? 0;
                return (
                  <tr
                    key={client.id}
                    className="border-b border-border last:border-0 hover:bg-paper"
                  >
                    <td className="px-4 py-3">
                      <a
                        href={`/clientes/${client.slug}`}
                        className="font-medium text-ink hover:text-accent"
                      >
                        {client.name}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <StatusDot status={client.status} />
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {client.whatsapp_number || "—"}
                    </td>
                    <td className="px-4 py-3 tabular text-ink-muted">
                      {accountCount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
