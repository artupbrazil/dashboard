import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAgency =
    profile?.role === "agency_admin" || profile?.role === "agency_viewer";

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-surface px-4 py-6">
        <div className="mb-8 px-2">
          <div className="text-sm font-medium tracking-wide text-ink-muted">
            Art Up
          </div>
          <div className="text-lg font-semibold text-ink">Dashboard</div>
        </div>

        <nav className="flex-1 space-y-0.5">
          <a
            href="/clientes"
            className="block rounded-md px-2.5 py-2 text-sm text-ink hover:bg-paper"
          >
            Clientes
          </a>
          <a
            href="/campanhas"
            className="block rounded-md px-2.5 py-2 text-sm text-ink-faint hover:bg-paper"
          >
            Campanhas
          </a>
        </nav>

        <div className="mt-auto space-y-2 border-t border-border pt-4 px-2">
          <div className="text-xs text-ink-faint">
            {user.email}
            <br />
            {isAgency ? "Agência" : "Cliente"}
          </div>
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
