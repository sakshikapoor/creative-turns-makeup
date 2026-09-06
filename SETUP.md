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
site_url: https://YOUR-SITE.netlify.app
display_url: https://YOUR-SITE.netlify.app
```

## 4. Turn on Deploy Previews

**Site configuration → Build & deploy → Deploy Previews → Any pull request.**

This is the piece that makes "stage mode" work: each draft your friend saves gets
its own temporary URL so she can see the change before it goes live.

## 5. Let the editor screen log in with GitHub

The CMS needs permission to commit on her behalf. Create a GitHub OAuth app and
hand the credentials to Netlify:

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
   - Application name: `Creative Turns editor`
   - Homepage URL: your Netlify URL
   - Authorization callback URL: `https://api.netlify.com/auth/done`
2. Generate a client secret and copy both the **Client ID** and **Client Secret**.
3. In Netlify: **Site configuration → Access control → OAuth → Install provider →
   GitHub**, and paste the two values.

> If Netlify's hosted OAuth provider is unavailable on your plan, the alternative
> is a small OAuth relay you deploy once (a Netlify Function or Cloudflare Worker)
> and point at with a `base_url` line in `config.yml`. Ask and I'll add it.

## 6. Set the editor password

The `/admin` screen sits behind a username and password as well as the GitHub
login. Set them in **Site configuration → Environment variables**:

| Key | Value |
|---|---|
| `ADMIN_USER` | e.g. `creativeturns` |
| `ADMIN_PASSWORD` | a strong password you choose |

Set the scope to **All deploy contexts** so deploy previews are protected too.

> If these are missing the editor screen returns 503 for everyone — it fails
> closed on purpose, so a misconfiguration can never leave it wide open.

Locally these come from `.env` instead (copy `.env.example` to `.env`).

## 7. Invite your friend

GitHub → repo **Settings → Collaborators → Add people**. Give her **Write**
access. She accepts the emailed invite — that is the only time she sees GitHub.

## 8. Send her the link

Send her `https://YOUR-SITE.netlify.app/admin/`, plus the username and password
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
