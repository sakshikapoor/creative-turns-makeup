// Step 2 of the GitHub login: trade the code for a token and hand it to Decap.
//
// The client secret is used here and never leaves the server. The token is
// passed to the CMS through postMessage, which is the handshake Decap expects.

const CLEAR_STATE = 'oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0';

// The token goes inside a <script>; escape anything that could close the tag.
function jsString(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

function page(body) {
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Set-Cookie': CLEAR_STATE,
    },
  });
}

function failure(message) {
  return page(`<!doctype html><meta charset="utf-8">
<title>Login failed</title>
<p style="font:16px system-ui;padding:2rem">${message}</p>
<script>
  // Tell the CMS window so it can stop waiting, then close.
  if (window.opener) {
    window.opener.postMessage(
      'authorization:github:error:' + ${jsString(JSON.stringify({ message }))},
      '*'
    );
  }
</script>`);
}

export default async (req) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return failure('GitHub login is not configured on this site.');
  }

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const cookie = req.headers.get('cookie') || '';
  const expected = /(?:^|;\s*)oauth_state=([^;]+)/.exec(cookie)?.[1];

  if (!code) return failure('GitHub did not send an authorisation code.');
  if (!state || !expected || state !== expected) {
    return failure('Login session expired or did not match. Please try again.');
  }

  let token;
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${url.origin}/oauth/callback`,
      }),
    });
    const data = await response.json();
    if (data.error || !data.access_token) {
      return failure(`GitHub refused the login: ${data.error_description || data.error || 'no token returned'}`);
    }
    token = data.access_token;
  } catch {
    return failure('Could not reach GitHub to complete the login.');
  }

  const payload = jsString(JSON.stringify({ token, provider: 'github' }));

  // Decap's handshake: the popup announces itself, the CMS window replies, and
  // only then is the token sent -- back to the exact origin that replied.
  return page(`<!doctype html><meta charset="utf-8">
<title>Signing you in…</title>
<p style="font:16px system-ui;padding:2rem">Signing you in…</p>
<script>
  (function () {
    function receive(e) {
      if (!e.origin || e.origin !== window.location.origin) return;
      window.opener.postMessage('authorization:github:success:' + ${payload}, e.origin);
      window.removeEventListener('message', receive, false);
      window.close();
    }
    window.addEventListener('message', receive, false);
    window.opener.postMessage('authorizing:github', window.location.origin);
  })();
</script>`);
};

export const config = { path: '/oauth/callback' };
