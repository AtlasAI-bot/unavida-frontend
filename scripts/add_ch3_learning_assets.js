#!/usr/bin/env node

/**
 * Add missing chapter learning assets to Chapter 3:
 * - Key Terms (glossary-style list)
 * - Review Questions
 * - Clinical Application / Clinical Story
 * Appends to the end of section 3.7.
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'data', 'CHAPTER_3_UNAVIDA_PRODUCTION.json');

function stripTags(s) { return String(s||'').replace(/<[^>]+>/g,' '); }
function wc(html){ const t=stripTags(html).replace(/\s+/g,' ').trim(); return t? t.split(' ').length:0; }

function esc(s){
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

function ul(items){
  return `<ul>\n${items.map(i=>`  <li>${i}</li>`).join('\n')}\n</ul>`;
}

function ol(items){
  return `<ol>\n${items.map(i=>`  <li>${i}</li>`).join('\n')}\n</ol>`;
}

function main(){
  const json = JSON.parse(fs.readFileSync(FILE,'utf8'));
  const sec = (json.chapter.sections||[]).find(s=>s.sectionNumber==='3.7');
  if(!sec) throw new Error('Section 3.7 not found');

  // Remove previous block if re-run
  sec.content = String(sec.content||'').replace(/<h4>\s*Key Terms\s*<\/h4>[\s\S]*$/i,'').trim();

  const keyTerms = [
    '<strong>Adverse effect:</strong> Unintended, harmful or undesirable response to a medication at therapeutic doses.',
    '<strong>Expected side effect:</strong> Predictable, often dose-related effect that occurs in addition to the therapeutic effect.',
    '<strong>Adverse drug reaction (ADR):</strong> Harmful, unintended response at normal doses that typically requires intervention or therapy change.',
    '<strong>Drug allergy:</strong> Immune-mediated reaction to a medication that can recur and may become more severe with re-exposure.',
    '<strong>Anaphylaxis:</strong> Rapid, life-threatening systemic hypersensitivity reaction involving airway, breathing, and/or circulation compromise.',
    '<strong>Idiosyncratic reaction:</strong> Unusual, unpredictable response not explained by pharmacologic action or classic allergy mechanisms.',
    '<strong>Black box warning:</strong> Strongest FDA warning describing serious or life-threatening drug risks.',
    '<strong>Organ toxicity:</strong> Medication-related injury to a specific organ system (e.g., liver, kidney, heart, marrow).',
    '<strong>Hepatotoxicity:</strong> Liver injury related to medication exposure; may be reflected by AST/ALT or bilirubin changes.',
    '<strong>Nephrotoxicity:</strong> Kidney injury related to medication exposure; may present with rising creatinine or decreased urine output.',
    '<strong>Myelosuppression:</strong> Bone marrow suppression causing decreased RBCs/WBCs/platelets and increased infection/bleeding risk.',
    '<strong>Toxicity:</strong> Harm from drug exposure that exceeds what the patient can tolerate (overdose or accumulation).',
    '<strong>Overdose:</strong> Exposure to a quantity of drug that can cause significant harm; may be intentional or accidental.',
    '<strong>Therapeutic window:</strong> Concentration range in which a drug is effective without unacceptable toxicity.',
    '<strong>Therapeutic index (TI):</strong> Ratio comparing toxic dose to effective dose; lower TI indicates higher risk.',
    '<strong>Half-life:</strong> Time for serum drug concentration to decrease by half; influences dosing interval and accumulation risk.',
    '<strong>Accumulation:</strong> Rising drug concentration over time when administration exceeds elimination.',
    '<strong>Drug–drug interaction:</strong> Change in effect of a medication caused by another medication.',
    '<strong>Drug–food interaction:</strong> Change in drug absorption or effect related to food or beverages.',
    '<strong>Dysglycemia:</strong> Abnormal glucose regulation (hyperglycemia or hypoglycemia) related to disease or medication effects.',
    '<strong>Hypoglycemia:</strong> Low blood glucose causing autonomic and neuroglycopenic symptoms; can be life-threatening.',
    '<strong>Hyperglycemia:</strong> High blood glucose; severe cases may cause dehydration and metabolic crisis.',
    '<strong>Electrolyte imbalance:</strong> Abnormal sodium/potassium/magnesium/calcium levels that can affect neurologic and cardiac function.',
    '<strong>QT prolongation:</strong> ECG change that increases risk for torsades de pointes, especially with low K/Mg.',
    '<strong>Ototoxicity:</strong> Medication-related injury to hearing/balance structures, often presenting with tinnitus or vertigo.',
    '<strong>Peripheral neuropathy:</strong> Medication-related nerve injury causing numbness, tingling, burning pain, or weakness.',
    '<strong>Teratogenicity:</strong> Potential of a drug/exposure to disrupt fetal development and cause congenital anomalies or developmental harm.'
  ];

  const reviewQuestions = [
    'Differentiate an expected side effect from an adverse drug reaction (ADR). Provide one clinical example of each.',
    'List three red-flag findings that suggest a medication reaction should be treated as an emergency.',
    'Explain why drug allergies can become more severe with repeat exposure.',
    'Define therapeutic window and explain why narrow-therapeutic-window drugs require closer monitoring.',
    'Describe two patient factors that increase risk for drug accumulation and toxicity.',
    'A patient becomes suddenly confused and diaphoretic after receiving insulin. What is the immediate nursing action and why?',
    'Describe how hypokalemia and hypomagnesemia can increase dysrhythmia risk in a patient receiving QT-prolonging medications.',
    'Explain why renal impairment increases the risk of toxicity for some medications even at standard doses.',
    'Identify two common early symptoms of ototoxicity and the nursing response when they are reported.',
    'Describe how medication reconciliation reduces duplicate therapy and prevents toxicity.',
    'What elements should be included when documenting a suspected medication-related adverse event?',
    'Explain why steroid therapy can cause hyperglycemia in patients with and without diabetes.',
    'Describe nursing priorities after administration of a reversal agent when the reversal duration may be shorter than the drug exposure.',
    'Define teratogenicity and explain why timing of exposure in pregnancy affects fetal risk.',
    'Explain why “normal dose” does not guarantee safety in older adults.'
  ];

  const clinicalStory = [
    '<h4>Clinical Application (Case Story): When “Side Effect” Is Actually Toxicity</h4>',
    `<p>A 72-year-old patient is admitted for pneumonia and receives an opioid for pain and a benzodiazepine for sleep. Over the next 12 hours, the patient becomes progressively more somnolent and is noted to have a slower respiratory rate. A nurse initially hears the report that the patient is “just sleepy” after medication.</p>`,
    `<p>During assessment, the nurse notes that the patient is difficult to arouse, has shallow respirations, and needs increased oxygen. The nurse links the timeline to stacked sedating medications and recognizes that the patient’s age and acute illness increase sensitivity to CNS depressants. The nurse activates the appropriate escalation pathway, holds additional sedating PRNs, and obtains objective data (vital signs and focused respiratory assessment) while preparing for protocol-based interventions.</p>`,
    '<h4>Clinical Reasoning Prompts</h4>',
    `<p>1) What objective findings indicate this situation is no longer an expected side effect? 2) Which patient factors increase risk for progression? 3) What immediate safety actions reduce harm while the provider evaluates next steps?</p>`,
    '<h4>Key Nursing Takeaway</h4>',
    `<p>The safest practice is to triage by severity first. When sedation progresses to impaired arousal or respiratory depression—especially with multiple CNS depressants—treat it as a potentially dangerous toxicity pattern, not a tolerable side effect.</p>`
  ].join('\n');

  const block = [
    '<h4>Key Terms</h4>',
    '<p>This glossary highlights essential vocabulary used throughout Chapter 3. These terms appear in medication safety policies, clinical handoffs, and patient teaching, and they directly influence nursing decisions at the bedside.</p>',
    ul(keyTerms),

    '<h4>Review Questions</h4>',
    '<p>Use these questions to check comprehension and guide group discussion. Focus on clinical decision-making: how to recognize dangerous patterns early and what to do first.</p>',
    ol(reviewQuestions.map(q=>esc(q))),

    clinicalStory
  ].join('\n\n');

  sec.content = (sec.content + '\n\n' + block).trim();
  sec.wordCount = wc(sec.content);

  // Update metadata wordcount
  json.chapter.metadata.wordCount = (json.chapter.sections||[]).reduce((n,s)=>n+(s.wordCount||0),0);
  json.chapter.metadata.lastUpdated = new Date().toISOString().slice(0,10);

  fs.writeFileSync(FILE, JSON.stringify(json,null,2) + '\n');
  console.log('Added key terms, review questions, and clinical application to Chapter 3.');
}

main();
