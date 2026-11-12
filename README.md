# Clever Traction — clevertraction.com

> From Strategy to Traction. Growth that sticks.

Marketing website for **Clever Traction**, a boutique growth accelerator and fractional CMO service for B2B / SaaS / Tech companies.

A fast, dependency-free static site: plain HTML, CSS and JavaScript. No build step.

## Structure

```
.
├── index.html            # Single-page site (hero, approach, services, add-ons, process, FAQ, contact)
├── 404.html              # Not-found page
├── assets/
│   ├── css/styles.css    # All styles (brand tokens at the top in :root)
│   └── js/main.js        # Nav, scroll reveal, counters, contact form
├── favicon.svg
├── CNAME                 # clevertraction.com (GitHub Pages custom domain)
├── robots.txt
└── sitemap.xml
```

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

### Option 1 — GitHub Pages (free)
1. Push this repo to GitHub.
2. **Settings → Pages →** Source: `Deploy from a branch`, branch `main`, folder `/ (root)`.
3. The `CNAME` file already sets the custom domain to `clevertraction.com`.
4. At your domain registrar, add DNS records:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www` → `<your-github-username>.github.io`
5. Back in Settings → Pages, tick **Enforce HTTPS** once the certificate is issued.

### Option 2 — Netlify / Vercel / Cloudflare Pages
Import the repo, leave the build command empty and set the publish directory to `/`. Then add `clevertraction.com` as a custom domain in the dashboard and follow its DNS instructions. (You can delete `CNAME` on these hosts.)

## Contact form

By default the form opens the visitor's email client addressed to `nicki.vt@gmail.com`.
To receive submissions directly instead, create a form endpoint (e.g. [Formspree](https://formspree.io), Basin, or Netlify Forms) and set it at the top of `assets/js/main.js`:

```js
var CONTACT_EMAIL = "nicki.vt@gmail.com";
var FORM_ENDPOINT = "https://formspree.io/f/your-id";
```

## Customising

- **Brand colours & fonts:** edit the variables in `:root` at the top of `assets/css/styles.css`.
  - Ink `#0B1410` · Moss `#1F3A2E` · Paper `#F4F1EA` · Traction Lime `#C8F03C`
  - Display: Bricolage Grotesque · Body: Inter · Labels: JetBrains Mono (Google Fonts)
- **Copy:** all text lives in `index.html`, grouped by commented sections.
- **Social preview image:** add `assets/img/og.png` (1200×630) and an `<meta property="og:image">` tag in `index.html`.
- **Analytics:** paste your GA4 / Plausible / PostHog snippet before `</head>` in `index.html`.

## Before launch checklist

- [ ] Contact email is `nicki.vt@gmail.com` — swap for a branded address later in `index.html` and `main.js` if you set one up
- [ ] Connect a form endpoint
- [ ] Add analytics
- [ ] Add OG image
- [ ] Add privacy policy / imprint page if required in your jurisdiction (GDPR)
