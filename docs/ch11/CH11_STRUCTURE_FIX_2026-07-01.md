# Chapter 11 structure fix — 2026-07-01

## What was fixed

- Restored the missing **Section 11.10** object in `src/data/CHAPTER_11_UNAVIDA_PRODUCTION.json`.
- Inserted it in the correct chapter order between **11.9** and **11.11**.
- Used the title **Invasive and Opportunistic Mycoses** with a production-matching section schema (`sectionNumber`, `id`, `title`, `duration`, `wordCount`, arrays, and HTML `content`).
- Updated Chapter 11 `metadata.lastUpdated` to `2026-07-01`.

## Why this was the right structural repair

- The production JSON had a real numbering gap: **11.9 → 11.11**.
- Chapter metadata already expected the missing section: existing section totals were short by exactly **19 minutes** and **2,900 words**, matching the chapter metadata values. Restoring 11.10 brings the summed section totals back into alignment with the chapter metadata.
- Local review notes in `docs/ch11/CH11_VIDEO_SCRIPT_NOTES_2026-07-01.md` and `CH11_VIDEO_SCRIPTS_ATLAS.md` already documented the source-export problem and the intended 11.10 topic.

## Content/source approach used

Because the underlying source export omitted 11.10, the restored section was reconstructed from:

- the established Chapter 11 antifungal/invasive-mycology themes in `ch11_review/`,
- the nearby 11.9 and 11.11 production section structure,
- existing local notes that identified 11.10 as **Invasive and Opportunistic Mycoses** and highlighted candidemia, invasive aspergillosis, cryptococcal CNS disease, mucormycosis, and high-risk host escalation.

## Caveats

- This repair restores the missing production section cleanly and preserves reader ordering/numbering behavior.
- The inserted 11.10 content is a synthesized reconstruction based on local chapter materials and prior review notes, not a verbatim recovery from an original source export.
- I did **not** renumber or rewrite neighboring sections, since the surrounding 11.9 and 11.11+ sequence was otherwise structurally intact.
