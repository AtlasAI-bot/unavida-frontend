import React, { useState, useMemo } from 'react';
import { CheckCircle2, Circle, BookMarked, Printer, Download } from 'lucide-react';

const LearningOutcomes = ({ chapterId }) => {
  const [completedOutcomes, setCompletedOutcomes] = useState(new Set());
  const [outcomeNotes, setOutcomeNotes] = useState({});
  const [expandedOutcome, setExpandedOutcome] = useState(null);
  const [filterLevel, setFilterLevel] = useState('all');

  const learningOutcomes = [
    {
      id: 1,
      outcome: 'Define pharmacology and explain its importance in nursing practice',
      bloomLevel: 'Remember',
      color: 'blue',
      assessmentMethod: 'Quiz, Written exam',
      relatedContent: ['What is Pharmacology?', 'Introduction section'],
      keyPoints: [
        'Pharmacology is the science of drugs and their interactions with living systems',
        'Essential for safe and effective patient care',
        'Foundation of nursing knowledge',
        'Encompasses drug properties, effects, and interactions'
      ]
    },
    {
      id: 2,
      outcome: 'Describe the historical evolution of pharmacology and drug development',
      bloomLevel: 'Remember',
      color: 'blue',
      assessmentMethod: 'Timeline exercise, Quiz',
      relatedContent: ['Historical Evolution', 'Key Milestones'],
      keyPoints: [
        'Ancient use of herbal remedies',
        'Scientific revolution changed drug discovery',
        'Isolation of active compounds in 19th century',
        'Modern chemical synthesis in 20th century',
        'Genomic medicine in 21st century'
      ]
    },
    {
      id: 3,
      outcome: 'Distinguish between pharmacokinetics and pharmacodynamics',
      bloomLevel: 'Understand',
      color: 'green',
      assessmentMethod: 'Multiple choice, Case study',
      relatedContent: ['Basic Definitions', 'ADME Process'],
      keyPoints: [
        'Pharmacokinetics = What the body does to the drug',
        'Pharmacodynamics = What the drug does to the body',
        'ADME: Absorption, Distribution, Metabolism, Excretion',
        'Understanding both is critical for nursing',
        'Different patient factors affect pharmacokinetics'
      ]
    },
    {
      id: 4,
      outcome: 'Explain the four processes of pharmacokinetics: absorption, distribution, metabolism, and excretion',
      bloomLevel: 'Understand',
      color: 'green',
      assessmentMethod: 'Short answer, Diagram labeling',
      relatedContent: ['ADME section', 'Drug pathways illustration'],
      keyPoints: [
        'Absorption: Drug enters bloodstream from site of administration',
        'Distribution: Drug transported to tissues and organs',
        'Metabolism: Drug broken down by body (usually liver)',
        'Excretion: Drug and metabolites eliminated (kidneys, bile, lungs)',
        'Each process can be affected by patient factors'
      ]
    },
    {
      id: 5,
      outcome: 'Apply knowledge of pharmacokinetics to predict effects of changes in renal or hepatic function',
      bloomLevel: 'Apply',
      color: 'red',
      assessmentMethod: 'Case study analysis, Clinical problem-solving',
      relatedContent: ['Case Studies', 'Drug Excretion'],
      keyPoints: [
        'Renal impairment affects drugs eliminated by kidneys',
        'Hepatic dysfunction impairs drug metabolism',
        'Drug accumulation occurs with impaired clearance',
        'Dosage adjustments may be necessary',
        'Nursing monitoring is critical for drug toxicity'
      ]
    },
    {
      id: 6,
      outcome: 'Analyze drug interactions and their clinical significance in patient care',
      bloomLevel: 'Apply',
      color: 'red',
      assessmentMethod: 'Case study, Clinical scenario analysis',
      relatedContent: ['Drug Interactions', 'Polypharmacy cases'],
      keyPoints: [
        'Drug-drug interactions can potentiate or inhibit effects',
        'Drug-food interactions affect absorption and metabolism',
        'Protein binding competition affects drug levels',
        'Enzyme induction/inhibition alters metabolism',
        'Nurses must recognize and report interactions'
      ]
    },
    {
      id: 7,
      outcome: 'Evaluate the relationship between dose and therapeutic response, including concepts of potency and efficacy',
      bloomLevel: 'Apply',
      color: 'red',
      assessmentMethod: 'Dosage calculation problems, Multiple choice',
      relatedContent: ['Pharmacodynamics', 'Dose-Response curves'],
      keyPoints: [
        'Potency: Amount of drug needed for effect (lower is more potent)',
        'Efficacy: Maximum effect a drug can achieve',
        'Therapeutic index: Ratio of toxic to therapeutic dose',
        'Narrow therapeutic index requires careful monitoring',
        'Individual variation affects therapeutic response'
      ]
    },
    {
      id: 8,
      outcome: 'Classify adverse drug reactions and describe nursing interventions for common ADRs',
      bloomLevel: 'Understand',
      color: 'green',
      assessmentMethod: 'Case study, Written exam',
      relatedContent: ['Adverse Effects', 'Drug Safety section'],
      keyPoints: [
        'ADRs are undesired effects at therapeutic doses',
        'Types: Side effects, Toxic effects, Idiosyncratic, Allergic',
        'Severity ranges from mild to life-threatening',
        'Immediate recognition prevents serious harm',
        'Documentation and reporting to prescriber is essential'
      ]
    },
    {
      id: 9,
      outcome: 'Apply pharmacological principles to safe medication administration and patient education',
      bloomLevel: 'Apply',
      color: 'red',
      assessmentMethod: 'Medication administration exam, Case study',
      relatedContent: ['Nursing responsibilities', 'Patient education'],
      keyPoints: [
        'Verify drug appropriateness before administration',
        'Check for contraindications and interactions',
        'Use weight-based dosing for special populations',
        'Educate patients on expected effects and side effects',
        'Monitor for therapeutic and adverse effects',
        'Document administration and patient response'
      ]
    }
  ];

  const filteredOutcomes = useMemo(() => {
    if (filterLevel === 'all') {
      return learningOutcomes;
    }
    return learningOutcomes.filter(o => o.bloomLevel === filterLevel);
  }, [filterLevel]);

  const toggleOutcome = (id) => {
    const newCompleted = new Set(completedOutcomes);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedOutcomes(newCompleted);
  };

  const updateNote = (id, note) => {
    setOutcomeNotes(prev => ({
      ...prev,
      [id]: note
    }));
  };

  const getBloomColor = (level) => {
    switch (level) {
      case 'Remember':
        return 'bg-blue-900 text-blue-200 border-blue-700';
      case 'Understand':
        return 'bg-green-900 text-green-200 border-green-700';
      case 'Apply':
        return 'bg-red-900 text-red-200 border-red-700';
      default:
        return 'bg-gray-800 text-gray-200';
    }
  };

  const getBloomLevelColor = (level) => {
    switch (level) {
      case 'Remember':
        return 'text-blue-400';
      case 'Understand':
        return 'text-green-400';
      case 'Apply':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const completionPercentage = learningOutcomes.length > 0
    ? Math.round((completedOutcomes.size / learningOutcomes.length) * 100)
    : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Simple export as JSON
    const exportData = {
      chapter: 'Chapter 1',
      learningOutcomes: learningOutcomes.map(outcome => ({
        ...outcome,
        completed: completedOutcomes.has(outcome.id),
        notes: outcomeNotes[outcome.id] || ''
      })),
      completionDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `learning-outcomes-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookMarked size={28} className="text-red-500" />
            Learning Outcomes
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
              title="Print"
            >
              <Printer size={20} />
            </button>
            <button
              onClick={handleExport}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
              title="Export"
            >
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-300">Overall Progress</span>
            <span className="text-sm font-bold text-red-500">{completionPercentage}%</span>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-400">
            {completedOutcomes.size} of {learningOutcomes.length} outcomes mastered
          </div>
        </div>

        {/* Bloom Level Filter */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-400 uppercase">Filter by Bloom's Level</p>
          <div className="flex flex-wrap gap-2">
            {['all', 'Remember', 'Understand', 'Apply'].map(level => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
                  filterLevel === level
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Outcomes */}
      <div className="space-y-3">
        {filteredOutcomes.map((outcome, idx) => (
          <div
            key={outcome.id}
            className="border border-gray-700 rounded-lg overflow-hidden hover:border-red-600 transition-colors"
          >
            {/* Header */}
            <button
              onClick={() => setExpandedOutcome(expandedOutcome === outcome.id ? null : outcome.id)}
              className="w-full text-left px-6 py-4 bg-gray-800 hover:bg-gray-700 transition-colors flex items-start gap-4"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOutcome(outcome.id);
                }}
                className="flex-shrink-0 mt-1 text-red-500 hover:text-red-400 transition-colors"
              >
                {completedOutcomes.has(outcome.id) ? (
                  <CheckCircle2 size={24} className="text-green-500" />
                ) : (
                  <Circle size={24} />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {idx + 1}. {outcome.outcome}
                  </h3>
                  <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${getBloomColor(outcome.bloomLevel)}`}>
                    {outcome.bloomLevel}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  <strong>Assessment:</strong> {outcome.assessmentMethod}
                </p>
              </div>

              <div className="flex-shrink-0 text-gray-400 mt-1">
                {expandedOutcome === outcome.id ? '−' : '+'}
              </div>
            </button>

            {/* Expanded Content */}
            {expandedOutcome === outcome.id && (
              <div className="bg-gray-900 border-t border-gray-700 p-6 space-y-6">
                {/* Key Points */}
                <div>
                  <h4 className="font-semibold text-red-400 mb-3">Key Points</h4>
                  <ul className="space-y-2">
                    {outcome.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-300">
                        <span className="flex-shrink-0 text-red-500 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Related Content */}
                <div>
                  <h4 className="font-semibold text-red-400 mb-3">Related Content</h4>
                  <div className="flex flex-wrap gap-2">
                    {outcome.relatedContent.map((content, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm border border-gray-700"
                      >
                        {content}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Assessment Information */}
                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <h4 className="font-semibold text-gray-200 mb-2">Assessment Information</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    This learning outcome will be assessed through: <strong>{outcome.assessmentMethod}</strong>
                  </p>
                  <p className="text-xs text-gray-500">
                    Bloom's Level: <span className={getBloomLevelColor(outcome.bloomLevel)}>{outcome.bloomLevel}</span>
                  </p>
                </div>

                {/* Notes */}
                <div>
                  <h4 className="font-semibold text-red-400 mb-3">Personal Notes</h4>
                  <textarea
                    value={outcomeNotes[outcome.id] || ''}
                    onChange={(e) => updateNote(outcome.id, e.target.value)}
                    placeholder="Add your own notes for this learning outcome..."
                    className="w-full h-24 p-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-red-600 focus:outline-none resize-none"
                  />
                </div>

                {/* Completion Button */}
                <button
                  onClick={() => toggleOutcome(outcome.id)}
                  className={`w-full py-3 rounded font-semibold transition-colors ${
                    completedOutcomes.has(outcome.id)
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {completedOutcomes.has(outcome.id)
                    ? '✓ Outcome Mastered'
                    : 'Mark as Mastered'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-800 rounded border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Remember</p>
          <p className="text-2xl font-bold text-blue-400">
            {learningOutcomes.filter(o => o.bloomLevel === 'Remember').length}
          </p>
        </div>
        <div className="p-4 bg-gray-800 rounded border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Understand</p>
          <p className="text-2xl font-bold text-green-400">
            {learningOutcomes.filter(o => o.bloomLevel === 'Understand').length}
          </p>
        </div>
        <div className="p-4 bg-gray-800 rounded border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Apply</p>
          <p className="text-2xl font-bold text-red-400">
            {learningOutcomes.filter(o => o.bloomLevel === 'Apply').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningOutcomes;
