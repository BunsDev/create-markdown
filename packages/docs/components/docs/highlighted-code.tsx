import { createHighlighter, type Highlighter } from 'shiki';

let highlighter: Highlighter | null = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['typescript', 'javascript', 'tsx', 'jsx', 'json', 'bash', 'shell', 'markdown'],
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
      dark: 'github-dark',
    },
  });

  return (
    <div className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-lg">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        {filename && (
          <span className="ml-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {filename}
          </span>
        )}
      </div>
      
      {/* Code content with syntax highlighting */}
      <div 
        className="overflow-x-auto text-sm [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:m-0 [&_code]:text-[13px] [&_.line]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

// Hero code example - more compact design for homepage
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
      dark: 'github-dark',
    },
  });

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 p-[1px] shadow-2xl">
      <div className="rounded-2xl overflow-hidden bg-zinc-950">
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
        
        {/* Window chrome */}
        <div className="relative flex items-center gap-2 border-b border-zinc-800/50 bg-zinc-900/80 backdrop-blur px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700 transition-colors group-hover:bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700 transition-colors group-hover:bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700 transition-colors group-hover:bg-green-400" />
          </div>
          {filename && (
            <span className="ml-3 text-xs font-mono text-zinc-500">
              {filename}
            </span>
          )}
        </div>
        
        {/* Code content */}
        <div 
          className="relative overflow-x-auto [&_pre]:!bg-transparent [&_pre]:p-5 [&_pre]:m-0 [&_code]:text-[13px] [&_code]:leading-6 [&_.line]:block"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
