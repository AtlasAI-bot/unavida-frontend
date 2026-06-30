# Chapter format standardization pass 2 — 2026-06-30

## Scope
Second-pass standardization review across the currently wired reader chapters and references view:
- Chapter 1
- Chapter 2
- Chapter 3
- Chapter 5
- Chapter 9
- Chapter 10
- Chapter 11
- Chapter 60 placeholder
- `references_all`

Primary goals for this pass:
1. tighten remaining chapter-format consistency where safe,
2. improve references structure,
3. normalize chapter-end ordering where feasible,
4. preserve rendering/navigation behavior,
5. avoid risky content rewrites.

---

## Changes made in this pass

### 1) Split Chapter 11 references into a dedicated final references section
**File:** `src/data/CHAPTER_11_UNAVIDA_PRODUCTION.json`

Chapter 11 originally embedded a real `<h4>References</h4>` block inside `ch11_15_review_questions`.

I split that content so that:
- `ch11_15_review_questions` now remains a true review/questions section
- new final section `ch11_16_references` holds the references block

This was the cleanest and safest structural normalization available in the current wired set because the citations already existed in production content; they were just placed inside the wrong section.

### 2) Hid the new Chapter 11 references section from the chapter TOC for consistency
**File:** `src/components/ChapterReader.jsx`

Updated:
- `navChapter11Sections`

So the chapter TOC now omits `ch11_16_references`, matching the current pattern already used for dedicated references sections in Chapters 1, 2, 3, and 10.

This keeps the reader navigation cleaner while still allowing the compiled references view to include Chapter 11 references.

---

## Resulting chapter-end structure after this pass

### Chapter 1
- glossary
- clinical story
- review
- references

### Chapter 2
- glossary
- review
- references

### Chapter 3
- glossary
- review
- references

### Chapter 5
- glossary
- review
- **no dedicated references section available in wired JSON**

### Chapter 9
- nursing considerations
- glossary
- review
- **no dedicated references section available in wired JSON**

### Chapter 10
- nursing considerations
- review
- key takeaways / clinical pearls
- references

### Chapter 11
- nursing considerations
- glossary
- review
- references

### Chapter 60 placeholder
- placeholder only

---

## What improved

### References structure
- Chapter 11 now matches the cleaner chapter-end model used by Chapters 1, 2, 3, and 10: review content and references are no longer mixed together.
- `references_all` can now pull Chapter 11 references from a dedicated final section instead of scraping them from the review section.

### End-of-chapter consistency
- Chapter 11 is materially more consistent with the other production chapters that already separate review from references.
- Dedicated references sections are now more consistently treated as non-TOC appendix-style material.

### Reader safety
- No routing changes were introduced.
- No section IDs were renamed for existing visible study sections.
- No references text was rewritten; it was only moved into its own section.

---

## What I deliberately did **not** change

### Chapter 5 references
I did **not** create a synthetic references section for Chapter 5.

Reason:
- the wired JSON does not contain a real chapter references block to promote,
- inventing citations or manufacturing a fake references section would be content-risky,
- this pass was intended to preserve production behavior and avoid unsupported source creation.

### Chapter 9 references
I did **not** create a synthetic references section for Chapter 9.

Reason:
- same issue as Chapter 5: no safe existing references block was present in the wired JSON,
- adding placeholder citations would improve format superficially but would degrade content integrity.

### Chapter 10 end-ordering
I left Chapter 10 as:
- nursing considerations
- review
- key takeaways / clinical pearls
- references

Reason:
- changing section order there is higher risk because Chapter 10 is already heavily wired with media and section-specific assets,
- there was no compelling structural defect as clear as the Chapter 11 embedded-references issue.

### Chapter 1 ordering
I left Chapter 1’s `clinical story` placement unchanged.

Reason:
- moving Chapter 1 sections would alter reader flow and study navigation more than this pass justified,
- the current order is not ideal for standardization, but it is stable.

---

## Chapters that still cannot be fully normalized safely in this pass

### Chapter 5
Cannot be fully normalized to `glossary -> review -> references` because no dedicated references source block exists in the wired chapter JSON.

### Chapter 9
Cannot be fully normalized to include a dedicated references section for the same reason: the wired chapter JSON does not contain a clean references block to extract into its own section.

### Chapter 10
Still differs from the preferred textbook-end sequence because `key takeaways / clinical pearls` sits after review and before references. I left it as-is to avoid unnecessary churn in a chapter with more complex current wiring.

### Chapter 60
Placeholder only; no meaningful normalization possible beyond preserving clear placeholder messaging.

---

## Suggested follow-up if a third pass happens

1. **Backfill real references sections for Chapters 5 and 9** from source manuscript/citation materials.
2. **Decide on one universal chapter-end pattern** for future production chapters, ideally:
   - core content
   - glossary
   - review questions
   - references
3. **Optionally normalize Chapter 10** only after confirming no downstream assumptions depend on its current section order.
4. **Consider a Chapter 1 cleanup pass** only if reader flow can be safely changed without affecting existing navigation expectations.

---

## Files changed in this pass
- `src/data/CHAPTER_11_UNAVIDA_PRODUCTION.json`
- `src/components/ChapterReader.jsx`

---

## Validation notes
- Chapter 11 JSON was edited structurally, not textually rewritten.
- The dedicated references block remains in the chapter data and should continue to render correctly.
- This pass prefers accurate structure over cosmetic uniformity where source material is missing.
