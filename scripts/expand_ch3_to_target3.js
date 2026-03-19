#!/usr/bin/env node

/**
 * Final expansion pass to push Chapter 3 above 20k words while keeping textbook cadence.
 */

const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'src', 'data', 'CHAPTER_3_UNAVIDA_PRODUCTION.json');

const h4 = (t) => `<h4>${t}</h4>`;
const p = (t) => `<p>${t}</p>`;
const ul = (items) => `<ul>\n${items.map(i => `  <li>${i}</li>`).join('\n')}\n</ul>`;

function stripTags(html) { return String(html||'').replace(/<[^>]+>/g,' '); }
function wc(html){ const t=stripTags(html).replace(/\s+/g,' ').trim(); return t? t.split(' ').length:0; }
function append(a,b){ a=String(a||'').trim(); b=String(b||'').trim(); return b ? (a? a+'\n\n'+b : b) : a; }

function expand(secNo, html){
  const out=[];

  if(secNo==='3.1'){
    out.push(
      h4('Reducing Preventable Harm: Common Failure Points'),
      p('Many adverse outcomes are driven by predictable failure points: incomplete histories, unclear documentation, missed early warning signs, and poor follow-up after a reaction. In practice, preventable harm often looks like a patient being re-exposed to a drug because the chart says “allergy” without describing the reaction, or a patient continuing a medication despite progressive symptoms because the symptom was labeled as “expected” without evaluating severity.'),
      p('Nurses reduce these failures by using closed-loop communication and structured documentation. When a concerning reaction occurs, documenting the timeline and response is not just paperwork—it is a safety tool. In outpatient settings, clear patient education is equally protective because it determines whether patients seek care early or delay until symptoms become severe.'),
      p('A high-yield practice is to standardize what patients are told to do: when to keep taking the medication with supportive care, when to call the clinic, and when to seek emergency care. This transforms vague caution into actionable safety behavior.'),
      ul([
        'Document reaction details, not just labels.',
        'Escalate early when symptoms are progressive or involve airway/breathing/circulation.',
        'Teach clear action thresholds to prevent delayed care.'
      ])
    );
  }

  if(secNo==='3.2'){
    out.push(
      h4('Monitoring Across the Care Continuum (Inpatient to Discharge)'),
      p('Organ injury prevention does not end at discharge. Some toxicities develop after cumulative exposure, and some symptoms appear later at home. Nurses should ensure that patients understand any follow-up labs, symptom monitoring, and medication changes made because of suspected injury. Clear discharge instructions prevent patients from restarting harmful OTC products or continuing outdated regimens.'),
      p('A practical discharge counseling pattern is: (1) name the organ system risk; (2) list the symptoms that require urgent evaluation; (3) list any follow-up testing; and (4) clarify which medications were stopped or adjusted and why. This supports continuity of care across settings and reduces preventable readmissions.'),
      p('When possible, reconcile medications at discharge with special attention to duplicates (e.g., multiple acetaminophen products), high-risk combinations, and changes in kidney or liver function that require new dosing strategies.'),
      ul([
        'Provide organ-specific symptom red flags at discharge (jaundice, oliguria, dyspnea, bleeding).',
        'Clarify follow-up labs and who will review them.',
        'Reconcile and simplify regimens to reduce duplicate exposures.'
      ])
    );
  }

  if(secNo==='3.3'){
    out.push(
      h4('Medication Safety After Toxicity: Preventing Repeat Events'),
      p('After a toxicity event, the patient’s risk remains elevated because the underlying drivers often persist: organ dysfunction, polypharmacy, and complex regimens. Nurses can prevent repeat events by ensuring that medication lists are updated, that “do not restart” instructions are explicit, and that monitoring plans are clear.'),
      p('This is also the moment to identify system vulnerabilities: confusing packaging, look-alike medication names, unclear PRN parameters, or missing monitoring orders. Reporting and feedback help create safer workflows for future patients. Even a brief debrief—what happened, why it happened, and what should change—can reduce recurrence.'),
      p('When a patient is transferred between units or discharged, an explicit note about the toxicity event and the revised plan helps prevent accidental re-dosing or duplicate therapy.'),
      ul([
        'Update the medication list and stop orders clearly after toxicity.',
        'Ensure monitoring plans (labs, ECG, glucose) are explicit and scheduled.',
        'Communicate the event and the revised plan during handoff and discharge.'
      ])
    );
  }

  if(secNo==='3.4'){
    out.push(
      h4('Documentation and Reporting of Glucose Events'),
      p('Glucose events should be documented in a way that supports regimen adjustment. For hypoglycemia, nurses should chart the glucose value, symptoms, suspected cause (missed meal, dose timing, renal decline), treatment given, and repeat values. For hyperglycemia, documenting timing relative to steroid dosing, infection, nutrition, and treatment helps clinicians tailor therapy.'),
      p('Trend documentation is especially valuable: repeated lows at the same time of day suggest a predictable mismatch that can be fixed. Without pattern documentation, clinicians may only see isolated events and may not adjust therapy appropriately.'),
      p('When patients are discharged with therapies that affect glucose, education should include when to check glucose at home, what values require contacting the provider, and what symptoms should prompt urgent evaluation.'),
      ul([
        'Document glucose events with timing, symptoms, suspected cause, treatment, and repeat values.',
        'Report recurring patterns, not just isolated readings.',
        'Provide discharge teaching aligned to the patient’s regimen and follow-up plan.'
      ])
    );
  }

  if(secNo==='3.5'){
    out.push(
      h4('Replacement Safety: Getting the Details Right'),
      p('Electrolyte replacement is common, but errors in route, concentration, and infusion rate can cause harm. Nursing practice includes verifying the ordered formulation, confirming the appropriate route, using correct infusion rates, and monitoring the patient’s response during and after replacement. Patients with renal impairment require special attention because replacement can overshoot into dangerous high levels.'),
      p('Replacement decisions are also tied to symptoms and rhythm risk. For example, symptomatic hypokalemia in a patient with ectopy on telemetry warrants urgent escalation and treatment per protocol. In contrast, mild asymptomatic abnormalities may be managed with scheduled replacement and trend monitoring. Nurses support safe care by matching urgency to clinical presentation and objective data.'),
      p('Finally, education matters: patients frequently self-treat cramps with supplements without understanding interactions. Clear counseling can prevent outpatient electrolyte-related harm.'),
      ul([
        'Verify route, dilution, and infusion rate for electrolyte replacement.',
        'Monitor closely in renal impairment to prevent overcorrection.',
        'Match urgency to symptoms and telemetry/ECG findings.'
      ])
    );
  }

  if(secNo==='3.6'){
    out.push(
      h4('Functional Safety: Driving, Falls, and Daily Activities'),
      p('Neurologic and sensory toxicity has real-world safety consequences. Dizziness, blurred vision, slowed reaction time, and impaired balance increase risk of falls and accidents. Nurses should translate clinical findings into functional safety advice: assistance with ambulation, avoiding driving or operating machinery when sedated, and recognizing when symptoms require immediate evaluation.'),
      p('In inpatient settings, these functional risks become unit safety problems—falls, aspiration, missed alarms. In outpatient settings, they become life safety problems—motor vehicle collisions and injury. Nursing education and documentation that explicitly addresses function reduces preventable harm.'),
      p('When symptoms persist, nursing advocacy for medication review is essential. Adjusting dose timing, reducing duplicate CNS depressants, or selecting alternatives can often restore safety without abandoning therapy.'),
      ul([
        'Implement fall precautions and mobility assistance when dizziness/ataxia is present.',
        'Provide clear functional guidance: driving restrictions, supervision, safety planning.',
        'Advocate for regimen review when symptoms impair function or progress.'
      ])
    );
  }

  if(secNo==='3.7'){
    out.push(
      h4('Preconception Planning and High-Risk Medications'),
      p('For patients with chronic conditions, preconception planning reduces fetal risk while protecting maternal health. Some medications require switching to safer alternatives before conception, while others can be continued with monitoring. Nurses support planning by encouraging early discussion with providers, reinforcing adherence to safer regimens, and ensuring that patients understand why changes are made.'),
      p('Even when a medication is not absolutely contraindicated, risk communication must be specific and calm. Patients benefit from understanding what is known, what is uncertain, and what monitoring is planned. This reduces fear-driven nonadherence and supports safer outcomes.'),
      p('A consistent nursing message is to avoid starting new OTC drugs or supplements without consultation during pregnancy and lactation, because “natural” products can still cause harm or interact with prescribed therapy.'),
      ul([
        'Encourage early preconception counseling for patients on high-risk therapies.',
        'Support calm, specific risk communication to prevent fear-driven nonadherence.',
        'Reinforce avoidance of unreviewed OTC products and supplements.'
      ])
    );
  }

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
  console.log('Expanded Chapter 3 pass3. Total words:', total);
}

main();
