# Prakhar Technology Website

Source for **[www.prakhartech.com](https://www.prakhartech.com)**, the website of Prakhar Technology, a Pune-based company that sells GPS vehicle tracking systems, the Elide Fire Ball fire extinguisher, and industrial & office supplies.

The site was converted from an old static HTML/CSS site into a React single-page app built with Vite, and is hosted on GitHub Pages.

## Tech stack

- **React 19** + **React Router 7**
- **Vite** (rolldown-vite) for dev server and builds
- **Vitest** + Testing Library for unit tests (jsdom)
- **Playwright** for end-to-end tests
- **ESLint** for linting
- **GitHub Actions** + **GitHub Pages** for CI and deployment

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test:unit` | Run Vitest unit tests |
| `npm run test:unit:watch` | Run Vitest in watch mode |
| `npm run test:unit:report` | Unit tests with a v8 coverage report (`coverage/`) |
| `npm run test:e2e` | Run Playwright e2e tests (starts the dev server automatically) |
| `npm run test:e2e:ui` | Run Playwright in UI mode |
| `npm test` | Unit tests, then Playwright in UI mode |

First time running e2e tests? Install the browsers with `npx playwright install`.

## Site sections

| Area | Routes |
|---|---|
| Company | `/`, `/about`, `/contact`, `/enquiry`, `/demo`, `/faq`, `/downloads` |
| GPS tracking | `/products`, `/softwares`, `/vehicle-fleet`, `/security`, `/personal`, `/whychoose`, `/whygps` |
| Elide Fire Ball | `/elidefireball` and its sub-pages: `product-overview`, `faq`, `health-and-safety`, `disposal`, `product-warrantee`, `patents`, `the-elide-fire-ball-story` |
| Supplies | `/stationery`, `/gifts` |

## Project structure

```
├── index.html              # Vite entry HTML (SEO meta tags)
├── public/                 # Static assets served as-is
│   ├── images/ css/ js/ font/
│   ├── elidefireball/      # Elide Fire Ball assets and user manual
│   ├── stationery/         # Product photos and client logos
│   ├── 404.html            # GitHub Pages SPA fallback
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── App.jsx             # Route definitions
│   ├── components/         # Layout, EnquiryForm, ElideSubnav, ScrollToTop
│   ├── pages/              # One component per page
│   ├── data/contactInfo.js # Phone numbers, emails, office addresses
│   └── test/               # Vitest unit tests
├── tests/e2e/              # Playwright specs
└── .github/workflows/      # CI and deployment
```

To change contact details across the site, edit `src/data/contactInfo.js`.

## Branching and deployment

```
feature work ──► dev ──(Dev CI: unit + e2e tests)──► main ──(Production Deploy)──► GitHub Pages
```

1. **Push to `dev`.** The **Dev CI & Auto-Merge** workflow (`dev-ci.yml`) runs the unit and Playwright tests.
   - **Tests pass:** `dev` is merged into `main` automatically, and any open `ci-fail` issues are closed.
   - **Tests fail:** an issue labelled `ci-fail` is opened with the end of the test log.
2. **Push to `main`.** The **Production Deploy** workflow (`production-deploy.yml`) builds the site and publishes `dist/` to GitHub Pages.

Setup notes:
- In **Settings → Pages**, set the source to **GitHub Actions**.
- The auto-merge step needs a `GH_PAT` repository secret (a token with `contents: write`).
- The custom domain is set by the `CNAME` file (`www.prakhartech.com`).
- `deploy.yml.disabled` is an old workflow kept for reference. It does not run.

## Contact

Prakhar Technology · LG 03, Phoenix Market City, East Court, Viman Nagar, Pune 411014 · [prashant@prakhartech.com](mailto:prashant@prakhartech.com)
