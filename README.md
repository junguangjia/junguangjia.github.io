# junguangjia.github.io

Personal academic website of Junguang Jia, published at <https://junguangjia.github.io/>.

Built with [Jekyll](https://jekyllrb.com) and the
[Academic Pages](https://github.com/academicpages/academicpages.github.io) template,
hosted for free on GitHub Pages.

## Pages

| Page                | Source                 | URL          |
| ------------------- | ---------------------- | ------------ |
| About (home)        | `_pages/about.md`      | `/`          |
| Research & Projects | `_pages/research.md`   | `/research/` |
| CV                  | `_pages/cv.md`         | `/cv/`       |

Header links are defined in `_data/navigation.yml`.

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

- **Biography:** edit the text in `_pages/about.md`.
- **Sidebar (name, short bio, location, affiliation, email, GitHub):** edit the
  `author:` block in `_config.yml`.
- **Education:** edit `_data/education.yml`. It feeds both the cards on the About
  page and the list on the CV page.
- **Projects:** edit `_data/projects.yml`. Entries under `academic:` and
  `independent:` appear on the Research & Projects page and are summarized on
  the CV page. Only add `links` for real, public URLs.
- **Work experience:** edit `_data/experience.yml` (shown on the CV page).
- **CV text (interests, coursework, skills, contact):** edit `_pages/cv.md`.
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

The CV page shows a "Download CV (PDF)" link automatically when the file
`files/Junguang_Jia_CV.pdf` exists. To publish or replace the PDF, save the new
version at exactly that path so the public URL
`https://junguangjia.github.io/files/Junguang_Jia_CV.pdf` never changes.
Before committing, check that the PDF contains no phone number, home address,
or other private details. If the file is removed, the link disappears.

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
`_includes/education-cards.html`, `_includes/project-cards.html`,
`_sass/_custom.scss`, small edits in `_includes/author-profile.html`,
`_includes/head.html`, `_includes/head/custom.html`, `_includes/seo.html`,
`_includes/footer.html`, `_includes/footer/custom.html`,
`_includes/masthead.html`, `assets/css/main.scss`,
the `Gemfile` (with a committed `Gemfile.lock`), `.gitignore`, and this
`README.md` plus `CLAUDE.md`. Template demo content (sample
publications, talks, teaching, posts, portfolio, files, images, generators,
Docker setup, and template workflows) was removed.

## License

The template is released under the MIT License (see `LICENSE`).
