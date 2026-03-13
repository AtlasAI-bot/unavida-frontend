# Chapter 2: Pharmacokinetics - Image Generation Prompts (Sections 2.1–2.6)

**Document Purpose:** High-quality image prompts for sections 2.1–2.6, aligned with Unavida's educational medical diagram style.

**Visual Style Guidelines:**
- Professional, clean medical illustrations (not cartoonish)
- Clear, anatomically/physiologically accurate
- High contrast, colorblind-friendly color palette (blues, grays, oranges, greens)
- Labeled components with sans-serif fonts
- Clinical context emphasized (real-world relevance)
- Light backgrounds with dark text for accessibility
- SVG-preferred format for scalability

**Each section includes:**
1. **Primary Prompt** - Main visual for the learning objective
2. **Backup Prompt** - Alternative approach if primary requires revision
3. **Format/Style Constraints** - Technical specifications
4. **Clinical Context** - How to emphasize real-world relevance

---

## **2.1 OVERVIEW: PHARMACOKINETICS IN CONTEXT**

### **Visual 2.1.1 — ADME Pipeline with Timeline**

**Primary Prompt:**
Create a detailed horizontal flowchart showing the ADME process (Absorption → Distribution → Metabolism → Excretion) over a 24-hour timeline. 

**Specifications:**
- **Layout:** Left-to-right flow diagram with time progression below
- **Elements to include:**
  - **Absorption phase (0–2 hours):** Drug entering from GI tract/injection site → bloodstream (show tablet dissolving, needle inserting, skin patch)
  - **Distribution phase (2–8 hours):** Drug molecules traveling through circulation to organs (heart, liver, brain, kidney highlighted) with protein-binding molecules shown
  - **Metabolism phase (8–18 hours):** Drug reaching liver, CYP450 enzymes active (Phase I/II indicated but not detailed—refer to section 2.4), converted to metabolites
  - **Excretion phase (18–24 hours):** Metabolites exiting via kidneys (urine) and bile (feces)
- **Color coding:** Absorption = blue, Distribution = purple, Metabolism = orange, Excretion = green
- **Labels:** Time milestones (0h, 2h, 8h, 18h, 24h) on timeline; organ names; "Active drug" vs. "Metabolite" distinction
- **Style:** Medical textbook diagram (similar to pharmacology illustrations in Lilley's Pharmacology or Goodman & Gilman's)
- **Dimensions:** 2000×800px (landscape), SVG preferred

**Backup Prompt:**
Simplified circular ADME diagram with the four steps arranged in a circle, arrows connecting each phase. Center shows "Drug Dose" with concentric rings representing blood, tissue, and organ penetration. Include clock face to show timing. Color-coded sections, labeled metabolites/conjugates. Less detailed but emphasizes cyclical nature and timing.

**Format/Style Constraints:**
- No 3D effects; clean 2D illustration
- High contrast (accessible for color blindness)
- All text legible at small sizes
- Transparent backgrounds acceptable
- Include legend if color-coding used

**Clinical Context to Emphasize:**
Show a digitalized patient silhouette if space allows, with drug pathway highlighted. Add small annotation box: "Why this matters: Understanding ADME helps nurses predict when drugs peak in blood, why timing of doses matters, and how long side effects may linger."

---

### **Visual 2.1.2 — Therapeutic Window Concept**

**Primary Prompt:**
Create a side-by-side comparison showing drug concentration vs. time curves for three scenarios: (1) Subtherapeutic, (2) Therapeutic, (3) Toxic. 

**Specifications:**
- **Layout:** X-axis = Time (hours); Y-axis = Serum Drug Concentration (mg/mL)
- **Three curves overlaid:**
  - **Subtherapeutic:** Curve stays below "Minimum Effective Concentration (MEC)" line—clinical outcome: no therapeutic effect (patient symptoms persist)
  - **Therapeutic:** Curve oscillates between MEC and "Minimum Toxic Concentration (MTC)" line—clinical outcome: symptom relief without side effects (green zone)
  - **Toxic:** Curve exceeds MTC line—clinical outcome: adverse effects (nausea, tremor, etc. labeled with icons)
- **Horizontal reference lines:**
  - MEC (lower threshold) = dashed red line
  - MTC (upper threshold) = dashed red line
  - Therapeutic window (safe zone) = light green shaded area between lines
- **Dosing events:** Arrows or tablets marking when doses given; show frequency effect (accumulation with repeated dosing in therapeutic curve)
- **Clinical example annotation:** Small box showing "e.g., Digoxin: MEC 0.5 ng/mL, MTC 2 ng/mL" with patient symptoms for each zone
- **Style:** Professional pharmacology textbook (similar to Katzung illustrations)
- **Dimensions:** 2000×1200px, SVG

**Backup Prompt:**
Infographic-style vertical layout with three columns: each representing Sub-therapeutic/Therapeutic/Toxic scenario. Top shows concentration curve, middle shows patient symptom icon, bottom shows dosing recommendation. Icons for outcomes (sad/happy/sick patient faces) to enhance clinical relevance. Simpler but more intuitive.

