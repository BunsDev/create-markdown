import { createHighlighter, type Highlighter } from 'shiki';

let highlighter: Highlighter | null = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['one-dark-pro', 'github-light'],
      langs: ['typescript', 'javascript', 'tsx', 'jsx', 'json', 'bash', 'shell', 'markdown', 'css', 'html'],
    });
  }
  return highlighter;
}

interface HighlightedCodeProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export async function HighlightedCode({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = false,
}: HighlightedCodeProps) {
  const hl = await getHighlighter();
  
  const html = hl.codeToHtml(code.trim(), {
    lang: language,
    themes: {
      light: 'github-light',
      dark: 'one-dark-pro',
    },
  });

  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30">
      {/* Gradient border effect - Purple only */}
      <div className="absolute inset-0 rounded-2xl bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Glass container */}
      <div className="relative rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-white/10 bg-white dark:bg-gradient-to-br dark:from-slate-900/95 dark:to-slate-950/95 backdrop-blur-xl">
        {/* Window chrome with glass effect */}
        <div className="flex items-center gap-2 border-b border-zinc-200/50 dark:border-white/10 bg-zinc-50/80 dark:bg-white/5 backdrop-blur-sm px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400/80 shadow-sm shadow-red-500/30 group-hover:bg-red-400 group-hover:shadow-red-500/50 transition-all duration-300" />
            <div className="h-3 w-3 rounded-full bg-yellow-400/80 shadow-sm shadow-yellow-500/30 group-hover:bg-yellow-400 group-hover:shadow-yellow-500/50 transition-all duration-300" />
            <div className="h-3 w-3 rounded-full bg-green-400/80 shadow-sm shadow-green-500/30 group-hover:bg-green-400 group-hover:shadow-green-500/50 transition-all duration-300" />
          </div>
          {filename && (
            <span className="ml-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {filename}
            </span>
          )}
        </div>
        
        {/* Code content with enhanced syntax highlighting */}
        <div 
          className="overflow-x-auto text-sm [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:m-0 [&_code]:text-[13px] [&_.line]:leading-relaxed [&_.line]:block"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        
        {/* Subtle inner glow */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/10 dark:ring-white/5" />
      </div>
    </div>
  );
}

// Hero code example - glassmorphic design for homepage
export async function HeroCode({
  code,
  language = 'typescript',
  filename,
}: HighlightedCodeProps) {
  const hl = await getHighlighter();
  
  const html = hl.codeToHtml(code.trim(), {
    lang: language,
    themes: {
      light: 'github-light',
      dark: 'one-dark-pro',
    },
  });

  return (
    <div className="group relative">
      {/* Animated gradient glow behind - Purple only */}
      <div className="absolute -inset-1 rounded-2xl bg-primary opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500" />
      
      {/* Gradient border container */}
      <div className="relative rounded-2xl p-[1px] bg-primary/50">
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
          {/* Glass overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
          
          {/* Window chrome with glass effect */}
          <div className="relative flex items-center gap-2 border-b border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-600 group-hover:bg-red-400 group-hover:shadow-lg group-hover:shadow-red-500/50 transition-all duration-300" />
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-600 group-hover:bg-yellow-400 group-hover:shadow-lg group-hover:shadow-yellow-500/50 transition-all duration-300" />
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-600 group-hover:bg-green-400 group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all duration-300" />
            </div>
            {filename && (
              <span className="ml-3 text-xs font-mono text-zinc-400 group-hover:text-zinc-300 transition-colors">
                {filename}
              </span>
            )}
          </div>
          
          {/* Code content with enhanced visibility */}
          <div 
            className="relative overflow-x-auto [&_pre]:!bg-transparent [&_pre]:p-5 [&_pre]:m-0 [&_code]:text-[13px] [&_code]:leading-6 [&_.line]:block"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          
          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
