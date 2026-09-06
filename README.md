# creative-turns-makeup

Handmade crochet and makeup products — product catalog with WhatsApp ordering, built with React + Vite.

## Getting started

```bash
npm install
npm start        # full local stack incl. /admin auth (http://localhost:8888)
npm run dev      # Vite only, no edge functions (http://localhost:5173)
npm run build    # production bundle into dist/
npm run preview  # serve the production build
```

`npm start` runs `netlify dev`, which is the only way to exercise `/admin` and the
OAuth functions locally — plain `npm run dev` does not run functions, and it also
serves `/admin/` incorrectly because Vite's SPA fallback intercepts it.

Copy `.env.example` to `.env` first and fill in the GitHub OAuth app values.

## Structure

```
index.html              Vite entry (fonts + #root)
src/main.jsx            React root
src/App.jsx             page composition
src/styles.css          the site stylesheet (plain CSS, unchanged)
src/components/         Nav, Hero, Intro, Section, Gallery, Quilt, Gifting, CallToAction, Footer, Icons
src/data/*.js           thin re-exports of the content files below
content/*.json          all editable text and photo references
public/images/          photos uploaded through the CMS
public/admin/           the browser-based editing screen (Decap CMS)
netlify/functions/      GitHub OAuth handshake for the CMS login
netlify.toml            build + deploy-preview settings
legacy-index.html       the original static page, kept for reference
```

All copy and product data lives in `content/*.json` — no text is hardcoded in
components. Edit those files directly, or use the editing screen described below.

## Editing without a terminal

Non-technical editors change text and photos at `/admin/` on the deployed site.
Saving creates a draft with its own preview URL; pressing Publish merges it to
`main` and the site redeploys.

Access is controlled by one thing: **GitHub collaborator permission on a private
repo.** `/admin` is a public URL, but a visitor without repo access gets a token
that can neither read nor write, so the editor is an empty shell to them.

The GitHub login handshake is self-hosted in `netlify/functions/` because
Netlify's old hosted service at `api.netlify.com/auth` now returns 404.

- **[SETUP.md](SETUP.md)** — one-time Netlify + GitHub setup (for you)
- **[EDITING.md](EDITING.md)** — plain-language guide (for the editor)

### Note on this machine

`npm install` and `netlify dev` both fail here with
`UNABLE_TO_GET_ISSUER_CERT_LOCALLY` unless Node is pointed at a CA bundle. Fix it
once by adding this to `~/.zshrc`:

```sh
export NODE_EXTRA_CA_CERTS=/opt/homebrew/etc/ca-certificates/cert.pem
```
