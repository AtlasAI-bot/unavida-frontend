#!/usr/bin/env python3
import json
import re
from pathlib import Path

SRC = Path(__file__).resolve().parents[1] / "src/data/CHAPTER_3_UNAVIDA_PRODUCTION.json"

FIGURES = [
    ("FIGURE_3_1_THERAPEUTIC_WINDOW", "Therapeutic Window", "paragraph"),
    ("FIGURE_3_2_ACCUMULATION", "Drug Accumulation", "paragraph"),
    ("FIGURE_3_3_GLUCOSE_REGULATION", "Physiology of Glucose Regulation", "heading"),
    ("FIGURE_3_4_ELECTROLYTE_DISTRIBUTION", "Normal Electrolyte Balance", "heading"),
    ("FIGURE_3_5_ORGAN_DAMAGE", "Mechanisms of Drug-Induced Injury", "heading"),
    ("FIGURE_3_6_NEUROPATHY", "Peripheral Neuropathy", "heading"),
    ("FIGURE_3_7_OTOTOXICITY", "Ototoxicity", "heading"),
    ("FIGURE_3_8_PLACENTA_TRANSFER", "Placental Transfer of Drugs", "heading"),
    ("FIGURE_3_9_TRIMESTER_RISK", "Critical Periods of Fetal Development", "heading"),
    ("FIGURE_3_10_POTASSIUM_ECG", "Potassium Imbalance", "heading"),
    ("FIGURE_3_11_CNS_EFFECTS", "Effects of Drugs on the Central Nervous System", "heading"),
    ("FIGURE_3_12_LIVER_METABOLISM", "Hepatotoxicity", "heading"),
    ("FIGURE_3_13_KIDNEY_EXCRETION", "Nephrotoxicity", "heading"),
    ("FIGURE_3_14_BONE_MARROW", "Bone Marrow Suppression", "heading"),
    ("FIGURE_3_15_ADVERSE_TYPES", "General Definition of Adverse Effects", "heading"),
    ("FIGURE_3_16_ALLERGY", "Allergic Reactions", "heading"),
    ("FIGURE_3_17_GLUCOSE_SYMPTOMS", "Hyperglycemia", "heading"),
    ("FIGURE_3_18_FLUID_REGULATION", "Normal Electrolyte Balance and Regulation", "heading"),
    ("FIGURE_3_19_TOXICITY_FLOW", "__END_SECTION_3_3__", "end_section"),
    ("FIGURE_3_20_TOXICITY_SUMMARY", "__END_CHAPTER__", "end_chapter"),
]


def insert_after_paragraph(html: str, phrase: str, tag: str) -> str:
    """Insert tag right after the paragraph that *contains* phrase.

    If phrase appears in a heading (no preceding <p>), insert after the *first*
    paragraph following that heading occurrence.
    """
    if tag in html:
        return html
    idx = html.find(phrase)
    if idx == -1:
        raise ValueError(f"Phrase not found in html: {phrase}")

    # Try: phrase is inside a paragraph
    p_start = html.rfind("<p", 0, idx)
    p_close_before = html.rfind("</p>", 0, idx)
    if p_start != -1 and (p_close_before == -1 or p_start > p_close_before):
        p_end = html.find("</p>", idx)
        if p_end == -1:
            raise ValueError(f"No </p> after phrase: {phrase}")
        p_end += len("</p>")
        return html[:p_end] + "\n" + tag + html[p_end:]

    # Fallback: phrase is not inside a paragraph (likely in a heading) → use next paragraph
    next_p = html.find("<p", idx)
    if next_p == -1:
        raise ValueError(f"No <p> after phrase: {phrase}")
    p_end = html.find("</p>", next_p)
    if p_end == -1:
        raise ValueError(f"No </p> after next <p> for phrase: {phrase}")
    p_end += len("</p>")
    return html[:p_end] + "\n" + tag + html[p_end:]


def insert_after_heading(html: str, phrase: str, tag: str) -> str:
    if tag in html:
        return html
    # Find a heading tag (h2-h5) whose inner text contains phrase.
    pat = re.compile(r"<(h[2-5])[^>]*>.*?" + re.escape(phrase) + r".*?</h[2-5]>", re.DOTALL)
    m = pat.search(html)
    if not m:
        raise ValueError(f"Heading not found for phrase: {phrase}")
    end = m.end()
    return html[:end] + "\n" + tag + html[end:]


def main():
    data = json.loads(SRC.read_text(encoding="utf-8"))
    sections = data.get("chapter", {}).get("sections", [])

    # helper: collect section content refs
    def iter_section_contents():
        for sec in sections:
            if isinstance(sec, dict) and isinstance(sec.get("content"), str):
                yield sec

    applied = []

    # First pass: direct phrase insertions
    for name, phrase, mode in FIGURES:
        tag = f"<<{name}>>"
        if mode in ("end_section", "end_chapter"):
            continue

        found = False
        for sec in iter_section_contents():
            html = sec["content"]
            if tag in html:
                found = True
                break
            if phrase in html:
                if mode == "paragraph":
                    sec["content"] = insert_after_paragraph(html, phrase, tag)
                else:
                    sec["content"] = insert_after_heading(html, phrase, tag)
                applied.append(name)
                found = True
                break
        if not found:
            raise SystemExit(f"Could not place {name}: phrase '{phrase}' not found in any section")

    # End of section 3.3
    end_33 = "<<FIGURE_3_19_TOXICITY_FLOW>>"
    if True:
        sec33 = next((s for s in sections if s.get("sectionNumber") == "3.3"), None)
        if not sec33:
            raise SystemExit("Section 3.3 not found")
        if end_33 not in sec33["content"]:
            sec33["content"] = sec33["content"].rstrip() + "\n" + end_33 + "\n"
            applied.append("FIGURE_3_19_TOXICITY_FLOW")

    # End of chapter (append to last section)
    end_ch = "<<FIGURE_3_20_TOXICITY_SUMMARY>>"
    last = sections[-1]
    if end_ch not in last["content"]:
        last["content"] = last["content"].rstrip() + "\n" + end_ch + "\n"
        applied.append("FIGURE_3_20_TOXICITY_SUMMARY")

    SRC.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print("Applied tags:")
    for a in applied:
        print(" -", a)


if __name__ == "__main__":
    main()
