import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

export const Glossary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const glossaryItems = [
    {
      id: 1,
      term: 'Absorption',
      definition: 'The process by which a drug enters the bloodstream from its site of administration. Varies by route (oral, IV, IM, etc.).',
      category: 'Pharmacokinetics'
    },
    {
      id: 2,
      term: 'Adverse Drug Reaction (ADR)',
      definition: 'An undesired effect of a medication that occurs at therapeutic or supratherapeutic doses. Can range from mild to life-threatening.',
      category: 'Safety'
    },
    {
      id: 3,
      term: 'Agonist',
      definition: 'A drug that binds to a receptor and produces a response. Creates a pharmacological effect.',
      category: 'Pharmacodynamics'
    },
    {
      id: 4,
      term: 'Antagonist',
      definition: 'A drug that binds to a receptor but produces no effect; blocks the action of agonists.',
      category: 'Pharmacodynamics'
    },
    {
      id: 5,
      term: 'Bioavailability',
      definition: 'The percentage of administered drug that reaches systemic circulation. 100% for IV; lower for other routes.',
      category: 'Pharmacokinetics'
    },
    {
      id: 6,
      term: 'Contraindication',
      definition: 'A condition or factor that makes the use of a drug inadvisable or potentially harmful to a patient.',
      category: 'Safety'
    },
    {
      id: 7,
      term: 'Distribution',
      definition: 'The process by which a drug is transported throughout the body to reach its target tissues. Depends on factors like protein binding and blood flow.',
      category: 'Pharmacokinetics'
    },
    {
      id: 8,
      term: 'Drug Interaction',
      definition: 'The modification of a drug\'s effect by another substance (drug, food, supplement). Can increase or decrease drug effects.',
      category: 'Safety'
    },
    {
      id: 9,
      term: 'Drug Tolerance',
      definition: 'Decreased response to a drug with repeated administration. The body adapts to the drug\'s presence.',
      category: 'Pharmacology'
    },
    {
      id: 10,
      term: 'Efficacy',
      definition: 'The maximum therapeutic effect a drug can produce, regardless of dose. A measure of how well a drug works.',
      category: 'Pharmacodynamics'
    },
    {
      id: 11,
      term: 'Excretion',
      definition: 'The elimination of drug metabolites and unchanged drug from the body, primarily through kidneys (urine), liver (bile), lungs, or other routes.',
      category: 'Pharmacokinetics'
    },
    {
      id: 12,
      term: 'First-Pass Metabolism',
      definition: 'The process where an orally administered drug is metabolized by the liver before reaching systemic circulation, reducing bioavailability.',
      category: 'Pharmacokinetics'
    },
    {
      id: 13,
      term: 'Half-Life (t½)',
      definition: 'The time required for plasma concentration of a drug to decrease by 50%. Clinically important for determining dosing intervals.',
      category: 'Pharmacokinetics'
    },
    {
      id: 14,
      term: 'Indication',
      definition: 'A disease or condition for which a drug is prescribed and proven to be effective.',
      category: 'Pharmacology'
    },
    {
      id: 15,
      term: 'Metabolism',
      definition: 'The chemical breakdown of a drug in the body, primarily in the liver. Phase I (oxidation), Phase II (conjugation), Phase III (transport).',
      category: 'Pharmacokinetics'
    },
    {
      id: 16,
      term: 'Pharmacodynamics',
      definition: 'What the drug does to the body; the mechanism of action and the relationship between drug concentration and effect.',
      category: 'Pharmacology'
    },
    {
      id: 17,
      term: 'Pharmacokinetics',
      definition: 'What the body does to the drug; encompasses absorption, distribution, metabolism, and excretion (ADME).',
      category: 'Pharmacology'
    },
    {
      id: 18,
      term: 'Pharmacology',
      definition: 'The science of drugs and their effects on living systems. Includes study of drug properties, interactions, and therapeutic and adverse effects.',
      category: 'Pharmacology'
    },
    {
      id: 19,
      term: 'Potency',
      definition: 'The amount of drug needed to produce a given effect. A more potent drug requires a smaller dose.',
      category: 'Pharmacodynamics'
    },
    {
      id: 20,
      term: 'Receptor',
      definition: 'A protein on or in a cell that a drug binds to, producing a cellular response. Drugs work through receptor binding.',
      category: 'Pharmacodynamics'
    },
    {
      id: 21,
      term: 'Side Effect',
      definition: 'An unintended effect of a medication that may be tolerable or bothersome but not necessarily harmful.',
      category: 'Safety'
    },
    {
      id: 22,
      term: 'Synergism',
      definition: 'The interaction of two or more drugs to produce a combined effect greater than the sum of individual effects.',
      category: 'Drug Interactions'
    },
    {
      id: 23,
      term: 'Therapeutic Index',
      definition: 'The ratio of toxic dose to therapeutic dose. A narrow index means small differences between effective and toxic doses; requires careful monitoring.',
      category: 'Safety'
    },
    {
      id: 24,
      term: 'Tolerance',
      definition: 'A phenomenon where increasing doses of a drug are needed to achieve the same effect over time.',
      category: 'Pharmacology'
    }
  ];

  const filteredItems = useMemo(() => {
    return glossaryItems.filter(
      (item) =>
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const categories = [...new Set(glossaryItems.map((item) => item.category))].sort();

  return (
    <div>
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-3 top-3 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search glossary..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-red-600 focus:outline-none"
        />
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-400 mb-4">
        {filteredItems.length} {filteredItems.length === 1 ? 'term' : 'terms'} found
      </p>

      {/* Glossary Items */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No terms found</p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="border border-gray-700 rounded overflow-hidden hover:border-red-600 transition-colors"
            >
              <button
                onClick={() => toggleExpanded(item.id)}
                className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 transition-colors flex items-start justify-between gap-3"
              >
                <div className="flex-1">
                  <p className="font-semibold text-white mb-1">{item.term}</p>
                  <p className="text-xs text-gray-400">{item.category}</p>
                </div>
                <span className="text-gray-400 text-lg flex-shrink-0">
                  {expandedItems.has(item.id) ? '−' : '+'}
                </span>
              </button>

              {expandedItems.has(item.id) && (
                <div className="px-4 py-3 bg-gray-900 border-t border-gray-700">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Categories */}
      {filteredItems.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">
            Categories
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const count = filteredItems.filter(
                (item) => item.category === category
              ).length;
              return (
                <span
                  key={category}
                  className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded-full"
                >
                  {category} ({count})
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Glossary;
