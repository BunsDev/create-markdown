import Link from 'next/link';
import { ArrowRight, Blocks, Zap, Package, Code2, Sparkles } from 'lucide-react';
import { HeroCode } from '@/components/docs/highlighted-code';

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

const heroCode = `import { parse, stringify, h1, paragraph } from 'create-markdown';

// Parse markdown to blocks
const blocks = parse(\`# Hello World
This is **bold** text.\`);

// Create blocks programmatically  
const doc = [
  h1('Welcome'),
  paragraph('Start building with blocks.'),
];

// Serialize back to markdown
const markdown = stringify(doc);`;

const parseExample = `import { parse } from 'create-markdown';

const blocks = parse(\`
# Getting Started

Welcome to **create-markdown**!

- Zero dependencies
- Full TypeScript support
- Block-based architecture
\`);

console.log(blocks);
// → [HeadingBlock, ParagraphBlock, BulletListBlock]`;

const createExample = `import { h1, paragraph, bulletList, codeBlock } from 'create-markdown';

const doc = [
  h1('My Document'),
  paragraph('Build documents programmatically.'),
  bulletList([
    'Type-safe block creation',
    'Intuitive API design', 
    'Full markdown support',
  ]),
  codeBlock('console.log("Hello!");', { language: 'js' }),
];`;

const serializeExample = `import { stringify } from 'create-markdown';

const markdown = stringify(doc);

// Output:
// # My Document
//
// Build documents programmatically.
//
// - Type-safe block creation
// - Intuitive API design
// - Full markdown support
//
// \\\`\\\`\\\`js
// console.log("Hello!");
// \\\`\\\`\\\``;

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Block-based markdown for the modern web</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Parse, create &{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 dark:from-blue-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                  serialize
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5Q50 1 100 5.5T199 5.5" stroke="url(#underline)" strokeWidth="2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="underline" x1="0" y1="0" x2="200" y2="0">
                      <stop stopColor="#2563eb"/>
                      <stop offset="0.5" stopColor="#7c3aed"/>
                      <stop offset="1" stopColor="#9333ea"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <br />
              markdown with ease
            </h1>
            <p className="mt-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              A clean, block-based API for working with markdown. 
              Zero dependencies. Full TypeScript support. Built for modern frameworks.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/docs"
                className="group inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="https://github.com/BunsDev/create-markdown"
                className="inline-flex items-center justify-center rounded-lg border bg-background px-8 py-3.5 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                View on GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example - Hero */}
      <section className="border-b py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Simple, intuitive API
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Parse markdown to blocks, manipulate them, and serialize back to markdown.
              </p>
            </div>
            <div className="group">
              <HeroCode code={heroCode} language="typescript" filename="example.ts" />
            </div>
          </div>
        </div>
      </section>

      {/* Three-column code examples */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                The complete workflow
              </h2>
              <p className="mt-4 text-muted-foreground">
                From parsing to creation to serialization — all with type safety.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Parse */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-sm">
                    1
                  </div>
                  <h3 className="font-semibold">Parse</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Convert markdown strings into structured blocks.
                </p>
                <HeroCode code={parseExample} language="typescript" filename="parse.ts" />
              </div>
              
              {/* Create */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-sm">
                    2
                  </div>
                  <h3 className="font-semibold">Create</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Build documents programmatically with type-safe factories.
                </p>
                <HeroCode code={createExample} language="typescript" filename="create.ts" />
              </div>
              
              {/* Serialize */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-sm">
                    3
                  </div>
                  <h3 className="font-semibold">Serialize</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Convert blocks back to clean markdown output.
                </p>
                <HeroCode code={serializeExample} language="typescript" filename="serialize.ts" />
              </div>
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
