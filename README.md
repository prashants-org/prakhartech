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
| `npm run build` | Production build to `dist/`, with every page prerendered |
| `npm run optimize:images` | Convert new PNG/JPG images in `public/` to WebP |
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

Every URL lives in [`src/routes.js`](src/routes.js), together with its title, description and sitemap priority. The router, the per-page `<head>` tags, the prerender and `sitemap.xml` are all generated from that one list, so **to add a page: create `src/pages/MyPage.jsx` and add one entry to `routes.js`.**

| Area | Routes |
|---|---|
| Company | `/`, `/about`, `/contact`, `/whychoose`, `/downloads`, `/enquiry`, `/demo` |
| GPS & fleet | `/vehicle-fleet`, `/products`, `/software`, `/security`, `/personal`, `/whygps`, `/faq`, `/fleet-savings-calculator` |
| Fire safety (Elide Fire Ball) | `/elidefireball` and `product-overview`, `faq`, `health-and-safety`, `disposal`, `product-warranty`, `patents`, `the-elide-fire-ball-story` |
| Workplace supplies | `/stationery`, `/gifts`, `/corporate-gifting` (seasonal: update `SEASON` in `CorporateGifting.jsx` each year) |

Old URLs `/softwares` and `/elidefireball/product-warrantee` redirect to their new addresses.

## How it works

- **Prerendering.** `npm run build` builds the client, builds a server bundle (`src/entry-server.jsx`), then `scripts/prerender.mjs` renders every route to static HTML in `dist/` (`about.html` and `about/index.html`), plus a real `404.html` and `sitemap.xml`. Crawlers get the full page with its own title and canonical; the browser then hydrates it. `npm run dev` is a normal SPA.
- **Enquiries.** Every form uses `useEnquiryForm` (`src/hooks`) and `src/lib/enquiry.js`: validation, a honeypot field against bots, and delivery through FormSubmit to `contactInfo.enquiryEmail`. Open the site-wide form from anywhere with `openEnquiry({ interest, message })`.
- **Quote basket.** Stationery and gift products have *Add to quote*; buyers send one request for many items. State lives in `src/components/quote/`.
- **Analytics.** Off by default. Set the repository variable `VITE_PLAUSIBLE_DOMAIN` (recommended: cookieless, no consent banner) or `VITE_GA_ID`. Conversion events: `enquiry_submit`, `quote_submit`, `whatsapp_click`, `call_click`, `calculator_estimate`.
- **Styles.** `src/App.css` holds the base design system; `src/styles/components.css` the shared components; each section (`home`, `elide`, `gifts`, `stationery`, `calculator`, `gifting`) has its own stylesheet that loads only with its pages. Business-line accents are CSS variables: `--fleet`, `--safety`, `--workplace`.
- **Brand.** The logos are vector files in `public/brand/` (`prakhar-icon.svg`, `prakhar-logo.svg`, `prakhar-icon-reversed.svg` for dark backgrounds). After changing them, run `node scripts/brand-assets.mjs` to regenerate the favicon, app icons and the social share image.
- **Elide pages.** `src/data/elide.js` lists every Elide page (feeding the Fire Safety menu and the related-links strip), the fire classes, and the embedded videos from the official [ELIDE FIRE® YouTube channel](https://www.youtube.com/c/ELIDEFIREextinguishingball). Videos are embedded, not re-hosted, and the player only loads on click.
- **Images.** Put PNG/JPG files in `public/`, then run `npm run optimize:images -- --prune` to convert them to WebP and update references.

## Project structure

```
├── index.html                # HTML shell (head markers are filled per page at build time)
├── scripts/
│   ├── prerender.mjs         # Static HTML for every route + 404 + sitemap
│   └── optimize-images.mjs   # PNG/JPG → WebP
├── public/                   # Static assets (images, logos, PDFs)
├── src/
│   ├── routes.js             # Every URL, title, description
│   ├── App.jsx               # Router built from routes.js
│   ├── entry-server.jsx      # Build-time renderer
│   ├── components/           # Layout, SiteNav, Modal, EnquiryForm, quote basket, home visuals
│   ├── hooks/                # useEnquiryForm
│   ├── lib/                  # seo, enquiry, analytics, fleetSavings, structuredData
│   ├── data/                 # contactInfo, navigation, clients, gifts
│   ├── pages/                # One component per page
│   ├── styles/               # Per-section stylesheets
│   └── test/                 # Vitest unit tests
├── tests/e2e/                # Playwright specs
└── .github/workflows/        # CI and deployment
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