**Format/Style Constraints:**
- Curves must be smooth (mathematically accurate exponential decay or biphasic)
- Grid background optional (light gray if used)
- Thresholds clearly labeled with numeric values
- Color scheme: Green (therapeutic), Red (danger zones)
- Accessible to colorblind viewers—use patterns/dashing in addition to color

**Clinical Context to Emphasize:**
Include real drug example (e.g., warfarin, digoxin, or phenytoin) with actual therapeutic range values. Add callout: "Narrow therapeutic window = greater risk of toxicity if dose miscalculated. Regular monitoring essential."

---

## **2.2 ABSORPTION: GETTING THE DRUG INTO THE BODY**

### **Visual 2.2.1 — Routes of Administration with Bioavailability Comparison**

**Primary Prompt:**
Create a comprehensive multi-panel diagram showing 6 routes of administration (IV, IM, PO, Sublingual, Transdermal, Inhalation) side-by-side with bioavailability percentages and time-to-peak curves.

**Specifications:**
- **Layout:** Six panels arranged in 2 rows × 3 columns
- **Each panel includes:**
  - **Route illustration:** Show anatomical site (e.g., IV in arm vein, IM in muscle, tablet in mouth, patch on skin, inhaler to lungs, sublingual under tongue)
  - **Bioavailability percentage:** Large bold number (IV=100%, IM=70%, PO=50%, Sublingual=80%, Transdermal=90%, Inhalation=90%)
  - **Time-to-peak curve:** Small graph showing Cmax and Tmax (concentration vs. time) unique to each route
  - **Onset time label:** "Rapid" / "Intermediate" / "Slow"
  - **Key advantage:** One-line summary (e.g., "100% bioavailability, immediate onset" for IV)
- **Color coding:** Each route gets distinct color (IV=red, IM=orange, PO=blue, Sublingual=purple, Transdermal=green, Inhalation=teal)
- **Central comparison table:** Optional small table in center showing bioavailability, onset, duration, and common drugs for each
- **Style:** Clean, modern infographic (similar to nursing education graphics)
- **Dimensions:** 2000×1400px (can be portrait or landscape)

**Backup Prompt:**
Single comprehensive image showing drug journey for each route from administration site → bloodstream → target organ. Vertical comparison of absorption barriers (GI pH, enzymes, blood flow) for each route. Emphasizes physiological factors affecting absorption. More educational but busier.

**Format/Style Constraints:**
- Anatomically accurate but simplified (remove unnecessary detail)
- Bold, clear labeling of percentages and times
- Curves should be relative to each other (not exact mathematical models)
- Use icons or simple silhouettes for routes if appropriate
- High contrast between text and background

**Clinical Context to Emphasize:**
Add real-world scenarios: "Why give IM injection instead of PO? Patient cannot swallow / needs faster absorption. Why use sublingual nitroglycerin? Bypasses first-pass metabolism → faster symptom relief."

---

### **Visual 2.2.2 — First-Pass Metabolism Concept**

**Primary Prompt:**
Create a side-by-side comparison diagram showing **Oral (PO) route with first-pass metabolism** vs. **IV route bypassing first-pass.**

**Specifications:**
- **Left panel — Oral (PO) Route:**
  - Drug tablet in mouth/GI tract
  - Arrow to small intestine with enzyme illustration (CYP450)
  - Drug molecule shown entering intestinal epithelium
  - Percentage loss annotation (e.g., "30% metabolized here")
  - Remaining drug enters hepatic portal vein
  - Arrow to liver with enzyme activity shown
  - Percentage loss annotation (e.g., "40% metabolized in liver")
  - Only fraction reaches systemic circulation (show reduced arrow size)
  - Final note: "Bioavailability = 30–40% of original dose"
- **Right panel — IV Route:**
  - Drug injection into vein
  - Direct arrow to systemic circulation (shown with heart/bloodstream)
  - "100% bioavailability—no first-pass loss"
  - Emphasis on rapid onset
- **Clinical callout box:** "Why some drugs taken sublingually: Nitroglycerin bypasses first-pass to reach therapeutic levels quickly. Sublingual route avoids GI metabolism."
- **Color scheme:** Oral pathway = orange/yellow (loss areas darkened); IV pathway = bright red (complete delivery)
- **Style:** Anatomy textbook illustration
- **Dimensions:** 2000×1200px, SVG

**Backup Prompt:**
Simplified flow chart showing: PO Drug → GI absorption loss (show % reduction) → Liver metabolism loss (show % reduction) → Reduced systemic availability (show final %). Compared to IV (straight arrow = 100%). Quick visual impact but less anatomically detailed.

**Format/Style Constraints:**
- Clearly distinguish between absorbed vs. metabolized vs. excreted drug
- Use arrow thickness to show % loss (thinner arrows = more loss)
- Labels with actual percentages (can be general ranges like "30–50%")
- Include enzyme illustrations (stylized CYP450 symbols)

**Clinical Context to Emphasize:**
"First-pass metabolism explains why some IV doses are lower than PO doses. Example: Propranolol oral dose 40 mg, but if given IV, only 5 mg needed due to lack of first-pass loss."

---

## **2.3 DISTRIBUTION: WHERE THE DRUG GOES IN THE BODY**

