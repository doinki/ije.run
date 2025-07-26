import { GeneralErrorBoundary } from '~/components/common/error-boundary';

export const loader = () => {
  throw new Response('This page could not be found.', { status: 404 });
};

export const action = () => {
  throw new Response('This page could not be found.', { status: 404 });
};

export default function Page() {
  return <GeneralErrorBoundary />;
}

export { GeneralErrorBoundary as ErrorBoundary } from '~/components/common/error-boundary';
