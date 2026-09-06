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
   place, scoped to **all scopes**:

   | Key | Value |
   |---|---|
   | `GITHUB_CLIENT_ID` | the Client ID |
   | `GITHUB_CLIENT_SECRET` | the secret |

   Scope them to **all scopes**, then redeploy.

The secret only ever lives in Netlify's environment. It is never in the repo and
never reaches the browser.

## 6. Make the repo private

**GitHub → repo Settings → General → Danger Zone → Change repository visibility
→ Make private.**

This is what keeps the site private, and it is why your friend only needs one
login. With a private repo, anyone who opens `/admin` and signs in with a GitHub
account that is not a collaborator gets a token that cannot read the repo at all
— the editor loads empty and does nothing.

Netlify keeps building a private repo normally on the free tier.

## 7. Invite your friend

GitHub → repo **Settings → Collaborators → Add people**. Give her **Write**
access. She accepts the emailed invite — that is the only time she sees GitHub.

## 8. Send her the link

Send her `https://creativeturns.netlify.app/admin/` and `EDITING.md`. Tell her to
bookmark the link. There is no password to pass on — her GitHub account is the
only credential.

---

## How the flow works underneath

| She does | What actually happens |
|---|---|
| Opens `/admin/` and logs in with GitHub | OAuth via this site's own functions, token stored in her browser |
| Edits and clicks **Save** | Commit on a `cms/...` branch + a pull request |
| Waits for the preview link | Netlify builds a Deploy Preview of that branch |
| Sets status to **Ready**, clicks **Publish** | PR merges to `main` |
| — | Netlify rebuilds `main`, change is live in ~1 minute |

Nothing reaches `main` until she presses Publish, and every change is an ordinary
commit — so `git revert` undoes anything that goes wrong.

## Where the security actually lives

One lock, in the right place: **GitHub collaborator access on a private repo.**

`/admin` is a public URL and always will be — it is a static page on a public
site. That does not matter. Because the repo is private, a stranger who loads it
and signs in gets a token that can neither read nor write anything, so the editor
is an empty shell to them.

Revoking access is therefore one action: remove her as a collaborator. There is
no shared password to rotate for everyone else.

## Guardrails worth knowing

- Deleting whole content files is disabled (`delete: false`), so she can't remove
  a page section wholesale by accident.
- She can still edit product text and photos freely — that's the point.
- Photos she uploads are committed to `public/images/`. Large photos make the repo
  grow; ask her to keep them under ~500 KB, or add an image CDN later.
- If she edits at the same time as you, the CMS branch and your `main` can diverge.
  Coordinate, or just let her own the content files.
