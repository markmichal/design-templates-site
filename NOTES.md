# Design Templates gallery: project notes

The README is the technical guide (files, where the designs come from, usage counting). These notes add the why, the decisions, ideas and history. This repo is public, so nothing private goes here. The bigger story (the Apps Script app, the Template Manager, the full list of decisions) is in the companion folder `~/Projects/CanvaTemplateGallery` (its README and `claude-project/Design-Templates-project-summary.md`).

## Why Mark built this
The gallery first ran as a Google Apps Script page, which took about 3 seconds to show and had Google's banner on top. Mark wanted the public gallery of Creative 1 Media's free Canva templates to open instantly at a friendly address, so this GitHub Pages site shows the page and reads the list of designs from the Apps Script data feed.

## Decisions
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
