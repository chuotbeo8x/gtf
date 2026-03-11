# Create New Theme From Starter Profile

This guide lets you create a new theme without cloning all advanced presets/routes.

## 1) Generate starter profile

From repository root:

```bash
npm run starter:build-profile
```

This creates `starter-profile/` using the manifest in `starter/starter-files.txt`.

## 2) Initialize new theme repository

- Copy `starter-profile/` to a new repository folder.
- Update metadata in `package.json`:
  - `name`
  - `description`
  - `author`
  - `repository`
  - `bugs`
- Replace screenshot and branding assets.

## 3) Keep only required routes/templates

- Start from minimal routes in `routes.yaml`.
- Add feature-specific templates incrementally.
- Follow naming standards in `docs/template-naming-conventions.md`.

## 4) Validate before first release

```bash
npm install
npm run lint
npm run scan
npm run build
```

## 5) Optional migration path

Use `docs/ghost-migration-checklist.md` each time you upgrade Ghost major/minor versions.
