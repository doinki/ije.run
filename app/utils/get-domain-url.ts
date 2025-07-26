export function getDomainUrl(request: Request): string {
  const protocol = request.headers.get('X-Forwarded-Proto') ?? new URL(request.url).protocol.replace(':', '');
  const host = request.headers.get('X-Forwarded-Host') ?? request.headers.get('host') ?? new URL(request.url).host;

  return `${protocol}://${host}`;
}
