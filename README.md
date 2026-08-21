# Clinton Obi Portfolio

A fast, accessible portfolio for Somuadina (Clinton) Obi, focused on IT support, digital marketing, SEO, content systems, analytics and digital operations.

## What is included

- Responsive editorial design with no external font dependency
- Semantic, indexable fallback content plus CMS-driven updates from `content/site.json`
- Real project destinations and lightweight code-native project visuals
- Netlify Forms contact workflow with accessible status feedback
- Invite-only Decap CMS architecture with an unprotected identity callback route
- Administrator-only `/admin/` redirects enforced at Netlify's edge
- Canonical, Open Graph, Twitter Card, sitemap, robots and Person JSON-LD metadata
- Content Security Policy and other browser security headers
- Keyboard-safe mobile navigation and reduced-motion support
- Build checks for content dates, SEO, security, accessibility and social-card dimensions

## Local development

```bash
npm install
npm run dev
```

Run the validation gate with:

```bash
npm run build
```

## Content administration

Portfolio content is stored in `content/site.json`. Approved administrators sign in through `/admin-login/`; successful administrator sessions continue to `/admin/`.

The public home page contains a small callback redirect so Netlify invitation, confirmation and recovery links are handed to the public sign-in route. The CMS bundle is pinned to Decap CMS `3.15.1`.

## Required Netlify settings

These settings must remain aligned with the repository:

1. Identity registration: **Invite only**
2. Email confirmations: **Required**
3. Approved owner account: role **admin**
4. Git Gateway access: role **admin**
5. Form notification for `contact`: `realclintonobi@gmail.com`
6. Production site visibility: **Public** after deployment verification

Do not make the `/admin-login/` route role-protected. It must remain reachable for invitation and account-recovery callbacks. The `/admin/` route and all descendants are protected by role-aware redirects in `netlify.toml`.

## Deployment

Netlify publishes the repository root. The default branch is `master`, and Decap CMS writes approved content changes to that branch through Git Gateway.
