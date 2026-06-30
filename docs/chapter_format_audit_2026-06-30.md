# Unavida chapter format audit — 2026-06-30

## Scope audited
Production-wired reader content in `src/components/ChapterReader.jsx`:
- Chapter 1
- Chapter 2
- Chapter 3
- Chapter 5
- Chapter 9
- Chapter 10
- Chapter 11
- Chapter 60 placeholder
- `references_all` compiled references view

## What is consistent enough right now

- **Reader wiring pattern is centralized and understandable.** The active production chapters are all imported directly into `ChapterReader.jsx`, grouped into chapter-specific arrays, and routed by chapter slug.
- **Section objects mostly follow the same broad shape.** Across production chapters, sections generally have `id`, `title`, `sectionNumber`, `content`, `duration`, and often `learningObjectives` / `keyTakeaways` / `contentBlocks`.
- **Section titles mostly follow the same visible pattern.** Chapters 2, 3, 5, 9, 10, and 11 mostly use `Section X.Y: Title`. Chapter 1 also follows that pattern in the UI even though its raw `sectionNumber` values differ.
- **End-of-chapter study structure is mostly recognizable.** Most chapters end with some mix of glossary, review questions, and/or references.
- **Reader navigation UI is consistent at the chapter level.** All wired chapters appear in the same left-hand TOC pattern, with the same click-through behavior and the same top-level routing model.
- **Chapter 60 is clearly marked as a placeholder in the UI and content.** It is not pretending to be production-ready content.

## Main inconsistencies

### 1) Metadata schema is not normalized

- **Chapter 1** uses `metadata.id`, `courseCode`, `courseName`, `estimatedReadingTime`, `estimatedStudyTime`.
- **Chapters 2, 3, 5, 9, 10, 11** use `chapterNumber`, `chapterId`, `estimatedTimeMinutes`, `lastUpdated`, `status`, etc.

This is workable because `ChapterReader.jsx` is not relying heavily on a unified metadata contract, but it is clearly inconsistent.

**Worth fixing now?** Not urgently, unless another component is about to consume metadata generically.

---

### 2) `sectionNumber` conventions differ by chapter

- **Chapter 1** uses numeric sequence values (`1`, `2`, `3`, ... `12`) even though titles are written as `Section 1.1`, `Section 1.2`, etc.
- **Chapter 2** mostly uses decimal section numbers (`2.0` ... `2.8`) but glossary/review are `9` and `10` instead of `2.9` and `2.10`.
- **Chapters 3, 5, 9, 10, 11** mostly use the expected decimal chapter pattern (`3.1`, `5.1`, `9.1`, etc.).
- **References view** uses `sectionNumber: 'R'`.

This matters because `ChapterReader.jsx` sorts some chapter content by `sectionNumber`, and the sort logic is doing extra work to compensate.

**Worth fixing now?**
- **Now:** Chapter 2 glossary/review numbering would be a safe cleanup if desired.
- **Later:** Chapter 1 should be normalized carefully, since its current numbering may be relied on elsewhere.

---

### 3) References handling is inconsistent across chapters

Current patterns:
- **Chapter 1:** explicit `references` section in JSON; removed from chapter nav.
- **Chapter 2:** explicit `ch2_references` section in JSON; still appears in chapter nav.
- **Chapter 3:** explicit `ch3_10_chapter_references` section; appears like a normal section.
- **Chapter 5:** no explicit references section; `references_all` tries to extract references from the last section content.
- **Chapter 9:** no explicit references section; same extraction fallback.
- **Chapter 10:** explicit references section exists, but is filtered out of chapter nav and only used by compiled references view.
- **Chapter 11:** no explicit references section; compiled references view falls back to the last section, which does **not** contain a references heading.

Net result:
- References behavior is **not standardized**.
- The compiled `references_all` page will show placeholders for some chapters rather than real citations.
- Chapter-level discoverability of references varies widely.

**Worth fixing now?** Yes, but as a small focused follow-up rather than in this audit pass. Best approach: pick one standard and apply it to all production chapters.

Recommended standard:
- Every production chapter should have an explicit final references section in its JSON.
- Either show that section in nav for all chapters, or hide it in nav for all chapters, but do it consistently.

---

### 4) Glossary / review / references placement is mostly consistent but not fully standardized

