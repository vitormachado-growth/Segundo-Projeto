import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "VT'S Barber - Agendamento Premium",
  description: 'Sistema de agendamento online para barbearias',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
