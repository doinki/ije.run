import { join } from 'node:path';
import { styleText } from 'node:util';

import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { ip } from 'address';
import { Hono } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { endTime, startTime, timing } from 'hono/timing';
import { cacheHeader } from 'pretty-cache-header';
import type { ServerBuild } from 'react-router';
import { createRequestHandler } from 'react-router-hono';
import { gracefulShutdown } from 'server.close';

declare module 'react-router' {
  interface AppLoadContext {
    serverBuild: ServerBuild;
    timing: {
      endTime: (name: string, precision?: number) => void;
      startTime: (name: string, description?: string) => void;
    };
  }
}

const start = performance.now();

process.chdir(join(import.meta.dirname, '..'));

if (import.meta.env.DEV) {
  await import('./source-map-support');
}

const app = new Hono();

app.use(timing());
app.use(
  secureHeaders({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    xDnsPrefetchControl: false,
    xDownloadOptions: false,
    xFrameOptions: 'DENY',
    xPermittedCrossDomainPolicies: false,
    xXssProtection: '1',
  }),
);

if (import.meta.env.PROD) {
  app.use(
    serveStatic({
      onFound: (path, c) => {
        let value: string;

        if (path.startsWith('client/assets')) {
          value = cacheHeader({ immutable: true, maxAge: '1y', public: true });
        } else if (path.endsWith('.html')) {
          value = cacheHeader({ maxAge: '1m', mustRevalidate: true, public: true, staleWhileRevalidate: '5m' });
        } else {
          value = cacheHeader({ maxAge: '1h', mustRevalidate: true, public: true, staleWhileRevalidate: '5h' });
        }

        c.header('Cache-Control', value);
      },
      root: 'client',
    }),
  );
}

app.get('*', async (c, next) => {
  if (c.req.path.at(-1) === '/' && c.req.path !== '/') {
    const url = new URL(c.req.url);
    url.pathname = url.pathname.substring(0, url.pathname.length - 1);

    return c.redirect(url);
  }

  await next();
});

// eslint-disable-next-line import/no-unresolved
const serverBuild: ServerBuild = await import('virtual:react-router/server-build');

app.use(
  createRequestHandler({
    build: serverBuild,
    getLoadContext: (c) => ({
      serverBuild,
      timing: {
        endTime: endTime.bind(null, c),
        startTime: startTime.bind(null, c),
      },
    }),
  }),
);

if (import.meta.env.PROD) {
  const hostname = process.env.HOSTNAME || '0.0.0.0';
  const port = Number(process.env.PORT) || 3000;

  const server = serve(
    {
      fetch: app.fetch,
      hostname,
      port,
      serverOptions: {
        keepAlive: true,
        keepAliveTimeout: 20_000,
      },
    },
    () => {
      const end = performance.now();

      const localUrl = styleText('cyan', `http://localhost:${styleText('bold', port.toString())}`);
      let lanUrl: string | null = null;
      const localIp = ip();
      if (localIp && /^10\.|^172\.(1[6-9]|2\d|3[01])\.|^192\.168\./.test(localIp)) {
        lanUrl = styleText('cyan', `http://${localIp}:${styleText('bold', port.toString())}`);
      }

      console.log(
        [
          `${styleText('gray', 'ready in')} ${styleText('bold', (end - start).toFixed(2))} ms`,
          `${styleText('green', '➜')} ${styleText('bold', 'Local')}:   ${localUrl}`,
          lanUrl && `${styleText('green', '➜')} ${styleText('bold', 'Network')}: ${lanUrl}`,
        ]
          .filter(Boolean)
          .join('\n')
          .trim(),
      );
    },
  );

  gracefulShutdown(server);
}

export default app;