### **Visual 2.3.1 — Volume of Distribution (Vd) Concept**

**Primary Prompt:**
Create a side-by-side comparison showing **High protein-binding drug (small Vd)** vs. **Lipophilic drug (large Vd)** with anatomical distribution patterns.

**Specifications:**
- **Left panel — High Protein-Binding Drug (e.g., Warfarin, Vd ≈ 0.1 L/kg):**
  - Human silhouette shown
  - Drug molecules illustrated (some bound to albumin protein, some free)
  - Concentration shown in plasma (blood vessel highlighting)
  - Minimal penetration into tissues or organs
  - Brain shows blood-brain barrier blocking entry
  - Label: "Concentrated in plasma; limited tissue distribution; high protein binding = more drug interactions"
  - Illustration of protein molecule with drug bound to it
- **Right panel — Lipophilic Drug (e.g., Chloroquine, Vd ≈ 100–300 L/kg):**
  - Human silhouette shown
  - Drug molecules distributed throughout body: fat tissue, organs (liver, kidney, spleen highlighted), muscle, even crossing BBB into brain
  - Fatty tissue shown with concentrated drug accumulation (darkened/highlighted)
  - Free drug molecules shown penetrating cell membranes
  - Label: "Widely distributed to tissues; accumulates in fat; crosses BBB; long half-life due to tissue reservoir"
- **Central comparison table:** Vd values, protein binding %, BBB penetration, tissue accumulation patterns
- **Color scheme:** Plasma = bright red; tissues = gradient of pink to pale; fat = yellow; BBB = thick black line (blocking vs. permeable)
- **Style:** Medical illustration with semi-transparent tissue layers
- **Dimensions:** 2000×1400px, SVG

**Backup Prompt:**
Infographic showing Vd as a concept: "Virtual space drug occupies." Small Vd = concentrated (show compact distribution), Large Vd = spread out (show dispersed distribution). Include kidney silhouettes to show how lipophilic drugs accumulate in tissues away from elimination organs.

**Format/Style Constraints:**
- Use transparency/opacity to show concentration gradients
- Protein molecules should be recognizable (show binding sites)
- Labels must clarify free vs. bound drug
- Color-code plasma, tissue, fat distinctly
- Include legend explaining Vd interpretation

**Clinical Context to Emphasize:**
"High Vd drugs accumulate in tissues—long washout period after stopping (e.g., chloroquine can be detected weeks later). Small Vd drugs stay in blood—easier to remove by dialysis."

---

### **Visual 2.3.2 — Blood-Brain Barrier and Special Distribution**

**Primary Prompt:**
Create a detailed cross-section illustration of the **Blood-Brain Barrier (BBB)** showing selective drug penetration with three examples: (1) Lipophilic drug crossing easily, (2) Hydrophilic drug blocked, (3) P-glycoprotein efflux pump actively removing drug.

**Specifications:**
- **Central diagram — BBB structure:**
  - Capillary endothelium shown in cross-section
  - Tight junctions between endothelial cells (draw intercellular tight junction proteins—claudins, occludin)
  - Astrocyte foot processes surrounding capillary
  - Highlight low pinocytosis (minimal vesicular transport) compared to peripheral capillaries
  - Label: "Tight junctions create selective barrier"
- **Left side — Lipophilic drug (e.g., phenytoin, some anesthetics):**
  - Drug molecules shown as small circles/ovals
  - Illustration of lipid bilayer (double layer) of cell membrane
  - Drug crossing directly through membrane (passive diffusion)
  - Brain tissue on other side (neuron shown)
  - Label: "Lipophilic drugs cross BBB readily → CNS effects"
- **Center — Hydrophilic drug (e.g., digoxin, gentamicin):**
  - Large charged molecules shown
  - Blocked at tight junctions (stopped at intercellular space)
  - Arrow showing "cannot cross"
  - Label: "Hydrophilic drugs blocked by BBB → minimal CNS penetration"
- **Right side — P-glycoprotein efflux pump:**
  - Draw transmembrane protein in endothelial cell
  - Drug entering cell on one side, being pumped out on blood side
  - ATP molecule shown as energy source
  - Label: "Efflux pumps actively remove substrate drugs from brain → even lipophilic drugs may not accumulate"
- **Color scheme:** Tight junctions = dark purple, Lipophilic drugs = blue/small icons, Hydrophilic drugs = red/large icons, P-gp pump = green, Brain side = light pink/neuronal detail
- **Style:** Cellular/molecular biology textbook illustration (similar to Campbell Biology or cell biology texts)
- **Dimensions:** 2000×1500px, SVG (detailed molecular illustration)

**Backup Prompt:**
Simplified side-by-side comparison: BBB shown as impermeable wall. Three drug molecules illustrated (lipophilic getting through, hydrophilic blocked, substrate of P-gp being pumped out). Clinically focused: "Some drugs don't reach CNS despite systemic levels—explains why some antibiotics can't treat meningitis."

**Format/Style Constraints:**
- Show atomic/molecular detail but maintain clarity
- Use arrows to show transport direction
- Protein structures simplified but recognizable
- Color intensity correlates with drug penetration success/failure
- Include scale reference or notation

