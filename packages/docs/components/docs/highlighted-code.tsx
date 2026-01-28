import { createHighlighter, type Highlighter } from 'shiki';

let highlighter: Highlighter | null = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-dark', 'github-light'],
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
      dark: 'github-dark',
    },
  });

  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Container with solid background */}
      <div className="border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0d1117] rounded-xl overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-[#161b22] px-4 py-3">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          {filename && (
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              {filename}
            </span>
          )}
        </div>
        
        {/* Code content */}
        <div 
          className="overflow-x-auto [&_pre]:!bg-transparent [&_pre]:p-5 [&_pre]:m-0 [&_code]:text-[14px] [&_code]:leading-7 [&_.line]:block"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

// Hero code example for homepage
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
    <div className="relative rounded-xl overflow-hidden shadow-2xl">
      {/* Container with GitHub dark background */}
      <div className="border border-zinc-700 bg-[#0d1117] rounded-xl overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-3 border-b border-zinc-700 bg-[#161b22] px-4 py-3">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          {filename && (
            <span className="text-sm font-mono text-zinc-300">
              {filename}
            </span>
          )}
        </div>
        
        {/* Code content */}
        <div 
          className="overflow-x-auto [&_pre]:!bg-transparent [&_pre]:p-6 [&_pre]:m-0 [&_code]:text-[14px] [&_code]:leading-7 [&_.line]:block"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
