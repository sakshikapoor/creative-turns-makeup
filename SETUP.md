# One-time setup (for Sakshi)

Do these once. After that your friend only ever visits one web address.

## 1. Push this repo to GitHub

Nothing here is set up yet on the remote — commit and push to
`github.com/sakshikapoor/creative-turns-makeup` on `main`.

## 2. Connect the repo to Netlify

1. Sign in at [netlify.com](https://netlify.com) with GitHub.
2. **Add new site → Import an existing project → GitHub →** pick this repo.
3. Netlify reads `netlify.toml`, so build command (`npm run build`) and publish
   directory (`dist`) are already correct. Click **Deploy**.
4. When it finishes, note the live URL, e.g. `https://creative-turns.netlify.app`.
5. Rename the site to something memorable under **Site configuration → Change site name**.

## 3. Put the real URL in the CMS config

Edit `public/admin/config.yml` and replace both placeholder URLs with your real
Netlify URL:

```yaml
site_url: https://creativeturns.netlify.app
display_url: https://creativeturns.netlify.app
```

## 4. Turn on Deploy Previews

**Site configuration → Build & deploy → Deploy Previews → Any pull request.**

This is the piece that makes "stage mode" work: each draft your friend saves gets
its own temporary URL so she can see the change before it goes live.

## 5. Let the editor screen log in with GitHub

Netlify used to host this handshake at `api.netlify.com/auth`. **That service now
returns 404**, so this site runs its own instead — `netlify/functions/oauth-*.mjs`.
Nothing to deploy separately; it ships with the site.

You still need a GitHub OAuth app so GitHub knows to trust the site:

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
   - Application name: `Creative Turns editor`
   - Homepage URL: `https://creativeturns.netlify.app`
   - **Authorization callback URL: `https://creativeturns.netlify.app/oauth/callback`**

   That callback URL must match exactly — it is the single most common thing to
   get wrong, and a mismatch gives a GitHub error page rather than a login.

2. Click **Generate a new client secret**. Copy the **Client ID** and the
   **secret** now; GitHub will not show the secret again.

3. Add them in Netlify → **Site configuration → Environment variables**, the same
   place as the editor password:

   | Key | Value |
   |---|---|
   | `GITHUB_CLIENT_ID` | the Client ID |
   | `GITHUB_CLIENT_SECRET` | the secret |

   Scope them to **all scopes**, then redeploy.

The secret only ever lives in Netlify's environment. It is never in the repo and
never reaches the browser.

## 6. Set the editor password

The `/admin` screen sits behind a username and password as well as the GitHub
login. Set them in **Site configuration → Environment variables**:

| Key | Value |
|---|---|
| `ADMIN_USER` | e.g. `creativeturns` |
| `ADMIN_PASSWORD` | a strong password you choose |

Along with `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` from step 5 — all four
belong here.

Set the scope to **All deploy contexts** so deploy previews are protected too.

> If these are missing the editor screen returns 503 for everyone — it fails
> closed on purpose, so a misconfiguration can never leave it wide open.

Locally these come from `.env` instead (copy `.env.example` to `.env`).

## 7. Invite your friend

GitHub → repo **Settings → Collaborators → Add people**. Give her **Write**
access. She accepts the emailed invite — that is the only time she sees GitHub.

## 8. Send her the link

Send her `https://creativeturns.netlify.app/admin/`, plus the username and password
from step 6, and `EDITING.md`. Tell her to bookmark the link.

Send the password over something other than the same channel as the link if you
can — WhatsApp for one, email for the other.

---

## How the flow works underneath

| She does | What actually happens |
|---|---|
| Opens `/admin/` | Browser asks for the username and password (edge function) |
| Logs in with GitHub | GitHub OAuth, token stored in her browser |
| Edits and clicks **Save** | Commit on a `cms/...` branch + a pull request |
| Waits for the preview link | Netlify builds a Deploy Preview of that branch |
| Sets status to **Ready**, clicks **Publish** | PR merges to `main` |
| — | Netlify rebuilds `main`, change is live in ~1 minute |

Nothing reaches `main` until she presses Publish, and every change is an ordinary
commit — so `git revert` undoes anything that goes wrong.

## The two locks

They protect different things and neither replaces the other:

1. **Username and password** (`netlify/edge-functions/admin-auth.js`) stops
   anyone from *loading* the editor screen. `/admin/` is a public URL otherwise —
   this is what keeps strangers out.
2. **GitHub collaborator access** stops anyone from *saving* a change. Even
   someone who got past the password cannot write to the repo without it.

Changing the password is a Netlify environment variable edit plus a redeploy; it
does not require a code change.

## Guardrails worth knowing

- Deleting whole content files is disabled (`delete: false`), so she can't remove
  a page section wholesale by accident.
- She can still edit product text and photos freely — that's the point.
- Photos she uploads are committed to `public/images/`. Large photos make the repo
  grow; ask her to keep them under ~500 KB, or add an image CDN later.
- If she edits at the same time as you, the CMS branch and your `main` can diverge.
  Coordinate, or just let her own the content files.
