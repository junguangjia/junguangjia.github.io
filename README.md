# junguangjia.github.io

Personal academic website of Junguang Jia, published at <https://junguangjia.github.io/>.

Built with [Jekyll](https://jekyllrb.com) and the
[Academic Pages](https://github.com/academicpages/academicpages.github.io) template,
hosted for free on GitHub Pages.

## Pages

| Page                | Source                 | URL          |
| ------------------- | ---------------------- | ------------ |
| About (home)        | `_pages/about.md`      | `/`          |
| CV                  | `_pages/cv.md`         | `/cv/`       |
| Research & Projects | `_pages/research.md`   | `/research/` |
| Teaching            | `_pages/teaching.md`   | `/teaching/` |
| Log                 | `_pages/log.md`        | `/log/`      |
| Miscellaneous       | `_pages/misc.md`       | `/misc/`     |

Header links are defined in `_data/navigation.yml`. The top bar has no site
name; the name is shown under the portrait in the sidebar. The old `/news/`
address redirects to `/log/`.

## Local preview

Prerequisites: Ruby 3.3 and Bundler. On macOS with Homebrew:

```bash
brew install ruby@3.3
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
```

Install the gems (into `vendor/bundle`, which is git-ignored) and serve the site:

```bash
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve --livereload --host localhost
```

Open <http://localhost:4000/>. In development mode `jekyll serve` rewrites the
site `url` to `http://localhost:4000`, so asset links resolve locally. Markdown
and HTML changes reload automatically; changes to `_config.yml` require
restarting the server.

A production build (what GitHub Pages produces) is:

```bash
JEKYLL_ENV=production bundle exec jekyll build --strict_front_matter
```

The output goes to `_site/` (git-ignored). Its links point at the live domain,
so inspect the files directly rather than serving `_site/` with another server.

## Editing content

- **Biography:** edit the text in `_pages/about.md`. The signature under it is
  `images/signature.png` (black ink on a transparent background; the page
  softens it in light mode and inverts it in dark mode).
- **Log:** edit `_data/log.yml` (newest first). Each entry has a `date`, a
  `type` (research, project, reading, teaching, milestone, life), and a short
  `text`; entries are grouped under year headings taken from the date. Use it
  for project and research progress, papers read, and other news.
- **Teaching:** edit `_data/teaching.yml` (`positions` for TA roles, `notes`
  for course notes; put note PDFs in `files/`). While both lists are empty the
  page shows a one-line placeholder.
- **Miscellaneous:** edit `_pages/misc.md`.
- **Sidebar (name, pronouns, motto, location, affiliation, email, profiles):**
  edit the `author:` block in `_config.yml` (`bio` holds the motto).
  `googlescholar` takes the full profile URL and `linkedin` the username
  (`linkedin.com/in/USERNAME`). While either is an empty string (`""`), the
  sidebar lists it like the other entries but without a link; delete the line
  to hide it.
- **Education:** edit `_data/education.yml` (shown as plain entries on the
  About page; dates use the CV style, e.g. `Sep 2025 – Present`). `logo` names
  a single-color file in `images/logos/`.
- **Projects:** edit `_data/projects.yml`. Entries under `academic:` and
  `independent:` appear on the Research & Projects page. Only add `links` for
  real, public URLs.
- **Math:** MathJax is not loaded. If a page needs LaTeX, add the MathJax
  script back to `_includes/footer/custom.html`.

Keep everything factual. Course projects are labeled as course projects, and
nothing on the site should claim publications, awards, or results that do not exist.

## Portrait

The sidebar shows `images/portrait.jpg` (400×400 px, metadata stripped), set by
`avatar: "portrait.jpg"` in the `author:` block of `_config.yml`. To replace it,
save a new web-sized square copy (roughly 400×400 px) with metadata stripped at
the same path, and keep the original photo outside this repository. Setting
`avatar` to empty gives a text-only sidebar.

## CV PDF

The CV page shows a download link and an embedded viewer for
`files/Junguang_Jia_CV.pdf` (the viewer is hidden on phones, which cannot show
a PDF inside a page). The public URL
`https://junguangjia.github.io/files/Junguang_Jia_CV.pdf` must not change.

- To use your own PDF, save it at exactly that path. Before committing, check
  that it contains no phone number, GPA, grades, test scores, or other private
  details, and update `cv_updated` in `_pages/cv.md`.
- The current PDF is generated from `_cv/Junguang_Jia_CV.html` (not published
  by Jekyll): open it in Google Chrome (version 131 or later, for the page
  numbers), Print, Save as PDF, paper Letter, margins Default, headers and
  footers off, background graphics on, and save it over
  `files/Junguang_Jia_CV.pdf`. Headless Chrome's `page.pdf()` with
  `preferCSSPageSize` produces the same file.
- The embedded viewer loads the PDF with `#navpanes=0&pagemode=none&view=FitH`
  so Chrome, Edge, and Firefox open it without the page-thumbnail sidebar and
  fit it to the frame width.

## Appearance

- Typography: Source Serif 4 for body text and headings; Source Sans 3 for
  navigation, the sidebar, and metadata; Latin Modern Roman italic (the LaTeX
  typeface, from the pinned latex.css package) for dates and the track line
  under each degree. The two Source families are pinned Fontsource WOFF2
  files (latin subset) and Latin Modern is one WOFF2 file from the pinned
  latex.css package, all served by jsDelivr. The `@font-face` rules, the
  `$latex-serif` stack, and the design tokens (colors, sizes) are in
  `_sass/_custom.scss`; the Source font stacks are in `_sass/_themes.scss`.
- Layout: the top bar, the sidebar with the content, and the footer share one
  centered container (at most 1180px wide), and the content fills the space
  next to the sidebar, so the page has equal margins on both sides. Text is
  16px on phones, 17px on tablets and laptops, and 18px from 1280px wide.
- Education and project entries are plain typographic entries (no cards).
  Education entries start with a single-color school logo drawn as a CSS mask
  in `--site-logo-color`, a light grey chosen so the logos stay in the
  background; it follows the light and dark themes.
- Light and dark themes follow the visitor's operating-system setting; there is
  no manual toggle. A small script in `_includes/head/custom.html` applies the
  theme before the first paint, and a `prefers-color-scheme` rule in
  `_sass/theme/_default_dark.scss` covers visitors without JavaScript.

## Publishing

The site is published by GitHub Pages directly from the `main` branch
(repository root, standard Jekyll build). There is no separate CI workflow.

```bash
git add -A
git commit -m "Describe the change"
git push origin main
```

GitHub builds and deploys the site within a minute or two. The deployment run
is listed under the repository's **Actions** tab as "pages build and deployment".

## Inspecting failed builds

- Open the repository's **Actions** tab and look at the latest
  "pages build and deployment" run. The `build` job log shows Jekyll errors.
- Reproduce locally with the production build command above; it uses the same
  `github-pages` gem versions as GitHub.
- Common causes: invalid YAML front matter, a missing include, or a Liquid
  syntax error in a page.

## Template source

Created from the Academic Pages template
(<https://github.com/academicpages/academicpages.github.io>), `master` branch at
commit `3d28cd27d0551b3d9dd8132f207538355fbbc7cc` (2026-09-18).

Site-specific changes are limited to: `_config.yml`, `_data/`, `_pages/`,
`_cv/`, `files/`, `images/portrait.jpg`, `images/signature.png`,
`images/logos/`, `_includes/education-cards.html`,
`_includes/project-cards.html`, `_includes/log-list.html`,
`_sass/_custom.scss`, the font variables in `_sass/_themes.scss`, small edits
in `_includes/author-profile.html`,
`_includes/head.html`, `_includes/head/custom.html`, `_includes/seo.html`,
`_includes/footer.html`, `_includes/footer/custom.html`,
`_includes/masthead.html`, `assets/css/main.scss`,
the `Gemfile` (with a committed `Gemfile.lock`), `.gitignore`, and this
`README.md` plus `CLAUDE.md`. Template demo content (sample
publications, talks, teaching, posts, portfolio, files, images, generators,
Docker setup, and template workflows) was removed.

## Credits

School logos in `images/logos/` are single-color adaptations of files from
Wikimedia Commons. The logos themselves are trademarks or insignia of their
institutions.

- `columbia.svg`: the Columbia University crown (crown and base bar only),
  from "Columbia University 1754.svg", public domain text logo
  (<https://commons.wikimedia.org/wiki/File:Columbia_University_1754.svg>).
- `ucsd.svg`: the seal as a solid ring with the lettering cut out and the
  center artwork kept, from "Seal of the University of California, San
  Diego.svg", public domain
  (<https://commons.wikimedia.org/wiki/File:Seal_of_the_University_of_California,_San_Diego.svg>).
- `fudan.svg`: from "Fudan University Logo.svg", public domain
  (<https://commons.wikimedia.org/wiki/File:Fudan_University_Logo.svg>).

## License

The template is released under the MIT License (see `LICENSE`).

## Research report and teaching recordings

The trace-estimation title and `Report (PDF)` link open the same-site file
`files/stochastic-trace-estimation-report.pdf`. `Code (GitHub)` opens the separate
public `junguangjia/stochastic-trace-estimation` repository. The PDF is an unchanged
snapshot of that repository's `latex/trace-estimation-report.pdf`; its source commit
and SHA-256 are recorded in `_data/projects.yml`. Treat the research repository as
the source of truth. When replacing the report, verify its PDF content and hash,
update those provenance fields, and retain the stable website URL. Do not rebuild
or revise the research project as part of an ordinary website edit.

`_data/teaching.yml` holds `videos`, `notes`, and optional verified `positions`.
Each recording has a title, quarter, role, institution, descriptive course label,
YouTube ID, poster, and short description. The owner confirmed UC San Diego TA
recordings for Linear Algebra in Fall 2020 and Computer Science / Java in Fall 2023.
Display quarters only; do not substitute thumbnail timestamps or upload dates.
No unconfirmed course numbers or faculty names should be added.

`assets/js/teaching-videos.js` upgrades poster links to keyboard-accessible buttons.
A click replaces that poster with the official privacy-enhanced YouTube iframe in
place and requests playback. No player is loaded or autoplayed on page load.
The iframe sends its actual origin via the referrer policy, supports inline mobile
playback and fullscreen, and preserves native controls. Browser policies may
require pressing Play in the player. The plain YouTube link always remains; if
JavaScript is unavailable, the poster is also a working YouTube link.

Add notes only after the owner supplies a public-ready file or URL; empty
notes/positions are not rendered. Transcripts are not published.
