#!/usr/bin/env node

/**
 * Add substantial depth to Chapter 3 so total word count lands in 20k–30k range.
 * This script is intentionally additive: it appends new subsections to each of the 7 sections.
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
function append(html, addition) {
  const base = String(html || '').trim();
  const add = String(addition || '').trim();
  if (!add) return base;
  return (base ? base + '\n\n' : '') + add;
}

const h4 = (t) => `<h4>${t}</h4>`;
const p = (t) => `<p>${t}</p>`;
const ul = (items) => `<ul>\n${items.map(i => `  <li>${i}</li>`).join('\n')}\n</ul>`;

function expand(secNo, html) {
  const out = [];

  if (secNo === '3.1') {
    out.push(
      h4('High-Risk Presentations That Mimic “Normal Side Effects”'),
      p('Many severe reactions begin with common symptoms. Early anaphylaxis can start as “itching” or “a weird throat feeling.” Early bleeding may appear as fatigue, lightheadedness, or mild gum bleeding. Early CNS toxicity may look like simple sleepiness. For this reason, nurses should interpret symptoms in context: timing relative to administration, co-administered medications, baseline risk factors, and whether the symptom is new or rapidly progressive.'),
      p('A bedside check that reduces missed harm is to ask, “Does this symptom fit the disease, or did it start after a medication change?” If the symptom started shortly after a new medication, a dose increase, or a new interacting drug, medication effect becomes more likely. This is especially true when the patient has reduced renal or hepatic clearance, is older, has low body weight, or is receiving multiple central nervous system depressants.'),
      p('For example, nausea after an antibiotic dose may be expected, but nausea plus hypotension, wheeze, or rapidly spreading hives is not. Drowsiness after an opioid may be expected, but drowsiness plus slowed respirations or inability to stay awake during conversation requires urgent action. Nurses protect patients by treating the dangerous pattern first and classifying the reaction second.'),

      h4('Patient Teaching That Improves Adherence Without Minimizing Risk'),
      p('Patients often stop medications because they were not prepared for expected side effects. Effective teaching names the most likely side effects, explains when they typically occur, and provides simple coping strategies (for example, taking with food when appropriate, hydration, or timing doses to minimize daytime sedation). At the same time, teaching must clearly separate expected effects from warning signs that require immediate evaluation.'),
      p('Teaching is most effective when it is brief, specific, and tied to the patient’s actual regimen. Instead of listing every possible adverse effect, nurses should emphasize the few that are common, the few that are dangerous, and what action to take. This approach reduces anxiety and prevents delayed care when serious reactions develop.'),

      h4('Communication and Handoff: Making Reaction Information Usable'),
      p('A reaction that is not communicated effectively becomes a repeat event. When handing off reaction information, nurses should provide: the medication name and dose, the route, the exact time given, the time symptoms began, what symptoms were present, the severity, interventions provided, and the patient’s response. This information allows prescribers and pharmacists to select safe alternatives and helps future nurses recognize early recurrence.'),
      p('When documenting allergies, it is safer to document the reaction description and timing rather than a vague label. “Morphine: nausea” is different from “morphine: facial swelling and wheeze within minutes.” The first suggests intolerance; the second suggests a potentially dangerous hypersensitivity pattern. Clear documentation prevents overly broad avoidance and prevents under-recognition of true immune-mediated reactions.'),

      h4('Key Nursing Actions (Adverse Effects—Expanded)'),
      ul([
        'Treat severity first: airway/breathing/circulation stabilization always comes before classification.',
        'Link symptom onset to medication timing, new starts, dose increases, or added interacting drugs.',
        'Use objective documentation: symptoms, timing, severity, treatment required, and response.',
        'Teach three buckets: expected effects, concerning effects that require a call, and emergency warning signs.',
        'Communicate reaction details in handoff so the next clinician can act safely.'
      ])
    );
  }

  if (secNo === '3.2') {
    out.push(
      h4('Cardiotoxicity and Hemodynamic Injury'),
      p('Some medications injure the heart by affecting the electrical conduction system, myocardial contractility, coronary perfusion, or fluid balance. Cardiotoxicity can present as dysrhythmias, worsening heart failure, chest discomfort, syncope, or blood pressure instability. The nursing risk is that early symptoms may be nonspecific, and deterioration can be rapid.'),
      p('Nurses support early detection by monitoring heart rate and rhythm, assessing for new palpitations or dizziness, and recognizing drug–electrolyte interactions that amplify risk. For example, QT-prolonging medications become more dangerous in the setting of hypokalemia or hypomagnesemia. Similarly, drugs with negative inotropic effects can destabilize patients with marginal cardiac reserve.'),
      p('When cardiotoxicity is suspected, objective data strengthens escalation: telemetry strips, ECG findings, vital sign trends, and symptom timing relative to dosing. Early communication can allow dose reduction, drug discontinuation, electrolyte correction, or transition to safer alternatives before a life-threatening rhythm occurs.'),

      h4('Pulmonary Toxicity and Respiratory Compromise'),
      p('Drug-induced pulmonary toxicity can include bronchospasm, interstitial inflammation, fibrosis, pulmonary edema, or suppressed respiratory drive. Clinical presentation may include cough, dyspnea, declining oxygen saturation, wheeze, or new crackles. Because symptoms can resemble infection, heart failure, or progression of chronic lung disease, medication history becomes essential for recognition.'),
      p('Nursing monitoring includes respiratory rate and work of breathing, oxygen saturation trends, lung auscultation, and response to supportive therapies. Early reporting of unexplained respiratory symptoms in patients receiving high-risk medications supports timely diagnostic evaluation and reduces risk of permanent injury.'),

      h4('Gastrointestinal Injury and Bleeding Risk'),
      p('Medications can injure the gastrointestinal tract through irritation, altered mucosal protection, or changes in coagulation. GI injury may present as abdominal pain, nausea, vomiting, occult or visible blood, or black/tarry stools. In patients receiving anticoagulants or antiplatelet agents, even small mucosal injuries can result in clinically significant bleeding.'),
      p('Nursing responsibilities include monitoring for bleeding signs, trending hemoglobin/hematocrit when indicated, assessing stool and emesis appearance when clinically appropriate, and teaching patients which symptoms require immediate evaluation. Early detection prevents progression to shock or severe anemia.'),

      h4('Organ Injury Prevention: A Practical Monitoring Plan'),
      p('Monitoring plans should match the organ system at risk and the patient’s vulnerability. A practical approach is to establish baseline status (labs, vitals, and symptoms), identify the expected monitoring interval, and define escalation thresholds. Trend-based monitoring is often more informative than a single abnormal value because it reveals direction and pace of change.'),
      p('Nurses can also reduce risk by identifying preventable amplifiers: dehydration, missed labs, duplicate therapies, and unreported OTC use. Patient education should emphasize avoiding duplicate acetaminophen-containing products, reporting reduced urine output, and reporting new shortness of breath, jaundice, or unusual bruising.'),

      h4('Key Nursing Actions (Organ Injury—Expanded)'),
      ul([
        'Match monitoring to the organ at risk (renal, hepatic, cardiac, pulmonary, marrow) and trend changes over time.',
        'Treat electrolyte abnormalities as organ-toxicity amplifiers (especially for cardiac risk).',
        'Escalate early for unexplained dyspnea, new dysrhythmias, oliguria, jaundice, or abnormal bleeding.',
        'Reconcile OTC products and supplements; duplicate exposures are a common hidden cause of injury.',
        'Document objective trends and timing relative to medication dosing to support safe clinical decisions.'
      ])
    );
  }

  if (secNo === '3.3') {
    out.push(
      h4('Common Overdose Patterns and What Nurses See First'),
      p('Overdose effects are driven by the drug’s primary physiologic targets. CNS depressants commonly present with somnolence progressing to respiratory depression, while stimulatory agents may present with agitation, tremor, tachycardia, hypertension, or seizures. Cardiovascular toxicity may present with bradycardia, hypotension, widened QRS complexes, or malignant dysrhythmias. Metabolic toxicity may present with hypoglycemia or hyperglycemia, acidosis, and altered mental status.'),
      p('Nurses often see the first warning signs: a change in arousal, a new oxygen requirement, unexpected hypotension, new confusion, or a rhythm change on telemetry. Early recognition is not about naming the toxin perfectly—it is about recognizing instability, preventing additional exposure, and escalating quickly so definitive interventions are not delayed.'),
      p('A practical bedside question is, “What system is failing?” If breathing is failing, respiratory support is the immediate priority. If circulation is failing, blood pressure support and rhythm evaluation become priority. If neurologic function is failing, seizure precautions and glucose evaluation may be priority. This approach keeps care safe while diagnostic clarification proceeds.'),

      h4('Medication Accumulation: The Quiet Overdose'),
      p('Accumulation is a common cause of toxicity in hospitalized patients and older adults. It occurs when dosing continues at a rate that exceeds elimination, often due to renal decline, hepatic dysfunction, dehydration, acute illness, or drug interactions that inhibit metabolism. Accumulation is clinically dangerous because it can be misinterpreted as “normal decline” or “fatigue” until severe toxicity occurs.'),
      p('Nurses can detect accumulation by trending subtle changes: increasing sedation, confusion, new tremor or ataxia, nausea, and worsening lab trends. When these changes align with ongoing dosing of a medication with narrow therapeutic margin, escalation should focus on objective findings and medication timing, prompting reassessment of dose and interval.'),

      h4('Post-Event Safety: Near Misses and System Fixes'),
      p('After a toxicity event, the clinical goal expands from acute management to prevention of recurrence. Near-miss and adverse-event reporting supports system improvements such as order set changes, clearer labeling, smart pump library updates, and standardized monitoring protocols. A “just culture” approach encourages reporting by focusing on system factors and risk reduction rather than blame.'),
      p('Nurses contribute by documenting clear timelines, identifying contributing factors such as interruptions, dose timing errors, or duplicate therapies, and participating in debriefs when available. The outcome is safer medication processes for future patients.'),

      h4('Key Nursing Actions (Toxicity/Overdose—Expanded)'),
      ul([
        'Recognize early instability patterns (sedation + RR decline; hypotension + bradycardia; agitation + tremor + tachycardia).',
        'Assume accumulation risk when renal/hepatic function changes, dehydration occurs, or interacting drugs are added.',
        'Hold further exposure per protocol, obtain focused labs/ECG, and escalate with objective data.',
        'Monitor for rebound after reversal; recurrence can occur when the antidote wears off first.',
        'Report and document to prevent recurrence and support system safety improvements.'
      ])
    );
  }

  if (secNo === '3.4') {
    out.push(
      h4('Clinical Presentation of Dysglycemia: Early vs Late Signs'),
      p('Hypoglycemia typically presents early with autonomic symptoms such as sweating, tremor, tachycardia, hunger, and anxiety, followed by neuroglycopenic symptoms such as confusion, behavior change, seizure, and loss of consciousness. Hyperglycemia often develops with thirst, polyuria, blurred vision, fatigue, and dehydration; severe hyperglycemia can progress to metabolic crisis with altered mental status.'),
      p('Because symptoms overlap with other conditions, nurses should treat unexpected changes in cognition, diaphoresis, weakness, or tachycardia as reasons to check a bedside glucose. Rapid identification prevents neurologic injury and reduces escalation to higher acuity care.'),

      h4('Medication Classes That Commonly Shift Glucose'),
      p('Glucose shifts are not limited to diabetes medications. Corticosteroids are common drivers of hyperglycemia. Some antipsychotics and immunosuppressants can increase insulin resistance. Beta blockers may mask adrenergic warning signs of hypoglycemia, delaying recognition. Fluoroquinolone antibiotics have been associated with dysglycemia in susceptible patients. These examples highlight why nurses should monitor glucose risk even when the primary diagnosis is not diabetes.'),
      p('For patients on insulin or sulfonylureas, the highest risk period is when intake is unpredictable or when renal function declines, extending drug effect. Coordination with nutrition, careful timing, and hold parameters reduce preventable hypoglycemia.'),

      h4('Operational Safety: Meals, NPO Status, and Tube Feeds'),
      p('The most common preventable hypoglycemia scenario is “insulin given, but the patient did not eat.” This can occur due to delayed trays, sudden NPO orders, nausea, procedures, or stopped tube feeds. Nursing prevention requires confirming intake and recognizing that the care plan can change rapidly across a shift.'),
      p('When nutrition is interrupted, nurses should reassess whether glucose-lowering therapy timing is safe, notify the team promptly, and monitor glucose more frequently until stability returns. Documentation of the interruption and the response supports safer future dosing decisions.'),

      h4('Key Nursing Actions (Glucose—Expanded)'),
      ul([
        'Use bedside glucose checks as a rapid assessment for sudden mental status or adrenergic symptoms.',
        'Increase monitoring when steroids are started, increased, or given at different times of day.',
        'Coordinate insulin timing with meals/tube feeds; reassess immediately when nutrition is interrupted.',
        'Recognize masking of hypoglycemia symptoms in patients on beta blockers.',
        'Escalate for recurrent hypoglycemia or severe hyperglycemia with dehydration/altered mental status.'
      ])
    );
  }

  if (secNo === '3.5') {
    out.push(
      h4('Electrolyte Shifts Across Systems: Neuromuscular and Gastrointestinal Effects'),
      p('Electrolyte abnormalities affect more than the heart. Low potassium and magnesium can produce weakness, cramps, paresthesias, and constipation, while high potassium can cause muscle weakness and paresthesias before rhythm changes occur. Calcium abnormalities can present with tetany, muscle cramps, or altered mental status. Sodium shifts can present with confusion, lethargy, or seizures.'),
      p('Because early symptoms can be vague, nurses should correlate patient complaints with lab trends and medication exposures (diuretics, laxatives, corticosteroids, ACE inhibitors, supplements). A pattern-based approach improves recognition: new weakness plus diuretic therapy suggests potassium risk; new confusion plus diuretic/SSRI exposure suggests sodium risk.'),

      h4('Electrolytes and Medication Effect: Why Small Changes Matter'),
      p('Many medications depend on normal electrolyte balance for safe physiologic effects. For example, medications that affect cardiac conduction become riskier when potassium or magnesium is low. Neuromuscular blockers and sedatives can have exaggerated effects in patients with significant electrolyte disturbances. These interactions explain why electrolyte correction is often part of toxicity prevention rather than a separate problem.'),
      p('Nurses support safe therapy by identifying risk combinations, ensuring that ordered electrolyte monitoring occurs on time, and escalating before symptoms progress to seizures or dysrhythmias.'),

      h4('Key Nursing Actions (Electrolytes—Expanded)'),
      ul([
        'Correlate symptoms with likely electrolyte patterns (weakness, cramps, confusion, irregular pulse).',
        'Identify medication drivers (diuretics, laxatives, corticosteroids, ACE inhibitors, supplements).',
        'Use telemetry/ECG context when potassium/magnesium are abnormal or QT-prolonging drugs are used.',
        'Administer replacement safely and monitor for response and recurrence.',
        'Escalate quickly for neurologic symptoms (seizure, severe confusion) or rhythm changes.'
      ])
    );
  }

  if (secNo === '3.6') {
    out.push(
      h4('Delirium, Sedation, and the Medication List'),
      p('Delirium is common in hospitalized patients and is frequently worsened by medications. Sedatives, opioids, anticholinergic medications, and polypharmacy can impair cognition, especially in older adults. The clinical risk is functional decline, falls, aspiration, and missed deterioration from underlying illness.'),
      p('When mental status changes, nursing assessment should include oxygenation, infection indicators, pain control, hydration, and medication timing. Medication contribution is more likely when delirium coincides with new starts, dose increases, or accumulation risk. Early escalation can lead to dose reduction, alternative therapy, or targeted monitoring.'),

      h4('Ototoxicity and Vestibular Toxicity: Protecting Hearing and Balance'),
      p('Ototoxicity can present with tinnitus, hearing loss, or balance disturbance. The vestibular system is especially sensitive to injury, and patients may describe vertigo, unsteady gait, or difficulty with balance. These symptoms increase fall risk and can be misinterpreted as generalized weakness.'),
      p('Nursing practice should include targeted questions in high-risk therapy, documentation of onset and progression, and safety planning (assistance with ambulation, fall precautions). Early reporting matters because some injuries may be partially reversible if exposure is reduced or stopped promptly.'),

      h4('Key Nursing Actions (Neuro/Sensory—Expanded)'),
      ul([
        'Treat new delirium as a multifactorial problem: check oxygenation, infection, pain, hydration, and medication timing.',
        'Increase fall precautions when dizziness, ataxia, or balance disturbance appears.',
        'Ask about tinnitus, hearing change, and visual change during prolonged or high-risk therapy.',
        'Recognize additive CNS depressant exposure and accumulation risk with renal/hepatic decline.',
        'Escalate early for progressive neurologic symptoms or any respiratory compromise.'
      ])
    );
  }

  if (secNo === '3.7') {
    out.push(
      h4('Unplanned Pregnancy and Medication Reconciliation'),
      p('Because many pregnancies are unplanned, exposure to potentially harmful medications can occur before pregnancy is recognized. For this reason, medication reconciliation for patients of childbearing potential should include a brief pregnancy risk screen when clinically appropriate and a review of medications with known fetal risk.'),
      p('Nurses also play a practical role in prevention by encouraging patients to disclose all medications, including acne treatments, supplements, and intermittent prescriptions. Clear counseling on when to notify the care team supports early intervention and reduces preventable fetal harm.'),

      h4('Lactation Considerations'),
      p('Medication safety considerations often continue into lactation. Some drugs enter breast milk in clinically meaningful amounts and can cause sedation, poor feeding, or other adverse effects in the infant. Risk depends on drug properties, dose, timing, and infant vulnerability.'),
      p('Nursing counseling should encourage patients to ask before starting over-the-counter products while breastfeeding. When medications are necessary, coordination with prescribers can support safer choices, timing strategies, and monitoring for infant effects.'),

      h4('Key Nursing Actions (Teratogenicity—Expanded)'),
      ul([
        'Include pregnancy possibility in assessment when high-risk medications are ordered.',
        'Reconcile OTC products and intermittent prescriptions; these are common hidden exposures.',
        'Provide direct counseling on when to notify the care team (positive pregnancy test, missed period, suspected exposure).',
        'In lactation, counsel on monitoring infants for sedation/feeding problems when maternal therapy is required.',
        'Document exposures and counseling to support follow-up and continuity of care.'
      ])
    );
  }

  return append(html, out.join('\n\n'));
}

function main() {
  const json = JSON.parse(fs.readFileSync(FILE, 'utf8'));

  for (const sec of json.chapter.sections || []) {
    sec.content = expand(sec.sectionNumber, sec.content);
    sec.wordCount = wc(sec.content);
  }

  const total = (json.chapter.sections || []).reduce((n, s) => n + (s.wordCount || 0), 0);
  json.chapter.metadata = { ...json.chapter.metadata, wordCount: total, lastUpdated: new Date().toISOString().slice(0,10) };

  fs.writeFileSync(FILE, JSON.stringify(json, null, 2) + '\n');
  console.log('Expanded Chapter 3. Total words:', total);
}

main();
