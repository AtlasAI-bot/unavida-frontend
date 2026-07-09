# Mobile-friendly pass 1 — 2026-07-09

## What changed

### Textbook dashboard
- Added a lightweight responsive breakpoint (`<= 900px`) inside `TextbookDashboard.jsx`.
- Switched the main dashboard grid from two columns to one column on compact screens.
- Increased header/action button padding and enforced taller tap targets for phone use.
- Let top action buttons wrap into wider full-row buttons on small screens.
- Increased chapter accordion and section-card padding on compact layouts so section lists are easier to tap.
- Reused the same component logic and inline styles so the pass stays modular and easy to revert.

### Chapter reader
- Added an `isMobile` breakpoint (`<= 768px`) and a resize listener in `ChapterReader.jsx`.
- Replaced the tiny floating TOC control on phones with a clearer in-header "Chapters" button plus current-section context.
- Added a mobile scrim/overlay behind the chapter navigation drawer so users can tap outside to close it.
- Locked body scroll while the mobile chapter drawer is open to reduce accidental background scrolling.
- Reduced the reader TOC offset on smaller screens so the drawer opens higher and wastes less vertical space.
- Increased base reader button padding for better tap targets.
- Added slightly roomier phone typography and line-height for better long-form reading comfort.
- Added a bit more main-panel padding on tablet/phone widths to keep content from feeling cramped.

## Validation
- Ran `npm run build`
- Result: success

## Notes on desktop safety
- Desktop layout and behavior were preserved intentionally.
- The old floating TOC button still appears on non-mobile widths.
- The reader drawer/overlay changes only activate on smaller screens.
- Dashboard changes are mostly responsive spacing/layout adjustments rather than structural rewrites.

## Follow-up recommendations
1. Add a dedicated shared responsive utility/hooks layer so breakpoints are not repeated inline across components.
2. Move the large inline reader styles into a separate CSS/module file before a bigger responsive pass.
3. Test on real iPhone/Android widths for edge cases like long chapter titles and modal stacking.
4. Consider a sticky bottom mobile reader bar for previous/next section navigation and study tools.
5. Consider collapsing some right-rail study tools into bottom sheets or modal panels for a stronger mobile-first reader flow.