**Clinical Context to Emphasize:**
"Why gentamicin (hydrophilic) is poor for bacterial meningitis but chloramphenicol (lipophilic) works well. Why CNS lymphomas need drugs that cross BBB."

---

## **2.4 METABOLISM: HOW THE BODY BREAKS DOWN DRUGS**

### **Visual 2.4.1 — Phase I, II, III Metabolism Pathways**

**Primary Prompt:**
Create a comprehensive vertical flowchart showing three phases of drug metabolism in the liver, with examples for each phase and enzyme families.

**Specifications:**
- **Layout:** Vertical flow from top (lipophilic drug substrate) to bottom (water-soluble excretable metabolite)
- **Phase I (top section) — Oxidation, Reduction, Hydrolysis:**
  - Liver microsome/smooth endoplasmic reticulum illustrated (stacked circular structures)
  - **CYP450 enzyme family highlighted:** Show stylized "CYP450" protein structure
  - Major isoforms listed in boxes: CYP3A4 (50% of drugs), CYP2D6, CYP2C9, CYP1A2, CYP2B6
  - Drug substrate entering enzyme active site
  - Functional group addition/exposure shown (e.g., -OH group added, ester bond hydrolyzed)
  - Product: Still lipophilic, often more active (metabolite may be pharmacologically active)
  - Percentage of drugs metabolized by each CYP annotated (CYP3A4 = 50% of drugs)
- **Arrow → Phase II (middle section) — Conjugation:**
  - Phase I product entering conjugation enzyme
  - Types of conjugation shown in sub-boxes:
    - **Glucuronidation** (most common) — glucose molecule attached
    - **Sulfation** — SO₃ group attached
    - **Acetylation** — acetyl group attached
  - Result: Water-soluble conjugate formed
  - Product: Usually inactive, polar, easily filtered by kidneys or excreted in bile
  - Locations: Liver (primary), kidney, GI tract, other tissues noted in small annotations
- **Arrow → Phase III (bottom section) — Active Transport:**
  - Transporter proteins illustrated (MDR1/P-glycoprotein, OATP, OCT)
  - Active transport of conjugate into hepatocyte (cytoplasm → bile canaliculus or blood)
  - ATP molecule shown as energy source
  - Biliary excretion (to feces) vs. renal excretion (to urine) both shown
- **Enzyme induction/inhibition callout boxes:**
  - **Induction example:** Rifampin → ↑ CYP450 activity → faster metabolism → ↓ drug level
  - **Inhibition example:** Ketoconazole → ↓ CYP3A4 activity → slower metabolism → ↑ drug level
- **Color scheme:** Phase I = orange/yellow, Phase II = green, Phase III = blue, Liver = dark red outline, Products = gradient showing lipophilic → hydrophilic transition
- **Style:** Biochemistry textbook illustration (clean, educational, detailed but not overwhelming)
- **Dimensions:** 2000×2200px (tall format to show progression), SVG

**Backup Prompt:**
Simplified three-box diagram: Phase I (oxidation), Phase II (conjugation), Phase III (transport). Each box shows enzyme family, example drugs, and outcome. Clinically focused: "Phase I = adds handle for Phase II, Phase II = makes water-soluble, Phase III = moves metabolite out." Shorter, more mnemonic.

**Format/Style Constraints:**
- Use arrow thickness/boldness to show major pathways
- Enzyme structures simplified but enzyme-like (show active sites, substrate binding)
- Color gradient should transition from lipophilic → hydrophilic appearance
- Include percentage annotations for CYP isoform prevalence
- Accessible legend for phases and enzyme types

**Clinical Context to Emphasize:**
"Understanding CYP450 metabolism predicts drug interactions. Example: Simvastatin (CYP3A4 substrate) + Ketoconazole (CYP3A4 inhibitor) = 15-fold ↑ in simvastatin levels → myopathy risk."

---

### **Visual 2.4.2 — CYP450 Enzyme Induction vs. Inhibition**

**Primary Prompt:**
Create a side-by-side comparison showing **CYP450 Enzyme Induction** (increased activity) vs. **CYP450 Enzyme Inhibition** (decreased activity) with clinical outcomes.

**Specifications:**
- **Left panel — Enzyme Induction:**
  - Timeline: T=0 hours (baseline CYP450 activity shown as moderate), T=1–2 weeks (increased enzyme expression)
  - **Mechanism:** Inducer drug (e.g., rifampin, phenytoin icon) shown binding to nuclear receptor → upregulation of CYP450 gene transcription → ↑ enzyme protein synthesis
  - Show ribosomes producing more enzyme copies (multiple CYP450 enzyme illustrations crowded together)
  - **Result:** Substrate drug (e.g., oral contraceptive) now metabolized faster → ↓ serum levels → ↑ clearance
  - **Clinical outcome box:** "Inducer + Substrate = ↓ substrate effect. Example: OCPs fail on rifampin (TB treatment) → breakthrough pregnancy."
  - Timeline graph showing ↓ concentration curve over time
