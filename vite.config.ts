import { join } from 'node:path';

import devServer, { defaultOptions } from '@hono/vite-dev-server';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import { envOnlyMacros } from 'vite-env-only';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), '');

  return {
    build: {
      rollupOptions: {
        input: config.isSsrBuild ? 'server/index.ts' : undefined,
      },
      sourcemap: true,
      target: config.isSsrBuild ? 'node24' : ['chrome111', 'safari16.4', 'firefox128'],
    },
    plugins: [
      tsconfigPaths(),
      envOnlyMacros(),
      tailwindcss(),
      basicSsl(),
      reactRouter(),
      devServer({
        entry: 'server/index.ts',
        exclude: [...defaultOptions.exclude, /^\/app\//],
        injectClientScript: false,
      }),
      !!env.ANALYZE &&
        visualizer({
          filename: join(
            import.meta.dirname,
            `node_modules/.cache/${config.isSsrBuild ? 'server' : 'client'}-stats.html`,
          ),
          open: true,
          template: 'flamegraph',
          title: config.isSsrBuild ? 'Server Visualizer' : 'Client Visualizer',
        }),
    ].filter(Boolean),
  };
});
