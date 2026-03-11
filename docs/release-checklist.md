# Release Checklist

Use this checklist before shipping a new theme release.

## 1) Quality gates

- [ ] `npm run lint`
- [ ] `npm run scan`
- [ ] `npm run build`
- [ ] `npm run check:docs-links`

## 2) Smoke test templates

- [ ] Home default (`/`)
- [ ] Home featured slider (`/featured-slider/`)
- [ ] Post page
- [ ] Custom post formats (full / wide / toc)
- [ ] Members pages (`/signup/`, `/signin/`, `/account/`)

## 3) A11y quick check

- [ ] Keyboard navigation works for menu, dropdown, and slider controls
- [ ] Icon-only controls have `aria-label`
- [ ] Dark mode and light mode text contrast is readable

## 4) Performance benchmark (optional but recommended)

- [ ] `npm run benchmark:lighthouse` (requires reachable Ghost URL and Lighthouse package access)

## 5) Packaging

- [ ] `npm run prod`
- [ ] Verify zip exists in `dist/`
- [ ] Optional: `npm run deploy` (if `.env` is configured)