- **Right panel — Enzyme Inhibition:**
  - Timeline: T=0 hours (baseline), T=hours–days (inhibitor takes effect quickly)
  - **Mechanism:** Inhibitor drug (e.g., ketoconazole, grapefruit juice icon) shown binding to CYP450 enzyme active site → enzyme blocked from metabolizing substrate
  - Enzyme active site shown with inhibitor occupying it (substrate cannot enter)
  - OR enzyme denatured/inactivated (inactive enzyme illustrated)
  - **Result:** Substrate drug (e.g., statin) cannot be metabolized → ↑ serum levels → ↓ clearance
  - **Clinical outcome box:** "Inhibitor + Substrate = ↑ substrate level → toxicity risk. Example: Ketoconazole + Simvastatin → 15× ↑ → myopathy."
  - Timeline graph showing ↑ concentration curve over time
- **Common examples table below:**
  - **Inducers:** Rifampin, Phenytoin, Carbamazepine, St. John's Wort | **Substrates affected:** OCPs, Warfarin, Many others
  - **Inhibitors:** Ketoconazole, Grapefruit, Ritonavir, Erythromycin | **Substrates affected:** Statins, Beta-blockers, Immunosuppressants
- **Color scheme:** Induction = ↑ (upward arrow), enzyme color intensifies; Inhibition = ↓ (downward arrow), enzyme color dims
- **Style:** Educational infographic (like pharmacology nursing educational materials)
- **Dimensions:** 2000×1400px, SVG

**Backup Prompt:**
Simpler parallel comparison: Left shows "Fast metabolism" (many enzymes, substrate disappearing quickly), Right shows "Slow metabolism" (few/blocked enzymes, substrate lingering). Clinical icons (happy patient vs. sick patient) showing outcomes. Minimal text, visual emphasis on metabolic rate difference.

**Format/Style Constraints:**
- Timeline clearly marked
- Enzyme illustrations change visually between induction and inhibition
- Substrate molecules should be recognizable (same molecule in both panels)
- Arrow sizes/directions match outcome (↑ = larger arrow, ↓ = smaller arrow)
- Color-code induction (red/warm) vs. inhibition (blue/cool) or use ↑/↓ symbols

**Clinical Context to Emphasize:**
"Time-sensitive induction: Takes 1–2 weeks for full effect. Inhibition is fast: Hours–days. When patient starts rifampin on warfarin, INR will drop over 1–2 weeks—monitor and increase warfarin dose. When stopping ketoconazole, statin levels drop—risk of relapse if dose not reduced."

---

## **2.5 EXCRETION: HOW THE BODY ELIMINATES DRUGS**

### **Visual 2.5.1 — Renal Excretion Pathways (Filtration, Secretion, Reabsorption)**

**Primary Prompt:**
Create a detailed cross-section of a **renal nephron (glomerulus, proximal tubule, distal tubule)** showing three renal excretion processes for drugs, with examples.

**Specifications:**
- **Central structure — Renal Nephron:**
  - **Glomerulus:** Capillary network with fenestrated endothelium
  - **Bowman's capsule:** Surrounding structure
  - **Proximal tubule:** Lined with epithelial cells
  - **Distal tubule:** Lower segment
  - **Collecting duct:** Terminal segment leading to ureter
- **Glomerular Filtration (top):**
  - Large molecules (proteins, bound drugs shown with attached albumin icon) → BLOCKED (cannot filter)
  - Small unbound drug molecules → FILTERED passively through fenestrated capillary
  - Show glomerular filtration pressure forcing fluid/drug into Bowman's capsule
  - Label: "Passive; unbound drugs filtered; depends on size & charge"
  - Example: Digoxin (unbound portion filtered)
- **Active Secretion (proximal tubule):**
  - Organic anion transporter (OAT) / Organic cation transporter (OCT) illustrated in tubular epithelium
  - Drug molecules being actively transported from blood (peritubular capillary) into tubular fluid
  - ATP symbol showing energy requirement
  - Drug concentration in tubule increases above plasma levels
  - Label: "Active transport; saturable; subject to competition"
  - Example: Penicillin secreted actively; probenecid blocks secretion (used therapeutically)
  - **Drug-drug interaction callout:** "Penicillin + Probenecid: Probenecid competes for secretion → ↓ penicillin excretion → ↑ penicillin levels (useful in gonorrhea, allows less frequent dosing)"
- **Passive Reabsorption (distal tubule):**
  - Lipophilic drug molecules shown reabsorbing from tubular fluid back into blood (through epithelial cells)
  - Mechanism: Concentration gradient; high tubular concentration → passive diffusion back across cell membrane
  - Label: "Passive; lipophilic drugs reabsorbed; influenced by urine pH"
  - **pH effect callout:** Acidic urine traps weak bases (ionized form cannot cross); alkaline urine traps weak acids
  - Example: Aspirin (weak acid) — alkaline urine ↑ excretion (used in overdose treatment)
- **Color scheme:** Blood side (capillary) = red, Tubular fluid = yellow, Epithelial cells = gray, Transporters = green, Filtered/secreted/reabsorbed drugs = distinct colors (blue/orange/purple)
- **Style:** Medical/anatomy textbook (detailed but educational, not overwhelming)
- **Dimensions:** 2400×1800px (detailed, high-resolution), SVG

