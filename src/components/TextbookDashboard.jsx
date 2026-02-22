import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Play } from 'lucide-react';
import { useStudentProgress } from '../context/StudentProgressContext';
import { useAuth } from '../context/AuthContext';

export const TextbookDashboard = () => {
  const navigate = useNavigate();
  const { textbookId } = useParams();
  const { getChapterProgress } = useStudentProgress();
  const { user } = useAuth();

  // Textbook data structure
  const textbookData = {
    NUR1100: {
      id: 'NUR1100',
      title: 'Pharmacology I',
      courseCode: 'NUR1100',
      description: 'Foundation pharmacology concepts for nursing practice',
      icon: '💊',
      color: 'from-cyan-400 to-cyan-600',
      units: [
        {
          number: 1,
          title: 'Foundations of Pharmacology',
          description: 'Core principles, pharmacokinetics & patient safety',
          chapters: [
            {
              id: 'ch1_intro',
              number: 1,
              title: 'Introduction to Pharmacology',
              description: 'Core principles, pharmacokinetics & patient safety',
              duration: '180 min',
              icon: '💊',
              gradient: 'from-cyan-400 to-cyan-600',
            },
          ],
        },
        {
          number: 2,
          title: 'Drug Classifications & Actions',
          description: 'Understanding drug classes and therapeutic mechanisms',
          chapters: [
            {
              id: 'ch2_drugs',
              number: 2,
              title: 'Drug Classifications',
              description: 'Understanding drug classes and therapeutic mechanisms',
              duration: '200 min',
              icon: '🧪',
              gradient: 'from-purple-400 to-purple-600',
            },
          ],
        },
        {
          number: 3,
          title: 'Cardiovascular Pharmacology',
          description: 'Medications for heart and vascular system management',
          chapters: [
            {
              id: 'ch3_cardio',
              number: 3,
              title: 'Cardiovascular Medications',
              description: 'Medications for heart and vascular system management',
              duration: '220 min',
              icon: '❤️',
              gradient: 'from-emerald-400 to-emerald-600',
            },
          ],
        },
      ],
    },
    NUR2110: {
      id: 'NUR2110',
      title: 'Advanced Pharmacology',
      courseCode: 'NUR2110',
      description: 'Advanced drug therapies and specialized pharmacology',
      icon: '🧬',
      color: 'from-purple-400 to-purple-600',
      units: [
        {
          number: 1,
          title: 'Advanced Neurological Pharmacology',
          description: 'CNS and peripheral nervous system medications',
          chapters: [
            {
              id: 'ch4_neuro',
              number: 4,
              title: 'Neurological Medications',
              description: 'CNS and peripheral nervous system medications',
              duration: '240 min',
              icon: '🧠',
              gradient: 'from-blue-400 to-blue-600',
            },
          ],
        },
        {
          number: 2,
          title: 'Endocrine System Pharmacology',
          description: 'Hormonal medications and metabolic regulation',
          chapters: [
            {
              id: 'ch5_endo',
              number: 5,
              title: 'Endocrine Medications',
              description: 'Hormonal medications and metabolic regulation',
              duration: '210 min',
              icon: '⚗️',
              gradient: 'from-pink-400 to-pink-600',
            },
          ],
        },
        {
          number: 3,
          title: 'Immune System Pharmacology',
          description: 'Vaccines, biologics, and immunotherapies',
          chapters: [
            {
              id: 'ch6_immune',
              number: 6,
              title: 'Immunologic Agents',
              description: 'Vaccines, biologics, and immunotherapies',
              duration: '230 min',
              icon: '🛡️',
              gradient: 'from-amber-400 to-amber-600',
            },
          ],
        },
      ],
    },
    NUR3120: {
      id: 'NUR3120',
      title: 'Clinical Pharmacology',
      courseCode: 'NUR3120',
      description: 'Real-world clinical applications and case studies',
      icon: '🏥',
      color: 'from-emerald-400 to-emerald-600',
      units: [
        {
          number: 1,
          title: 'Clinical Case Studies',
          description: 'Real-world patient scenarios and case analysis',
          chapters: [
            {
              id: 'ch7_cases',
              number: 7,
              title: 'Case Studies in Clinical Practice',
              description: 'Real-world patient scenarios and case analysis',
              duration: '200 min',
              icon: '📋',
              gradient: 'from-indigo-400 to-indigo-600',
            },
          ],
        },
        {
          number: 2,
          title: 'Drug Interactions & Safety',
          description: 'Managing complex medication interactions',
          chapters: [
            {
              id: 'ch8_interactions',
              number: 8,
              title: 'Drug Interactions & Patient Safety',
              description: 'Managing complex medication interactions',
              duration: '220 min',
              icon: '⚠️',
              gradient: 'from-red-400 to-red-600',
            },
          ],
        },
      ],
    },
  };

  const textbook = textbookData[textbookId];

  if (!textbook) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Textbook Not Found</h2>
          <button
            onClick={() => navigate('/bookshelf')}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
          >
            Back to Bookshelf
          </button>
        </div>
      </div>
    );
  }

  const handleChapterClick = (chapterId) => {
    navigate(`/reader/${chapterId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 text-gray-900">
      {/* Header with Breadcrumb */}
      <div className="sticky top-0 z-40 bg-white bg-opacity-90 backdrop-blur-md border-b border-cyan-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-4 text-sm">
            <button
              onClick={() => navigate('/bookshelf')}
              className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold transition-colors"
            >
              <ArrowLeft size={16} />
              Bookshelf
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-semibold">{textbook.title}</span>
          </div>

          {/* Title Row */}
          <div className="flex items-center gap-4">
            <div className="text-5xl">{textbook.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{textbook.title}</h1>
              <p className="text-gray-600">{textbook.courseCode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-56 bg-gradient-to-r overflow-hidden" style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}>
        <div className={`absolute inset-0 bg-gradient-to-br ${textbook.color} opacity-90`}></div>
        <div className="absolute inset-0 flex items-center px-8">
          <div className="max-w-2xl text-white">
            <p className="text-xl font-light mb-2">
              {textbook.description}
            </p>
            <p className="text-sm opacity-90">
              {textbook.units.length} units • {textbook.units.reduce((acc, unit) => acc + unit.chapters.length, 0)} chapters
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {textbook.units.map((unit) => (
          <div key={`unit-${unit.number}`} className="mb-16">
            {/* Unit Header */}
            <div className="mb-8 pb-6 border-b-2 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Unit {unit.number}: {unit.title}
              </h2>
              <p className="text-gray-600">{unit.description}</p>
            </div>

            {/* Chapter Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unit.chapters.map((chapter) => {
                const progress = getChapterProgress(chapter.id, 10);
                return (
                  <div
                    key={chapter.id}
                    onClick={() => handleChapterClick(chapter.id)}
                    className="group cursor-pointer"
                  >
                    <div className="relative rounded-lg overflow-hidden bg-white border border-gray-200 hover:border-cyan-400 shadow-md hover:shadow-xl transition-all h-full flex flex-col hover:scale-105 transform duration-300">
                      {/* Thumbnail */}
                      <div className={`relative h-40 bg-gradient-to-br ${chapter.gradient} flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300`}>
                        <div className="absolute inset-0 opacity-20"></div>
                        <div className="text-6xl">{chapter.icon}</div>
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-800 font-semibold shadow-md">
                          <Clock size={12} />
                          {chapter.duration}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col">
                        {/* Chapter Title */}
                        <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">
                          Chapter {chapter.number}: {chapter.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                          {chapter.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-gray-500">Progress</span>
                            <span className="text-cyan-600 font-semibold">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <button className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-lg">
                          <Play size={16} />
                          {progress > 0 ? 'Continue' : 'Start'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      <div className="border-t border-gray-300 bg-gradient-to-r from-blue-50 to-purple-50 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-cyan-600">{textbook.units.length}</p>
            <p className="text-gray-600 text-sm">Units</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600">
              {textbook.units.reduce((acc, unit) => acc + unit.chapters.length, 0)}
            </p>
            <p className="text-gray-600 text-sm">Chapters</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-600">
              {textbook.units.reduce((acc, unit) => {
                return acc + unit.chapters.reduce((chAcc, ch) => chAcc + parseInt(ch.duration), 0);
              }, 0)}
            </p>
            <p className="text-gray-600 text-sm">Total Minutes</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-teal-600">0%</p>
            <p className="text-gray-600 text-sm">Complete</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextbookDashboard;