Observed patterns:
- **Chapter 1:** glossary → clinical story → review → references
- **Chapter 2:** glossary → review → references
- **Chapter 3:** glossary → review → references
- **Chapter 5:** glossary → review, **no explicit references section**
- **Chapter 9:** glossary → review, **no explicit references section**
- **Chapter 10:** review → key takeaways / clinical pearls → references, **no glossary section**
- **Chapter 11:** glossary → review, **no explicit references section**

**Worth fixing now?**
- **Now:** document and adopt a standard order for future chapter builds.
- **Later:** backfill old chapters where references/glossary sections are missing.

Recommended default sequence:
1. Core content sections
2. Key terms glossary
3. Review questions
4. References

If a chapter also has “key takeaways / clinical pearls,” decide whether that belongs before review or after review, then keep it consistent.

---

### 5) Content-format structure differs a lot by chapter

- **Chapters 1 and 2** are the most structured: they make real use of `contentBlocks`, `learningObjectives`, and `keyTakeaways`.
- **Chapters 3, 5, 9, 10, 11** are mostly long HTML blobs in `content`, with little or no structured block usage.
- **Chapter 5** glossary content is notably more raw/plain and less consistently HTML-shaped than nearby chapters.
- **Chapter 10** and **Chapter 11** are closer to document-import output than fully normalized reader JSON.

This is not immediately breaking, because the reader has a lot of fallback rendering logic. But it means the frontend is carrying formatting debt that belongs in content normalization.

**Worth fixing now?**
- **Now:** no sweeping rewrite.
- **Later:** normalize content ingestion so new chapters do not depend on reader-side cleanup logic.

---

### 6) Section ID / numbering / nav consistency has a few sharp edges

- Chapter prefixes are mostly consistent by chapter (`sec1_`, `sec2_`, `ch3_`, `ch5_`, `ch9_`, `ch10_`, `ch11_`).
- However, the naming convention itself changes between early and later chapters (`sec*` vs `ch*`).
- `references_all` is a synthetic section and behaves differently from chapter content, which is fine, but it adds another one-off convention.
- The reader’s **prev/next navigation** is built from a global `allSections` list, so “Next” can move across chapters instead of staying within the active chapter. That may be intentional, but it is a different pattern from typical chapter-contained navigation.

**Worth fixing now?**
- **Now:** not necessary unless chapter-contained next/previous is a product requirement.
- **Later:** decide whether navigation should stay within chapter by default.

---

### 7) One concrete data defect existed in Chapter 11

- `CHAPTER_11_UNAVIDA_PRODUCTION.json` contained a duplicated `11.9` section (`ch11_9_site_specific_antifungal_therapy`) twice.
- This was a real consistency issue and a potential React key / nav bug.

**Fixed in this pass:** yes.

## Safe fixes made in this pass

### 1) Removed duplicated Chapter 11 section

File changed:
- `src/data/CHAPTER_11_UNAVIDA_PRODUCTION.json`

Change made:
- Removed the second duplicate copy of `Section 11.9: Site-Specific Antifungal Therapy`.

Why this was safe:
- The duplicate section had the same `id`, same `sectionNumber`, same title, and duplicated content.
- Keeping both served no useful format purpose and could cause unstable rendering / duplicated nav entries.

## Fix-now vs fix-later summary

### Worth fixing now (small follow-up PRs)

1. **Standardize references handling** across Chapters 1/2/3/5/9/10/11.
2. **Normalize Chapter 2 glossary/review numbering** from `9` / `10` to `2.9` / `2.10` if no downstream dependency objects.
3. **Decide one nav rule for references sections** (always visible or always hidden from chapter TOC).
4. **Add explicit references sections** for Chapters 5, 9, and 11 if source citations are available.

### Better left for later / larger normalization work

1. **Unify metadata schema** across all chapter JSON files.
2. **Normalize Chapter 1 sectionNumber values** to match visible `1.x` titles.
3. **Convert later chapters to structured blocks** instead of relying on large HTML strings plus frontend cleanup.
4. **Standardize glossary / review / key takeaways ordering** for all future chapter builds.
5. **Decide whether prev/next should stay within a chapter** instead of traversing all wired sections globally.

## Bottom line

The reader is functional, and the production-wired chapters are close enough in surface shape that the frontend can render them. But the content contract is still uneven in three places that matter: **metadata shape, section numbering conventions, and references handling**.

If only a few things get cleaned up next, I’d prioritize:
1. references standardization,
2. Chapter 2 numbering cleanup,
3. agreeing on one end-of-chapter section order for all future production chapters.
