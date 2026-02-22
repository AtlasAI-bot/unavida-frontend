import { useState, useEffect } from 'react';

export const useChapterData = () => {
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChapterData = async () => {
      try {
        // In production, this would fetch from an API or CDN
        // For now, we'll load the JSON file via fetch
        const response = await fetch('/data/chapter1.json');
        if (!response.ok) throw new Error('Failed to load chapter data');
        const data = await response.json();
        setChapterData(data);
      } catch (err) {
        setError(err.message);
        // Fallback to mock data
        setChapterData(getMockChapterData());
      } finally {
        setLoading(false);
      }
    };

    loadChapterData();
  }, []);

  return { chapterData, loading, error };
};

// Mock data structure matching the JSON
const getMockChapterData = () => ({
  chapter: {
    metadata: {
      id: 'ch1_intro_to_pharmacology',
      title: 'Chapter 1: Introduction to Pharmacology',
      subtitle: 'Foundations of Nursing Pharmacology & Patient Safety',
      courseCode: 'NUR1100',
      courseName: 'Pharmacology I',
      estimatedReadingTime: 180,
      estimatedStudyTime: 240,
      wordCount: 33147
    },
    learningOutcomes: [],
    sections: [
      {
        id: 'sec1',
        title: 'Introduction',
        subsections: [
          {
            id: 'subsec1',
            title: 'Welcome to Pharmacology',
            content: 'Pharmacology is the science of drugs and their interactions with living systems...'
          }
        ]
      }
    ],
    flashcards: generateMockFlashcards(),
    quizzes: [{ questions: generateMockQuestions() }]
  }
});

const generateMockFlashcards = () => {
  const terms = [
    { term: 'Pharmacology', definition: 'The science of drugs and their effects on living systems' },
    { term: 'Pharmacokinetics', definition: 'What the body does to the drug (absorption, distribution, metabolism, excretion)' },
    { term: 'Pharmacodynamics', definition: 'What the drug does to the body (mechanism of action)' },
    { term: 'Therapeutic Index', definition: 'The ratio between toxic dose and therapeutic dose' },
    { term: 'Bioavailability', definition: 'The percentage of administered drug that reaches systemic circulation' },
    { term: 'Half-life', definition: 'The time it takes for plasma concentration to be reduced by 50%' },
    { term: 'ADME', definition: 'Absorption, Distribution, Metabolism, Excretion' },
    { term: 'Drug Tolerance', definition: 'Decreased response to a drug with repeated administration' },
    { term: 'Adverse Drug Reaction', definition: 'Undesired effect from drug use' },
    { term: 'Contraindication', definition: 'A condition making a drug inadvisable' }
  ];

  return terms.map((card, idx) => ({
    id: `card-${idx + 1}`,
    question: card.term,
    answer: card.definition,
    difficulty: 'medium'
  }));
};

const generateMockQuestions = () => {
  return [
    {
      questionNumber: 1,
      type: 'multiple_choice',
      question: 'What is pharmacology?',
      options: {
        A: 'The study of diseases',
        B: 'The science of drugs and their effects',
        C: 'The study of anatomy',
        D: 'The study of physiology'
      },
      correctAnswer: 'B'
    },
    {
      questionNumber: 2,
      type: 'multiple_choice',
      question: 'Which phase of pharmacokinetics involves drug metabolism?',
      options: {
        A: 'Absorption',
        B: 'Distribution',
        C: 'Metabolism',
        D: 'Excretion'
      },
      correctAnswer: 'C'
    },
    {
      questionNumber: 3,
      type: 'multiple_choice',
      question: 'What does a narrow therapeutic index indicate?',
      options: {
        A: 'Safe drug with wide dosage range',
        B: 'Small difference between effective and toxic doses',
        C: 'Drug is rapidly metabolized',
        D: 'Drug has no side effects'
      },
      correctAnswer: 'B'
    }
  ];
};
