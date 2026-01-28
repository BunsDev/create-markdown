import Link from 'next/link';
import { ArrowRight, Blocks, Zap, Package, Code2, Sparkles } from 'lucide-react';
import { HeroCode } from '@/components/docs/highlighted-code';

const features = [
  {
    icon: Blocks,
    title: 'Block-Based',
    description: 'Work with structured blocks instead of raw strings. Parse, manipulate, and serialize with ease.',
    gradient: 'from-primary/20 to-primary/10',
    iconColor: 'text-primary',
  },
  {
    icon: Zap,
    title: 'Zero Dependencies',
    description: 'Core package has no runtime dependencies. Lightweight and fast.',
    gradient: 'from-primary/15 to-primary/5',
    iconColor: 'text-primary',
  },
  {
    icon: Package,
    title: 'Framework Ready',
    description: 'Works with Next.js, Vite, Remix, Astro, and more. React components included.',
    gradient: 'from-primary/10 to-primary/20',
    iconColor: 'text-primary',
  },
  {
    icon: Code2,
    title: 'Full TypeScript',
    description: 'Complete type definitions with generics. Excellent DX with autocomplete.',
    gradient: 'from-primary/20 to-primary/15',
    iconColor: 'text-primary',
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
      {/* Hero Section - Glassmorphic */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* Animated gradient orbs - Purple only */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/25 to-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-primary/30 to-primary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-20 left-1/3 w-[600px] h-[300px] bg-gradient-to-br from-primary/15 to-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>
        
        <div className="container py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            {/* Glass badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground mb-8 bg-background/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <span>Block-based markdown for the modern web</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Parse, create &{' '}
              <span className="relative inline-block">
                <span className="text-primary">
                  serialize
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5Q50 1 100 5.5T199 5.5" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <br />
              markdown with ease
            </h1>
            
            <p className="mt-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed">
              A clean, block-based API for working with markdown. 
              Zero dependencies. Full TypeScript support. Built for modern frameworks.
            </p>
            
            {/* CTA buttons - Glassmorphic */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/docs"
                className="group relative inline-flex items-center justify-center rounded-xl px-8 py-4 text-sm font-medium overflow-hidden transition-all duration-300 hover:scale-105 bg-primary text-primary-foreground shadow-lg hover:shadow-xl"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/80 blur-xl" />
                {/* Content */}
                <span className="relative flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              
              <Link
                href="https://github.com/BunsDev/create-markdown"
                className="group inline-flex items-center justify-center rounded-xl px-8 py-4 text-sm font-medium bg-background/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg hover:bg-background/80 hover:border-white/30 hover:shadow-xl transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                View on GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example - Hero - Glassmorphic */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-muted/30 to-transparent" />
        
        <div className="container relative">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Simple, intuitive API
              </h2>
              <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
                Parse markdown to blocks, manipulate them, and serialize back to markdown.
              </p>
            </div>
            <div className="group">
              <HeroCode code={heroCode} language="typescript" filename="example.ts" />
            </div>
          </div>
        </div>
      </section>

      {/* Three-column code examples - Glassmorphic */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                The complete workflow
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                From parsing to creation to serialization — all with type safety.
              </p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Parse */}
              <div className="group space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary font-bold shadow-lg">
                    1
                  </div>
                  <h3 className="text-lg font-semibold">Parse</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Convert markdown strings into structured blocks.
                </p>
                <HeroCode code={parseExample} language="typescript" filename="parse.ts" />
              </div>
              
              {/* Create */}
              <div className="group space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary font-bold shadow-lg">
                    2
                  </div>
                  <h3 className="text-lg font-semibold">Create</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Build documents programmatically with type-safe factories.
                </p>
                <HeroCode code={createExample} language="typescript" filename="create.ts" />
              </div>
              
              {/* Serialize */}
              <div className="group space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary font-bold shadow-lg">
                    3
                  </div>
                  <h3 className="text-lg font-semibold">Serialize</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Convert blocks back to clean markdown output.
                </p>
                <HeroCode code={serializeExample} language="typescript" filename="serialize.ts" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Glassmorphic */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need
            </h2>
            <p className="mt-4 text-center text-muted-foreground text-lg">
              A complete toolkit for working with markdown in modern applications.
            </p>
            
            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative rounded-2xl overflow-hidden p-6 transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Glass background */}
                  <div className="absolute inset-0 bg-background/60 dark:bg-background/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl" />
                  
                  {/* Gradient hover effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                  
                  {/* Content */}
                  <div className="relative">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg`}>
                      <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Inner ring */}
                  <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Glassmorphic */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-muted/50" />
        
        <div className="container relative">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Install create-markdown and start building in minutes.
            </p>
            
            {/* Glassmorphic install command */}
            <div className="mt-10 inline-block rounded-2xl overflow-hidden">
              <div className="relative">
                {/* Gradient border */}
                <div className="absolute -inset-[1px] bg-primary rounded-2xl opacity-30" />
                
                <div className="relative bg-background/80 dark:bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-4">
                  <code className="font-mono text-sm sm:text-base text-primary font-medium">
                    bun add create-markdown
                  </code>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <Link
                href="/docs"
                className="group relative inline-flex items-center justify-center rounded-xl px-8 py-4 text-sm font-medium overflow-hidden transition-all duration-300 hover:scale-105 bg-primary text-primary-foreground shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/80 blur-xl" />
                <span className="relative flex items-center">
                  Read the docs
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Glassmorphic */}
      <footer className="relative border-t border-white/10 py-10">
        <div className="absolute inset-0 bg-background/50 backdrop-blur-xl" />
        
        <div className="container relative">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-sm text-muted-foreground">
              Built by{' '}
              <a
                href="https://bunsdev.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:opacity-80 transition-opacity"
              >
                BunsDev
              </a>
              . Open source on{' '}
              <a
                href="https://github.com/BunsDev/create-markdown"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:opacity-80 transition-opacity"
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
