# QA Instructions — Cakish

## Project Overview

**What it is**: A Next.js 16 + React 19 + Tailwind 4 static website for "Cakish", a premium pavlova brand based in Wicklow, Ireland. Three pages (Home, Story, Order) with a client-side order configurator.

**Tech stack**: Next.js 16.2.1, React 19, Tailwind CSS 4, TypeScript 5, static export (`output: "export"`).

**Deployment target**: GitHub Pages via `.github/workflows/deploy-pages.yml`. The static export goes to the `out/` directory and is uploaded as a Pages artifact.

**Live URL pattern**: `https://<user>.github.io/cakish/`

## Deployment Topology

### Build Pipeline
1. Push to `main` → GitHub Actions triggers `deploy-pages.yml`
2. `npm ci` → `npm run build` (with `GITHUB_ACTIONS=true` env var)
3. Next.js static export produces the `out/` directory
4. `actions/upload-pages-artifact@v3` uploads `out/` → `actions/deploy-pages@v4` deploys

### Code Transformations at Deploy
- **basePath**: `/cakish` is prepended to all routes when `GITHUB_ACTIONS=true`
- **assetPrefix**: `/cakish/` is prepended to all static assets
- **`NEXT_PUBLIC_BASE_PATH`**: Set to `/cakish` at build time, inlined into client JS via `process.env.NEXT_PUBLIC_BASE_PATH`
- **Images**: `unoptimized: true` (no Next.js image optimization server — required for static export)
- **trailingSlash**: `true` — all routes end with `/` (e.g., `/cakish/order/`)

### Environment Differences (Local vs Production)
| Concern | Local (`npm run dev`) | Production (GitHub Pages) |
|---|---|---|
| `basePath` | `""` (empty) | `/cakish` |
| `assetPrefix` | `""` (empty) | `/cakish/` |
| Image paths | `/images/foo.jpeg` | `/cakish/images/foo.jpeg` |
| Navigation hrefs | `/order` | `/cakish/order/` |
| `NEXT_PUBLIC_BASE_PATH` | `""` | `/cakish` |

### ⚠️ Known Deployment Landmine
The `assetPath()` helper (`lib/asset-path.ts`) reads `process.env.NEXT_PUBLIC_BASE_PATH` which is inlined at build time. Any image or asset that bypasses `assetPath()` and uses a raw `/images/...` path **will break on GitHub Pages**. This has happened before — see git history: commits `625a304`, `1b7fed8`, `0f18da3`.

## Critical Paths

### 1. Asset Path Handling (HIGH PRIORITY)
Every `<Image src=...>` and asset reference must go through `assetPath()`. If a developer adds a new image and uses a raw path, it will work locally but break in production.

**What to check**:
- Every `<Image>` component uses `assetPath()` for its `src` prop
- No hardcoded `/images/...` paths anywhere in JSX
- The `BrandLogo` component correctly uses `assetPath()`
- `assetPath()` does not double-prefix (e.g., `/cakish/cakish/...`)
- `assetPath()` handles paths with and without leading `/`

### 2. Navigation Links (HIGH PRIORITY)
Next.js `<Link>` components automatically prepend `basePath`. Raw `<a href=...>` tags do not.

**What to check**:
- All internal navigation uses `<Link>` from `next/link`, not `<a>`
- External links (email, Instagram) correctly use `<a>` with full URLs
- `isActive()` in `SiteHeader` correctly detects the active page on both local and GitHub Pages
- Footer links use `<Link>`, not `<a>`

### 3. Order Configurator (MEDIUM PRIORITY)
The order configurator is the most interactive component. It has client-side state, pricing calculations, clipboard API usage, and a slide-out drawer.

**What to check**:
- Pricing math: `unitPrice = basePrice + surcharge`, `total = unitPrice × quantity`
- Quantity cannot go below 1
- No upper bound on quantity (design question: is this intentional?)
- `navigator.clipboard.writeText()` requires HTTPS or localhost — will fail on HTTP
- Inquiry summary text is correctly formatted with all selected options
- Drawer/overlay open/close state management
- "Pay Securely Online" button shows "coming soon" dialog (not a real payment flow)
- Keyboard accessibility: can users navigate size/finish options and quantity via keyboard?

