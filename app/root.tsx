import notoSansKr from '@fontsource-variable/noto-sans-kr?url';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import type { Route } from './+types/root';
import { Progress } from './components/ui/progress';
import { ThemeScript } from './components/ui/theme-switch';
import tailwindcss from './tailwind.css?url';

export const links: Route.LinksFunction = () => [
  {
    href: tailwindcss,
    rel: 'stylesheet',
  },
  {
    href: notoSansKr,
    rel: 'stylesheet',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
        <ThemeScript />
      </head>
      <body>
        <Progress />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export { GeneralErrorBoundary as ErrorBoundary } from './components/common/error-boundary';
