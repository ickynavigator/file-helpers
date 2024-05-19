import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./src/tests/setup.ts'],
    include: ['**/*.test.ts'],
    globals: true,
    environment: 'jsdom',
    coverage: {
      exclude: ['**/*.test.ts', '**/node_modules/**', '**/tests/**'],
      reporter: ['text', 'json', 'lcov'],
      provider: 'istanbul',
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
