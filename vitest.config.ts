import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./src/vitest.setup.ts'],
    include: ['**/*.test.ts'],
    globals: true,
    environment: 'jsdom',
    coverage: {
      exclude: ['**/*.test.ts', '**/node_modules/**'],
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