**Backup Prompt:**
Simplified three-step diagram showing: (1) Filtration at glomerulus (drug in → filter out), (2) Secretion in proximal tubule (blood → tubule), (3) Reabsorption in distal tubule (tubule → blood). Minimal structural detail, focus on net effect (drug reaching urine or recirculating to blood). Easier to understand at a glance.

**Format/Style Constraints:**
- Anatomically accurate but simplified capillary/tubule structures
- Drug molecules should be identical visual symbol (to trace their pathways)
- Transporter proteins should be visually distinct from other proteins
- Use arrows with arrowhead size/color to indicate transport direction and energy requirement
- pH effects should be clearly labeled with examples

**Clinical Context to Emphasize:**
"Why elderly patients accumulate drugs: Reduced GFR. Why dose adjustments critical for aminoglycosides, digoxin, ACE inhibitors in renal disease. Why alkalinizing urine speeds salicylate excretion in aspirin overdose."

---

### **Visual 2.5.2 — Dose Adjustment Based on Renal Function (GFR/CrCl)**

**Primary Prompt:**
Create a **dose adjustment nomogram or color-coded chart** showing drug dose adjustments across renal function categories (Normal → Severe impairment).

**Specifications:**
- **Layout:** Horizontal bar chart or stepped pyramid showing five renal function categories
- **Categories (left to right or top to bottom):**
  - **Normal renal function:** GFR >90 mL/min | CrCl >90 mL/min
  - **Mild impairment:** GFR 60–89 mL/min | CrCl 60–89 mL/min (minimal dose adjustment usually)
  - **Moderate impairment:** GFR 30–59 mL/min | CrCl 30–59 mL/min (20–50% dose reduction)
  - **Severe impairment:** GFR <30 mL/min | CrCl <30 mL/min (50–80% dose reduction; extend intervals)
  - **ESRD/Dialysis:** GFR <15 mL/min | On dialysis (highly individualized; specialized dosing tables)
- **Each category shows:**
  - **Color gradient:** Green (normal) → yellow (mild) → orange (moderate) → red (severe) → dark red (dialysis)
  - **Dose percentage:** Bar showing % of normal dose (normal = 100%, mild = 100%, moderate = 50%, severe = 25%, dialysis = variable)
  - **Dosing interval:** Text or icon showing typical interval (normal = Q24H, severe = Q48H or longer)
  - **Example drug:** Real drug with actual adjusted dosing (e.g., Gentamicin: Normal = 5 mg/kg Q24H, Severe = 5 mg/kg Q48H or dose reduction)
- **Bottom table (optional):** Quick reference table with common renally-eliminated drugs and their adjusted dosing
  - Columns: Drug | Normal Dose | Mild/Moderate | Severe | ESRD
  - Rows: 4–6 examples (Gentamicin, ACE inhibitor, Digoxin, Penicillin, Cephalosporin)
- **Clinical callout:** "Why creatinine alone is misleading: Elderly patient with Cr=1.0 appears normal, but actual CrCl may be 30 mL/min. Always calculate CrCl using Cockcroft-Gault or use eGFR."
- **Color scheme:** Spectrum from green → red; neutral background for readability
- **Style:** Clinical nursing reference guide (practical, quick-lookup format)
- **Dimensions:** 2000×1400px, SVG or infographic format

**Backup Prompt:**
Simpler visual: Four kidney silhouettes arranged left-to-right, each shaded to show percentage function (normal = bright, severe = dark/damaged). Above each kidney, drug dosing recommendation as % of normal dose. Quick visual: darker kidney = lower dose. Clinically focused on dose reduction percentage.

**Format/Style Constraints:**
- Color intensity correlates with renal function loss
- Numeric values (GFR, dose %, interval) clearly visible
- Table should be scannable (high contrast text)
- Include footnote on how to calculate CrCl or access eGFR
- Accessible colors (not red-green alone distinction for colorblindness)

**Clinical Context to Emphasize:**
"Aminoglycosides in renal disease: Standard dosing causes ototoxicity + nephrotoxicity. Extended-interval dosing (higher dose less frequently) is safer. Drug levels must be monitored in renal impairment—TDM is essential."

---

## **2.6 HALF-LIFE, STEADY STATE, AND CLEARANCE**

### **Visual 2.6.1 — Half-Life Decay and Steady-State Achievement**

**Primary Prompt:**
Create a **combination graph showing (1) Single-dose half-life decay curve and (2) Repeated-dose accumulation to steady state.**

**Specifications:**
- **Left side — Single-Dose Half-Life Decay (top-left graph):**
  - X-axis: Time (in multiples of t½: 0, 1 t½, 2 t½, 3 t½, 4 t½, 5 t½)
  - Y-axis: Plasma concentration (0–100%)
  - **Single exponential decay curve:** Starts at 100% (Cmax), drops to 50% at t½, 25% at 2×t½, 12.5% at 3×t½, etc.
  - **Half-life markers:** Vertical dashed lines at each t½ with annotations (t½, 2×t½, 3×t½, 4×t½, 5×t½)
  - **Elimination zone:** Below 5% concentration (therapeutically insignificant)
  - **Label:** "Single dose: concentration decreases by 50% with each half-life"
  - **Example annotation:** "Warfarin t½ = 40 hours; after 8 days (5 t½), 97% eliminated"
