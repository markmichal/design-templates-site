# Design Templates site

The public address for Cru Creative 1's Canva template gallery: **https://templates.crutastic.com**

This repo is just a frame. `index.html` fills the window with the gallery, which runs on Google Apps Script (project folder: `Projects/CanvaTemplateGallery`). Framing it hides Google's "created by a Google Apps Script user" banner.

- Designs, events, and the manager all live in the Apps Script project. Nothing here changes when designers add templates.
- `?event=...` on this address is passed through, so links to a single event still work.
- If the gallery's Apps Script link ever changes, update `GALLERY` in `index.html`.
- Published with GitHub Pages from `main`. `CNAME` holds the custom address; the GoDaddy record is a CNAME `templates` → `markmichal.github.io` on crutastic.com.
