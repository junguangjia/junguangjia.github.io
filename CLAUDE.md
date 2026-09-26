# CLAUDE.md

Guidance for AI coding agents working in this repository.

## What this is

The personal academic website of Junguang Jia (<https://junguangjia.github.io/>),
built with Jekyll and the Academic Pages template and published by GitHub Pages
from the `main` branch (repository root, standard Jekyll build, no custom
workflow). This repository is independent of every other project; do not link
it to, import from, or modify ArtVenn or any other repository.

## Stack and commands

- Ruby 3.3 (`/opt/homebrew/opt/ruby@3.3/bin` on macOS) with Bundler; gems are
  installed project-locally in `vendor/bundle`.
- `bundle exec jekyll serve --livereload --host localhost` for local preview
  (development mode rewrites the site `url` to localhost automatically).
- `JEKYLL_ENV=production bundle exec jekyll build --strict_front_matter` for the
  production build; inspect `_site/` before publishing.
- Deployment is a plain `git push origin main`; GitHub Pages builds the site.

See `README.md` for editing instructions.

## Rules

- Factual accuracy first. Do not invent publications, awards, results,
  supervisors, collaborations, profiles, dates, or credentials. Course projects
  stay labeled as course projects. Junguang is an M.A. student, not a PhD
  student or candidate.
- Never commit private inputs: transcripts, recommendation letters, application
  drafts, identity documents, phone numbers, home addresses, credentials, or
  original (unreviewed) CV files. Only a reviewed, public-ready CV belongs at
  `files/Junguang_Jia_CV.pdf`; keep that path stable.
- Do not publish GPA, GRE scores, course grades, or a phone number unless the
  owner explicitly asks. The public email is junguang.jia@columbia.edu.
- Only add a portrait that the site owner explicitly supplies.
- Keep customizations small and documented. Prefer editing `_config.yml`,
  `_data/*.yml`, `_pages/*.md`, and `_sass/_custom.scss` over changing template
  layouts. Do not add JavaScript frameworks, analytics, comment systems,
  contact-form services, or other dependencies.
- Inline scripts (for example in `_includes/footer/custom.html`) must use only
  block comments: the production build compresses HTML onto single lines, so a
  `//` comment would swallow the rest of the script.
- Preserve the template's MIT license and attribution (`LICENSE`, footer).
- Do not add extra deployment pipelines; GitHub Pages branch publishing is the
  only mechanism.
