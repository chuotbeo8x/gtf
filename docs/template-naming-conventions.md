# Template Naming Conventions

This document standardizes naming and placement for Handlebars templates.

## Directory grouping

- `partials/home/*`: homepage-specific sections and blocks.
- `partials/story/*`: post card/story card variants.
- `partials/layout/*`: header/footer/navigation/account blocks.
- `partials/components/*`: generic reusable UI pieces.
- `partials/amp/*`: AMP-only templates/styles.
- `members/*`: member auth/account templates.

## File naming rules

- Use lowercase and kebab-case for all new files.
- Prefix custom page/post templates with `custom-`.
- Prefix old legacy `godo-` templates only when maintaining backward compatibility.

## Route/template alignment

- Every custom route in `routes.yaml` should map to one explicit template file.
- Keep one source-of-truth comment near each route block documenting intended template.

## Migration policy

For new development, prefer creating templates under grouped partial folders first.
Avoid adding new top-level `*.hbs` files unless Ghost requires them (`index.hbs`, `post.hbs`, `page.hbs`, etc.).
