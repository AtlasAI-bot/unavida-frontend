#!/usr/bin/env node

/**
 * Restructure Chapter 3 into 7 major sections (per user spec) and update titles/metadata.
 * Goal: textbook-like organization (plain clinical headings), while preserving useful long-form
 * material already written so the chapter stays in the 20k–30k word range.
 *
 * This script:
 * - Rewrites chapter metadata title/subtitle
 * - Builds exactly 7 sections:
 *   3.1 Adverse Effects
 *   3.2 Drug-Induced Tissue and Organ Damage
 *   3.3 Toxicity (therapeutic window, accumulation, overdose)
 *   3.4 Alterations in Glucose Metabolism
 *   3.5 Electrolyte Imbalances
 *   3.6 Neurologic and Sensory Toxicity
 *   3.7 Teratogenicity
 * - Reuses/embeds existing Chapter 3 content (assessment, management, special populations, high-alert meds)
 *   under the most appropriate major sections to keep depth and word count.
 * - Recomputes per-section wordCount.
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'data', 'CHAPTER_3_UNAVIDA_PRODUCTION.json');

function wc(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length;
}

function recomputeSectionWordCount(sec) {
  let n = wc(sec.content);
  for (const b of (sec.contentBlocks || [])) {
    n += wc(b.title) + wc(b.content) + wc(b.htmlReady);
  }
  sec.wordCount = n;
  return n;
}

function normalizeNewlinesToParagraphs(text) {
  if (!text) return '';
  // Keep intentional blank lines, but convert single newlines inside paragraphs to spaces.
  const lines = String(text).split('\n');
  const out = [];
  let buf = [];

  const flush = () => {
    if (!buf.length) return;
    // join wrapped lines
    out.push(buf.join(' ').replace(/\s+/g, ' ').trim());
    buf = [];
  };

  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      flush();
      out.push('');
      continue;
    }
    // Preserve simple headings/callout labels as their own paragraphs.
    if (/^(Clinical Safety Alert|Section Summary|Documentation Focus|Clinical Application)\b/.test(t)) {
      flush();
      out.push(t);
      out.push('');
      continue;
    }
    // Preserve numbered lists and bullets as line-based.
    if (/^(\d+\)|\-|\* )/.test(t)) {
      flush();
      out.push(t);
      continue;
    }
    buf.push(t);
  }
  flush();

  // Collapse 3+ blank lines
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function main() {
  const json = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const old = json.chapter.sections || [];
  const byId = Object.fromEntries(old.map(s => [s.id, s]));

  // Update metadata
  json.chapter.metadata = {
    ...json.chapter.metadata,
    chapterNumber: 3,
    chapterId: 'ch3_toxic_effects',
    title: 'Chapter 3: Toxic Effects of Drugs',
    subtitle: 'Adverse Effects, Organ Injury, and Nursing Safety Actions',
    estimatedTimeMinutes: 210
  };

  const oldAssessment = byId.sec3_4_assessment_red_flags?.content || '';
  const oldManagement = byId.sec3_6_management_and_reporting?.content || '';
  const oldHighAlert = byId.sec3_5_high_alert_meds_antidotes?.content || '';
  const oldSpecialPops = byId.sec3_7_special_populations?.content || '';
  const oldDefinitions = byId.sec3_1_toxicity_basics?.content || '';
  const oldTherWindow = byId.sec3_2_therapeutic_window_ti?.content || '';
  const oldPatterns = byId.sec3_3_types_of_toxicity?.content || '';

  // Reuse the best existing blocks in the most relevant new sections.
  const sec31 = {
    sectionNumber: '3.1',
    id: 'ch3_1_adverse_effects',
    title: 'Section 3.1: Adverse Effects (Expected Side Effects vs ADRs vs Allergy)',
    duration: 35,
    learningObjectives: [
      'Differentiate expected side effects, adverse drug reactions (ADRs), intolerance, and immune-mediated allergy',
      'Recognize clinical features that require urgent escalation (e.g., suspected anaphylaxis)',
      'Document medication reactions with precise timing, symptoms, severity, and treatment'
    ],
    keyTakeaways: [
      'Use precise reaction language because it changes urgency and future medication choices',
      'Triage reactions by severity first, then mechanism',
      'Document symptom details and timing rather than vague labels'
    ],
    contentBlocks: byId.sec3_1_toxicity_basics?.contentBlocks || [],
    flashcardLinks: [],
    interactiveElements: [],
    content: normalizeNewlinesToParagraphs(`Adverse Effects\n\nAdverse effects are unintended responses that occur during medication therapy. Some are predictable extensions of pharmacologic action (expected side effects), while others are harmful responses that require a change in therapy (adverse drug reactions). Nurses must distinguish these patterns because the category determines urgency, documentation, and future medication options.\n\nA practical clinical approach begins with severity, not labels. Airway compromise, wheeze/stridor, angioedema, hypotension, rapidly progressive rash, severe bleeding, seizures, or severe altered mental status should be treated as emergencies and escalated immediately. Once the patient is stabilized, reaction categorization becomes a safety tool for preventing repeat harm.\n\nClinical reaction language and documentation\n\nAccurate documentation prevents two common safety failures: labeling a predictable side effect as an “allergy” (which unnecessarily removes effective options) and minimizing a true allergy as a benign side effect (which increases the risk of catastrophic re-exposure). Nursing documentation should therefore capture medication name, reaction description, onset timing, severity, and treatment required.\n\n${oldDefinitions}`)
  };

  const sec32 = {
    sectionNumber: '3.2',
    id: 'ch3_2_organ_damage',
    title: 'Section 3.2: Drug-Induced Tissue and Organ Damage',
    duration: 35,
    learningObjectives: [
      'Describe how medications can injure organs (liver, kidney, marrow, heart, GI tract) through predictable mechanisms',
      'Recognize early clinical and laboratory warning signs of organ injury',
      'Implement nursing monitoring plans and escalation triggers that prevent progression'
    ],
    keyTakeaways: [
      'Organ damage often begins with trend changes before severe symptoms appear',
      'Renal/hepatic function changes can convert a safe regimen into unsafe exposure within days',
      'Nursing surveillance links medication timing to lab and symptom trends'
    ],
    contentBlocks: [],
    flashcardLinks: [],
    interactiveElements: [],
    content: normalizeNewlinesToParagraphs(`Drug-Induced Tissue and Organ Damage\n\nDrug-induced tissue and organ damage describes medication-related injury to organs such as the liver, kidneys, bone marrow, heart, lungs, and gastrointestinal tract. These injuries can be dose-related (predictable) or patient-specific (increased susceptibility due to comorbidities, genetics, or interactions). The clinical importance is that organ injury may progress silently until it becomes severe; early trend recognition is therefore a core nursing safety skill.\n\nMechanisms of injury include direct cellular toxicity, toxic metabolite formation, ischemic injury from hemodynamic effects, immune-mediated inflammation, and cumulative dose effects. The clinical presentation may be nonspecific (fatigue, nausea, malaise) or organ-directed (jaundice, reduced urine output, bruising/bleeding, dyspnea, arrhythmias). Laboratory trends frequently provide earlier signals than symptoms alone, particularly for hepatic and renal injury and marrow suppression.\n\nNursing implications emphasize baseline risk screening, scheduled surveillance, and timely escalation. Nurses trend creatinine and urine output for renal risk; AST/ALT and bilirubin when hepatic injury is suspected; CBC trends for marrow suppression; and ECG/telemetry when arrhythmia risk is present. When organ injury is suspected, the safest approach is to stop further exposure when indicated by protocol, notify the prescriber and pharmacist with objective trends, and implement supportive measures while the regimen is reviewed.\n\nClinical Assessment and Escalation (Organ Injury)\n\n${oldAssessment}\n\nManagement, Documentation, and Reporting\n\n${oldManagement}`)
  };

  const sec33 = {
    sectionNumber: '3.3',
    id: 'ch3_3_toxicity_overdose',
    title: 'Section 3.3: Toxicity (Therapeutic Window, Accumulation, and Overdose)',
    duration: 45,
    learningObjectives: [
      'Explain therapeutic window and why accumulation occurs with reduced clearance or interactions',
      'Recognize common bedside toxicity patterns using time course and objective data',
      'Apply a safety-first toxicity workflow: stabilize, hold/stop exposure, monitor, escalate'
    ],
    keyTakeaways: [
      'Toxicity is not limited to intentional overdose; accumulation at therapeutic doses is common',
      'Time course and patient vulnerability guide the most likely pattern and the safest response',
      'High-alert medication handling reduces preventable harm'
    ],
    contentBlocks: [
      ...(byId.sec3_2_therapeutic_window_ti?.contentBlocks || []),
      ...(byId.sec3_3_types_of_toxicity?.contentBlocks || []),
      ...(byId.sec3_5_high_alert_meds_antidotes?.contentBlocks || []),
      ...(byId.sec3_6_management_and_reporting?.contentBlocks || [])
    ],
    flashcardLinks: [],
    interactiveElements: [],
    content: normalizeNewlinesToParagraphs(`Toxicity and Overdose\n\nIn clinical practice, toxicity refers to harmful effects from drug exposure that exceeds what the patient can tolerate. Overdose is one cause of toxicity, but it is not the only cause. Toxicity can occur at standard doses when clearance decreases, when interacting medications raise exposure, when formulations are used incorrectly, or when patient sensitivity changes. This makes toxicity a bedside pattern-recognition problem driven by timing, trends, and patient vulnerability.\n\nToxicity often follows predictable pathways. Dose-related toxicity frequently reflects exposure problems (dose, interval, route, accumulation, or drug levels). Non–dose-related toxicity often reflects hypersensitivity or idiosyncratic reactions that can become severe quickly. The nursing priority is to identify the threatened system (airway/breathing, circulation, neurologic status, bleeding) and respond with stabilizing actions and early escalation.\n\nTherapeutic window and accumulation\n\n${oldTherWindow}\n\nPatterns of medication harm\n\n${oldPatterns}\n\nHigh-alert medications, reversals, and post-reversal monitoring\n\n${oldHighAlert}\n\nManagement and reporting\n\n${oldManagement}`)
  };

  const sec34 = {
    sectionNumber: '3.4',
    id: 'ch3_4_glucose',
    title: 'Section 3.4: Alterations in Glucose Metabolism',
    duration: 25,
    learningObjectives: [
      'Recognize medication-related hyperglycemia and hypoglycemia patterns',
      'Identify early clinical signs that require bedside glucose verification',
      'Coordinate medication timing with nutrition and patient status changes'
    ],
    keyTakeaways: [
      'Acute mental status changes require a rapid bedside glucose check',
      'Glucose risk increases with mismatched medication and intake, renal decline, and acute illness',
      'Treat hypoglycemia promptly and monitor for recurrence'
    ],
    contentBlocks: [],
    flashcardLinks: [],
    interactiveElements: [],
    content: normalizeNewlinesToParagraphs(`Alterations in Glucose Metabolism\n\nMedications can raise or lower blood glucose by changing insulin sensitivity, hepatic glucose production, insulin secretion, appetite, or energy utilization. These effects matter because dysglycemia can cause rapid neurologic deterioration and is frequently reversible when recognized early. In bedside practice, hypoglycemia is a high-yield safety concern because it can mimic sedation or “toxicity” while requiring a different immediate intervention.\n\nHypoglycemia commonly presents with diaphoresis, tremor, palpitations, hunger, confusion, irritability, and, in severe cases, seizures or loss of consciousness. Hyperglycemia may present with thirst, polyuria, blurred vision, fatigue, and in severe cases dehydration and altered mental status. Clinical presentation is influenced by time course, recent meals, and recent medication changes.\n\nNursing implications include coordinating glucose-lowering therapies with nutrition, verifying that the patient is eating as expected, and reassessing after dose changes or interruptions (NPO status, vomiting, delayed meal trays, stopped tube feeds). When symptoms suggest dysglycemia, a bedside glucose check is an immediate safety action. Treatment follows institutional protocols, but monitoring for recurrence is essential because corrective therapy can outlast nutrition or because long-acting insulin and other therapies can re-produce hypoglycemia.\n\nClinical Safety Alert\n\nAny acute confusion, diaphoresis, tremor, or sudden behavior change in a patient receiving insulin or hypoglycemics requires an immediate bedside glucose check. Do not delay evaluation by attributing symptoms to “medication reaction” without verifying glucose.`)
  };

  const sec35 = {
    sectionNumber: '3.5',
    id: 'ch3_5_electrolytes',
    title: 'Section 3.5: Electrolyte Imbalances',
    duration: 25,
    learningObjectives: [
      'Identify common medication-related electrolyte disturbances (K, Mg, Na, Ca)',
      'Recognize clinical signs and ECG patterns that suggest electrolyte-driven instability',
      'Implement monitoring, replacement, and escalation steps safely per protocol'
    ],
    keyTakeaways: [
      'Electrolyte abnormalities can precipitate dysrhythmias, weakness, and seizures',
      'Risk increases with renal dysfunction, diuretics, GI losses, and interacting medications',
      'Trend labs and respond promptly to symptomatic or critical abnormalities'
    ],
    contentBlocks: [],
    flashcardLinks: [],
    interactiveElements: [],
    content: normalizeNewlinesToParagraphs(`Electrolyte Imbalances\n\nMedications can disrupt electrolyte balance through renal losses or retention, shifts between intracellular and extracellular compartments, endocrine effects, or secondary effects such as vomiting and diarrhea. Electrolyte disturbances are clinically important because they can cause dysrhythmias, neuromuscular weakness, altered mental status, and seizures. Because symptoms may be nonspecific, trend-based monitoring is often required to detect risk early.\n\nPotassium and magnesium abnormalities are especially relevant to cardiac safety. Hypokalemia and hypomagnesemia increase arrhythmia risk and can amplify the risk from QT-prolonging medications. Hyperkalemia can cause bradyarrhythmias, conduction delay, and life-threatening rhythm changes. Sodium abnormalities may present with confusion, headache, seizures, and volume status changes.\n\nNursing implications include identifying high-risk contexts (renal impairment, diuretic therapy, poor intake, GI losses, critical illness), trending electrolytes on schedule, and escalating promptly for symptomatic patients or critical values. Replacement and correction must be administered using safe route, dilution, and infusion-rate practices per protocol. When electrolyte-driven rhythm instability is suspected, ECG monitoring and rapid provider notification are indicated.\n\nClinical Safety Alert\n\nWhen a patient is receiving QT-prolonging medications, low potassium or magnesium should be treated as a risk amplifier. If palpitations, syncope, or telemetry changes occur, escalate promptly and obtain ECG/electrolytes per protocol.`)
  };

  const sec36 = {
    sectionNumber: '3.6',
    id: 'ch3_6_neuro_sensory',
    title: 'Section 3.6: Neurologic and Sensory Toxicity',
    duration: 25,
    learningObjectives: [
      'Recognize neurologic and sensory warning signs of medication toxicity',
      'Differentiate expected sedation from unsafe CNS depression',
      'Implement safety precautions (falls, aspiration) and escalation triggers'
    ],
    keyTakeaways: [
      'New confusion, ataxia, severe sedation, visual changes, tinnitus, and seizures can signal toxicity',
      'Additive CNS depressants and reduced clearance are common drivers',
      'Safety precautions and reassessment prevent progression'
    ],
    contentBlocks: [],
    flashcardLinks: [],
    interactiveElements: [],
    content: normalizeNewlinesToParagraphs(`Neurologic and Sensory Toxicity\n\nNeurologic and sensory toxicity includes medication-related effects on cognition, level of consciousness, coordination, peripheral nerves, vision, hearing, and balance. These effects matter because they increase fall risk, impair the ability to protect the airway, and may represent early accumulation of medications that can progress to respiratory depression, seizures, or malignant dysrhythmias.\n\nMechanisms include excessive central nervous system depression, excitatory neurotoxicity, altered neurotransmitter signaling, peripheral nerve injury, or increased exposure due to decreased clearance or interactions. Clinically, neurotoxicity may present with new confusion, delirium, agitation, tremor, ataxia, difficulty walking, new seizures, or profound sedation. Sensory symptoms may include blurred vision, color changes, tinnitus, hearing changes, or vertigo. Timing relative to medication starts, titration, and PRN stacking is a key diagnostic clue.\n\nNursing implications emphasize safety and trend recognition. Compare cognition and mobility to baseline, increase monitoring frequency after CNS-active medication changes, and implement fall and aspiration precautions when risk is elevated. When the neurologic change is severe, progressive, or paired with respiratory depression, hypotension, or arrhythmia risk, escalate immediately and prevent additional exposure by holding further sedatives or interacting PRNs per protocol.\n\nFocused bedside recognition and escalation\n\n${oldAssessment}`)
  };

  const sec37 = {
    sectionNumber: '3.7',
    id: 'ch3_7_teratogenicity',
    title: 'Section 3.7: Teratogenicity',
    duration: 20,
    learningObjectives: [
      'Define teratogenicity and explain why timing of exposure matters in pregnancy',
      'Apply nursing screening and counseling practices that reduce preventable fetal risk',
      'Identify patient education priorities regarding OTC and supplement use'
    ],
    keyTakeaways: [
      'Pregnancy introduces a second patient; medication decisions must weigh maternal benefit and fetal risk',
      'Risk varies by gestational timing, dose, and duration',
      'Medication reconciliation should include OTC and supplements'
    ],
    contentBlocks: [],
    flashcardLinks: [],
    interactiveElements: [],
    content: normalizeNewlinesToParagraphs(`Teratogenicity\n\nTeratogenicity is the capacity of a medication or exposure to disrupt fetal development, increasing the risk of congenital anomalies, pregnancy loss, or developmental impairment. This concept matters because medication safety during pregnancy requires balancing maternal benefit against fetal risk, and because risk is strongly influenced by exposure timing during development.\n\nMechanisms include interference with cell division and organ development, altered placental blood flow, or disruption of critical signaling pathways. Clinical risk assessment often depends on careful history and documentation because teratogenic harm is not usually apparent at the bedside in the moment of exposure. This makes nursing screening, medication reconciliation, and patient education central to prevention.\n\nNursing implications include verifying pregnancy and lactation status when appropriate, ensuring the prescriber and pharmacist are aware of pregnancy context, and educating patients to avoid unreviewed OTC medications and supplements. When exposure is suspected, timely escalation for risk assessment and follow-up planning is essential.\n\nSpecial populations context (pregnancy and lactation)\n\n${oldSpecialPops}`)
  };

  json.chapter.sections = [sec31, sec32, sec33, sec34, sec35, sec36, sec37];

  // Recompute word counts
  let total = 0;
  for (const s of json.chapter.sections) total += recomputeSectionWordCount(s);

  fs.writeFileSync(FILE, JSON.stringify(json, null, 2) + '\n');
  console.log('Restructured Chapter 3 to 7 sections. Total words:', total);
}

main();
