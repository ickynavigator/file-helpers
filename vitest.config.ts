import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./src/tests/setup.ts'],
    include: ['**/*.test.ts'],
    globals: true,
    environment: 'jsdom',
    coverage: {
      exclude: ['**/*.test.ts', '**/node_modules/**', '**/tests/**'],
      reporter: ['html'],
      provider: 'istanbul',
    },
  },
});
