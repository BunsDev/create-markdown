import Link from 'next/link';
import { ArrowRight, Blocks, Zap, Package, Code2 } from 'lucide-react';

const features = [
  {
    icon: Blocks,
    title: 'Block-Based',
    description: 'Work with structured blocks instead of raw strings. Parse, manipulate, and serialize with ease.',
  },
  {
    icon: Zap,
    title: 'Zero Dependencies',
    description: 'Core package has no runtime dependencies. Lightweight and fast.',
  },
  {
    icon: Package,
    title: 'Framework Ready',
    description: 'Works with Next.js, Vite, Remix, Astro, and more. React components included.',
  },
  {
    icon: Code2,
    title: 'Full TypeScript',
    description: 'Complete type definitions with generics. Excellent DX with autocomplete.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="container py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Block-based markdown for{' '}
              <span className="bg-gradient-to-r from-zinc-600 to-zinc-900 dark:from-zinc-400 dark:to-zinc-100 bg-clip-text text-transparent">
                modern apps
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Parse, create, and serialize markdown with a clean block-based API. 
              Zero dependencies. Full TypeScript support.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="https://github.com/BunsDev/create-markdown"
                className="inline-flex items-center justify-center rounded-md border bg-background px-8 py-3 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </Link>
            </div>
          </div>
        </div>
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </section>

      {/* Code Example */}
      <section className="border-b py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Simple, intuitive API
            </h2>
            <p className="mt-4 text-center text-muted-foreground">
              Parse markdown to blocks, manipulate them, and serialize back to markdown.
            </p>
            <div className="mt-10 rounded-lg border bg-zinc-950 dark:bg-zinc-900 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="ml-2 text-sm text-zinc-400">example.ts</span>
              </div>
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm text-zinc-100">
{`import { parse, stringify, h1, paragraph } from 'create-markdown';

// Parse markdown to blocks
const blocks = parse(\`# Hello World
This is **bold** text.\`);

// Create blocks programmatically
const doc = [
  h1('Welcome'),
  paragraph('Start building with blocks.'),
];

// Serialize back to markdown
const markdown = stringify(doc);`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Everything you need
            </h2>
            <p className="mt-4 text-center text-muted-foreground">
              A complete toolkit for working with markdown in modern applications.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-lg border bg-card p-6 shadow-sm"
                >
                  <feature.icon className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Install create-markdown and start building in minutes.
            </p>
            <div className="mt-8 rounded-lg border bg-muted/50 p-4 font-mono text-sm">
              <code>bun add create-markdown</code>
            </div>
            <div className="mt-8">
              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
              >
                Read the docs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              Built by{' '}
              <a
                href="https://bunsdev.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4"
              >
                BunsDev
              </a>
              . Open source on{' '}
              <a
                href="https://github.com/BunsDev/create-markdown"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
            <p className="text-sm text-muted-foreground">MIT License</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
