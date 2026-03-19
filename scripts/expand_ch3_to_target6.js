#!/usr/bin/env node

/** Add one more substantial subsection per section to cross 20k words. */

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
    h4('System-Level Safety: Interruptions, Workload, and Human Factors'),
    p('Adverse drug events are not only pharmacology problems; they are also human factors problems. Interruptions during medication preparation, unclear orders, similar packaging, and time pressure increase error risk and make it harder to notice early deterioration. Nurses improve safety by using standardized routines, minimizing interruptions during high-risk tasks when possible, and applying independent double checks for high-alert medications.'),
    p('When an adverse effect occurs, a just-culture mindset supports learning. Instead of only asking “who made the mistake,” teams ask “what conditions made the mistake more likely?” That perspective leads to process changes: clearer order sets, improved labeling, safer storage, better monitoring triggers, and better patient education materials. Nurses are central to this learning loop because they see where workarounds occur and where real-world workflows differ from policy.')
  );

  if(no==='3.2') out.push(
    h4('Medication-Induced Injury vs Disease Progression'),
    p('A frequent clinical challenge is distinguishing medication-induced organ injury from progression of the underlying illness. For example, dyspnea may reflect pneumonia, heart failure, pulmonary embolism, or drug-induced lung injury. Rising creatinine may reflect dehydration, sepsis, obstructive uropathy, or nephrotoxic exposure. Nurses support differentiation by correlating symptom onset with medication timing and by identifying what else changed in the patient’s status.'),
    p('Trend thinking is again key. If organ markers worsen soon after a new medication is started, after a dose increase, or after a new interaction is introduced, medication contribution becomes more likely. That does not replace diagnostic workup, but it prompts earlier escalation and dose reassessment while evaluation proceeds. When nurses communicate both the clinical picture and the medication timeline, clinicians can make safer decisions faster.')
  );

  if(no==='3.3') out.push(
    h4('Why “Normal Dose” Does Not Guarantee Safety'),
    p('Toxicity can occur at standard doses because “standard” assumes normal clearance and average sensitivity. In reality, patients vary widely. Renal and hepatic impairment, low body weight, older age, acute illness, and interacting medications can increase exposure or sensitivity. The same dose that is therapeutic in one patient can be toxic in another. This explains why toxicity prevention requires more than memorizing doses; it requires assessing the patient’s ability to handle the dose.'),
    p('Nursing practice operationalizes this by monitoring response and trends after therapy begins. When the patient’s condition changes—dehydration, infection, new confusion, lab changes—nurses should treat it as a possible “dose no longer fits the patient” problem. Early recognition and escalation often prevent severe outcomes.')
  );

  if(no==='3.4') out.push(
    h4('Special Populations: Older Adults and Glucose Instability'),
    p('Older adults may have reduced counter-regulatory hormone responses and may not show classic adrenergic symptoms of hypoglycemia. They may present primarily with confusion, weakness, or falls. Renal impairment can prolong the effect of glucose-lowering medications, increasing recurrence risk after treatment.'),
    p('Nursing monitoring should therefore be conservative in older adults: verify intake, monitor more frequently during illness, and reassess after treatment. When patients have repeated events, escalating for regimen adjustment is safer than repeatedly treating symptoms without changing the underlying mismatch.')
  );

  if(no==='3.5') out.push(
    h4('Electrolyte Imbalance as a Trigger for Escalation'),
    p('Electrolyte abnormalities should not be treated as “just lab problems.” They are physiologic instability signals that can predict deterioration, particularly when paired with high-risk medications. For example, a patient with hypokalemia receiving a QT-prolonging medication is not merely abnormal on paper; they are at increased risk of a lethal dysrhythmia.'),
    p('Nurses should escalate using both the lab value and the clinical context: current medications, ECG/telemetry findings, symptoms, and comorbid conditions. This context-based escalation helps providers prioritize corrections and consider medication changes that reduce risk.')
  );

  if(no==='3.6') out.push(
    h4('Linking Symptoms to Dose Changes'),
    p('A major practical skill is linking symptoms to dose changes. Many neuro-sensory toxicities emerge after titration: increasing an opioid dose, adding a second sedative, or increasing an anticonvulsant. When symptoms appear after titration, the most likely cause is the change. This makes the nursing timeline crucial information.'),
    p('When reporting, nurses should include: what changed, when it changed, and what symptoms followed. This allows clinicians to reverse the driver quickly—by reducing the dose, spacing doses, or discontinuing an interacting medication—rather than ordering unnecessary tests while the patient continues to worsen.')
  );

  if(no==='3.7') out.push(
    h4('Counseling on OTC and “Natural” Products'),
    p('Over-the-counter medications, herbal products, and supplements are common sources of unrecognized fetal and neonatal risk. Patients may assume that “natural” means safe, but natural products can have pharmacologic effects and can interact with prescribed medications. Some supplements can also contain inconsistent dosing.'),
    p('Nurses reduce risk by asking directly about supplements and by giving a simple rule: do not start new OTC or herbal products during pregnancy or breastfeeding without clinician review. This messaging prevents avoidable exposures and supports safer maternal–fetal outcomes.')
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
  console.log('Expanded Chapter 3 pass6. Total words:', total);
}

main();
