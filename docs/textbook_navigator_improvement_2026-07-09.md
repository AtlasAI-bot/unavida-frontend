# Textbook Navigator Improvement Report — 2026-07-09

## Goal
Tighten the textbook dashboard + reader navigation without changing routing behavior or doing a full redesign.

## What I changed

### 1) Dashboard chapter list now explains what is actually available
File: `src/components/TextbookDashboard.jsx`

- Added route/availability helpers so section cards know whether they open real reader content.
- Replaced the old vague alert-only behavior with explicit section availability states:
  - **Ready to read** for published routes
  - **Planned content** for blueprint items that are not published yet
- Disabled planned section buttons instead of letting them feel like broken links.
- Added per-chapter counts:
  - published sections ready
  - planned sections remaining
- Auto-opens the most relevant chapter first (prefers **In Progress**, otherwise first chapter).
- Added short instructional copy above the chapter list so students understand why some items open and some do not.

### 2) Reader TOC now has stronger hierarchy and clearer current state
File: `src/components/ChapterReader.jsx`

- Replaced repetitive hardcoded TOC chapter blocks with a shared `chapterNavGroups` structure.
- Added chapter-level summaries in the TOC (for example, published section counts / references label).
- Added secondary metadata under each TOC item:
  - section number
  - word count
  - duration when available
- Made the active section more obvious with:
  - stronger active styling
  - a **Current section** pill
- Updated the top reader header/breadcrumb area to reflect the active chapter instead of always looking like Chapter 1.
- Kept all existing section navigation behavior and URL syncing intact.

### 3) Placeholder chapter behavior is less misleading
File: `src/components/ChapterReader.jsx`

- Kept future/planned chapters visible in the TOC so the course outline still exists.
- Reframed placeholder items as **planned outline** entries instead of making them look like normal published reader sections.
- Updated the message for those clicks to clearly say the chapter is on the roadmap but not yet published.

### 4) Minor terminology cleanup on dashboard shortcuts
File: `src/components/TextbookDashboard.jsx`

- Renamed a couple of vague utility labels:
  - `Quick Jump` → `Quick Jump Workspace`
  - `Bookmarks` → `Saved Bookmarks`

## Why these were the highest-value fixes

These changes reduce the biggest UX friction points without risking the reader:

- students can tell **published vs planned** content faster
- the TOC does a better job of showing **where they are now**
- chapter/section hierarchy reads more consistently
- placeholder content feels intentional instead of broken
- routing and existing reader section behavior remain unchanged

## Validation

- Ran production build successfully:
  - `npm run build`

## Good next improvements later

1. **Dashboard shortcut integrity**
   - `Notes`, `Quick Jump Workspace`, and `Saved Bookmarks` still route to the workbook area; they should eventually land on distinct destinations or expose contextual drawers/modals.

2. **Real progress/status data**
   - Chapter and section statuses are still mostly presentation-level labels. Next step: tie them to real completion/progress data.

3. **TOC expand/collapse state**
   - Reader chapter groups currently open based on active chapter and manual toggling. Persisting expanded state per session would be a small but nice upgrade.

4. **Placeholder chapter treatment**
   - Planned chapters still allow a click that explains they are unpublished. A cleaner follow-up would be disabled planned rows with an inline “coming soon” helper instead of an alert.

5. **Cross-course awareness**
   - The current reader breadcrumbs/routes are still largely centered on the Pharmacology I textbook pathing. If more textbooks reuse this reader, the active course/book context should become first-class data.

## Files changed

- `src/components/TextbookDashboard.jsx`
- `src/components/ChapterReader.jsx`
