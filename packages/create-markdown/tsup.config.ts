import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    react: 'src/react.ts',
    preview: 'src/preview.ts',
  },
  format: ['esm', 'cjs'],
  outDir: 'dist',
  clean: true,
  dts: false,
  sourcemap: true,
  splitting: false,
  target: 'es2020',
  external: [
    '@create-markdown/core',
    '@create-markdown/react',
    '@create-markdown/preview',
    'react',
    'shiki',
    'mermaid',
  ],
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    }
  },
})
