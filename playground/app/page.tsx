// Import from the parent package's dist folder
import {
  VERSION,
  parse,
  stringify,
  h1,
  h2,
  paragraph,
  bulletList,
  codeBlock,
  blockquote,
  bold,
  italic,
  link,
  spans,
} from '../../dist/index.js';

export default function Home() {
  // Block-based API
  const blocks = [
    h1('create-markdown v0.2.0'),
    paragraph(spans(
      bold('Block-based'),
      { text: ' markdown notes with ', styles: {} },
      italic('zero dependencies'),
      { text: '.', styles: {} }
    )),
    h2('Features'),
    bulletList([
      'Parse markdown to blocks',
      'Serialize blocks to markdown',
      'Full TypeScript support',
      'React components (optional)',
    ]),
    codeBlock(`import { parse, stringify, h1, paragraph } from 'create-markdown';

const blocks = parse('# Hello\\n\\nWorld');
const md = stringify([h1('Hello'), paragraph('World')]);`, 'typescript'),
    blockquote('Built with love for the markdown community.'),
    paragraph(spans(
      { text: 'Check out the ', styles: {} },
      link('documentation', 'https://github.com/BunsDev/create-markdown'),
      { text: ' for more.', styles: {} }
    )),
  ];

  // Parse some markdown
  const parsedBlocks = parse(`# Parsed Heading

This is **bold** and *italic* text with \`inline code\`.

- Item one
- Item two
- Item three

> A wise quote

---

\`\`\`javascript
console.log('Hello!');
\`\`\``);

  // Serialize blocks back to markdown
  const serialized = stringify(blocks);

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ 
          fontSize: '1.75rem', 
          fontWeight: 600, 
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          create-markdown{' '}
          <code style={{ 
            fontSize: '0.5em', 
            background: '#1f2937',
            padding: '0.25em 0.5em',
            borderRadius: '4px',
            WebkitTextFillColor: '#6ee7b7',
          }}>
            v{VERSION}
          </code>
        </h1>
        <p style={{ marginTop: '0.5rem', opacity: 0.6, fontSize: '0.9rem' }}>
          Block-based markdown notes package • Zero dependencies
        </p>
      </header>

      {/* Block Creation Demo */}
      <Section title="Block Factory API">
        <p style={{ marginBottom: '1rem', fontSize: '0.85rem', opacity: 0.7 }}>
          Create blocks programmatically with type-safe factories:
        </p>
        <pre style={{ color: '#fcd34d', fontSize: '0.75rem', overflow: 'auto' }}>
          {JSON.stringify(blocks.slice(0, 3), null, 2)}
        </pre>
      </Section>

      {/* Serialization Demo */}
      <Section title="Blocks → Markdown">
        <pre style={{ color: '#86efac', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
          {serialized}
        </pre>
      </Section>

      {/* Parsing Demo */}
      <Section title="Markdown → Blocks">
        <p style={{ marginBottom: '1rem', fontSize: '0.85rem', opacity: 0.7 }}>
          Parsed {parsedBlocks.length} blocks from markdown:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {parsedBlocks.map((block, i) => (
            <div key={i} style={{
              padding: '0.5rem 0.75rem',
              background: '#1f2937',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
            }}>
              <span style={{ color: '#f472b6' }}>{block.type}</span>
              {block.content.length > 0 && (
                <span style={{ color: '#94a3b8', marginLeft: '0.5rem' }}>
                  "{block.content.map(s => s.text).join('').slice(0, 40)}..."
                </span>
              )}
            </div>
          ))}
        </div>
      </Section>

      <footer style={{ 
        marginTop: '3rem', 
        paddingTop: '1.5rem', 
        borderTop: '1px solid #374151',
        fontSize: '0.8rem',
        opacity: 0.5,
        textAlign: 'center',
      }}>
        MIT License • <a href="https://github.com/BunsDev/create-markdown" style={{ color: '#6ee7b7' }}>GitHub</a>
      </footer>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{
      marginBottom: '1.5rem',
      background: '#111827',
      padding: '1.25rem',
      borderRadius: 8,
      border: '1px solid #1f2937',
    }}>
      <h2 style={{
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        opacity: 0.4,
        marginBottom: '1rem',
      }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
