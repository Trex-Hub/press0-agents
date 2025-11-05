import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // Adjust the entry point as needed
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  outDir: 'dist',
  target: 'es2022',
  tsconfig: 'tsconfig.json',
  minify: false,
  bundle: true,
  skipNodeModulesBundle: true,
  external: ['@prisma/client'],
  noExternal: [],
}); 