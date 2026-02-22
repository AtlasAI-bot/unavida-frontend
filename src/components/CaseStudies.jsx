import React, { useState, useMemo } from 'react';
import { CheckCircle, AlertCircle, BookOpen, Filter } from 'lucide-react';

const CaseStudies = ({ chapterId }) => {
  const [completedCases, setCompletedCases] = useState(new Set());
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [expandedCase, setExpandedCase] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState({});

  const caseStudies = [
    {
      id: 1,
      title: 'Polypharmacy in Elderly Patient',
      difficulty: 'Intermediate',
      patientInfo: '78-year-old Margaret Smith, admitted with hypertension, diabetes, arthritis, and insomnia. Currently taking 9 medications: Lisinopril, Metformin, Ibuprofen (daily), Flurazepam, Sertraline, Aspirin, Atorvastatin, Omeprazole, and Diphenhydramine.',
      scenario: 'Margaret presents with confusion, dizziness, and weakness. Her daughter is concerned about medication interactions and wants to know if the medications might be contributing to her symptoms.',
      questions: [
        {
          id: 'q1',
          question: 'What are the primary pharmacokinetic and pharmacodynamic concerns in this polypharmacy situation?',
          type: 'short-answer',
          answer: 'Key concerns include: (1) Multiple CNS depressants (Flurazepam, Diphenhydramine, Sertraline) causing additive sedation/confusion; (2) Potential drug-drug interactions (e.g., Ibuprofen with Aspirin increases GI bleeding risk); (3) Age-related pharmacokinetic changes reduce drug metabolism and clearance; (4) Anticholinergic burden from multiple drugs; (5) Potential adverse drug reactions (ADRs) from drug-drug interactions.'
        },
        {
          id: 'q2',
          question: 'Which medication combination is most concerning and why?',
          type: 'multiple-choice',
          options: [
            'A) Lisinopril and Metformin',
            'B) Flurazepam, Diphenhydramine, and Sertraline (all CNS depressants)',
            'C) Atorvastatin and Omeprazole',
            'D) Aspirin and Metformin'
          ],
          correctAnswer: 'B',
          explanation: 'Triple CNS depressant therapy is most concerning in an elderly patient, leading to excessive sedation, confusion, falls, and respiratory depression. While Ibuprofen + Aspirin is also risky, the CNS depression is more immediately dangerous in this acute presentation.'
        },
        {
          id: 'q3',
          question: 'What nursing interventions would you recommend?',
          type: 'short-answer',
          answer: 'Recommended interventions: (1) Medication reconciliation - review with prescriber for deprescribing opportunities; (2) Consider discontinuing one CNS depressant (Flurazepam or Diphenhydramine); (3) Monitor blood glucose closely; (4) Assess for falls risk; (5) Educate on drug interactions; (6) Regular monitoring of renal and hepatic function; (7) Consider non-pharmacological interventions for insomnia and pain; (8) Coordinate with primary care for medication optimization.'
        }
      ]
    },
    {
      id: 2,
      title: 'Drug Interaction in Cardiovascular Patient',
      difficulty: 'Advanced',
      patientInfo: '56-year-old Robert Johnson with history of atrial fibrillation, on Warfarin for anticoagulation. Recently prescribed Amoxicillin for dental infection and started on Ibuprofen for post-extraction pain.',
      scenario: 'Robert calls his clinic nurse reporting increased bruising on his arms and gums, and he notices his gums are bleeding when he brushes his teeth. His last INR was therapeutic at 2.5.',
      questions: [
        {
          id: 'q1',
          question: 'Explain the mechanism of the drug-drug interactions occurring with Warfarin, Amoxicillin, and Ibuprofen.',
          type: 'short-answer',
          answer: 'Mechanism of interactions: (1) Warfarin is highly protein-bound; Ibuprofen displaces it from protein binding, increasing free warfarin levels; (2) Ibuprofen inhibits platelet function, increasing bleeding risk synergistically with warfarin; (3) Amoxicillin can potentiate warfarin by inhibiting vitamin K-producing intestinal bacteria; (4) Combined effect: These interactions significantly increase bleeding risk, likely elevating INR above therapeutic range (>2.5); (5) Result: Increased anticoagulation leading to spontaneous bleeding manifestations.'
        },
        {
          id: 'q2',
          question: 'What is the immediate nursing action?',
          type: 'multiple-choice',
          options: [
            'A) Tell patient to continue all medications as prescribed',
            'B) Contact prescriber immediately regarding NSAIDs with Warfarin; recommend INR check',
            'C) Tell patient to stop Warfarin immediately',
            'D) Wait and see if bleeding resolves on its own'
          ],
          correctAnswer: 'B',
          explanation: 'NSAIDs are contraindicated with Warfarin due to increased bleeding risk. Immediate prescriber contact is necessary to discontinue Ibuprofen and arrange INR testing. The combination creates a dangerous interaction that must be addressed urgently.'
        },
        {
          id: 'q3',
          question: 'What alternative pain management would you recommend?',
          type: 'short-answer',
          answer: 'Safe alternatives for post-extraction pain: (1) Acetaminophen (up to 3g/day) - does not affect platelet function or warfarin metabolism; (2) Local anesthetic rinses (benzocaine) for topical relief; (3) Topical analgesic gels; (4) Ice packs and elevation; (5) Clove oil or saltwater rinses; (6) If stronger analgesia needed: Consider tramadol or codeine if not contraindicated, but avoid all NSAIDs. Important: Do NOT use any NSAID with Warfarin without prescriber approval and monitoring.'
        }
      ]
    },
    {
      id: 3,
      title: 'Adverse Drug Reaction and Hypersensitivity',
      difficulty: 'Beginner',
      patientInfo: '31-year-old Jennifer Lee with strep throat, prescribed Amoxicillin-clavulanate. First dose given at 8 AM.',
      scenario: 'At 2 PM, Jennifer calls reporting itching around her mouth, a generalized rash on her trunk, and mild shortness of breath. She appears anxious and confused over the phone.',
      questions: [
        {
          id: 'q1',
          question: 'Based on the symptoms, what type of adverse reaction is Jennifer experiencing?',
          type: 'multiple-choice',
          options: [
            'A) Side effect',
            'B) Idiosyncratic reaction',
            'C) Type I hypersensitivity/anaphylaxis',
            'D) Drug tolerance'
          ],
          correctAnswer: 'C',
          explanation: 'Classic signs of Type I hypersensitivity (IgE-mediated, immediate): itching/urticaria (rash), respiratory involvement (SOB), and systemic symptoms within 4-6 hours of first dose. This is progressing toward anaphylaxis - a medical emergency requiring immediate intervention.'
        },
        {
          id: 'q2',
          question: 'What is your immediate nursing action?',
          type: 'short-answer',
          answer: 'Immediate actions: (1) Tell Jennifer to STOP the medication immediately; (2) Direct her to nearest emergency department immediately or call 911 - this is potentially life-threatening; (3) Inform her to tell all healthcare providers about this penicillin allergy; (4) Do NOT self-treat at home; (5) Advise against antihistamines alone - she needs professional assessment and possible epinephrine; (6) Contact her prescriber to report the reaction; (7) Document the reaction type and time of onset in her medical record.'
        },
        {
          id: 'q3',
          question: 'How does a drug allergy differ from a side effect?',
          type: 'short-answer',
          answer: 'Key differences: (1) Side effects are expected, predictable, dose-related, occur in all patients (e.g., drowsiness from antihistamines); (2) Drug allergies are unpredictable, immune-mediated reactions independent of dose, occur only in sensitized individuals; (3) Side effects typically decrease over time; allergies do not resolve; (4) Side effects can often be managed; allergies require drug discontinuation and avoidance; (5) Future exposure to same drug or cross-reactive drugs will trigger allergic response in allergic individuals; (6) Severity can escalate with repeated exposure (anaphylaxis).'
        }
      ]
    },
    {
      id: 4,
      title: 'Medication Error and Nursing Responsibilities',
      difficulty: 'Intermediate',
      patientInfo: '67-year-old Harold Davis, post-operative day 2 after hip replacement. Prescribed Metformin 1000 mg BID for diabetes, Lisinopril 10 mg daily for hypertension, and Morphine 5 mg IV q4h PRN for pain.',
      scenario: 'You are preparing medications. You notice the pharmacy dispensed Metformin 500 mg tablets and the order says "1 tablet BID." Harold has been NPO for surgery, and his renal function (Creatinine 1.8) is elevated post-operatively. You are uncertain about giving Metformin in his current condition.',
      questions: [
        {
          id: 'q1',
          question: 'What is the concern with administering Metformin to this patient in his current condition?',
          type: 'multiple-choice',
          options: [
            'A) Metformin causes hyperglycemia',
            'B) Risk of lactic acidosis due to impaired renal clearance; contraindicated in renal dysfunction',
            'C) Metformin potentiates morphine effects',
            'D) Metformin should be given 30 min before meals'
          ],
          correctAnswer: 'B',
          explanation: 'Metformin is CONTRAINDICATED in renal impairment (eGFR <30, and caution if <45) because it cannot be cleared by kidneys and accumulates, causing lactic acidosis - a potentially fatal metabolic emergency. This patient\'s elevated creatinine (1.8) indicates reduced renal function.'
        },
        {
          id: 'q2',
          question: 'What is the appropriate nursing action?',
          type: 'short-answer',
          answer: 'Appropriate action: (1) HOLD the Metformin dose; (2) Contact the prescriber IMMEDIATELY to report elevated creatinine and NPO status; (3) Report the concern about Metformin use in renal impairment; (4) Recommend checking most recent eGFR or creatinine clearance; (5) Ask about alternative glucose management (may need insulin or other agents); (6) Do NOT administer until prescriber confirms it is safe; (7) Document your communication and clinical reasoning; (8) This is an example of appropriate medication verification and patient safety advocacy - NEVER give a medication you believe is contraindicated.'
        },
        {
          id: 'q3',
          question: 'Explain the pharmacokinetic principle involved in this contraindication.',
          type: 'short-answer',
          answer: 'Pharmacokinetic principle - EXCRETION: (1) Metformin is NOT metabolized; it is eliminated unchanged by the kidneys; (2) In normal renal function, the body rapidly excretes Metformin, preventing accumulation; (3) In renal impairment (high creatinine, low eGFR), glomerular filtration is reduced; (4) Metformin accumulates in the body because clearance is impaired; (5) High Metformin levels cause lactic acidosis - a serious ADR; (6) Solution: Either use an alternative diabetes medication that is metabolized, or reduce the dose significantly if Metformin must be used, with close monitoring.'
        }
      ]
    },
    {
      id: 5,
      title: 'Special Populations: Pediatric Dosing',
      difficulty: 'Advanced',
      patientInfo: '6-year-old Tommy Chen, 45 lbs (20.4 kg), presenting with acute otitis media. Prescribed Amoxicillin. Standard adult dose is 500 mg TID. Pediatric dosing is weight-based: 25-45 mg/kg/day divided into 3 doses.',
      scenario: 'The pharmacy filled Tommy\'s prescription for Amoxicillin 250 mg/5mL suspension with instructions to give 1 teaspoon TID. His mother is unsure if this is correct and calls to verify.',
      questions: [
        {
          id: 'q1',
          question: 'Calculate the correct pediatric dose for Tommy.',
          type: 'short-answer',
          answer: 'Calculation: (1) Using 45 mg/kg/day (high end for otitis media): 20.4 kg × 45 mg/kg = 918 mg/day total; (2) Divided into 3 doses: 918 ÷ 3 = 306 mg per dose; (3) Using 25-45 mg/kg/day range: 25 mg/kg/day = 510 mg/day (170 mg per dose); 45 mg/kg/day = 918 mg/day (306 mg per dose); (4) Appropriate range: 170-306 mg per dose TID; (5) 1 teaspoon = 5 mL of 250 mg/5mL = 250 mg per dose - This is within the acceptable range but on the high end. Should be verified with prescriber for exact intended dose.'
        },
        {
          id: 'q2',
          question: 'What is important about medication administration to pediatric patients?',
          type: 'multiple-choice',
          options: [
            'A) Use volume measures (teaspoons) - they are accurate',
            'B) Pediatric doses are the same as adult doses, just smaller volume',
            'C) Use weight-based calculations; provide measuring syringe, not household measures',
            'D) Children metabolize drugs faster than adults, so higher doses are needed'
          ],
          correctAnswer: 'C',
          explanation: 'Pediatric dosing requires: (1) Weight-based calculations in mg/kg; (2) Accurate measurement with syringes (not teaspoons which vary in size); (3) Recognition that pediatric pharmacokinetics/pharmacodynamics differ from adults; (4) Special care in medication safety for vulnerable population; (5) Clear parent education on proper administration.'
        },
        {
          id: 'q3',
          question: 'What patient education would you provide to Tommy\'s mother?',
          type: 'short-answer',
          answer: 'Parent education: (1) Give the medication WITH FOOD to reduce GI upset; (2) Use the provided measuring syringe - NOT a teaspoon; (3) Complete the full course even if Tommy feels better; (4) Watch for signs of allergic reaction (rash, swelling of lips/tongue, difficulty breathing) - call immediately if occur; (5) Common side effects: diarrhea, upset stomach - contact provider if severe; (6) Space doses about 8 hours apart for BID dosing; (7) Store suspension in refrigerator if directed; (8) Shake suspension well before each dose to distribute drug evenly; (9) Contact prescriber if symptoms don\'t improve in 48 hours.'
        }
      ]
    }
  ];

  const filteredCases = useMemo(() => {
    if (selectedDifficulty === 'all') {
      return caseStudies;
    }
    return caseStudies.filter(c => c.difficulty === selectedDifficulty);
  }, [selectedDifficulty]);

  const handleMarkComplete = (caseId) => {
    const newCompleted = new Set(completedCases);
    if (newCompleted.has(caseId)) {
      newCompleted.delete(caseId);
    } else {
      newCompleted.add(caseId);
    }
    setCompletedCases(newCompleted);
  };

  const handleAnswerQuestion = (caseId, questionId, answer) => {
    const key = `${caseId}-${questionId}`;
    setAnsweredQuestions(prev => ({
      ...prev,
      [key]: answer
    }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-900 text-green-200';
      case 'Intermediate':
        return 'bg-yellow-900 text-yellow-200';
      case 'Advanced':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-gray-800 text-gray-200';
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen size={28} className="text-red-500" />
            Clinical Case Studies
          </h2>
          <div className="text-sm text-gray-400">
            {completedCases.size} of {caseStudies.length} completed
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <Filter size={18} className="text-gray-400" />
          {['all', 'Beginner', 'Intermediate', 'Advanced'].map(difficulty => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
                selectedDifficulty === difficulty
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.map(caseStudy => (
          <div
            key={caseStudy.id}
            className="border border-gray-700 rounded-lg overflow-hidden hover:border-red-600 transition-colors"
          >
            {/* Case Header */}
            <button
              onClick={() => setExpandedCase(expandedCase === caseStudy.id ? null : caseStudy.id)}
              className="w-full text-left px-6 py-4 bg-gray-800 hover:bg-gray-700 transition-colors flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {caseStudy.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(caseStudy.difficulty)}`}>
                    {caseStudy.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {caseStudy.scenario}
                </p>
              </div>
              <div className="flex-shrink-0 text-gray-400">
                {completedCases.has(caseStudy.id) ? (
                  <CheckCircle size={24} className="text-green-500" />
                ) : (
                  <span className="text-xl">{expandedCase === caseStudy.id ? '−' : '+'}</span>
                )}
              </div>
            </button>

            {/* Case Content */}
            {expandedCase === caseStudy.id && (
              <div className="bg-gray-900 border-t border-gray-700 p-6 space-y-6">
                {/* Patient Info */}
                <div>
                  <h4 className="font-semibold text-red-400 mb-2">Patient Information</h4>
                  <p className="text-gray-300">{caseStudy.patientInfo}</p>
                </div>

                {/* Scenario */}
                <div>
                  <h4 className="font-semibold text-red-400 mb-2">Scenario</h4>
                  <p className="text-gray-300">{caseStudy.scenario}</p>
                </div>

                {/* Questions */}
                <div>
                  <h4 className="font-semibold text-red-400 mb-4">Questions</h4>
                  <div className="space-y-4">
                    {caseStudy.questions.map(q => (
                      <div key={q.id} className="bg-gray-800 rounded p-4">
                        <p className="font-semibold text-white mb-3">
                          {caseStudy.questions.indexOf(q) + 1}. {q.question}
                        </p>

                        {q.type === 'multiple-choice' ? (
                          <div className="space-y-2 mb-3">
                            {q.options.map((option, idx) => {
                              const isSelected = answeredQuestions[`${caseStudy.id}-${q.id}`] === option;
                              const isCorrect = option.startsWith(q.correctAnswer);
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleAnswerQuestion(caseStudy.id, q.id, option)}
                                  className={`w-full text-left p-3 rounded border transition-colors ${
                                    isSelected
                                      ? isCorrect
                                        ? 'border-green-500 bg-green-900 bg-opacity-30 text-green-200'
                                        : 'border-red-500 bg-red-900 bg-opacity-30 text-red-200'
                                      : 'border-gray-700 hover:border-gray-600'
                                  }`}
                                >
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <textarea
                            value={answeredQuestions[`${caseStudy.id}-${q.id}`] || ''}
                            onChange={(e) => handleAnswerQuestion(caseStudy.id, q.id, e.target.value)}
                            placeholder="Type your answer here..."
                            className="w-full h-24 p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:border-red-600 focus:outline-none resize-none mb-3"
                          />
                        )}

                        {/* Feedback */}
                        {answeredQuestions[`${caseStudy.id}-${q.id}`] && (
                          <div className="mt-3 p-3 bg-blue-900 bg-opacity-30 border border-blue-700 rounded">
                            <p className="font-semibold text-blue-200 mb-1 flex items-center gap-2">
                              <AlertCircle size={16} /> Answer Explanation
                            </p>
                            <p className="text-sm text-blue-100">
                              {q.explanation || q.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mark Complete Button */}
                <button
                  onClick={() => handleMarkComplete(caseStudy.id)}
                  className={`w-full py-3 rounded font-semibold transition-colors ${
                    completedCases.has(caseStudy.id)
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {completedCases.has(caseStudy.id) ? '✓ Case Completed' : 'Mark as Complete'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-3">Progress Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Cases Completed</p>
            <p className="text-3xl font-bold text-red-500">{completedCases.size}/{caseStudies.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Completion Rate</p>
            <p className="text-3xl font-bold text-red-500">
              {caseStudies.length > 0 ? Math.round((completedCases.size / caseStudies.length) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;
