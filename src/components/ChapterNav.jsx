import React, { useState } from 'react';
import { X, ChevronDown, CheckCircle } from 'lucide-react';

const ChapterNav = ({ 
  sections, 
  activeSection, 
  onSectionClick, 
  isOpen, 
  onClose,
  chapter,
  completedSections = []
}) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleExpand = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 z-40 lg:z-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-50 to-purple-50 border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Table of Contents</h2>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <h3 className="text-sm font-semibold text-teal-600 truncate">
            {chapter.metadata.title}
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            {Number(chapter.metadata.wordCount || 0).toLocaleString()} words • {chapter.metadata.estimatedReadingTime || 0} min
          </p>
        </div>

        {/* Course Info */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-600">
            <span className="font-semibold text-gray-900">{chapter.metadata.courseCode}</span>
            {' '}{chapter.metadata.courseName}
          </p>
          <div className="mt-3 space-y-2">
            <div className="text-xs text-gray-600">
              <span className="font-semibold">Level:</span> {chapter.metadata.difficulty}
            </div>
            <div className="text-xs text-gray-600">
              <span className="font-semibold">Study Time:</span> {chapter.metadata.estimatedStudyTime} min
            </div>
          </div>
        </div>

        {/* Sections List */}
        <nav className="p-4 space-y-2">
          {sections.map((section, index) => {
            const isActive = activeSection === index;
            const isCompleted = completedSections.includes(section.id);
            const hasSubsections = section.subsections && section.subsections.length > 0;

            return (
              <div key={section.id}>
                <button
                  onClick={() => {
                    onSectionClick(index);
                    if (hasSubsections) {
                      toggleExpand(index);
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-100 to-purple-100 border-l-4 border-teal-500 text-gray-900 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold leading-tight">
                        {section.title}
                      </p>
                      {section.id !== 'references' && (
                        <p className="text-xs text-gray-500 mt-1">
                          {Number(section.wordCount || 0).toLocaleString()} words • {section.duration || 0} min
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      {isCompleted && (
                        <CheckCircle size={16} className="text-green-500" />
                      )}
                      {hasSubsections && (
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform ${
                            expandedSection === index ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </div>
                  </div>
                </button>

                {/* Subsections */}
                {hasSubsections && expandedSection === index && (
                  <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                    {section.subsections.map((subsection) => (
                      <button
                        key={subsection.id}
                        className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
                      >
                        • {subsection.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Learning Outcomes */}
        <div className="mt-8 p-4 border-t border-gray-200 bg-blue-50">
          <h4 className="font-semibold text-blue-900 text-sm mb-3">Learning Outcomes</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {chapter.learningOutcomes.chapterLevel.slice(0, 5).map((outcome) => (
              <div key={outcome.id} className="text-xs text-blue-700 flex gap-2">
                <span className="font-bold text-blue-600">✓</span>
                <span>{outcome.outcome}</span>
              </div>
            ))}
            {chapter.learningOutcomes.chapterLevel.length > 5 && (
              <p className="text-xs text-blue-600 font-semibold mt-2">
                +{chapter.learningOutcomes.chapterLevel.length - 5} more...
              </p>
            )}
          </div>
        </div>

        {/* Study Tips */}
        <div className="mt-4 p-4 border-t border-gray-200 bg-purple-50">
          <h4 className="font-semibold text-purple-900 text-sm mb-3">Study Tips</h4>
          <ul className="text-xs text-purple-700 space-y-2">
            <li>📖 Read each section completely</li>
            <li>🔖 Bookmark important concepts</li>
            <li>📝 Take detailed notes</li>
            <li>❓ Review the practice questions</li>
            <li>🎴 Use flashcards to memorize</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 p-4 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>Chapter 1 of 4</p>
          <p className="mt-1">Next: Chapter 2 - Major Drug Classes</p>
        </div>
      </div>
    </>
  );
};

export default ChapterNav;
