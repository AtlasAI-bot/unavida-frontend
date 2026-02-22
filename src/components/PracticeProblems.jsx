import React, { useState, useMemo } from 'react';
import { CheckCircle, AlertCircle, Calculator, BarChart3 } from 'lucide-react';

const PracticeProblems = ({ chapterId }) => {
  const [completedProblems, setCompletedProblems] = useState(new Set());
  const [userAnswers, setUserAnswers] = useState({});
  const [expandedProblem, setExpandedProblem] = useState(null);
  const [showSolution, setShowSolution] = useState({});
  const [problemFilter, setProblemFilter] = useState('all');

  const problems = [
    {
      id: 1,
      type: 'dosage-calculation',
      difficulty: 'Beginner',
      question: 'A patient weighs 150 lbs (68 kg) and needs to receive 5 mg/kg of Amoxicillin. How many mg should the patient receive?',
      solution: {
        steps: [
          'Step 1: Convert weight to kg (already provided): 68 kg',
          'Step 2: Apply the dose formula: Dose = Dose/kg × Weight',
          'Step 3: Dose = 5 mg/kg × 68 kg = 340 mg',
          'Step 4: Verify units and reasonableness'
        ],
        answer: '340 mg'
      },
      category: 'Weight-Based Dosing'
    },
    {
      id: 2,
      type: 'dosage-calculation',
      difficulty: 'Beginner',
      question: 'A nurse must administer 250 mg of Cephalexin. The medication is supplied as 500 mg/5 mL. What volume should the nurse administer?',
      solution: {
        steps: [
          'Step 1: Use the formula: Volume = (Desired Dose / Dose on Hand) × Volume on Hand',
          'Step 2: Volume = (250 mg / 500 mg) × 5 mL',
          'Step 3: Volume = 0.5 × 5 mL = 2.5 mL',
          'Step 4: Verify: 250 mg should be in 2.5 mL of a 500 mg/5 mL solution ✓'
        ],
        answer: '2.5 mL'
      },
      category: 'Concentration-Based Dosing'
    },
    {
      id: 3,
      type: 'dosage-calculation',
      difficulty: 'Intermediate',
      question: 'Pediatric patient weighs 35 kg. Gentamicin is prescribed at 7.5 mg/kg/day divided into 3 doses. How much should be given per dose?',
      solution: {
        steps: [
          'Step 1: Calculate total daily dose: Dose = 7.5 mg/kg × 35 kg = 262.5 mg/day',
          'Step 2: Divide by number of doses per day: 262.5 mg ÷ 3 = 87.5 mg per dose',
          'Step 3: Round appropriately (87.5 mg per dose)',
          'Step 4: Verify: 87.5 × 3 = 262.5 mg total ✓'
        ],
        answer: '87.5 mg per dose'
      },
      category: 'Pediatric Dosing'
    },
    {
      id: 4,
      type: 'dosage-calculation',
      difficulty: 'Intermediate',
      question: 'A 6-year-old child (20 kg) is prescribed Metformin 10-15 mg/kg twice daily. The available suspension is 100 mg/mL. What volume should be given per dose using the minimum dose?',
      solution: {
        steps: [
          'Step 1: Calculate minimum dose: 10 mg/kg × 20 kg = 200 mg minimum',
          'Step 2: Using minimum dose: 200 mg per dose',
          'Step 3: Calculate volume: Volume = (200 mg / 100 mg/mL) = 2 mL',
          'Step 4: Instruction: Give 2 mL BID (twice daily)',
          'Note: Maximum dose would be 15 × 20 = 300 mg, yielding 3 mL'
        ],
        answer: '2 mL per dose'
      },
      category: 'Pediatric Dosing'
    },
    {
      id: 5,
      type: 'dosage-calculation',
      difficulty: 'Advanced',
      question: 'Patient requires Dobutamine IV infusion at 5 mcg/kg/min. Patient weighs 80 kg. The concentration is 250 mg in 250 mL D5W. What is the infusion rate in mL/hour?',
      solution: {
        steps: [
          'Step 1: Calculate required dose per minute: 5 mcg/kg/min × 80 kg = 400 mcg/min',
          'Step 2: Determine concentration: 250 mg in 250 mL = 1 mg/mL',
          'Step 3: Convert: 1 mg/mL = 1000 mcg/mL',
          'Step 4: Calculate mL per minute: 400 mcg/min ÷ 1000 mcg/mL = 0.4 mL/min',
          'Step 5: Convert to mL/hour: 0.4 mL/min × 60 min/hour = 24 mL/hour'
        ],
        answer: '24 mL/hour'
      },
      category: 'IV Infusion Rates'
    },
    {
      id: 6,
      type: 'scenario-based',
      difficulty: 'Advanced',
      question: 'Patient A takes Warfarin 5 mg daily for atrial fibrillation. Patient B (same weight, age, condition) just started Warfarin but is also taking Amoxicillin for strep throat. Patient B requests the same dose as Patient A. What is your nursing response and why?',
      solution: {
        steps: [
          'Do NOT give the same dose. Explain that Amoxicillin interferes with Warfarin metabolism',
          'Amoxicillin reduces vitamin K-producing bacteria in intestines, potentiating Warfarin effect',
          'Patient B will need a lower dose of Warfarin to achieve therapeutic INR',
          'Contact prescriber to discuss interaction and request dose adjustment',
          'Patient B will need more frequent INR monitoring',
          'Educate Patient B about the interaction and not to start new antibiotics without notifying prescriber'
        ],
        answer: 'Do not give same dose; contact prescriber due to drug interaction; Patient B needs monitoring'
      },
      category: 'Drug Interactions'
    },
    {
      id: 7,
      type: 'concept-check',
      difficulty: 'Beginner',
      question: 'True or False: A drug with high potency requires a larger dose than a drug with low potency to achieve the same effect.',
      solution: {
        answer: 'False',
        steps: [
          'Potency refers to how much drug is needed to produce an effect',
          'Higher potency = LESS drug needed = SMALLER dose',
          'Lower potency = MORE drug needed = LARGER dose',
          'Example: Drug A is 10 times more potent than Drug B means Drug A needs 1/10 the dose of Drug B',
          'Potency is different from efficacy (maximum effect achievable)'
        ]
      },
      category: 'Pharmacodynamics'
    },
    {
      id: 8,
      type: 'scenario-based',
      difficulty: 'Intermediate',
      question: 'Patient with liver disease (cirrhosis) is prescribed a medication that is primarily metabolized by the liver. What dosage adjustment would you expect?',
      solution: {
        steps: [
          'Expect REDUCED dose compared to patients with normal liver function',
          'Reason: Impaired hepatic metabolism slows drug breakdown',
          'Result: Drug accumulates in the body, increasing risk of toxicity',
          'Solution: Prescriber typically reduces dose and/or increases dosing interval',
          'Nursing action: Monitor for signs of drug toxicity; report to prescriber',
          'Example: Normal dose might be 500 mg BID, but may reduce to 250 mg BID in cirrhosis'
        ],
        answer: 'Reduced dose expected due to impaired metabolism'
      },
      category: 'Hepatic Impairment'
    },
    {
      id: 9,
      type: 'matching',
      difficulty: 'Beginner',
      question: 'Match pharmacokinetic processes with their definitions',
      solution: {
        answer: 'Correct matches provided below',
        matches: [
          { process: 'Absorption', definition: 'Drug enters bloodstream from site of administration' },
          { process: 'Distribution', definition: 'Drug transported to tissues and organs throughout body' },
          { process: 'Metabolism', definition: 'Drug broken down in the body, primarily in liver' },
          { process: 'Excretion', definition: 'Drug and metabolites eliminated from body via kidneys, bile, etc.' }
        ]
      },
      category: 'ADME Processes'
    },
    {
      id: 10,
      type: 'dosage-calculation',
      difficulty: 'Advanced',
      question: 'Patient with renal impairment (CrCl = 25 mL/min) needs Gentamicin. Normal dose is 1.5 mg/kg IV q8h. Using renal dose adjustment nomogram: for CrCl 25-50, give normal loading dose then 50% of normal maintenance dose. Patient weighs 70 kg. What is the total amount given in first 24 hours (loading dose + maintenance doses)?',
      solution: {
        steps: [
          'Step 1: Loading dose = 1.5 mg/kg × 70 kg = 105 mg',
          'Step 2: Normal maintenance dose (q8h = 3 times/day) = 105 mg × 3 = 315 mg/day',
          'Step 3: With renal impairment: 50% of maintenance = 315 mg × 0.5 = 157.5 mg/day',
          'Step 4: Total in first 24 hours = Loading dose + Adjusted maintenance',
          'Step 5: Total = 105 mg + 157.5 mg = 262.5 mg in first 24 hours',
          'Note: Subsequent days would be 157.5 mg/day'
        ],
        answer: '262.5 mg in first 24 hours'
      },
      category: 'Renal Dosing'
    }
  ];

  const filteredProblems = useMemo(() => {
    if (problemFilter === 'all') {
      return problems;
    }
    return problems.filter(p => p.difficulty === problemFilter);
  }, [problemFilter]);

  const handleAnswerChange = (id, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [id]: answer
    }));
  };

  const handleToggleSolution = (id) => {
    setShowSolution(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleMarkComplete = (id) => {
    const newCompleted = new Set(completedProblems);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedProblems(newCompleted);
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

  const getTypeLabel = (type) => {
    switch (type) {
      case 'dosage-calculation':
        return '📊 Calculation';
      case 'scenario-based':
        return '🎯 Scenario';
      case 'concept-check':
        return '✓ Concept';
      case 'matching':
        return '🔗 Matching';
      default:
        return type;
    }
  };

  const completionPercentage = problems.length > 0
    ? Math.round((completedProblems.size / problems.length) * 100)
    : 0;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calculator size={28} className="text-red-500" />
            Practice Problems
          </h2>
          <div className="text-right">
            <div className="text-sm text-gray-400">Completed</div>
            <div className="text-2xl font-bold text-red-500">{completedProblems.size}/{problems.length}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-300">Progress</span>
            <span className="text-sm font-bold text-red-500">{completionPercentage}%</span>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-400 uppercase">Filter by Difficulty</p>
          <div className="flex flex-wrap gap-2">
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map(difficulty => (
              <button
                key={difficulty}
                onClick={() => setProblemFilter(difficulty)}
                className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
                  problemFilter === difficulty
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-4">
        {filteredProblems.map((problem, idx) => (
          <div
            key={problem.id}
            className="border border-gray-700 rounded-lg overflow-hidden hover:border-red-600 transition-colors"
          >
            {/* Problem Header */}
            <button
              onClick={() => setExpandedProblem(expandedProblem === problem.id ? null : problem.id)}
              className="w-full text-left px-6 py-4 bg-gray-800 hover:bg-gray-700 transition-colors flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="text-sm font-semibold text-red-500">
                    Problem {problem.id}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-xs text-gray-400">{getTypeLabel(problem.type)}</span>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                    {problem.category}
                  </span>
                </div>
                <p className="text-gray-300 line-clamp-2">{problem.question}</p>
              </div>

              <div className="flex-shrink-0 flex items-center gap-2">
                {completedProblems.has(problem.id) && (
                  <CheckCircle size={24} className="text-green-500" />
                )}
                <span className="text-gray-400">{expandedProblem === problem.id ? '−' : '+'}</span>
              </div>
            </button>

            {/* Problem Content */}
            {expandedProblem === problem.id && (
              <div className="bg-gray-900 border-t border-gray-700 p-6 space-y-6">
                {/* Question */}
                <div>
                  <h4 className="font-semibold text-red-400 mb-3">Question</h4>
                  <p className="text-gray-300 text-lg">{problem.question}</p>
                </div>

                {/* Answer Input */}
                {problem.type === 'concept-check' ? (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-red-400">Your Answer</h4>
                    <div className="flex gap-3">
                      {['True', 'False'].map(choice => (
                        <button
                          key={choice}
                          onClick={() => handleAnswerChange(problem.id, choice)}
                          className={`px-4 py-2 rounded font-semibold transition-colors ${
                            userAnswers[problem.id] === choice
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : problem.type === 'matching' ? (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-red-400">Match the items</h4>
                    <p className="text-sm text-gray-400">
                      (These are shown in the solution - work them out on paper first!)
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-red-400 mb-2">
                      Your Answer
                    </label>
                    <input
                      type="text"
                      value={userAnswers[problem.id] || ''}
                      onChange={(e) => handleAnswerChange(problem.id, e.target.value)}
                      placeholder="Enter your answer here..."
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-red-600 focus:outline-none"
                    />
                  </div>
                )}

                {/* Show/Hide Solution Button */}
                <button
                  onClick={() => handleToggleSolution(problem.id)}
                  className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded font-semibold transition-colors"
                >
                  {showSolution[problem.id] ? '▼ Hide Solution' : '▶ Show Solution'}
                </button>

                {/* Solution */}
                {showSolution[problem.id] && (
                  <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded p-4 space-y-3">
                    <h4 className="font-semibold text-blue-300 flex items-center gap-2">
                      <AlertCircle size={18} /> Solution
                    </h4>

                    {/* Steps */}
                    {problem.solution.steps && (
                      <div className="space-y-2">
                        {problem.solution.steps.map((step, idx) => (
                          <p key={idx} className="text-sm text-blue-100 leading-relaxed">
                            {step}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Matching Items */}
                    {problem.solution.matches && (
                      <div className="space-y-2">
                        {problem.solution.matches.map((match, idx) => (
                          <div key={idx} className="text-sm text-blue-100">
                            <strong>{match.process}</strong> → {match.definition}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Final Answer */}
                    <div className="mt-4 pt-4 border-t border-blue-700">
                      <p className="text-sm text-blue-100">
                        <strong>Answer:</strong> {problem.solution.answer}
                      </p>
                    </div>

                    {/* Comparison with User Answer */}
                    {userAnswers[problem.id] && (
                      <div className="mt-4 pt-4 border-t border-blue-700">
                        <p className="text-sm text-blue-100 mb-2">
                          <strong>Your Answer:</strong> {userAnswers[problem.id]}
                        </p>
                        <div className={`text-sm font-semibold ${
                          userAnswers[problem.id].toLowerCase() === problem.solution.answer.toLowerCase()
                            ? 'text-green-300'
                            : 'text-yellow-300'
                        }`}>
                          {userAnswers[problem.id].toLowerCase() === problem.solution.answer.toLowerCase()
                            ? '✓ Correct!'
                            : '○ Review the solution carefully'}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Mark Complete Button */}
                <button
                  onClick={() => handleMarkComplete(problem.id)}
                  className={`w-full py-3 rounded font-semibold transition-colors ${
                    completedProblems.has(problem.id)
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {completedProblems.has(problem.id)
                    ? '✓ Problem Completed'
                    : 'Mark as Complete'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-800 rounded border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Calculations</p>
          <p className="text-2xl font-bold text-red-500">
            {problems.filter(p => p.type === 'dosage-calculation').length}
          </p>
        </div>
        <div className="p-4 bg-gray-800 rounded border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Other Problem Types</p>
          <p className="text-2xl font-bold text-blue-500">
            {problems.filter(p => p.type !== 'dosage-calculation').length}
          </p>
        </div>
        <div className="p-4 bg-gray-800 rounded border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Completed Rate</p>
          <p className="text-2xl font-bold text-green-500">{completionPercentage}%</p>
        </div>
      </div>
    </div>
  );
};

export default PracticeProblems;
