// Step 1 of the GitHub login: send the editor to GitHub to approve access.
//
// Replaces Netlify's old hosted OAuth service (api.netlify.com/auth), which now
// returns 404. Decap opens this in a popup; GitHub sends the user back to
// /oauth/callback with a short-lived code.

export default async (req) => {
  const clientId = process.env.GITHUB_CLIENT_ID;

  // Fail closed, and say which half is missing so setup mistakes are obvious.
  if (!clientId) {
    return new Response(
      'GitHub login is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.',
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const origin = new URL(req.url).origin;

  // A random state ties this request to the callback, so someone else cannot
  // feed us a code they obtained elsewhere.
  const state = crypto.randomUUID();

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', `${origin}/oauth/callback`);
  authorize.searchParams.set('scope', 'repo');
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      'Set-Cookie': `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
      'Cache-Control': 'no-store',
    },
  });
};

export const config = { path: '/oauth/auth' };
