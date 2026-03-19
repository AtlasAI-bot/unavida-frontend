#!/usr/bin/env node

/** Push Chapter 3 over 20k words with one additional subsection per main section. */

const fs=require('fs');
const path=require('path');
const FILE=path.join(__dirname,'..','src','data','CHAPTER_3_UNAVIDA_PRODUCTION.json');

const h4=t=>`<h4>${t}</h4>`;
const p=t=>`<p>${t}</p>`;

function stripTags(h){return String(h||'').replace(/<[^>]+>/g,' ')}
function wc(h){const t=stripTags(h).replace(/\s+/g,' ').trim();return t?t.split(' ').length:0}
function append(a,b){a=String(a||'').trim();b=String(b||'').trim();return b?(a?a+'\n\n'+b:b):a}

function expand(no, html){
  const out=[];
  if(no==='3.1') out.push(
    h4('When to Hold a Medication vs When to Continue'),
    p('Holding a medication is appropriate when the patient is unstable, when symptoms suggest a severe reaction, or when continuing the dose would plausibly worsen harm. Examples include suspected anaphylaxis, severe hypotension linked to dosing, progressive neurologic depression, active bleeding, or rapidly worsening rash. In these situations, nursing escalation and protocol-based actions protect the patient while the prescriber evaluates next steps.'),
    p('Continuing a medication may be appropriate when effects are expected, mild, and stable, and when supportive strategies are effective. The nursing responsibility is to reassess regularly and to communicate changes early. The goal is not to eliminate all discomfort, but to prevent discomfort from becoming harm.')
  );
  if(no==='3.2') out.push(
    h4('Interprofessional Collaboration: Using Pharmacy as a Safety Partner'),
    p('Many organ-injury risks can be reduced through early pharmacist collaboration. Pharmacists can identify interaction risks, recommend renal/hepatic dose adjustments, suggest monitoring intervals, and propose alternative agents with lower toxicity profiles. Nurses support this collaboration by providing accurate clinical context: current labs, trends, symptoms, and medication timing.'),
    p('In practice, early pharmacy involvement is especially valuable for complex regimens, high-alert drugs, older adults, and patients with unstable kidney or liver function. Clear, early communication prevents last-minute crisis management.')
  );
  if(no==='3.3') out.push(
    h4('Home and Community Overdose Prevention Education'),
    p('Many overdoses occur outside the hospital through duplicate OTC products, misunderstanding dosing instructions, or substance exposure. Nurses can prevent harm by teaching patients to read labels, avoid taking multiple combination products containing the same active ingredient (such as acetaminophen), and store medications securely away from children.'),
    p('When a patient is prescribed medications with high overdose risk, education should include what symptoms require urgent evaluation and whom to contact. Clear, specific guidance reduces delayed care and prevents repeat events.')
  );
  if(no==='3.4') out.push(
    h4('Glucose Monitoring Frequency: Aligning Checks to Risk'),
    p('The safest glucose monitoring frequency depends on therapy intensity and patient stability. Patients receiving scheduled insulin, steroids, or medications with known dysglycemia risk may require more frequent checks, especially during acute illness. Patients with stable intake and stable regimens may require less frequent checks.'),
    p('Nursing judgment matters: if a patient’s intake changes, mental status changes, or infection develops, monitoring frequency should increase promptly and the care team should be notified. This prevents severe dysglycemia from developing between routine checks.')
  );
  if(no==='3.5') out.push(
    h4('Diet, Supplements, and Electrolyte Risk Outside the Hospital'),
    p('Electrolyte abnormalities can be worsened by diet and supplements. Patients may take potassium, magnesium, calcium, or “salt substitutes” without understanding that kidney function and medications influence safety. For example, potassium supplements may be risky for patients on ACE inhibitors or potassium-sparing diuretics.'),
    p('Nursing teaching should emphasize that supplements are medications. Patients should be advised to consult the care team before starting electrolyte supplements and to report palpitations, weakness, confusion, or muscle cramps promptly.')
  );
  if(no==='3.6') out.push(
    h4('Baseline Assessment: A Simple Habit With High Payoff'),
    p('Neurologic toxicity is easier to detect when a baseline is documented. Brief baseline assessment includes orientation, speech clarity, gait stability, and basic sensory questions (vision and hearing changes). This establishes a reference point for later comparison after medication starts or dose changes.'),
    p('When baseline is unclear, subtle decline may be missed. A consistent baseline habit turns “something seems off” into objective, actionable clinical information.')
  );
  if(no==='3.7') out.push(
    h4('Documentation of Pregnancy/Lactation Context'),
    p('Pregnancy and lactation context should be documented clearly because it changes medication decision-making. Documenting gestational stage, breastfeeding status, and contraception considerations supports safer prescribing and reduces ambiguity during handoffs.'),
    p('When risk counseling occurs, documenting what was discussed and the follow-up plan supports continuity of care and reinforces patient safety if the patient is seen by a different team later.')
  );

  return append(html, out.join('\n\n'));
}

function main(){
  const json=JSON.parse(fs.readFileSync(FILE,'utf8'));
  for(const sec of json.chapter.sections||[]){
    sec.content=expand(sec.sectionNumber, sec.content);
    sec.wordCount=wc(sec.content);
  }
  const total=(json.chapter.sections||[]).reduce((n,s)=>n+(s.wordCount||0),0);
  json.chapter.metadata={...json.chapter.metadata, wordCount: total, lastUpdated: new Date().toISOString().slice(0,10)};
  fs.writeFileSync(FILE, JSON.stringify(json,null,2)+'\n');
  console.log('Expanded Chapter 3 pass4. Total words:', total);
}

main();
