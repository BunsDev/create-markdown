import Link from 'next/link';
import { ArrowRight, Blocks, Zap, Package, Code2, Sparkles } from 'lucide-react';

// Beautiful SVG-based code block component
function CodeWindow({ filename, children }: { filename: string; children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 rounded-2xl blur-xl opacity-50" />

      <div className="relative bg-[#1a1b26] rounded-2xl overflow-hidden border border-white/10">
        {/* Window chrome */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#16161e] border-b border-white/5">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-sm font-medium text-zinc-400">{filename}</span>
        </div>

        {/* Code content */}
        <div className="p-5 font-mono text-[13px] leading-6 overflow-x-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// Syntax highlighting colors (Tokyo Night inspired)
const c = {
  keyword: 'text-[#bb9af7]',    // purple - import, const, from
  function: 'text-[#7aa2f7]',   // blue - function names
  string: 'text-[#9ece6a]',     // green - strings
  comment: 'text-[#565f89]',    // gray - comments
  variable: 'text-[#c0caf5]',   // light - variables
  property: 'text-[#73daca]',   // cyan - properties
  punctuation: 'text-[#a9b1d6]', // light gray - brackets, etc
  number: 'text-[#ff9e64]',     // orange - numbers
};

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

// Hero code display with beautiful syntax highlighting
function HeroCodeBlock() {
  return (
    <CodeWindow filename="example.ts">
      <div className="space-y-1">
        <p><span className={c.keyword}>import</span> <span className={c.punctuation}>{'{'}</span> <span className={c.variable}>parse</span><span className={c.punctuation}>,</span> <span className={c.variable}>stringify</span><span className={c.punctuation}>,</span> <span className={c.variable}>h1</span><span className={c.punctuation}>,</span> <span className={c.variable}>paragraph</span> <span className={c.punctuation}>{'}'}</span> <span className={c.keyword}>from</span> <span className={c.string}>'create-markdown'</span><span className={c.punctuation}>;</span></p>
        <p>&nbsp;</p>
        <p><span className={c.comment}>// Parse markdown to blocks</span></p>
        <p><span className={c.keyword}>const</span> <span className={c.variable}>blocks</span> <span className={c.punctuation}>=</span> <span className={c.function}>parse</span><span className={c.punctuation}>(</span><span className={c.string}>`# Hello World</span></p>
        <p><span className={c.string}>This is **bold** text.`</span><span className={c.punctuation}>);</span></p>
        <p>&nbsp;</p>
        <p><span className={c.comment}>// Create blocks programmatically</span></p>
        <p><span className={c.keyword}>const</span> <span className={c.variable}>doc</span> <span className={c.punctuation}>=</span> <span className={c.punctuation}>[</span></p>
        <p>  <span className={c.function}>h1</span><span className={c.punctuation}>(</span><span className={c.string}>'Welcome'</span><span className={c.punctuation}>),</span></p>
        <p>  <span className={c.function}>paragraph</span><span className={c.punctuation}>(</span><span className={c.string}>'Start building with blocks.'</span><span className={c.punctuation}>),</span></p>
        <p><span className={c.punctuation}>];</span></p>
        <p>&nbsp;</p>
        <p><span className={c.comment}>// Serialize back to markdown</span></p>
        <p><span className={c.keyword}>const</span> <span className={c.variable}>markdown</span> <span className={c.punctuation}>=</span> <span className={c.function}>stringify</span><span className={c.punctuation}>(</span><span className={c.variable}>doc</span><span className={c.punctuation}>);</span></p>
      </div>
    </CodeWindow>
  );
}

// Parse example
function ParseCodeBlock() {
  return (
    <CodeWindow filename="parse.ts">
      <div className="space-y-1">
        <p><span className={c.keyword}>import</span> <span className={c.punctuation}>{'{'}</span> <span className={c.variable}>parse</span> <span className={c.punctuation}>{'}'}</span> <span className={c.keyword}>from</span> <span className={c.string}>'create-markdown'</span><span className={c.punctuation}>;</span></p>
        <p>&nbsp;</p>
        <p><span className={c.keyword}>const</span> <span className={c.variable}>blocks</span> <span className={c.punctuation}>=</span> <span className={c.function}>parse</span><span className={c.punctuation}>(</span><span className={c.string}>`</span></p>
        <p><span className={c.string}># Getting Started</span></p>
        <p>&nbsp;</p>
        <p><span className={c.string}>Welcome to **create-markdown**!</span></p>
        <p>&nbsp;</p>
        <p><span className={c.string}>- Zero dependencies</span></p>
        <p><span className={c.string}>- Full TypeScript support</span></p>
        <p><span className={c.string}>- Block-based architecture</span></p>
        <p><span className={c.string}>`</span><span className={c.punctuation}>);</span></p>
        <p>&nbsp;</p>
        <p><span className={c.variable}>console</span><span className={c.punctuation}>.</span><span className={c.function}>log</span><span className={c.punctuation}>(</span><span className={c.variable}>blocks</span><span className={c.punctuation}>);</span></p>
        <p><span className={c.comment}>// → [HeadingBlock, ParagraphBlock, ListBlock]</span></p>
      </div>
    </CodeWindow>
  );
}

// Create example
function CreateCodeBlock() {
  return (
    <CodeWindow filename="create.ts">
      <div className="space-y-1">
        <p><span className={c.keyword}>import</span> <span className={c.punctuation}>{'{'}</span> <span className={c.variable}>h1</span><span className={c.punctuation}>,</span> <span className={c.variable}>paragraph</span><span className={c.punctuation}>,</span> <span className={c.variable}>bulletList</span> <span className={c.punctuation}>{'}'}</span> <span className={c.keyword}>from</span> <span className={c.string}>'create-markdown'</span><span className={c.punctuation}>;</span></p>
        <p>&nbsp;</p>
        <p><span className={c.keyword}>const</span> <span className={c.variable}>doc</span> <span className={c.punctuation}>=</span> <span className={c.punctuation}>[</span></p>
        <p>  <span className={c.function}>h1</span><span className={c.punctuation}>(</span><span className={c.string}>'My Document'</span><span className={c.punctuation}>),</span></p>
        <p>  <span className={c.function}>paragraph</span><span className={c.punctuation}>(</span><span className={c.string}>'Build docs programmatically.'</span><span className={c.punctuation}>),</span></p>
        <p>  <span className={c.function}>bulletList</span><span className={c.punctuation}>([</span></p>
        <p>    <span className={c.string}>'Type-safe block creation'</span><span className={c.punctuation}>,</span></p>
        <p>    <span className={c.string}>'Intuitive API design'</span><span className={c.punctuation}>,</span></p>
        <p>    <span className={c.string}>'Full markdown support'</span><span className={c.punctuation}>,</span></p>
        <p>  <span className={c.punctuation}>]),</span></p>
        <p><span className={c.punctuation}>];</span></p>
      </div>
    </CodeWindow>
  );
}

// Serialize example
function SerializeCodeBlock() {
  return (
    <CodeWindow filename="serialize.ts">
      <div className="space-y-1">
        <p><span className={c.keyword}>import</span> <span className={c.punctuation}>{'{'}</span> <span className={c.variable}>stringify</span> <span className={c.punctuation}>{'}'}</span> <span className={c.keyword}>from</span> <span className={c.string}>'create-markdown'</span><span className={c.punctuation}>;</span></p>
        <p>&nbsp;</p>
        <p><span className={c.keyword}>const</span> <span className={c.variable}>markdown</span> <span className={c.punctuation}>=</span> <span className={c.function}>stringify</span><span className={c.punctuation}>(</span><span className={c.variable}>doc</span><span className={c.punctuation}>);</span></p>
        <p>&nbsp;</p>
        <p><span className={c.comment}>// Output:</span></p>
        <p><span className={c.comment}>// # My Document</span></p>
        <p><span className={c.comment}>//</span></p>
        <p><span className={c.comment}>// Build docs programmatically.</span></p>
        <p><span className={c.comment}>//</span></p>
        <p><span className={c.comment}>// - Type-safe block creation</span></p>
        <p><span className={c.comment}>// - Intuitive API design</span></p>
        <p><span className={c.comment}>// - Full markdown support</span></p>
      </div>
    </CodeWindow>
  );
}

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
          <div className="mx-auto max-w-screen-2xl text-center">
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
                  <path d="M1 5.5Q50 1 100 5.5T199 5.5" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <br />
              markdown with ease
            </h1>

            <p className="mt-8 text-lg text-muted-foreground md:text-xl max-w-4xl mx-auto leading-relaxed">
              Block-based API for working with markdown.
              Zero dependencies. TypeScript support. Built for modern frameworks.
            </p>

            {/* CTA buttons */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-3xl px-8 py-4 font-mono text-sm font-medium bg-[#1e1e2e] hover:bg-[#2a2a3e] text-violet-400 border border-violet-500/20 hover:border-violet-500/40 transition-all duration-300"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="https://github.com/BunsDev/create-markdown"
                className="inline-flex items-center justify-center rounded-3xl px-8 py-4 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-600 shadow-lg transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
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
          <div className="mx-auto max-w-screen-2xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Simple, intuitive API
              </h2>
              <p className="mt-4 text-muted-foreground text-lg max-w-screen-2xl mx-auto">
                Parse markdown to blocks, manipulate them, and serialize back to markdown.
              </p>
            </div>
            <HeroCodeBlock />
          </div>
        </div>
      </section>

      {/* Bento Grid - Code Examples */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-screen-2xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Complete Workflow
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                From parsing to creation to serialization — all with type safety.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">

              {/* Parse - Large card spanning 2 rows on lg */}
              <div className="lg:row-span-2 group">
                <div className="h-full rounded-3xl bg-gradient-to-br from-violet-500/10 to-purple-600/5 border border-white/10 p-6 transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white text-lg font-bold shadow-lg shadow-violet-500/30">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Parse</h3>
                      <p className="text-sm text-muted-foreground">Markdown → Blocks</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    Convert any markdown string into structured, typed blocks that you can manipulate programmatically.
                  </p>
                  <ParseCodeBlock />
                </div>
              </div>

              {/* Create - Regular card */}
              <div className="group">
                <div className="h-full rounded-3xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-white/10 p-6 transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-lg font-bold shadow-lg shadow-blue-500/30">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Create</h3>
                      <p className="text-sm text-muted-foreground">Type-safe builders</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    Build documents programmatically with intuitive factory functions.
                  </p>
                  <CreateCodeBlock />
                </div>
              </div>

              {/* Serialize - Regular card */}
              <div className="group">
                <div className="h-full rounded-3xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-white/10 p-6 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 text-white text-lg font-bold shadow-lg shadow-emerald-500/30">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Serialize</h3>
                      <p className="text-sm text-muted-foreground">Blocks → Markdown</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    Convert blocks back to clean, formatted markdown output.
                  </p>
                  <SerializeCodeBlock />
                </div>
              </div>

              {/* Feature highlights - spans 2 columns */}
              <div className="md:col-span-2 group">
                <div className="h-full rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-rose-500/10 border border-white/10 p-6 transition-all duration-300 hover:border-amber-500/30">
                  <div className="flex flex-wrap items-center justify-center gap-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-semibold">Zero Dependencies</p>
                        <p className="text-sm text-muted-foreground">Lightweight core</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                        <Code2 className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-semibold">Full TypeScript</p>
                        <p className="text-sm text-muted-foreground">Complete types</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                        <Package className="h-5 w-5 text-rose-500" />
                      </div>
                      <div>
                        <p className="font-semibold">Framework Ready</p>
                        <p className="text-sm text-muted-foreground">Works everywhere</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Glassmorphic */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-screen-2xl">
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
          <div className="mx-auto max-w-screen-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Install create-markdown and start building in minutes.
            </p>

            {/* Install command */}
            <div className="mt-10 inline-flex items-center justify-center rounded-full px-8 py-4 bg-[#1e1e2e] border border-violet-500/20">
              <code className="font-mono text-sm sm:text-base text-violet-400 font-medium">
                bun add create-markdown
              </code>
            </div>

            <div className="mt-10">
              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 font-mono text-sm font-medium bg-[#1e1e2e] hover:bg-[#2a2a3e] text-violet-400 border border-violet-500/20 hover:border-violet-500/40 transition-all duration-300"
              >
                Read the docs
                <ArrowRight className="ml-2 h-4 w-4" />
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
