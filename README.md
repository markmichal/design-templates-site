# Design Templates gallery

The public gallery of Cru Creative 1 Media's free Canva templates: **https://templates.crutastic.com**

A plain HTML, CSS, and JS page on GitHub Pages. No build step.

| File | What it does |
|---|---|
| `index.html` | The page: top bar, hero, filters, card grid, Past events, How it works, footer. Includes gray placeholder cards that show until the designs arrive. |
| `styles.css` | The look (Cru Cornerstone colors, Sora and Inter, cards, arrows and dots, phone layout). |
| `app.js` | Reads the list of designs and draws everything. |
| `favicon.svg` | The Cru symbol for the browser tab. |
| `intro.mp4`, `intro-poster.jpg` | The 2-minute intro video (music, no voiceover) and its cover picture (a frame from 1:18). Made web-ready with `ffmpeg -i in.mp4 -c copy -movflags +faststart intro.mp4` so it starts playing before it fully downloads. |
| `intro.js` | The intro pop-up: opens by itself once per browser (marked as seen the moment it opens), and anytime from **Watch the intro**. The same video also plays in How it works. Only one video plays at a time. |
| `CNAME` | The custom address. GoDaddy has a CNAME `templates` → `markmichal.github.io` on crutastic.com. |

## Where the designs come from

The page asks the gallery's **Google Apps Script** program for the list of events and designs (`FEED` at the top of `app.js`, with `?format=json`). That program, its Google Sheet, and the Drive picture folder live in the separate repo `markmichal/canva-template-gallery`, along with the **Template Manager** where designers add templates. Nothing here changes when designers add something.

- Preview pictures load straight from Google Drive. If Drive ever won't show one, the page asks the feed for it instead (`?format=json&img=<id>`).
- The feed is cached on Google's side for 6 hours, and every save in the manager clears it, so new posts show up right away.
- **Fast repeat visits:** the page saves the last list of designs in the visitor's browser and shows it instantly, then quietly checks Google for anything new.
- **If Google is down:** returning visitors still see their saved list. First-time visitors see a friendly "couldn't load" message with a Try again button.
- `?event=<event id>` opens one event, and picking an event updates the address so it can be shared.

## Changing it

Edit the files, commit, and push to `main`. GitHub Pages publishes in about a minute (it caches for up to 10 minutes, so use Cmd+Shift+R to check).

This page started as a copy of the Apps Script gallery page (`src/Gallery.html` in the other repo, now removed). If the look changes here, the Template Manager's styles in `src/Styles.html` over there may need the same change to keep matching.
