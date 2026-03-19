#!/usr/bin/env node

/**
 * Second expansion pass to bring Chapter 3 into 20k–30k word range.
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
      h4('Case-Pattern Examples (Short Clinical Frames)'),
      p('Pattern recognition becomes easier when students can “see” what the first few minutes look like. Consider a patient who receives an IV antibiotic and within minutes reports itching, develops hives, and begins coughing or wheezing. The correct nursing response is not to debate whether this is an allergy versus an ADR—it is to treat it as a potentially severe hypersensitivity reaction, stop the infusion, assess airway and circulation, and escalate immediately per protocol.'),
      p('Now contrast that with a patient who starts an oral medication and reports mild nausea two hours later without rash, respiratory symptoms, or hypotension. That presentation is more consistent with an expected side effect or intolerance. Nursing care focuses on symptom relief, timing with meals if appropriate, and patient teaching about when to call back if symptoms worsen or new red flags appear.'),
      p('A third frame is delayed harm: a patient on an anticoagulant who becomes progressively weak, dizzy, and pale over days, with dark stools. Early recognition depends on nursing vigilance, trend awareness, and linking symptoms to medication risk. The symptom is not “a side effect” to tolerate; it is a warning sign that requires assessment and escalation.'),
      p('These frames teach a consistent habit: stabilize first, identify the likely pattern second, and then document and communicate in a way that prevents repeat exposure or delayed treatment.')
    );
  }

  if(secNo==='3.2'){
    out.push(
      h4('Risk Factors That Convert “Safe Dosing” Into Unsafe Exposure'),
      p('Organ injury risk is not only about the drug—it is also about the patient. Dehydration, acute kidney injury, hepatic congestion from heart failure, low body mass, older age, and interacting medications can all reduce clearance or increase active drug exposure. A regimen that was safe on admission can become unsafe during hospitalization if the patient’s physiology changes.'),
      p('For nurses, this means monitoring is dynamic. Intake/output, daily weight trends, blood pressure changes, and laboratory values provide real-time signals that clearance may be changing. When these signals change, nurses should anticipate that drug exposure may also change and should escalate for dose review when appropriate.'),
      p('Polypharmacy is a major amplifier. Drugs that compete for metabolism pathways or reduce renal perfusion can raise exposure to other medications. Nurses reduce risk by performing complete medication reconciliation (including OTC products) and by ensuring that monitoring labs are not missed during transitions of care.'),
      p('Finally, cumulative dose effects matter. Some injuries occur after a threshold exposure over time rather than after a single dose. Nurses support prevention by tracking duration of therapy, ensuring follow-up testing occurs at the correct interval, and teaching patients what delayed warning signs to report after discharge.')
    );
  }

  if(secNo==='3.3'){
    out.push(
      h4('Antidotes and Reversal Agents: Examples and Nursing Monitoring'),
      p('When an antidote exists, it is often paired with a specific monitoring responsibility. For opioid toxicity, naloxone can reverse respiratory depression, but its duration may be shorter than the opioid, creating rebound risk. After reversal, nurses monitor respiratory rate, oxygenation, level of consciousness, and recurrence of sedation. For acetaminophen overdose, N-acetylcysteine reduces risk of hepatic injury, but monitoring includes liver markers, coagulation trends, and clinical symptoms over time.'),
      p('For hypoglycemia from excessive insulin or secretagogues, treatment may restore glucose quickly, yet recurrence can occur if the medication effect persists. Nurses therefore monitor glucose repeatedly and coordinate nutrition. For anticoagulant-related bleeding risk, the immediate nursing focus is hemodynamic stability, bleeding assessment, and lab trend monitoring, while definitive reversal strategies are directed by the provider.'),
      p('These examples reinforce a principle: the antidote is not the finish line. Nursing monitoring after reversal is the safety bridge that prevents recurrence, detects delayed injury, and ensures that the patient remains stable as the underlying exposure clears.')
    );
  }

  if(secNo==='3.4'){
    out.push(
      h4('Severe Hyperglycemia: Recognizing When It Becomes an Emergency'),
      p('Hyperglycemia becomes an emergency when it is accompanied by dehydration, vomiting, abdominal pain, rapid breathing, significant weakness, or altered mental status. In these cases, the concern is not just the glucose value; it is the patient’s volume status and metabolic stability. Drug-induced hyperglycemia may precipitate diabetic ketoacidosis (DKA) or hyperosmolar hyperglycemic state (HHS) in susceptible patients, particularly during infection or steroid therapy.'),
      p('Nursing recognition focuses on vital signs, mental status, hydration indicators, and trend evaluation. Escalation should be timely when symptoms suggest metabolic crisis. Nurses support treatment by monitoring intake/output, supporting ordered fluid therapy, and performing glucose checks at the frequency required to guide safe correction. Patient education is also important at discharge so patients understand medication-related glucose risk and follow-up needs.')
    );
  }

  if(secNo==='3.5'){
    out.push(
      h4('Acid–Base Balance and Electrolyte Shifts'),
      p('Acid–base disturbances can both cause and result from electrolyte abnormalities. For example, vomiting and diuretic use can contribute to metabolic alkalosis and may be associated with potassium loss, increasing weakness and rhythm risk. Respiratory depression from sedatives can cause respiratory acidosis, contributing to clinical deterioration and altering the effectiveness of some therapies.'),
      p('Nursing implications include recognizing that abnormal blood gases, abnormal electrolytes, and medication effects often cluster together. When a patient has worsening mental status, weakness, or rhythm instability, it is safer to evaluate for combined medication, electrolyte, and acid–base contribution rather than treating each as separate problems. Care coordination includes ensuring ordered labs are obtained and reporting changes promptly.')
    );
  }

  if(secNo==='3.6'){
    out.push(
      h4('Syndrome-Level Toxicity: When Patterns Matter More Than Single Symptoms'),
      p('Some medication toxicities present as syndromes—clusters of symptoms that are more informative than any single sign. For example, severe CNS depression may combine sedation, slowed respirations, and hypotension. Other syndromes may combine autonomic instability, hyperthermia, neuromuscular changes, and altered mental status. Nurses should treat these as high-risk patterns that warrant immediate escalation and avoidance of further exposure to contributing medications.'),
      p('The nursing advantage is early recognition. When multiple symptoms appear together soon after medication changes, nurses can prevent progression by triggering rapid evaluation, obtaining objective data, and advocating for safer regimens. This approach supports patient safety even when the exact diagnosis is not yet confirmed.')
    );
  }

  if(secNo==='3.7'){
    out.push(
      h4('Clinical Counseling: Shared Decision-Making During Pregnancy'),
      p('Medication decisions during pregnancy often require shared decision-making: the benefit of therapy to the mother must be weighed against fetal risk. Nurses support this process by ensuring that the patient understands why the medication is being used, what the known risks are, and what monitoring or follow-up is planned. For chronic conditions, abrupt discontinuation may be harmful; therefore, the safest path is often coordinated adjustment rather than unilateral stopping.'),
      p('Nurses also help ensure that patients have a clear plan for follow-up—prenatal care coordination, appropriate screening, and a pathway for questions. When patients feel informed and supported, they are more likely to adhere to safe therapy and to report exposures promptly.')
    );
  }

  // Minimal formatting improvement: add spacing before lists if needed.
  const add = out.join('\n\n');
  return append(html, add);
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
  console.log('Expanded Chapter 3 pass2. Total words:', total);
}

main();
