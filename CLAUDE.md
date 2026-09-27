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
  owner explicitly asks. The public email is junguang.jia@columbia.edu. The
  public CV PDF (`files/Junguang_Jia_CV.pdf`, generated from
  `_cv/Junguang_Jia_CV.html`) follows the same rule.
- Typography is Source Serif 4 (prose, headings), Source Sans 3 (navigation,
  sidebar, metadata), and Latin Modern Roman italic (dates and the track line
  under each degree, as the owner asked); on Japanese and Chinese pages Noto
  Serif/Sans JP or SC set the CJK text and nothing is italic; entries are plain typographic entries, not cards;
  the theme follows the operating system with no toggle; the layout is one
  centered container with the content filling the space next to the sidebar
  (the owner asked for no wide empty strip on the right); the site name is
  shown under the portrait, not in the top bar. Keep these unless the owner
  asks otherwise, and keep every text color at WCAG AA contrast.
- The public CV follows the owner's latest CV (September 2026, v6) minus the
  private items above. The website's Education section omits Provost Honors at
  the owner's request (the CV PDF keeps it, as the owner's CV does).
- The site is multilingual (English template; French, Japanese, Simplified
  Chinese; see README "Languages"). Any content change made in English must be
  mirrored in the `fr:`/`ja:`/`zh:` blocks of the data files and in the page
  files under `_pages/fr|ja|zh/`, or left to fall back to English; never let a
  translation state something the English does not. The owner's name per
  language (`name` in _data/i18n.yml): Chinese 贾俊廣 (exactly as the owner
  wrote it), Japanese 賈俊廣 with the reading （ジャ・ジュングアン） under it
  (賈 is the Japanese form of 贾, which the Japanese web font lacks), French
  "Junguang JIA" (surname in capitals) in the sidebar, title and footer, and
  "Junguang Jia" in running text.
- Teaching recordings are native YouTube iframes that load with the page and
  play only when the visitor presses YouTube's Play button (owner's request).
  Do not replace them with a click-to-load poster, overlay anything on the
  player, or turn on autoplay without the owner's approval.
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
