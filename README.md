# Clinton Obi Portfolio

A premium minimalist personal portfolio for Clinton Obi, focused on IT Support, Digital Marketing, SEO, content strategy, data and AI-supported workflows.

The site is intentionally lightweight. It remains a static website, but includes an editable dashboard through Decap CMS so content can be updated without touching the code.

## Main Features

- Premium minimalist responsive design
- Editable portfolio content stored in `content/site.json`
- Admin dashboard available at `/admin/`
- Netlify Forms-ready contact form
- Netlify-friendly deployment setup
- Simple local development workflow

## Project Structure

```text
.
├── admin/
│   ├── config.yml
│   └── index.html
├── assets/
├── content/
│   └── site.json
├── css/
│   └── style.css
├── js/
│   └── app.js
├── scripts/
│   └── build.js
├── index.html
├── netlify.toml
├── package.json
└── README.md
```

## Run Locally

```bash
npm install
npm run dev
```

Then open the local URL shown in your terminal.

## Build Check

```bash
npm run build
```

This validates the required static files and checks that `content/site.json` is valid JSON.

## Editing Content

Most website text, sections, skills, projects, experience and links are controlled from:

```text
content/site.json
```

Once deployed on Netlify and CMS access is enabled, visit:

```text
/admin/
```

## Netlify CMS Setup

To use the admin dashboard:

1. Deploy this repository to Netlify.
2. In Netlify, enable Identity.
3. Enable Git Gateway.
4. Invite your email as a user.
5. Visit `/admin/` on the live site.
6. Log in and edit the portfolio content.

## Important Notes

- The default branch is `master`.
- The site publishes from the repository root.
- Uploaded media from the dashboard goes into the `assets` folder.
- Keep `content/site.json` valid JSON if editing manually.
