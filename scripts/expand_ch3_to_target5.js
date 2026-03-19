#!/usr/bin/env node

/** Final small expansion to exceed 20k words. */

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
  if(no==='3.1') out.push(h4('Follow-Up After a Reaction'),
    p('Follow-up closes the safety loop. After a significant reaction, nurses should ensure that the medication list reflects the event, that the patient understands what happened, and that future exposure risk is reduced. In the hospital, this includes handoff communication and chart updates. In outpatient settings, this includes clear instructions for what to do if symptoms recur and how to communicate the reaction to other clinicians.'),
    p('When appropriate, nurses can encourage patients to carry updated medication lists and to report reaction history accurately, including what treatment was required.')); 

  if(no==='3.2') out.push(h4('Trend Thinking: The “Slope” Matters'),
    p('A single abnormal lab value is often less informative than the trend. A creatinine that rises slightly each day, or liver enzymes that steadily climb, suggests evolving injury even if each individual value is not yet critical. Nurses are often the first to notice this slope because they review daily results and observe bedside changes.'),
    p('Escalation that includes the trend (“creatinine has risen daily for three days”) supports earlier intervention than escalation based only on the most recent number.'));

  if(no==='3.3') out.push(h4('Preventing Duplicate Therapy'),
    p('Duplicate therapy is a common, preventable contributor to toxicity. It can occur when a patient receives two products from the same class, overlapping PRNs, or OTC products that contain the same active ingredient. Duplicate acetaminophen exposure is a classic example.'),
    p('Medication reconciliation at transitions—admission, transfer, and discharge—reduces duplicate therapy and protects patients from hidden overdose patterns.'));

  if(no==='3.4') out.push(h4('Glucose and Cognition'),
    p('Glucose abnormalities can present primarily as cognitive changes—irritability, confusion, or unusual behavior—especially in older adults. Nurses should treat sudden behavioral change as a physiologic problem until proven otherwise and include glucose in rapid bedside assessment.'),
    p('This practice prevents missed hypoglycemia and avoids attributing symptoms to anxiety, dementia, or “noncompliance” when the cause is metabolic.'));

  if(no==='3.5') out.push(h4('Electrolytes and Muscle Function'),
    p('Muscle weakness, cramps, and paresthesias are common early clues to electrolyte imbalance. Patients may describe “legs feel heavy,” “cramping,” or “tingling.” These symptoms should be evaluated in the context of diuretics, GI losses, kidney disease, and supplement use.'),
    p('Early evaluation prevents progression to arrhythmias, respiratory muscle weakness, or seizures in severe cases.'));

  if(no==='3.6') out.push(h4('Ask One More Question'),
    p('Many neuro-sensory toxicities are missed because patients are not asked directly. A simple addition to routine assessment—“Any new ringing in your ears? Any new blurred vision? Any new numbness or tingling?”—can surface early toxicity before it becomes permanent.'),
    p('When symptoms are identified early, dose adjustment or medication substitution is often possible without sacrificing therapeutic goals.'));

  if(no==='3.7') out.push(h4('After Birth: Neonatal Monitoring Considerations'),
    p('Some medications used during pregnancy can affect neonatal adaptation even without causing congenital malformations. Depending on exposure, newborns may require monitoring for respiratory depression, feeding difficulty, jitteriness, or withdrawal symptoms. Nurses support safety by communicating maternal medication history to the newborn care team.'),
    p('Clear documentation of maternal exposures supports appropriate newborn observation and reduces missed medication-related neonatal complications.'));

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
  console.log('Expanded Chapter 3 pass5. Total words:', total);
}

main();
