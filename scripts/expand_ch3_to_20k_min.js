#!/usr/bin/env node

/** Add a final ~800-1200 words to ensure Chapter 3 exceeds 20,000 words. */

const fs=require('fs');
const path=require('path');
const FILE=path.join(__dirname,'..','src','data','CHAPTER_3_UNAVIDA_PRODUCTION.json');

const h4=t=>`<h4>${t}</h4>`;
const p=t=>`<p>${t}</p>`;

function stripTags(h){return String(h||'').replace(/<[^>]+>/g,' ')}
function wc(h){const t=stripTags(h).replace(/\s+/g,' ').trim();return t?t.split(' ').length:0}

function main(){
  const json=JSON.parse(fs.readFileSync(FILE,'utf8'));
  const targetId='ch3_3_toxicity_overdose';
  const sec=json.chapter.sections.find(s=>s.id===targetId);
  if(!sec){throw new Error('Section not found: '+targetId)}

  const add=[
    h4('Clinical Application: Building a Safe “Toxicity Check” Habit'),
    p('A practical way to prevent missed toxicity is to build a repeatable bedside habit whenever a patient’s status changes. First, confirm whether there was a recent medication change: a new start, a dose increase, a route change, or a new PRN given more frequently. Second, assess whether clearance may have changed: reduced urine output, dehydration, rising creatinine, new liver dysfunction, or acute illness. Third, identify whether there are additive effects: multiple sedatives, multiple blood pressure–lowering agents, multiple anticoagulants, or drugs that share the same adverse-effect profile.'),
    p('Next, obtain focused objective data tied to the threatened system. For suspected CNS/respiratory toxicity, check respiratory rate and depth, oxygenation trends, level of arousal, and consider capnography if available. For suspected cardiovascular toxicity, evaluate pulse quality, blood pressure trends, telemetry/ECG changes, and electrolytes that amplify rhythm risk. For suspected bleeding toxicity, assess for visible bleeding, orthostatic symptoms, bruising patterns, stool or emesis changes, and trend hemoglobin/hematocrit when indicated.'),
    p('Finally, communicate and document in a way that supports rapid decision-making. The safest escalation message is specific: what changed, what was given, what you are seeing, and what objective data supports concern. This approach reduces delays, prevents additional exposure, and helps the team select the right intervention. In many cases, simply holding the next dose and escalating with objective findings prevents a mild toxicity pattern from becoming a critical event.'),
    h4('Medication Reconciliation After an Event'),
    p('After stabilization, a brief reconciliation step prevents repeat exposure. Nurses should confirm that the medication in question is clearly flagged in the active medication list, that any PRN parameters are clarified, and that duplicate products are removed. This is particularly important when patients receive combination products or when different services add medications independently.'),
    p('A concise handoff note improves safety: identify the suspected medication, the observed toxicity pattern, the key objective data (vitals, labs, ECG), what interventions were used, and what the current plan is. When this information is carried forward, the next clinician can make safe choices without re-deriving the story from scattered chart fragments.')
  ].join('\n\n');

  sec.content = (String(sec.content||'').trim() + '\n\n' + add).trim();
  sec.wordCount = wc(sec.content);

  const total=json.chapter.sections.reduce((n,s)=>n+(s.wordCount||0),0);
  json.chapter.metadata={...json.chapter.metadata, wordCount: total, lastUpdated: new Date().toISOString().slice(0,10)};

  fs.writeFileSync(FILE, JSON.stringify(json,null,2)+'\n');
  console.log('Chapter 3 total words now:', total);
}

main();
