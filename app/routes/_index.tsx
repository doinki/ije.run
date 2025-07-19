import { globSync, readFileSync } from 'node:fs';

import { cacheHeader } from 'pretty-cache-header';

import { convertMdToHtml } from '~/utils/convert-md-to-html';

import type { Route } from './+types/_index';

export const shouldRevalidate = () => false;

export const meta: Route.MetaFunction = () => {
  return [{ description: 'Blog', title: 'Blog' }];
};

export const headers: Route.HeadersFunction = () => {
  return {
    'Cache-Control': cacheHeader({ maxAge: '5m', mustRevalidate: true, public: true, staleWhileRevalidate: '1h' }),
  };
};

export const loader = async () => {
  const files = globSync('app/content/**/*.md');

  return (await Promise.all(files.map((path) => convertMdToHtml(readFileSync(path, 'utf8'))))).map(
    ({ frontmatter }) => frontmatter,
  );
};

export default function Page({ loaderData }: Route.ComponentProps) {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center gap-6 p-6">
      {loaderData.map((post) => (
        <article key={post.title} className="border p-4">
          <header className="mb-2">
            <h2 className="text-xl md:text-2xl">{post.title}</h2>
            <time className="text-neutral-600" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('ko')}
            </time>
          </header>
          <p>{post.description}</p>
          <span className="text-orange-600">Read more</span>
        </article>
      ))}
    </main>
  );
}
