import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'create-markdown playground',
  description: 'Live testing environment for create-markdown package',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
