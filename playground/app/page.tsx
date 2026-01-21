// Import directly from the parent package's dist folder
import { createMarkdown, VERSION } from '../../dist/index.js';

export default function Home() {
  const doc = createMarkdown('# Hello from create-markdown\n\nThis is a **test** document.\n\n- Item 1\n- Item 2\n- Item 3');

  return (
    <main style={{ maxWidth: 640, margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-0.02em' }}>
          create-markdown{' '}
          <code style={{ color: '#6ee7b7', fontSize: '0.7em' }}>v{VERSION}</code>
        </h1>
        <p style={{ marginTop: '0.5rem', opacity: 0.5, fontSize: '0.875rem' }}>
          playground — testing local package
        </p>
      </header>

      <section style={{
        background: '#141414',
        padding: '1.5rem',
        borderRadius: 8,
        border: '1px solid #262626',
      }}>
        <h2 style={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          opacity: 0.4,
          marginBottom: '1rem',
        }}>
          Document Content
        </h2>
        <pre style={{ color: '#a5f3fc' }}>
          {doc.content}
        </pre>
      </section>

      <section style={{
        marginTop: '1.5rem',
        background: '#141414',
        padding: '1.5rem',
        borderRadius: 8,
        border: '1px solid #262626',
      }}>
        <h2 style={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          opacity: 0.4,
          marginBottom: '1rem',
        }}>
          Document Object
        </h2>
        <pre style={{ fontSize: '0.875rem', color: '#fcd34d' }}>
          {JSON.stringify(doc, null, 2)}
        </pre>
      </section>
    </main>
  );
}
