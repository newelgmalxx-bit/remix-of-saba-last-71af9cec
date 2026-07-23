## Goal
Raise Lighthouse Performance to 100 on both desktop and mobile (mobile currently very low, desktop 90). Fix the render-blocking + API-chain issues surfaced in the latest PSI report while keeping all functionality intact.

## Root causes (from the PSI PDF)
1. **API waterfall dominates load** — home page fires ~10 `/api/*` requests during initial render (`settings`, `services`, `portfolio`, `plans`, `site`, `reviews`, `tracking`, `tickets` …). Dependency depth reaches **2.8 s** and inflates FCP/LCP/Speed Index.
2. **Render-blocking font CSS** still costs ~240 ms.
3. **Enormous JS payload (2.67 MB)** — 518 KB unused, 23 KB legacy transforms.
4. **Image delivery** — 438 KB can be saved (dimensions + modern format).
5. **Forced reflow** in `PortfolioSection.tsx` (7 ms).
6. **Accessibility** — non-sequential headings + duplicate link text.
7. Server-side cache lifetime (152 KB) — noted, out of scope for code (documented for hosting).

## Plan

### 1. Kill the API waterfall on first paint
- **Defer tracking hooks past LCP.** Move `useTrackVisit`, `usePageTracking`, `useInjectTracking` out of `__root.tsx`'s synchronous render path — wrap each in `requestIdleCallback` (already partially done for `useInjectTracking`; extend to the two tracking hooks). No `/track` or `/tracking` fetch during the LCP window.
- **Lazy the reviews summary.** `ServicesGrid` calls `useReviewsSummary(slug)` for every card, causing N parallel `/reviews/summary?slug=…` requests before LCP. Batch into a single `/reviews/summary?slugs=…` request OR delay each hook until the card enters the viewport via `IntersectionObserver`. Preferred: viewport-gated fetch (no backend change required).
- **Gate `useSiteSettings` network refresh.** Hook already hydrates from `localStorage` synchronously; wrap the background `publicApi.getSiteSettings()` in `requestIdleCallback` so first paint uses cached data only.
- **Confirm no other home-page hooks fetch on mount.** Verify `ServicesGrid`/`PortfolioSection`/`WhyUsSection` render from static data (`src/data/services.ts`) and don't trigger `/services`, `/portfolio`, `/plans` requests. If any do, switch them to static + optional background revalidation.

### 2. Non-blocking fonts
- Replace remote Google Fonts `<link>` with **self-hosted `Tajawal` woff2 subset** (Arabic + Latin) via a `@font-face` in `styles.css` with `font-display: swap`. Removes the render-blocking request to `fonts.googleapis.com` + the extra `fonts.gstatic.com` connection. Drop the two `preconnect` links.

### 3. Trim JavaScript
- **Route-level code splitting.** TanStack file-routes are already split, but verify no admin route is imported eagerly from a public route. Add `manualChunks` in `vite.config.ts` to isolate heavy libs (`recharts`, `@react-oauth/google`, `date-fns`, `lucide-react` icon set) so home doesn't ship them.
- **Legacy JS (23 KB).** Set `build.target: 'es2020'` in `vite.config.ts` to stop shipping transforms for obsolete browsers.
- **Drop unused imports in `HeroSection`, `SiteHeader`, `SiteFooter`.** Tree-shake `lucide-react` by using per-icon paths (`lucide-react/dist/esm/icons/…`) or vite plugin `unplugin-icons` — pick the per-path approach (zero-config, immediate win).

### 4. Image delivery
- Ensure every `<img>` on the home path has explicit `width`/`height`, `decoding="async"`, and `loading="lazy"` except the LCP logo (`fetchpriority="high"`).
- Regenerate portfolio + hero-mock WebP at exact rendered dimensions (max-width bounds); currently oversized by ~438 KB per PSI.

### 5. Fix forced reflow in `PortfolioSection.tsx`
- Batch DOM reads before writes (or remove the `offsetWidth`/scroll measurement that PSI flagged) — likely a marquee/scroll calculation. Move measurement into `useLayoutEffect` and cache the value.

### 6. Accessibility to 100
- Correct heading hierarchy: no `h3` without a preceding `h2` in `HeroSection`, `ServicesGrid`, `PortfolioSection`, `StatsBanner`, `WhyUsSection`, `CtaBanner`.
- Give visually-identical links distinct accessible names (e.g. "اقرأ المزيد" repeated across service cards → append the service name via `aria-label`).

### 7. Server / hosting note (documented, not coded)
Efficient cache lifetimes (152 KB) requires setting long `Cache-Control` on static assets at the hosting layer — outside the app repo. I'll flag this in the final summary but won't invent build-time headers that Lovable's static host ignores.

## Verification
- `bun run build` succeeds, bundle-analyzer output confirms home chunk shrank.
- Playwright headless run of `/` on throttled network → measure `performance.getEntriesByType('paint')` + `PerformanceObserver('largest-contentful-paint')` and confirm LCP < 2.5 s and no `/api/*` request fires before LCP.
- Manual re-run of PageSpeed Insights on mobile after deploy.

## Out of scope
- Backend changes to the reviews endpoint (unless the viewport-gating alone doesn't get us to 100 — will revisit).
- Any redesign or copy changes.
