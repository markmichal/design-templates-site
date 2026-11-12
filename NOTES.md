# Design Templates gallery: project notes

The README is the technical guide (files, where the designs come from, usage counting). These notes add the why, the decisions, ideas and history. This repo is public, so nothing private goes here. The bigger story (the Apps Script app, the Template Manager, the full list of decisions) is in the companion folder `~/Projects/CanvaTemplateGallery` (its README and `claude-project/Design-Templates-project-summary.md`).

## Why Mark built this
The gallery first ran as a Google Apps Script page, which took about 3 seconds to show and had Google's banner on top. Mark wanted the public gallery of Creative 1 Media's free Canva templates to open instantly at a friendly address, so this GitHub Pages site shows the page and reads the list of designs from the Apps Script data feed.

## Decisions
- 2026-11-11: **Grey dot in the bottom left corner of the public gallery opens the Template Manager** (Mark kept losing the manager link). Google asks for a cru.org sign-in, and only people on Team access get in; everyone else sees the polite "ask for access" page. Simpler than building a Google sign-in pop-up on the site, which would need a Google Cloud project.
- 2026-11-11: Page text too: "Cru Creative 1 Media" is now just "Cru" (tab title, link preview text, footer). Mark then asked to drop the small line above the headline entirely, so it is gone. The link preview picture had the same line, so the line was taken off it too, and it was renamed `share-preview-3.jpg` so texting apps pick up the new one.
- 2026-11-11: Mark asked to take "Creative 1 Media" out of the intro video. The label at 0:15 now reads "Created by Cru", and the small line on the gallery page shown at 1:13 to 1:19 now reads "From Cru". New cover picture from the fixed video. Old files are in the Mac Trash. The page's own text was not changed.
- 2026-11-11: **Prototype bar and feedback button.** A turquoise bar at the top of the public gallery says the site is a prototype, not ready for use yet, with a **Share feedback** button. The form asks for name and email (both optional) and their thoughts. Notes go to the Feedback tab of the Sheet and the manager's new **Feedback** tab. Nobody gets an email (the app never sends email), so check the manager. Remove the bar when the gallery officially launches (it's marked in index.html).
- 2026-11-10: **The gallery can be closed ("Coming soon") from the manager's Settings tab.** Built and pushed, but Mark chose to leave the gallery open for now (2026-11-10). Some people said it wasn't quite ready to be public. Closed means the feed sends no designs, pictures or Canva links to anyone except people with the private preview link, and visitors' saved copies are wiped. Mark chose a switch over turning the website off, because turning GitHub Pages off and on can break the secure lock and DNS. Copies people already made in Canva, and Canva links someone saved, still work.
- 2026-10-15: Public gallery lives here at templates.crutastic.com; data, manager, Sheet and Drive stay on Google.
- 2026-10-15: Team name is "Creative 1 Media" (numeral 1), never "Creative One".
- 2026-10-28: 2-minute intro video: pops up once per browser, plus a Watch the intro button and a player in How it works.
- 2026-10-31: Count visits, template clicks and searches with no results, with no names or emails. Managers' own clicks are skipped once they open the gallery from the Template Manager (`?nocount=1`).
- 2026-10-31: Fixed link preview picture (`share-preview.jpg`) for texts and posts.

## Ideas for later
See "Ideas raised but not built" in the CanvaTemplateGallery summary (featured designs checkbox, Canva connection, structure changes after feedback).

## History
- 2026-10-15: Started as a frame around the Apps Script page, then became the real gallery page reading the data feed.
- 2026-10-28: Intro video added.
- 2026-10-31: Usage counting, no-count for managers, link preview picture.
- 2026-11-09: Project kit added (AGENTS.md, CLAUDE.md, .gitignore, these notes).
