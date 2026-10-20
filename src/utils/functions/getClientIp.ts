export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-nf-client-connection-ip') ??
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown'
  );
}
