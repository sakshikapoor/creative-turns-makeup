// HTTP Basic Auth in front of the CMS editing screen.
//
// This is a second, independent lock. The real protection on the *content* is
// GitHub repo write access — this just stops strangers from loading the editor
// at all. Credentials come from environment variables, never from this file.

const REALM = 'Creative Turns editor';

function challenge(body = 'Authentication required.') {
  return new Response(body, {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

// Compare without leaking which character differed via timing.
function safeEqual(a, b) {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

function decodeCredentials(header) {
  if (!header) return null;
  const [scheme, encoded] = header.split(' ');
  if (!encoded || scheme.toLowerCase() !== 'basic') return null;
  let decoded;
  try {
    // atob yields a byte string; decode it as UTF-8 so non-ASCII passwords work.
    const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
    decoded = new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
  // Only the first colon separates user from password; passwords may contain colons.
  const split = decoded.indexOf(':');
  if (split === -1) return null;
  return { user: decoded.slice(0, split), pass: decoded.slice(split + 1) };
}

export default async (request, context) => {
  const expectedUser = Netlify.env.get('ADMIN_USER');
  const expectedPass = Netlify.env.get('ADMIN_PASSWORD');

  // Fail closed. A missing or empty variable must never mean "let everyone in".
  if (!expectedUser || !expectedPass) {
    return new Response(
      'Editor login is not configured. Set ADMIN_USER and ADMIN_PASSWORD.',
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const creds = decodeCredentials(request.headers.get('authorization'));
  if (!creds) return challenge();

  // Evaluate both halves before returning so a wrong username and a wrong
  // password take the same path.
  const userOk = safeEqual(creds.user, expectedUser);
  const passOk = safeEqual(creds.pass, expectedPass);
  if (!(userOk && passOk)) return challenge('Wrong username or password.');

  // Authenticated: serve the page, but keep it out of any shared CDN cache.
  const response = await context.next();
  const out = new Response(response.body, response);
  out.headers.set('Cache-Control', 'no-store');
  return out;
};

export const config = {
  path: ['/admin', '/admin/*'],
};
