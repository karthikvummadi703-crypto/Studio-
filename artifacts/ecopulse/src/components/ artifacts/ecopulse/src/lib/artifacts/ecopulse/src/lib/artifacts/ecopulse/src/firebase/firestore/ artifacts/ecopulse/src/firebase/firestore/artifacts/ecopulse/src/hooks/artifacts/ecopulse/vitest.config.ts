import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: [
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
      'tests/**/*.test.ts',
      'tests/**/*.test.tsx',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        lines: 75,
        functions: 75,
        branches: 65,
        statements: 75,
      },
      exclude: [
        'node_modules/**',
        'src/test/**',
        'src/app/api/**',
        'src/middleware.ts',
        'src/lib/firebase-admin.ts',
        'dist/**',
        '**/*.config.*',
        '**/types/**',
      ],
    },
    exclude: [
      'node_modules/**',
      'dist/**',
      'src/app/api/**',
      'src/middleware.test.ts',
      'src/test/tests/**',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
