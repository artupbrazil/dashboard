const LABELS: Record<string, { label: string; className: string }> = {
  active: { label: "Ativo", className: "bg-up" },
  paused: { label: "Pausado", className: "bg-ink-faint" },
  churned: { label: "Encerrado", className: "bg-down" },
};

export default function StatusDot({ status }: { status: string }) {
  const config = LABELS[status] ?? LABELS.active;
  return (
    <span className="inline-flex items-center gap-1.5 text-ink-muted">
      <span className={`h-1.5 w-1.5 rounded-full ${config.className}`} />
      {config.label}
    </span>
  );
}
