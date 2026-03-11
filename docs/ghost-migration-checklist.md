# Ghost Version Migration Checklist

Use this checklist when upgrading Ghost version compatibility.

## 1) Compatibility baseline

- [ ] Update and confirm `engines.ghost` in `package.json`.
- [ ] Run `npm run scan` and fix new warnings/errors.

## 2) Theme API/features

- [ ] Review Ghost release notes for theme-breaking changes.
- [ ] Validate custom settings in `package.json -> config.custom` still work.
- [ ] Validate members, search, and comments integrations.

## 3) Template validation

- [ ] Smoke test `index`, `post`, `page`, `author`, `tag` templates.
- [ ] Smoke test custom templates used in `routes.yaml`.
- [ ] Verify AMP templates if enabled.

## 4) Front-end checks

- [ ] Re-run accessibility checks on main controls.
- [ ] Re-run performance checks for homepage/post pages.

## 5) Release gate

- [ ] `npm run lint`
- [ ] `npm run check:docs-links`
- [ ] `npm run scan`
- [ ] `npm run build`
- [ ] `npm run prod`
