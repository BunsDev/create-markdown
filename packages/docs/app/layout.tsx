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
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Fixed background effects - Purple only */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Gradient mesh background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
            
            {/* Animated gradient orbs - Purple only */}
            <div className="absolute top-0 -left-40 w-80 h-80 bg-gradient-to-br from-primary/15 to-primary/10 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute top-1/3 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
            <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
            
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
          </div>

          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