### 4. Mobile Responsiveness (MEDIUM PRIORITY)
The site uses Tailwind responsive prefixes (`md:`, `lg:`, `sm:`) extensively.

**What to check**:
- Hero section: image-first on mobile, text-first on desktop (order-1/order-2 swap)
- Navigation: horizontal scrollable on mobile, wrapping on desktop
- Sticky header doesn't overlap content on mobile
- Order configurator layout stacks properly on small screens
- Checkout drawer is full-width on mobile

### 5. Static Export Integrity (MEDIUM PRIORITY)
Since this is `output: "export"`, certain Next.js features are unavailable.

**What to check**:
- No `getServerSideProps` or dynamic server features used
- No API routes (would fail in static export)
- All pages are pre-rendered at build time
- `404.html` is generated (Next.js does this via `/_not-found`)
- No `next/headers` or `next/cookies` usage in pages

## Project-Specific QA Checklist

### Before Every PR
- [ ] `npm run build` succeeds without errors or warnings
- [ ] `npm run lint` passes
- [ ] All `<Image>` sources use `assetPath()`
- [ ] All internal links use `<Link>` from `next/link`
- [ ] New images added to `public/images/` are referenced correctly
- [ ] No `console.log` statements left in production code
- [ ] Pricing calculations in `productConfig` are correct (check surcharges)

### Before Every Deploy
- [ ] Build with `GITHUB_ACTIONS=true` locally to verify basePath handling:
  ```bash
  GITHUB_ACTIONS=true npm run build
  ```
- [ ] Verify `out/` directory contains all expected pages and assets
- [ ] Spot-check that image paths in generated HTML include `/cakish/` prefix

### Accessibility Minimums
- [ ] All images have descriptive `alt` text
- [ ] Interactive elements (buttons, links) are keyboard-focusable
- [ ] `aria-pressed` is used correctly on toggle buttons (size/finish selectors)
- [ ] Checkout drawer has `aria-hidden` and close button with `aria-label`
- [ ] Color contrast meets WCAG AA (check gold text on light backgrounds)

## Files to Watch

| File | Why |
|---|---|
| `lib/asset-path.ts` | Single point of failure for all image/asset paths |
| `next.config.ts` | basePath/assetPrefix changes break production |
| `lib/site-data.ts` | Pricing data — any change affects displayed prices |
| `components/order-configurator.tsx` | Most complex client-side component; pricing logic, clipboard, drawer state |
| `components/site-header.tsx` | `isActive()` logic must handle both local and GitHub Pages pathnames |
| `.github/workflows/deploy-pages.yml` | Build/deploy pipeline — changes here affect production |

## Known Issues from Git History

1. **Logo path breakage** (commits `625a304`, `1b7fed8`, `0f18da3`): The brand logo path has broken multiple times due to confusion about whether `assetPath()` or Next.js `basePath` should handle the prefix. Current solution: `assetPath()` reads `NEXT_PUBLIC_BASE_PATH` which is inlined at build time.
2. **Mobile hero layout** (commit `18ef0fd`): Hero section had incorrect ordering on mobile — image was showing after text instead of before.

## Test Strategy

**Framework**: No tests exist yet. Recommended: Vitest + React Testing Library (compatible with Next.js 16 and React 19).

**Priority test targets**:
1. `assetPath()` — unit tests for path construction with and without basePath
2. `productConfig` pricing — unit tests for all size/finish/quantity combinations
3. `OrderConfigurator` — component tests for state management, pricing display, quantity bounds
4. `SiteHeader.isActive()` — unit tests for active-link detection across environments
5. Snapshot/smoke tests for each page rendering without errors

**Not needed**:
- E2E tests (overkill for a static brochure site)
- API tests (no API routes)
- SSR tests (static export only)

---
Last deep scan: 2025-03-27
