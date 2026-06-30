# Chapter format standardization pass — 2026-06-30

## What I changed

Focused on low-risk, reader-safe standardization across the currently wired chapters.

### 1) Normalized Chapter 2 end-section numbering
**File:** `src/data/CHAPTER_2_UNAVIDA_PRODUCTION.json`

Updated the two inconsistent `sectionNumber` values so the full end-of-chapter sequence is now internally consistent:
- `sec2_9_key_terms_glossary`: `9` → `2.9`
- `sec2_10_review_questions`: `10` → `2.10`

This aligns Chapter 2 with the visible titles already shown in the reader and reduces numbering drift in sort/order logic.

### 2) Standardized references visibility in chapter TOC where dedicated references sections already exist
**File:** `src/components/ChapterReader.jsx`

Updated chapter navigation groupings so dedicated references sections are hidden from the left-hand chapter TOC for:
- Chapter 2 (`ch2_references`)
- Chapter 3 (`ch3_10_chapter_references`)

This makes Chapter 2 and Chapter 3 behave more like Chapter 1 and Chapter 10, which were already suppressing standalone references entries from the chapter section list.

### 3) Standardized Chapter 3 references section title
**File:** `src/data/CHAPTER_3_UNAVIDA_PRODUCTION.json`

Renamed:
- `Section 3.10: Chapter References` → `Section 3.10: References`

This matches the naming pattern already used elsewhere.

## What remains inconsistent

### References handling is still only partially standardized
- **Chapter 1, 2, 3, 10** have explicit chapter references sections.
- **Chapter 5** has no explicit references section and no clean chapter-end references block to promote safely.
- **Chapter 9** has no explicit references section in the wired JSON.
- **Chapter 11** still keeps its references embedded inside the review section rather than as a dedicated final references section.
- The compiled `references_all` view still has to mix explicit references with fallback/placeholder behavior depending on chapter.

### End-of-chapter ordering is still not fully uniform
Current shapes still differ:
- Chapter 1: glossary → clinical story → review → references
- Chapter 2: glossary → review → references
- Chapter 3: glossary → review → references
- Chapter 5: glossary → review
- Chapter 9: glossary → review
- Chapter 10: review → key takeaways / clinical pearls → references
- Chapter 11: glossary → review (with references embedded inside review)

### Metadata/schema normalization is still deferred
Chapter 1 still uses a different metadata contract from later chapters. I left this alone because it is broader than a safe format pass and could ripple into other reader/dashboard assumptions.

## Follow-up recommendations

1. **Create explicit final references sections for Chapters 5, 9, and 11** when source citations are confirmed.
2. **Split Chapter 11 references out of the review section** into a dedicated final section to match the cleaner chapter-end pattern.
3. **Adopt one standard end-of-chapter sequence for future builds:**
   - core content
   - glossary
   - review questions
   - references
4. **Keep references hidden from chapter TOC consistently** if that is the chosen UX rule; the codebase is now closer to that convention, but not all chapters are normalized the same way in content.
5. **Handle Chapter 1 metadata/section-number normalization separately** as a deliberate follow-up, not as part of a low-risk format cleanup.

## Verification notes

- Re-validated the edited JSON files for parseability.
- Did not do a sweeping content rewrite.
- Avoided changing reader behavior beyond low-risk numbering/title/TOC consistency improvements.
