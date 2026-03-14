// Chapter 2 reader content seed
// Kept in a dedicated module so content can be managed separately from the reader UI.

export const chapter2SeedSections = [
  {
    id: 'sec2_1_pk_overview',
    title: 'Section 2.1: Pharmacokinetics Overview (ADME)',
    content:
      'Pharmacokinetics (PK) describes what the body does to a medication — how it gets in, where it goes, how it is changed, and how it is removed. The classic PK framework is ADME:\n\n• Absorption: how the drug enters the bloodstream\n• Distribution: where the drug travels in the body\n• Metabolism: how the body chemically changes the drug (often liver)\n• Excretion: how the drug (or metabolites) leave the body (often kidneys)\n\nWhy nurses care: PK explains why the same dose can be safe in one patient and harmful in another. It is the backbone for dosing decisions, timing of administration, monitoring plans, and recognizing early signs of accumulation or toxicity.\n\n🎥 Video: 2.1 Pharmacokinetics Overview (ADME)\n🖼️ Image Placeholder: ADME Process Map',
  },
  {
    id: 'sec2_2_absorption',
    title: 'Section 2.2: Absorption & Bioavailability',
    content:
      'Absorption is the movement of a medication from its administration site into systemic circulation. For IV medications, absorption is essentially bypassed (the medication is already in the bloodstream). For oral, IM, SubQ, transdermal, and inhaled medications, absorption can be slower and more variable.\n\nKey factors that influence absorption:\n\n• Route of administration (PO vs IM vs SubQ vs inhalation vs transdermal)\n• Blood flow at the site (poor perfusion can delay IM/SubQ absorption)\n• Surface area (lungs and small intestine absorb quickly due to large surface area)\n• GI motility and food (can delay, reduce, or sometimes increase absorption)\n• Formulation (immediate-release vs extended-release; never crush ER without guidance)\n• Interactions (some medications bind with calcium/iron/magnesium and absorb poorly together)\n\nBioavailability is the fraction of the administered dose that reaches systemic circulation in an active form. Oral medications may have reduced bioavailability due to first-pass metabolism in the liver.\n\nNursing application: If a medication appears ineffective, assess whether it is being absorbed reliably before assuming the dose is too low.\n\n🎥 Video: 2.2 Absorption & Bioavailability\n🖼️ Image Placeholder: Route vs Bioavailability Diagram',
  },
  {
    id: 'sec2_3_distribution',
    title: 'Section 2.3: Distribution — Where Drugs Go',
    content:
      'Distribution is the movement of a medication from the bloodstream into tissues and organs. Reaching the target tissue depends on physiology and on properties of the drug itself.\n\nCore concepts in distribution:\n\n• Plasma protein binding: Only “free” (unbound) drug can typically produce a pharmacologic effect. Low albumin states can increase free drug levels and raise toxicity risk.\n• Blood flow: Highly perfused organs receive medication sooner than poorly perfused tissues.\n• Physiologic barriers: The blood–brain barrier limits entry of many medications into the CNS.\n• Lipid vs water solubility: Lipid-soluble drugs may distribute widely and can persist longer in fatty tissue.\n\nNursing application: Distribution helps explain why patients with low albumin, changes in body fat/water, or altered perfusion can respond differently to standard doses.\n\n🎥 Video: 2.3 Distribution\n🖼️ Image Placeholder: Tissue Distribution Visual',
  },
  {
    id: 'sec2_4_metabolism',
    title: 'Section 2.4: Metabolism & CYP450',
    content:
      'Metabolism (biotransformation) is the chemical alteration of a medication — typically to make it easier to eliminate. The liver is the primary site for metabolism for many drugs.\n\nImportant concepts:\n\n• First-pass metabolism: Oral medications may be partially metabolized by the liver before reaching systemic circulation, reducing bioavailability.\n• Phase I and Phase II reactions: The body modifies the drug and often “tags” it for elimination.\n• CYP450 interactions: Many drug–drug interactions occur because one medication induces (speeds up) or inhibits (slows down) CYP enzymes that metabolize another medication.\n\nClinical implications:\n\n• Enzyme inhibition → higher drug levels → increased effect/toxicity risk\n• Enzyme induction → lower drug levels → reduced therapeutic effect\n\nNursing application: Be alert when new medications are added or stopped, especially in polypharmacy. Unexpected sedation, bleeding, loss of symptom control, or new adverse effects can be a metabolism/interactions problem — not a “mystery new disease.”\n\n🎥 Video: 2.4 Metabolism & CYP450\n🖼️ Image Placeholder: Phase I/II Metabolism Flow',
  },
  {
    id: 'sec2_5_excretion',
    title: 'Section 2.5: Excretion & Drug Elimination',
    content:
      'Excretion is the removal of medications and/or metabolites from the body. The kidneys are the most common route for drug elimination, but bile, lungs, and sweat may also contribute depending on the medication.\n\nWhy excretion matters:\n\n• Reduced renal clearance can lead to drug accumulation and toxicity\n• Dehydration, acute kidney injury, and chronic kidney disease can rapidly change safe dosing\n• Some medications are eliminated unchanged in the urine; others require hepatic metabolism first\n\nPractical nursing focus:\n\n• Review renal function (eGFR/CrCl trends, urine output) when giving renally cleared drugs\n• Monitor for signs of toxicity that fit the medication (confusion, sedation, arrhythmias, bleeding, etc.)\n• Escalate early when renal function changes — don’t wait for a crisis\n\n🎥 Video: 2.5 Excretion & Elimination\n🖼️ Image Placeholder: Excretion Pathway Diagram',
  },
  {
    id: 'sec2_6_half_life_clearance',
    title: 'Section 2.6: Half-Life, Clearance & Steady State',
    content:
      'Half-life (t½) is the time it takes for the concentration of a medication in the bloodstream to decrease by about 50%. Clearance is a measure of how efficiently the body eliminates a medication. Together, these determine dosing intervals, duration of action, and the risk of accumulation.\n\nSteady state occurs when the rate of drug administration equals the rate of drug elimination, resulting in a relatively stable concentration. Many medications take roughly 4–5 half-lives to approach steady state.\n\nWhy nurses care:\n\n• Timing and monitoring: Understanding onset vs peak vs duration supports safer administration\n• Accumulation risk: Short intervals + long half-life can cause levels to build up\n• Therapeutic drug monitoring: Some medications require peak/trough levels and careful adjustment\n\nNursing application: If a patient is not responding to therapy, consider whether the medication has had enough time to reach steady state before labeling it a failure. If adverse effects appear after multiple doses, consider accumulation.\n\n🎥 Video: 2.6 Half-Life & Steady State\n🖼️ Image Placeholder: Plasma Concentration–Time Curve',
  },

  // Text-only extensions (no videos required)
  {
    sectionNumber: '2.7',
    id: 'sec2_7_special_populations',
    title: 'Section 2.7: Special Populations & PK Adjustments',
    duration: 20,
    wordCount: 0,
    learningObjectives: [],
    keyTakeaways: [],
    contentBlocks: [],
    flashcardLinks: [],
    interactiveElements: [],
    content:
      'Pharmacokinetics changes across the lifespan and in specific physiologic states. A “standard adult dose” may not be standard at all once pregnancy, childhood, aging, or organ impairment is in the picture.\n\nCommon high-risk populations:\n\n• Pediatrics: Dosing is often weight-based; organ systems are still maturing. Small errors can be large percentage errors.\n• Pregnancy/lactation: Changes in volume of distribution and renal clearance can alter drug levels; fetal and infant safety must be considered.\n• Older adults: Reduced renal/hepatic reserve, changes in body fat/water, increased sensitivity to CNS effects, and higher polypharmacy risk.\n• Renal impairment: Reduced excretion can cause accumulation; dosing or interval adjustments are often required.\n• Hepatic impairment: Reduced metabolism can increase drug levels; some prodrugs may also be less effective if not activated properly.\n\nNursing application: Always connect the medication plan to the patient’s context. When in doubt, verify: renal function, liver history, current labs, and the patient’s full medication list (including OTC and supplements).\n\n🧠 Key takeaway: “Same dose” does not mean “same exposure” across patients.',
  },
  {
    sectionNumber: '2.8',
    id: 'sec2_8_clinical_application',
    title: 'Section 2.8: Clinical Application — Safe PK Thinking at the Bedside',
    duration: 20,
    wordCount: 0,
    learningObjectives: [],
    keyTakeaways: [],
    contentBlocks: [],
    flashcardLinks: [],
    interactiveElements: [],
    content:
      'Pharmacokinetics is most useful when it changes what you do at the bedside. Here is a practical PK checklist nurses can use to prevent avoidable adverse events:\n\n1) Before giving the medication\n• Confirm route and formulation (especially ER/IR)\n• Review kidney and liver function when relevant\n• Scan for recent med changes that could create interactions\n\n2) After giving the medication\n• Monitor for therapeutic effect (is it working?)\n• Monitor for adverse effect (is it harming?)\n• Watch for delayed effects (accumulation) or lack of effect (poor absorption/induction)\n\n3) When you should escalate\n• Sudden change in mental status, respiratory status, bleeding, arrhythmia, or severe GI symptoms\n• New renal/hepatic lab abnormalities\n• Unusual sedation or loss of symptom control after a medication change\n\n4) How to communicate clearly\n• Describe timing: when the dose was given and when symptoms started\n• Provide relevant vitals/labs and current med list\n• Ask a direct question: “Could this be accumulation or interaction? Should we adjust dose/interval or check levels?”\n\n🧩 Bottom line: PK is your early-warning system. It helps you catch problems before they become emergencies.',
  },
];

export default chapter2SeedSections;
