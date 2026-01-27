import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'create-markdown',
    template: '%s | create-markdown',
  },
  description: 'Block-based markdown parsing and serialization with zero dependencies',
  keywords: ['markdown', 'parser', 'serializer', 'blocks', 'typescript', 'react'],
  authors: [{ name: 'Val Alexander' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://create-markdown.dev',
    title: 'create-markdown',
    description: 'Block-based markdown parsing and serialization with zero dependencies',
    siteName: 'create-markdown',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'create-markdown',
    description: 'Block-based markdown parsing and serialization with zero dependencies',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
