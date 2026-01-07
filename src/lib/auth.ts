export function getToken(): string | null {
  return localStorage.getItem('authToken');
}

export function parseJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const json = decodeURIComponent(
      atob(payload)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
}

export function getUserFromToken() {
  const t = getToken();
  if (!t) return null;
  return parseJwt(t);
}

export function isProvider() {
  const u = getUserFromToken();
  return u && u.role === 'Provider';
}