- **Right side — Repeated Dosing with Accumulation (top-right graph):**
  - X-axis: Time (dose administration days/intervals)
  - Y-axis: Plasma concentration (0–150% or higher for demonstration)
  - **Multiple dose curve:** Each new dose adds to remaining drug; curve shows "sawtooth" pattern (↑ after dose, ↓ between doses, but baseline rising with each dose)
  - **Dose timing markers:** Vertical dotted lines or dose symbols (D1, D2, D3, D4... D5) marking when doses given
  - **Steady-state plateau:** Curve stabilizes after ~5 t½ (horizontal dashed line at steady-state concentration)
  - **Time to steady state annotation:** "Reaches 97% of steady state in ~5 t½"
  - **Accumulation ratio:** Formula shown: AR = 1/(1 − e^(−k×τ)) or AR = τ/(t½ × 0.693); practical example: "If t½ = 24 hrs and dose interval = 24 hrs, drug accumulates 2-fold by day 5"
  - **Label:** "Repeated dosing: drug accumulates; steady state reached after ~5 half-lives"
- **Bottom section — Comparative example (small graph):**
  - Two curves overlaid showing short t½ drug vs. long t½ drug
  - Short t½ reaches steady state quickly (few days)
  - Long t½ takes much longer (weeks)
  - Clinical implication: "Why warfarin takes ~8 days to reach stable INR; why codeine reaches steady state in days"
- **Clinical callout boxes:**
  - "Why loading dose used:" For long t½ drugs, waiting 5 t½ is impractical. Loading dose = (Desired Css × Vd) / F achieves therapeutic level immediately
  - "Practical implications:" Drug levels predictable after ~5 t½; labs drawn after reaching steady state; dose adjustments effective ~1 week later
- **Color scheme:** Single-dose curve = blue, Accumulation curve = orange/red, Steady state = green horizontal line, Loading dose marker = purple arrow
- **Style:** Educational pharmacokinetics graph (clean, professional, similar to pharmacology textbooks)
- **Dimensions:** 2000×1400px (landscape for side-by-side), SVG

**Backup Prompt:**
Simplified step-by-step illustration: Show 5 containers labeled "Day 1 dose" through "Day 5 dose," each with stacked drug concentration showing accumulation. By day 5, container is full (steady state). Use height/volume analogy—easy visual understanding. Minimal math, emphasis on concept.

**Format/Style Constraints:**
- Curves must be mathematically accurate exponential decay/accumulation
- Grid background helpful (light gray grid, not intrusive)
- Half-life intervals clearly marked
- Dosing intervals clearly marked
- Y-axis percentage scale easy to read
- All equations/formulas legible but not overwhelming (background formulas acceptable)

**Clinical Context to Emphasize:**
"Why we can't judge warfarin dosing until day 8. Why starting a new antidepressant (t½ = 24 hrs) takes 4–5 days for therapeutic effect. Why loading doses used for digoxin but not for warfarin (practical timeline difference)."

---

### **Visual 2.6.2 — Loading Dose vs. Maintenance Dose Calculation**

**Primary Prompt:**
Create an **infographic showing how to calculate and use loading and maintenance doses** to achieve desired steady-state concentration rapidly.

**Specifications:**
- **Top section — Problem Statement:**
  - Timeline showing "Day 0" with patient needing immediate therapeutic effect (e.g., heart failure, arrhythmia)
  - Two scenarios side-by-side:
    - **Without loading dose:** Only maintenance doses given; therapeutic effect delayed until steady state (5 t½)
    - **With loading dose:** Loading dose given immediately; therapeutic effect within hours; then maintenance doses sustain level
- **Middle section — Formulas & Calculations:**
  - **Loading Dose (LD) formula:**
    - LD = (Desired Css × Vd) / F
    - Break down each component:
      - **Desired Css:** Target steady-state concentration (e.g., 2 ng/mL for digoxin)
      - **Vd:** Volume of distribution (L) — how much body space drug occupies
      - **F:** Bioavailability (fraction of dose reaching systemic circulation; IV = 1, PO = variable)
    - **Example calculation:** "Digoxin: Desired Css = 1 ng/mL, Vd = 7 L/kg (70 kg pt = 490 L), F = 0.7 (oral)
      LD = (1 ng/mL × 490 L) / 0.7 = 700 ng = 0.7 mg. Gives one dose now → immediately therapeutic."
  - **Maintenance Dose (MD) formula:**
    - MD = (Css × CL × τ) / F
    - Break down:
      - **Css:** Same desired concentration
      - **CL:** Clearance (mL/min) — how fast body eliminates drug
      - **τ:** Dosing interval (hours/days)
      - **F:** Same bioavailability
    - **Example:** "Digoxin maintenance: Css = 1 ng/mL, CL = 110 mL/min (estimated from renal function), τ = 24 hrs
      MD = (1 × 110 × 1440 min) / 0.7 = 226 mcg ≈ 250 mcg daily. Sustains steady state."
  - **Dosing plan visualization:** Timeline showing "Day 0: LD dose → Cmax, Days 1+: MD doses → oscillation around Css"
