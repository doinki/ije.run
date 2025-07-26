import type { ReactNode } from 'react';
import type { ErrorResponse } from 'react-router';
import { isRouteErrorResponse, useParams, useRouteError } from 'react-router';

import { getErrorMessage } from '~/utils/get-error-message';

type StatusHandler = (info: { error: ErrorResponse; params: Record<string, string | undefined> }) => ReactNode;

export function GeneralErrorBoundary({
  defaultStatusHandler = statusHandler,
  statusHandlers,
  unexpectedErrorHandler = errorHandler,
}: {
  defaultStatusHandler?: StatusHandler;
  statusHandlers?: Record<number, StatusHandler>;
  unexpectedErrorHandler?: (error: unknown) => ReactNode;
}) {
  const params = useParams();
  const error = useRouteError();

  return (
    <div className="grid min-h-svh place-content-center">
      {isRouteErrorResponse(error)
        ? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
            error,
            params,
          })
        : unexpectedErrorHandler(error)}
    </div>
  );
}

function statusHandler({ error }: { error: ErrorResponse }) {
  return (
    <div className="flex h-12 items-center gap-4">
      <h1 className="text-2xl font-medium">{error.status}</h1>
      <hr className="h-full border-r opacity-30" />
      <h2 className="text-sm">{error.data}</h2>
    </div>
  );
}

function errorHandler(error: unknown) {
  return <p className="text-sm">{getErrorMessage(error)}</p>;
}
