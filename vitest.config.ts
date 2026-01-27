import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/*/src/**/*.test.ts', 'packages/*/src/**/*.test.tsx'],
    exclude: ['node_modules', 'dist', 'playground'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        'dist',
        'playground',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
    },
  },
});
