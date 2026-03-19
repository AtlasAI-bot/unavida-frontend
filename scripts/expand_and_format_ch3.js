#!/usr/bin/env node

/**
 * Expand Chapter 3 from current imported DOCX (~10k words) to target range 20k–30k,
 * while keeping a textbook cadence and fixing common formatting issues.
 *
 * - Appends original subsections (plain clinical headings) to each of the 7 sections.
 * - Ensures each added subsection has >=2 paragraphs.
 * - Converts "Figure X ... (placeholder)" paragraphs into subtle italic placeholders.
 * - Recomputes word counts.
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'data', 'CHAPTER_3_UNAVIDA_PRODUCTION.json');

function stripTags(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ');
}

function wc(html) {
  const t = stripTags(html).replace(/\s+/g, ' ').trim();
  return t ? t.split(' ').length : 0;
}

function fixFigurePlaceholders(html) {
  // Convert simple figure placeholder paragraphs into subtle italic text.
  return String(html || '').replace(
    /<p>\s*(Figure\s+\d+[-–]\d+\.|Figure\s+\d+\.|Figure\s+\d+[-–]\d+)([^<]*?)\(placeholder\)\s*<\/p>/gi,
    (_m, a, b) => `<p class="reader-subtle"><em>${a}${b}(illustration placeholder)</em></p>`
  );
}

function append(html, addition) {
  const base = String(html || '').trim();
  const add = String(addition || '').trim();
  if (!add) return base;
  return (base ? base + '\n\n' : '') + add;
}

function h4(title) {
  return `<h4>${title}</h4>`;
}

function paras(...ps) {
  return ps.map(p => `<p>${p}</p>`).join('\n');
}

function list(items) {
  return `<ul>\n${items.map(i => `  <li>${i}</li>`).join('\n')}\n</ul>`;
}

function expandSection(sectionNumber, currentHtml) {
  // Add depth with subsections, staying general + a few examples.
  const add = [];

  if (sectionNumber === '3.1') {
    add.push(
      h4('Clinical Differentiation: Side Effect, Adverse Drug Reaction, Intolerance, and Allergy'),
      paras(
        'A practical way to classify an unwanted medication effect is to ask whether it is predictable from the drug’s mechanism. Predictable effects are usually dose-related and may be managed by dose adjustment, timing changes, food strategies, or supportive care. In contrast, adverse drug reactions (ADRs) may be unpredictable and may require discontinuation, substitution, or urgent treatment. Intolerance refers to non–immune-mediated inability to tolerate a drug at usual doses, while drug allergy involves an immune response that can recur and escalate with re-exposure.',
        'At the bedside, the distinction matters because it changes the urgency of escalation and the “future safety label” placed in the chart. For example, nausea with an oral antibiotic is often an intolerance or expected side effect that may be managed, whereas urticaria with facial swelling suggests an allergic pattern requiring immediate safety actions and clear documentation to prevent re-exposure.'
      ),
      h4('Severity Triage and Escalation Thresholds'),
      paras(
        'Nursing triage starts with physiologic stability. Any sign of airway compromise (wheeze, stridor, swelling of lips/tongue), hemodynamic instability (hypotension, syncope), rapidly progressive rash, active bleeding, new seizure activity, or severe altered mental status should be treated as an emergency and escalated immediately. When the patient is stable, nurses can then evaluate whether the symptom pattern is likely medication-related and whether it is mild, moderate, or severe.',
        'A useful framework is to ask whether the symptom is (1) uncomfortable but stable, (2) function-limiting or progressive, or (3) life-threatening. This approach prevents underreaction to dangerous patterns and overreaction to predictable effects that can be managed safely. Clear, objective symptom description—rather than vague labels—helps the team choose the safest next step.'
      ),
      h4('Documentation That Prevents Repeat Harm'),
      paras(
        'Medication reaction documentation should read like a brief clinical narrative: what was given, when it was given, what happened, how quickly it happened, what the severity was, and what treatment was required. Specificity is protective. “Rash” is less useful than “diffuse urticaria within 30 minutes of first dose, pruritus, no respiratory symptoms, treated with antihistamine.”',
        'When updating the allergy list, accuracy matters. Mislabeling a predictable side effect as an “allergy” can remove effective first-line therapies and increase downstream risk. Conversely, failing to document a true allergy pattern can lead to re-exposure. Nurses should verify patient-reported allergies when possible, document the reaction history, and communicate patterns that suggest immune-mediated hypersensitivity.'
      ),
      h4('Key Nursing Actions (Adverse Effects)'),
      list([
        'Triage by severity first: stabilize airway, breathing, and circulation before classification.',
        'Link timing: new symptoms shortly after a start, dose increase, or added medication raise suspicion for medication effects.',
        'Document with objective details (onset, symptoms, severity, treatment) rather than broad labels.',
        'Educate patients on expected effects versus urgent warning signs requiring immediate evaluation.',
        'Communicate reaction patterns to prescribers/pharmacy to support safer substitutions.'
      ])
    );
  }

  if (sectionNumber === '3.2') {
    add.push(
      h4('Hepatotoxicity: Recognition and Monitoring'),
      paras(
        'The liver is central to drug metabolism and is therefore vulnerable to injury from both predictable toxic metabolites and immune-mediated reactions. Drug-induced liver injury may present with nonspecific symptoms such as fatigue, nausea, poor appetite, or right upper quadrant discomfort before laboratory abnormalities are recognized. Jaundice, dark urine, and pruritus are later signs that should prompt immediate escalation.',
        'Nursing monitoring emphasizes baseline risk assessment and trend evaluation of liver-related labs when ordered (e.g., AST/ALT, alkaline phosphatase, bilirubin). Patients receiving long-term therapy with potentially hepatotoxic agents should be educated to report early symptoms and to avoid unnecessary co-exposures such as excess alcohol or duplicate acetaminophen-containing products.'
      ),
      h4('Nephrotoxicity: Kidney Clearance and Dose Adjustment'),
      paras(
        'Many medications and metabolites rely on renal clearance. When kidney function declines, serum concentrations may rise even at standard doses, converting a safe regimen into a toxic one. Nephrotoxicity may develop from direct tubular injury, altered renal blood flow, or crystal deposition, and may present as rising creatinine, decreased urine output, or electrolyte abnormalities.',
        'Nursing responsibilities include trending intake/output, daily weights when indicated, and monitoring for early signs of fluid overload or dehydration that worsen renal risk. Nurses also help prevent nephrotoxicity by ensuring hydration strategies are followed when ordered, verifying that dose adjustments are considered for reduced kidney function, and reporting early changes in renal markers.'
      ),
      h4('Myelosuppression and Bleeding/Infection Risk'),
      paras(
        'Drug-related bone marrow suppression can reduce red blood cells, white blood cells, and platelets, increasing fatigue, infection risk, and bleeding risk. While chemotherapy is a classic cause, non-oncology drugs can also affect marrow function in susceptible patients. The clinical risk is that early changes are often lab-based, while symptoms may appear later.',
        'Nursing surveillance focuses on CBC trends, fever screening, bleeding precautions when platelets are low, and early reporting of mucosal bleeding, petechiae, or unexplained bruising. Education includes reinforcing when patients should seek evaluation (fever, sore throat with neutropenia risk, black/tarry stools, or persistent bleeding).' 
      ),
      h4('Key Nursing Actions (Organ Injury)'),
      list([
        'Trend labs over time; early injury often shows as gradual changes before severe symptoms develop.',
        'Monitor organ-specific warning signs (jaundice, oliguria, dyspnea, unusual bruising/bleeding).',
        'Identify risk amplifiers: dehydration, polypharmacy, high cumulative dosing, and reduced clearance.',
        'Escalate promptly for critical values or progressive symptoms linked to medication timing.',
        'Reinforce patient education on early symptoms of organ injury and safe OTC use.'
      ])
    );
  }

  if (sectionNumber === '3.3') {
    add.push(
      h4('A Nursing Workflow for Suspected Toxicity'),
      paras(
        'When toxicity is suspected, nurses use a consistent safety workflow: (1) assess and stabilize airway, breathing, and circulation; (2) stop or hold further exposure when indicated by protocol; (3) obtain focused data (vital signs, ECG when indicated, point-of-care glucose, targeted labs, and medication timing history); and (4) escalate promptly with objective findings. This workflow reduces delays caused by diagnostic uncertainty.',
        'The medication history should include recent starts, dose changes, PRN stacking, and over-the-counter products. When the clinical picture changes rapidly, it is safer to assume medication contribution until ruled out, particularly for high-alert drugs and patients with reduced renal or hepatic clearance.'
      ),
      h4('Therapeutic Drug Monitoring: When Levels Matter'),
      paras(
        'Therapeutic drug monitoring is most valuable when a medication has a narrow therapeutic window, variable clearance, and concentration-related toxicity. In those cases, serum concentrations provide objective data to guide dosing and identify accumulation. Nurses support safe monitoring by drawing levels at the correct time relative to dosing (e.g., trough timing when ordered) and ensuring the clinical team is informed of critical results.',
        'Even when formal drug levels are not used, laboratory surrogates and physiologic monitoring can function similarly. For example, ECG changes, INR trends, creatinine changes, and mental status trends can indicate rising risk and support early dose adjustment before severe toxicity occurs.'
      ),
      h4('Antidotes and Reversal: Monitoring After the “Fix”'),
      paras(
        'Antidotes and reversal agents can rapidly improve symptoms, but they do not always outlast the offending medication. After reversal, nursing monitoring is critical because re-sedation or recurrence can occur when the antidote duration is shorter than the drug exposure. Continuous reassessment of respiratory status, hemodynamics, neurologic function, and laboratory trends helps prevent rebound deterioration.',
        'Post-toxicity care includes clear documentation of suspected cause, timing, interventions, and response. This record supports safer future prescribing and reduces the chance of repeating the same error pattern.'
      ),
      h4('Key Nursing Actions (Toxicity/Overdose)'),
      list([
        'Use a consistent safety workflow: stabilize first, then investigate.',
        'Clarify timing: last dose time, PRN frequency, and recent dose changes.',
        'Obtain focused data quickly (glucose, vitals, ECG when indicated, targeted labs).',
        'Prepare for rebound risk after reversal; monitor beyond initial improvement.',
        'Document suspected cause and response clearly to prevent repeat harm.'
      ])
    );
  }

  if (sectionNumber === '3.4') {
    add.push(
      h4('Steroid-Associated Hyperglycemia'),
      paras(
        'Corticosteroids are a common cause of drug-induced hyperglycemia because they increase hepatic glucose production and reduce insulin sensitivity. Hyperglycemia can occur in patients with diabetes and in patients without known diabetes, particularly during acute illness. The clinical concern is not just elevated numbers, but dehydration, infection risk, and metabolic decompensation in vulnerable patients.',
        'Nursing monitoring includes scheduled bedside glucose checks when steroids are initiated or escalated, assessment for classic symptoms (polydipsia, polyuria, blurred vision), and coordination of glucose-lowering strategies as ordered. Nurses should also recognize that steroid dosing time can influence glucose patterns across the day.'
      ),
      h4('Hypoglycemia Prevention in Patients Receiving Insulin or Secretagogues'),
      paras(
        'Drug-induced hypoglycemia is often preventable when medication timing is coordinated with nutrition and the patient’s clinical status. Missed meals, delayed trays, vomiting, reduced oral intake, or interruption of tube feeds can transform a usual insulin regimen into an unsafe one. Renal impairment can prolong the effect of some glucose-lowering medications and increase recurrence risk.',
        'Nursing prevention includes verifying intake, using hold parameters as ordered, reassessing after treatment of hypoglycemia, and documenting patterns to support safe regimen adjustment. Education should include recognition of early symptoms and the importance of consistent carbohydrate intake when appropriate.'
      ),
      h4('Key Nursing Actions (Glucose Metabolism)'),
      list([
        'Treat acute confusion, diaphoresis, tremor, or weakness as a prompt to check bedside glucose.',
        'Coordinate insulin and meals; verify the patient is eating before giving rapid-acting insulin when applicable.',
        'Increase monitoring when steroids are started or doses increased.',
        'Follow hypoglycemia protocols and reassess for recurrence.',
        'Communicate patterns (time of day, steroid timing, intake changes) to support safe dose adjustments.'
      ])
    );
  }

  if (sectionNumber === '3.5') {
    add.push(
      h4('Potassium and Magnesium: Rhythm Risk and QT Prolongation'),
      paras(
        'Potassium and magnesium disturbances are strongly associated with cardiac rhythm instability. Hypokalemia and hypomagnesemia can amplify the risk of torsades de pointes in patients receiving QT-prolonging medications, while hyperkalemia can cause conduction slowing and life-threatening bradyarrhythmias. Because symptoms may be mild or nonspecific, ECG/telemetry and lab trends often provide the earliest warning.',
        'Nursing care focuses on recognizing risk combinations: QT-prolonging medications plus low potassium/magnesium, renal failure plus potassium-retaining drugs, or significant GI losses. Replacement should be administered using safe dilution and rate practices, with reassessment of symptoms and laboratory values as directed.'
      ),
      h4('Sodium and Water Balance: Neurologic Presentation'),
      paras(
        'Sodium abnormalities often present with neurologic symptoms because rapid shifts cause water movement in brain tissue. Mild hyponatremia may present with headache or confusion, while severe or rapid changes can lead to seizures. Hypernatremia often reflects water deficit and may present with thirst, agitation, and signs of dehydration.',
        'Nursing priorities include careful monitoring of neurologic status, fluid balance, and laboratory trends. Because correction strategies differ, nurses should avoid “one-size-fits-all” interventions and follow ordered protocols for fluid restriction, replacement, or medication adjustment.'
      ),
      h4('Key Nursing Actions (Electrolytes)'),
      list([
        'Trend electrolytes and correlate with symptoms and telemetry/ECG changes.',
        'Treat low K/Mg as rhythm risk amplifiers in patients on QT-prolonging therapies.',
        'Monitor intake/output and daily weights when fluid balance is a concern.',
        'Administer replacements safely (route, dilution, rate) and recheck as ordered.',
        'Escalate for critical values or neurologic/cardiac symptoms.'
      ])
    );
  }

  if (sectionNumber === '3.6') {
    add.push(
      h4('CNS Depression: Falls, Aspiration, and Respiratory Risk'),
      paras(
        'Central nervous system depression is one of the most common and most dangerous medication toxicity patterns. Even when sedation is an expected effect, the clinical risk increases when sedation becomes progressive, when multiple sedating medications overlap, or when the patient has reduced clearance. Sedation can lead to falls, aspiration, and respiratory depression, especially when combined with alcohol or other depressants.',
        'Nursing monitoring includes respiratory rate and depth, oxygen saturation trends, level of arousal, and functional safety assessment (gait stability, ability to follow commands). When CNS depression is suspected, it is safer to reduce additional sedative exposure and escalate promptly rather than attempting to “wait it out.”'
      ),
      h4('Peripheral Neuropathy and Sensory Injury: Early Detection'),
      paras(
        'Medication-related peripheral neuropathy and sensory injury often develop gradually. Patients may report numbness, tingling, burning pain, balance problems, tinnitus, or visual changes. Because some forms of sensory injury can become irreversible, early detection and reporting are critical.',
        'Nursing practice supports early detection by asking targeted questions during therapy that carries risk, documenting onset and progression, and escalating for regimen review when symptoms appear. Safety counseling may include fall prevention, driving precautions, and symptom monitoring instructions.'
      ),
      h4('Key Nursing Actions (Neurologic/Sensory Toxicity)'),
      list([
        'Assess baseline cognition and mobility; compare after medication changes.',
        'Monitor respiratory status closely when CNS depressants are used, especially in combination.',
        'Implement fall and aspiration precautions when sedation or dizziness is present.',
        'Ask directly about tinnitus, visual changes, numbness/tingling, and balance changes during prolonged therapy.',
        'Escalate progressive neurologic or sensory symptoms early to prevent irreversible harm.'
      ])
    );
  }

  if (sectionNumber === '3.7') {
    add.push(
      h4('Pregnancy and Lactation Labeling: Practical Use at the Bedside'),
      paras(
        'Modern medication labeling emphasizes narrative risk summaries rather than single-letter categories. In practice, nurses support safe medication use by verifying pregnancy status when clinically appropriate, identifying drugs with known fetal risk, and ensuring that the patient receives clear counseling on risks, benefits, and safer alternatives when available.',
        'Because many patients use over-the-counter medications and supplements, medication reconciliation should include nonprescription products. For patients who may become pregnant, counseling on contraception requirements for known teratogens is a safety intervention that prevents irreversible outcomes.'
      ),
      h4('Timing Matters: Early Pregnancy vs Late Pregnancy Effects'),
      paras(
        'Exposure during early organ formation is associated with risk of structural malformations, while later pregnancy exposures may affect growth, neonatal adaptation, or withdrawal patterns. Some medications may not cause malformations yet still create clinically important neonatal effects such as respiratory depression, hypotonia, or withdrawal symptoms.',
        'Nursing monitoring and education should therefore reflect timing: early pregnancy emphasizes prevention of exposure to known teratogens and prompt reporting of exposures, while late pregnancy and peripartum care emphasizes newborn monitoring considerations and coordinated planning with obstetric and pediatric teams.'
      ),
      h4('Key Nursing Actions (Teratogenicity)'),
      list([
        'Include OTC products and supplements in medication reconciliation.',
        'Verify pregnancy status and counsel on fetal risk when high-risk drugs are used.',
        'Escalate suspected teratogenic exposure promptly for risk assessment and follow-up.',
        'Provide clear patient education on contraception requirements when applicable.',
        'Document exposures and counseling clearly to support continuity of care.'
      ])
    );
  }

  return append(currentHtml, add.join('\n\n'));
}

function main() {
  const json = JSON.parse(fs.readFileSync(FILE, 'utf8'));

  for (const sec of json.chapter.sections || []) {
    sec.content = fixFigurePlaceholders(sec.content);
    sec.content = expandSection(sec.sectionNumber, sec.content);
    sec.content = fixFigurePlaceholders(sec.content);
    sec.wordCount = wc(sec.content);
    sec.contentBlocks = sec.contentBlocks || [];
  }

  const total = (json.chapter.sections || []).reduce((n, s) => n + (s.wordCount || 0), 0);
  json.chapter.metadata = {
    ...json.chapter.metadata,
    wordCount: total,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };

  fs.writeFileSync(FILE, JSON.stringify(json, null, 2) + '\n');
  console.log('Expanded & formatted Chapter 3. Total words:', total);
}

main();
