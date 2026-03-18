#!/usr/bin/env node

/*
Rewrites Chapter 3 section.content into a more textbook-style narrative (matching Chapter 1 tone).
- Removes conversational openers
- Uses clear subheadings (plain text)
- Keeps "Exam Alert" content but standardizes to "Clinical Safety Alert"
*/

const fs = require('fs');

const FILE = 'src/data/CHAPTER_3_UNAVIDA_PRODUCTION.json';

const TEXT = {
  sec3_0_overview_intro: `Overview and how to use this chapter

Medication toxicity is a preventable cause of patient harm. In nursing practice, “toxicity” does not only mean an overdose. Toxicity includes any clinically significant harmful effect from a medication, whether it occurs at a therapeutic dose, after repeated doses, or in a patient whose physiology makes a standard dose unsafe.

This chapter provides a practical framework for recognizing toxicity early, prioritizing immediate safety actions, and communicating clearly with the care team. It is written to support bedside decision-making: what to look for, what to check, what to hold, what to escalate, and how to document.

What you should be able to do after this chapter

1) Use precise language to classify a medication harm event (side effect, adverse drug reaction, allergy, overdose, toxicity).
2) Identify why “small changes” in dose, organ function, or interacting medications can create large clinical effects.
3) Recognize common patterns of toxicity, including dose-related and non–dose-related reactions.
4) Perform a focused toxicity assessment using vital signs, key symptoms, and priority laboratory values.
5) Respond appropriately when toxicity is suspected: protect airway and circulation, hold/stop unsafe medications per protocol, and escalate promptly.
6) Document and report events accurately to reduce repeat harm.

How to study and apply this material

- Read the definitions first. Many safety errors begin as language errors (for example, calling a predictable side effect an “allergy,” or dismissing a true allergy as a “side effect”).
- Learn patterns rather than memorizing isolated facts. Most toxicity scenarios follow repeatable time courses (immediate, early, delayed, cumulative).
- Tie every toxicity concern to a mechanism and a plan:
  - What changed (dose, route, timing, organ function, interaction)?
  - What is the highest-risk complication (respiratory depression, shock, arrhythmia, bleeding, seizure)?
  - What data confirms severity (vitals, mental status, glucose, INR, creatinine, electrolytes, drug levels)?
  - Who must be notified, and what recommendation is being requested?

Clinical Safety Alert
If a patient has airway compromise, severe hypotension, severe altered mental status, active bleeding, seizures, or a new malignant dysrhythmia, treat it as an emergency. Stabilize first and escalate immediately. Do not delay care while searching for the “perfect” explanation.

Key nursing principle
Toxicity is often recognized by pattern: a change in assessment findings over time, especially after a dose change, a new medication, a new illness, or a decline in renal/hepatic function. Nursing surveillance is the early-warning system that prevents progression from mild toxicity to irreversible harm.` ,

  sec3_1_toxicity_basics: `What toxicity means in clinical practice

Patients often describe any unpleasant medication effect as a “reaction” or an “allergy.” Clinically, nursing documentation and triage require more precise categorization because the category changes risk, urgency, and future medication choices.

Core categories and practical definitions

Side effect
A predictable effect that occurs in addition to the intended therapeutic effect. Side effects are often dose-related and may be acceptable, manageable, or expected depending on severity.

Examples: constipation with opioids, mild nausea with many antibiotics.

Adverse drug reaction (ADR)
A harmful or unpleasant response to a medication at normal doses that warrants prevention, dose adjustment, medication discontinuation, or altered monitoring. ADRs may be predictable (dose-related) or unpredictable.

Allergic reaction (hypersensitivity)
An immune-mediated reaction to a drug. Allergic reactions may be mild (rash) or severe and life-threatening (anaphylaxis). True allergies generally require avoidance of the offending drug and, in some cases, avoidance of cross-reactive drugs.

Overdose
Exposure to a dose greater than intended or greater than safe. Overdose can be accidental (calculation error, duplicate dosing, wrong concentration) or intentional. Overdose is a cause of toxicity but is not the only cause.

Toxicity
Clinically significant harm due to drug exposure. Toxicity may occur at therapeutic doses when patient factors change drug handling (absorption, distribution, metabolism, elimination) or when drug–drug interactions increase exposure or sensitivity.

Why this distinction matters for nursing care

- Safety in the current encounter: the same symptom requires different urgency depending on mechanism. For example, mild opioid pruritus is not managed the same way as urticaria with airway symptoms.
- Safety in the next encounter: inaccurate labeling creates future harm. Labeling a side effect as an “allergy” can unnecessarily remove a useful therapy. Labeling a true allergy as a “side effect” can lead to a repeat exposure and a severe reaction.

Clinical Safety Alert
Treat as potential anaphylaxis when there is any combination of hives/urticaria, angioedema (lip/tongue/face swelling), wheeze/stridor, throat tightness, hypotension, or respiratory distress. Escalate immediately per protocol.

A bedside documentation approach
When documenting a reported “allergy,” capture the details:

- Medication name
- Reaction description (symptoms)
- Timing (how soon after exposure)
- Severity (mild discomfort vs airway/blood pressure compromise)
- Treatment required (antihistamine only vs epinephrine/intubation)
- History of repeat exposure and whether reaction recurred

This approach converts vague labels into actionable safety information and reduces repeated harm.` ,

  sec3_2_therapeutic_window_ti: `Therapeutic window, therapeutic index, and why small changes matter

Many medications have a range of exposure where benefit is likely and harm is unlikely. This concept is the therapeutic window. When a medication has a narrow therapeutic window, the difference between an effective dose and a toxic dose is small. In these situations, a “small” change in patient physiology, dose timing, or interacting medications can produce a large clinical change.

Key concepts

Therapeutic window
The range of drug concentrations that produces therapeutic effect without unacceptable toxicity.

Therapeutic index (TI)
A measure of relative safety. A narrower TI indicates higher risk because the toxic range is close to the effective range.

Steady state
With repeated dosing, drug concentration rises until the rate of drug intake equals the rate of elimination. Many medications reach steady state after several half-lives. Toxicity may appear after repeated dosing even if early doses were tolerated.

Half-life
The time required for the concentration of a drug to decrease by 50%. Half-life predicts time to steady state and time to clear a medication after discontinuation.

Why “small changes” produce harm

1) Clearance changes
Renal or hepatic decline decreases clearance, increases half-life, and raises steady-state concentration. Toxicity may appear gradually over 2 to 5 days (or longer) depending on half-life.

2) Interaction changes
Enzyme inhibition can raise drug levels quickly (hours to days). Enzyme induction can lower drug levels more slowly (days), creating therapeutic failure and prompting unsafe dose escalation.

3) Route and formulation changes
Switching from IV to PO (or immediate-release to extended-release) changes peak and timing. Crushing extended-release medications can cause dose dumping and acute toxicity.

4) Protein binding and distribution changes
Low albumin increases the free (active) fraction of highly protein-bound drugs. Edema, ascites, obesity, and pregnancy can change volume of distribution and alter concentration at effect sites.

Therapeutic drug monitoring (TDM): when levels matter
Some medications require drug levels because clinical assessment alone is insufficient to predict safety (narrow therapeutic window, delayed toxicity, variable clearance).

Nursing responsibilities with TDM

- Document exact dosing time and exact sample draw time.
- Ensure the sample represents the intended level (peak vs trough).
- Communicate mis-timed levels before dose changes are made.

Clinical Safety Alert
A “high level” drawn at the wrong time can lead to an unsafe dose reduction, and a “normal level” drawn incorrectly can provide false reassurance. Timing is part of the lab value.` ,

  sec3_3_types_of_toxicity: `Patterns of medication harm (dose-related vs non–dose-related)

Medication harm tends to follow predictable patterns. Recognizing the pattern helps nurses anticipate progression and communicate effectively.

Dose-related reactions (predictable)
These are often extensions of the medication’s pharmacologic effect. Severity increases with higher dose or higher exposure.

Examples:
- Hypotension with antihypertensives
- Respiratory depression with opioids
- Hypoglycemia with insulin
- Bleeding with anticoagulants

Non–dose-related reactions (unpredictable)
These are not directly related to dose or expected pharmacologic effect. They include many allergic and idiosyncratic reactions.

Examples:
- Anaphylaxis to antibiotics
- Severe cutaneous adverse reactions (rare but dangerous)

Time-course patterns

Immediate reactions
Occur minutes to hours after exposure; often allergic, infusion-related, or peak-related.

Early reactions
Occur within the first 24 to 72 hours; may reflect peak effects, early accumulation, or interaction onset.

Delayed reactions
Occur after days to weeks; may reflect steady-state accumulation, organ decline, immune sensitization, or delayed adverse effects.

Cumulative toxicity
Occurs after repeated dosing when elimination is reduced or when the medication accumulates in tissues.

Key nursing implication
When the patient worsens after repeated doses, think accumulation and changing clearance rather than “the patient is just sensitive.” Ask what changed: renal function, hepatic function, interacting medications, hydration, perfusion, or route reliability.` ,

  sec3_4_assessment_red_flags: `Recognizing toxicity at the bedside: assessment, red flags, and priority labs

Early recognition of toxicity relies on a structured nursing assessment. In many cases, toxicity is identified by a change from baseline after a new medication, a dose change, a route change, or a change in patient status.

Step 1: Immediate safety assessment (ABCs)

Airway and breathing
- Work of breathing, oxygen saturation, respiratory rate
- Signs of airway edema, wheeze/stridor
- Sedation level and ability to protect airway

Circulation
- Blood pressure and perfusion
- Heart rate, rhythm, and signs of shock

Neurologic status
- Level of consciousness, new confusion, agitation, seizures
- New focal deficits require urgent evaluation

Clinical Safety Alert
Severe respiratory depression, severe hypotension, active bleeding, status epilepticus, or malignant dysrhythmias are emergencies. Stabilize and escalate immediately.

Step 2: Targeted medication-focused questions

- What medication was started, stopped, or dose-adjusted?
- When was the last dose and what route/formulation was used?
- Are there duplicate therapies (two sedatives, two anticoagulants, two patches)?
- Has renal or hepatic function changed?
- Were any OTC medications, supplements, or antibiotics added?

Step 3: High-yield red flags by body system

Respiratory
- RR < 12 with increasing sedation
- New hypoxia, cyanosis, or apnea

Cardiovascular
- New hypotension, syncope, chest pain
- New bradycardia or tachyarrhythmia

Neurologic
- New confusion, delirium, severe agitation
- New seizures, severe headache, sudden weakness

Bleeding
- Hematemesis, melena, hematuria
- Large bruising, gum bleeding, uncontrolled oozing

Metabolic
- Hypoglycemia (sweating, confusion, altered mental status)
- Hyperkalemia or hypokalemia symptoms (weakness, arrhythmias)

Step 4: Priority labs and monitoring

Common high-yield studies (as ordered per protocol)
- Glucose (bedside check when altered mental status is present)
- Electrolytes (especially potassium, magnesium)
- Renal function (creatinine, BUN, urine output trend)
- Liver function and synthetic markers when relevant (AST/ALT, bilirubin, INR, albumin)
- Coagulation (INR, aPTT) for anticoagulants
- Drug levels when applicable

Nursing documentation standard
Document the time course: last dose time, onset of symptoms, trend in vitals, and any status change (new dialysis, new antibiotic, new vomiting). Time-stamped documentation makes toxicity actionable.` ,

  sec3_5_high_alert_meds_antidotes: `High-alert medications and common antidotes/reversal agents

High-alert medications are drugs that carry a heightened risk of causing significant patient harm when used in error. The risk is driven by narrow therapeutic windows, high potency, complex dosing, or rapid onset of dangerous effects.

The nursing approach is consistent across high-alert drugs:

- Verify the “rights” with heightened attention (patient, drug, dose, route, time, documentation, reason, response).
- Identify the highest-risk adverse outcome (bleeding, respiratory depression, severe hypoglycemia, arrhythmia, hypotension).
- Monitor and trend the correct endpoints.
- Know the immediate escalation triggers.

Common high-alert categories (examples)

Anticoagulants
Primary risk: bleeding.
High-yield monitoring: signs of bleeding, INR/aPTT when relevant, platelet count (heparin-induced thrombocytopenia risk), hemoglobin/hematocrit trends.

Insulin
Primary risk: hypoglycemia.
High-yield monitoring: bedside glucose timing, oral intake, mental status, and hypoglycemia symptoms.

Opioids and sedatives
Primary risk: respiratory depression and loss of airway protection.
High-yield monitoring: respiratory rate, sedation score, oxygenation, and concurrent CNS depressants.

Electrolytes and concentrated infusions
Primary risk: malignant arrhythmias.
High-yield monitoring: ECG changes, potassium/magnesium trends, infusion concentration and pump settings.

Antidotes and reversal concepts (overview)

Antidotes are not substitutes for assessment and stabilization. They are used when the clinical syndrome and severity indicate the medication effect must be rapidly reversed.

Examples of common reversals (conceptual)
- Opioid reversal for clinically significant respiratory depression
- Hypoglycemia treatment for symptomatic low glucose
- Anticoagulant reversal strategies when life-threatening bleeding is present

Clinical Safety Alert
When an antidote/reversal is used, continue monitoring. Re-sedation or rebound toxicity can occur when the antidote wears off before the offending drug clears.` ,

  sec3_6_management_and_reporting: `What to do when you suspect toxicity: hold/stop, escalate, document, report

When toxicity is suspected, the nursing priority is patient safety. Diagnosis refinement can occur after stabilization.

Immediate actions (general framework)

1) Stabilize and support
- Assess ABCs.
- Apply oxygen and place on monitoring as indicated.
- Prepare for escalation when airway or hemodynamics are threatened.

2) Stop further exposure when appropriate
- Hold the next dose of the suspected medication per protocol when safety is uncertain.
- Verify orders and clarify duplicates.
- Do not administer additional sedatives, antihypertensives, anticoagulants, or insulin when the patient is exhibiting toxicity signs without clarification.

3) Notify the right team promptly
- Provider and/or rapid response per severity.
- Pharmacy for medication review and interaction assessment.

4) Collect critical data that changes decisions
- Vital trends (before/after last dose), mental status, respiratory rate, oxygen saturation.
- Time-stamped medication administration record review.
- Glucose, electrolytes, renal function trend, coagulation studies as indicated.

5) Document clearly
High-value documentation includes:
- exact medication, dose, route, and time of last dose
- symptom onset time and progression
- objective findings (RR, O2 sat, BP, heart rate, sedation score)
- notifications and orders received

Reporting and safety culture
Medication events should be reported through the appropriate safety system (institution policy). Reporting supports system fixes, not punishment. Accurate categorization (side effect vs allergy vs ADR vs overdose) improves future safety for the patient and for the unit.

Clinical Safety Alert
If the pattern suggests a time-sensitive emergency (anaphylaxis, severe bleeding, respiratory depression, severe hypoglycemia, malignant arrhythmia), escalate immediately. Do not delay response while waiting for confirmatory labs.` ,

  sec3_7_special_populations: `Special populations and high-risk contexts

Certain patient populations and clinical contexts increase toxicity risk because they alter pharmacokinetics (absorption, distribution, metabolism, elimination) and pharmacodynamics (sensitivity at the effect site). Nurses should anticipate risk and increase monitoring intensity.

Pediatrics
- Weight-based dosing increases calculation risk.
- Organ systems are developing; clearance may be reduced in neonates.
- Small absolute dose errors can cause large clinical effects.

Older adults
- Reduced renal clearance is common, even when serum creatinine appears “normal” due to low muscle mass.
- Increased sensitivity to CNS-active medications increases fall and delirium risk.
- Polypharmacy increases interaction risk.

Pregnancy and lactation
- Physiologic changes alter distribution and clearance.
- Safety involves two patients (parent and fetus/infant).

Renal impairment and dialysis
- Reduced clearance increases half-life and accumulation risk.
- Dialysis modality and timing change exposure.

Hepatic impairment
- Reduced metabolism and reduced albumin can increase free drug exposure.
- Bleeding risk and encephalopathy increase the danger of sedatives and anticoagulants.

Critical illness (sepsis, shock)
- Oral absorption may be unreliable.
- Perfusion changes alter drug delivery and clearance.
- Rapid status changes can convert a safe regimen into an unsafe regimen within hours.

Key nursing habit
When you see: infant, pregnancy, older adult frailty, renal disease, liver disease, polypharmacy, shock.
Immediately ask: which PK step changed for this patient today, and what toxicity pattern would appear first?` ,

  sec3_8_clinical_application: `Clinical application: toxicity thinking in real scenarios

Toxicity recognition improves when nurses practice pattern-based reasoning with time-stamped data. The goal is not to guess the exact mechanism immediately. The goal is to prevent progression and to communicate a clear, actionable concern.

A bedside toxicity workflow

1) Identify the syndrome
- sedation/respiratory depression
- bleeding
- hypoglycemia
- allergic/anaphylaxis features
- arrhythmia or hemodynamic collapse

2) Link the syndrome to medication exposure
- last dose time, route, formulation
- recent starts/stops
- interacting medications

3) Verify severity using objective measures
- RR, O2 sat, sedation score
- BP, heart rhythm
- glucose
- INR/aPTT when relevant
- electrolytes and renal function trend

4) Escalate with a clear SBAR
Include: timing, objective findings, what changed, and what you recommend (hold next dose, obtain level, review dosing interval, switch route, initiate protocol).

Clinical Safety Alert
When the patient is unstable, escalation is not optional. The nurse’s role is to trigger timely rescue and provide accurate time course and medication history.

Documentation tip
The most useful note links symptom timing to dose timing. Example format:
- “After dose #3 at 1400, sedation increased to __ and RR decreased to __. Creatinine rose from __ to __. Next scheduled dose at __ held pending review.”` ,

  sec3_9_key_terms_glossary: `Key terms glossary

This glossary consolidates high-yield toxicity and safety terms used throughout the chapter. These terms support precise documentation and safer clinical communication.

- Adverse drug reaction (ADR): Harmful response to a medication at normal doses that requires prevention or change in therapy.
- Allergy (hypersensitivity): Immune-mediated reaction; may progress to anaphylaxis.
- Anaphylaxis: Severe systemic hypersensitivity reaction involving airway, breathing, or circulation compromise.
- Antidote/reversal agent: A therapy used to counteract a drug effect when clinically indicated.
- Bioavailability: Fraction of a dose that reaches systemic circulation (important when switching routes).
- Clearance: The body’s ability to eliminate a drug (renal or hepatic); decreased clearance increases accumulation.
- Half-life: Time required for drug concentration to decrease by 50%.
- Narrow therapeutic window: Effective dose range is close to toxic range.
- Overdose: Exposure above intended or safe dose.
- Side effect: Predictable effect that occurs along with the intended therapeutic effect.
- Therapeutic drug monitoring: Measurement of drug levels to guide safe dosing.
- Therapeutic index: Relative safety measure; lower TI means higher risk.

Use these terms consistently to improve safety, reduce confusion, and prevent repeated harm.` ,

  // Review questions kept as-is but cleaned to match textbook tone and remove informal phrasing.
  sec3_10_review_questions: `Review questions and assessment

Use these questions to check comprehension and to practice applying toxicity concepts to realistic nursing scenarios. Focus on three skills:

1) correct categorization (side effect vs ADR vs allergy vs overdose)
2) recognition of high-risk patterns (accumulation, interactions, narrow therapeutic window)
3) safe nursing actions (ABCs, hold/clarify, escalate, document)

Work each item as a clinical reasoning exercise:
- Identify the primary risk.
- Identify the key data needed.
- State the immediate nursing action and who to notify.

Proceed to the question bank in the assessment section for structured practice.` ,

  ch3_references: `References

This chapter’s concepts align with standard nursing pharmacology safety principles: medication administration rights, toxicity recognition, pharmacokinetics/pharmacodynamics, and high-alert medication handling. Use institutional protocols, pharmacy guidance, and evidence-based drug references for drug-specific reversal and monitoring requirements.`
};

function main(){
  const raw = fs.readFileSync(FILE,'utf8');
  const json = JSON.parse(raw);
  let changed = 0;
  for(const sec of json.chapter.sections){
    if(TEXT[sec.id]){
      sec.content = TEXT[sec.id];
      changed++;
    }
  }
  if(!changed){
    console.error('No matching sections updated.');
    process.exit(1);
  }
  // Recompute wordCount to keep UI consistent
  const wordCount = (s) => String(s||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().split(' ').filter(Boolean).length;
  for(const sec of json.chapter.sections){
    sec.wordCount = wordCount(sec.content) + (sec.contentBlocks||[]).reduce((acc,b)=>acc+wordCount(b.title)+wordCount(b.content)+wordCount(b.htmlReady),0);
  }
  fs.writeFileSync(FILE, JSON.stringify(json,null,2)+"\n");
  console.log('Updated sections:', changed);
}

main();