- **Bottom section — Practical comparison table:**
  - | Parameter | Without LD | With LD |
    |-----------|-----------|---------|
    | Time to therapeutic level | 5 t½ (weeks for long t½ drugs) | Hours |
    | Initial dose | Maintenance dose | Much higher (LD) |
    | Day 1 concentration | Below therapeutic | At target |
    | When used clinically | Chronic maintenance | Acute conditions |
    | Example drugs | Warfarin, antidepressants | Digoxin, IV antibiotics, initial anesthesia |
- **Drug-specific examples (small boxes):**
  - **Digoxin (acute heart failure):** LD = 0.5 mg IV, then 0.25 mg daily
  - **Warfarin (DVT prophylaxis):** No LD (slow onset preferred), just 5 mg daily, adjust by INR
  - **Vancomycin (sepsis):** LD = 25–30 mg/kg IV, then 15–20 mg/kg Q8–12H based on levels
- **Color scheme:** Loading dose = bright color (rapid rise), maintenance doses = steady color (plateau), time axis progression clear
- **Style:** Clinical decision-making infographic (like nurse practitioner dosing guides)
- **Dimensions:** 2200×1600px (vertical format for formulas + examples), SVG

**Backup Prompt:**
Simpler visual: Show two timelines side-by-side. Left = without LD (slow rise to therapeutic level over weeks). Right = with LD (immediate jump to therapeutic, then maintenance keeps level steady). Emphasize "fast vs. slow" outcome, minimal formulas. Intuitive for non-math-focused learners.

**Format/Style Constraints:**
- Formulas should be clear, with each variable explained separately
- Example calculations should show step-by-step work (not just final answer)
- Color-code LD dose (large, bold) vs. MD dose (smaller, repeated)
- Include units in all calculations (ng/mL, L, mL/min, hours) to avoid confusion
- Practical clinical scenarios to anchor learning

**Clinical Context to Emphasize:**
"Warfarin does NOT use loading dose despite long t½ (40 hrs) because slow onset preferred for safety—waiting 8 days allows INR monitoring and titration. Digoxin USES loading dose because acute heart failure can't wait 5–9 days. Vancomycin USES high loading dose for sepsis (requires rapid bactericidal concentration at infection site)."

---

## **FILE METADATA**

**Document:** CH2_IMAGE_PROMPTS_2_1_TO_2_6.md  
**Version:** 1.0  
**Created:** 2026-03-11  
**Status:** Ready for image generation  
**Target Platform:** Unavida-frontend (React-based educational platform)  
**Target Format:** SVG (preferred) or high-res PNG (2000×1500px minimum)  
**Visual Style:** Professional medical diagrams (education-focused, not entertainment)  
**Accessibility:** Colorblind-friendly, high contrast, labeled components  
**Clinical Context:** Each prompt includes real-world nursing/clinical applications to emphasize relevance

---

## **USAGE INSTRUCTIONS FOR IMAGE GENERATION**

1. **Primary Prompt:** Use the detailed primary prompt first. If revision needed (color scheme, detail level, anatomical accuracy), reference the backup.
2. **Format Specification:** Follow the SVG preference; PNG acceptable if SVG unavailable (maintain 2000px width minimum).
3. **Style Consistency:** All six images should visually cohesive—use consistent:
   - Color palette (blues, oranges, greens, purples, grays)
   - Font family (sans-serif, legible at small sizes)
   - Line weights (clean, not too thick/thin)
   - Component symbols (protein structures, drug molecules, organ icons should match across all six images)
4. **Validation:** Each image should:
   - Be legible when printed in grayscale
   - Display correctly at 50% and 200% zoom
   - Include alt-text suitable for screen readers
   - Avoid red-green color distinction alone (colorblind accessibility)
5. **Integration:** Save with filenames:
   - `CH2_2_1_1_ADME_Pipeline.svg`
   - `CH2_2_1_2_Therapeutic_Window.svg`
   - `CH2_2_2_1_Routes_of_Administration.svg`
   - `CH2_2_2_2_First_Pass_Metabolism.svg`
   - `CH2_2_3_1_Volume_of_Distribution.svg`
   - `CH2_2_3_2_Blood_Brain_Barrier.svg`
   - `CH2_2_4_1_Metabolism_Phases.svg`
   - `CH2_2_4_2_CYP450_Induction_Inhibition.svg`
   - `CH2_2_5_1_Renal_Excretion_Pathways.svg`
   - `CH2_2_5_2_Renal_Function_Dosing.svg`
   - `CH2_2_6_1_Half_Life_Steady_State.svg`
   - `CH2_2_6_2_Loading_Maintenance_Dose.svg`

---

**End of Document**

**Next Steps for Production Team:**
1. Review prompts with subject matter expert (clinical pharmacist/pharmacology faculty)
2. Assign to medical illustrator or AI image generation service
3. Generate primary versions; QA check against prompts
4. Generate backup versions if primary requires significant revision
5. Integrate into reader platform with alt-text and captions
6. Test for colorblindness accessibility (use tools like Contrast Checker, Color Blindness Simulator)
