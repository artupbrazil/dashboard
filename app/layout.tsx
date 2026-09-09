import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Art Up — Dashboard",
  description: "Monitoramento de campanhas e atendimento",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
