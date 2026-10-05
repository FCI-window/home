# FCI website

`website/` is the new site source. Home and FCI support ko, en, ja, zh-CN, zh-TW, es; RAB supports the first five; ROHD and DRE&M support all six. Paran is Korean only. Every index.html selects saved language, browser language, then a supported fallback. Large text toggles 20% enlargement.

Production uses the `gh-pages` branch at its root. `website/` contents are copied to that root so public URLs remain `/`, `/fci/`, `/rab/`, `/rohd/`, `/dream/`, `/paran/`. Existing `/documents/` and other app-related files are retained. Policy links use absolute `/documents/` URLs, which work in local previews and production.

Legacy source stays in `main` at its current location. Do not move documents or delete app-related paths. Generate publication files using `python3 scripts/build-public-site.py /absolute/new/output-directory`, then publish that output to `gh-pages`. The builder retains tracked legacy public files for compatibility, overlays new pages, and redirects old `home/index*.html` bookmarks to the new homepage. Source documentation and design concepts are excluded.
