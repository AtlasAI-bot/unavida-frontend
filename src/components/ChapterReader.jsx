import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, X, Bookmark, BookmarkCheck, Search, Volume2, Download, Share2, BookOpen, HelpCircle } from 'lucide-react';
import { useStudentProgress } from '../context/StudentProgressContext';
import ChapterNav from './ChapterNav';
import ChapterTools from './ChapterTools';
import EmbeddedVideo from './EmbeddedVideo';
import Flashcards from './Flashcards';
import Quiz from './Quiz';
import CaseStudies from './CaseStudies';
import LearningOutcomes from './LearningOutcomes';
import PracticeProblems from './PracticeProblems';
import chapterData from '../data/CHAPTER_1_UNAVIDA_PRODUCTION.json';

export const ChapterReader = () => {
  const { chapterId = 'ch1_intro_to_pharmacology' } = useParams();
  const navigate = useNavigate();
  const { progress, addBookmark, removeBookmark, addNote, getNote, updateProgress } = useStudentProgress();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentViewMode, setCurrentViewMode] = useState('content'); // 'content', 'flashcards', 'quiz'
  const contentRef = useRef(null);
  const timerRef = useRef(null);
  const progressUpdateRef = useRef(null);

  const chapter = chapterData.chapter;
  const sections = chapter.sections;
  const currentSection = sections[activeSection];

  // Helper function to get video URL from mediaAssets
  const getVideoUrl = (videoSegmentId) => {
    if (!videoSegmentId) return null;
    try {
      const videos = chapter.mediaAssets?.videos || [];
      const video = videos.find(v => v.id === videoSegmentId);
      return video?.url || `/videos/chapter1_videos/${videoSegmentId}.mp4`;
    } catch (e) {
      console.error('Error getting video URL:', e);
      return `/videos/chapter1_videos/${videoSegmentId}.mp4`;
    }
  };

  // Timer for tracking reading time - only runs once on mount
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Cleanup progress update timeout on unmount
  useEffect(() => {
    return () => {
      if (progressUpdateRef.current) {
        clearTimeout(progressUpdateRef.current);
      }
    };
  }, []);

  // ONLY reset scroll when section changes (not on every scroll)
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeSection]);

  // Debounce progress updates - don't update on every second
  // Only update when section changes or every 10 seconds of reading
  useEffect(() => {
    // Clear any existing timeout
    if (progressUpdateRef.current) {
      clearTimeout(progressUpdateRef.current);
    }

    // Update progress immediately when section changes
    updateProgress(chapterId, {
      currentSection: activeSection,
      readingProgress: Math.round((activeSection / sections.length) * 100),
      timeSpent
    });

    // Also debounce updates while reading (every 10 seconds)
    progressUpdateRef.current = setTimeout(() => {
      updateProgress(chapterId, {
        currentSection: activeSection,
        readingProgress: Math.round((activeSection / sections.length) * 100),
        timeSpent
      });
    }, 10000);

    return () => {
      if (progressUpdateRef.current) {
        clearTimeout(progressUpdateRef.current);
      }
    };
  }, [activeSection, chapterId, timeSpent]);

  const handleSectionClick = useCallback((index) => {
    setActiveSection(index);
    setSidebarOpen(false);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const progressPercentage = Math.round((activeSection / sections.length) * 100);

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-slate-100 text-gray-900">
      {/* Left Sidebar - Navigation */}
      <ChapterNav 
        sections={sections}
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        chapter={chapter}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Menu size={24} />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentViewMode === 'flashcards' 
                    ? '📚 Flashcard Study'
                    : currentViewMode === 'quiz'
                    ? '❓ Chapter Quiz'
                    : chapter.metadata.title}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentViewMode === 'content' ? currentSection.title : 'Study Materials'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentViewMode !== 'content' && (
                <button
                  onClick={() => setCurrentViewMode('content')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
                >
                  ← Back
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Progress Bar - Only show in content mode */}
          {currentViewMode === 'content' && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600">
                  {progressPercentage}% Complete
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(timeSpent)} reading
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto bg-white"
        >
          {/* Flashcards View */}
          {currentViewMode === 'flashcards' && (
            <Flashcards chapterId={chapterId} />
          )}

          {/* Quiz View */}
          {currentViewMode === 'quiz' && (
            <Quiz chapterId={chapterId} />
          )}

          {/* Case Studies View */}
          {currentViewMode === 'cases' && (
            <div className="max-w-6xl mx-auto px-8 py-12">
              <CaseStudies chapterId={chapterId} />
            </div>
          )}

          {/* Learning Outcomes View */}
          {currentViewMode === 'outcomes' && (
            <div className="max-w-6xl mx-auto px-8 py-12">
              <LearningOutcomes chapterId={chapterId} />
            </div>
          )}

          {/* Practice Problems View */}
          {currentViewMode === 'problems' && (
            <div className="max-w-6xl mx-auto px-8 py-12">
              <PracticeProblems chapterId={chapterId} />
            </div>
          )}

          {/* Regular Content View */}
          {currentViewMode === 'content' && (
          <div className="max-w-4xl mx-auto px-8 py-12">
            {/* Section Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {currentSection.title}
                  </h2>
                  <p className="text-gray-600">
                    {currentSection.duration} min read • {currentSection.wordCount.toLocaleString()} words
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                    title="Print section"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                    title="Share section"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Learning Objectives */}
              {currentSection.learningObjectives && currentSection.learningObjectives.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-8">
                  <h3 className="font-semibold text-blue-900 mb-3">Learning Objectives</h3>
                  <ul className="space-y-2">
                    {currentSection.learningObjectives.map((objective, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-blue-800">
                        <span className="font-bold text-blue-600 flex-shrink-0">{idx + 1}.</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Embedded Video - if this section has a video segment */}
              {currentSection.videoSegmentId && (
                <div className="my-6">
                  <EmbeddedVideo
                    videoId={currentSection.videoSegmentId}
                    videoPath={getVideoUrl(currentSection.videoSegmentId)}
                    title={`📹 Video: ${currentSection.title}`}
                    caption={currentSection.videoCaption || `Watch this video to learn more about ${currentSection.title.toLowerCase()}`}
                    showCaption={true}
                  />
                </div>
              )}
            </div>

            {/* Main Content Blocks */}
            <div className="prose prose-lg max-w-none">
              {currentSection.contentBlocks && currentSection.contentBlocks.map((block) => (
                <div key={block.blockId} className="mb-8">
                  {block.type === 'narrative' && (
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg mb-6">
                      {block.htmlReady ? (
                        <div 
                          className="text-gray-800 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : (
                        <p className="text-gray-800 whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {block.type === 'definition' && (
                    <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-purple-900 mb-2">{block.title}</h4>
                      {block.htmlReady ? (
                        <div 
                          className="text-gray-800"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : (
                        <p className="text-gray-800">{block.content}</p>
                      )}
                    </div>
                  )}

                  {block.type === 'definition_set' && (
                    <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-purple-900 mb-2">{block.title}</h4>
                      {block.htmlReady ? (
                        <div 
                          className="text-gray-800"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : (
                        <p className="text-gray-800">{block.content}</p>
                      )}
                    </div>
                  )}

                  {block.type === 'clinical_example' && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-green-900 mb-2">💡 Clinical Example: {block.title}</h4>
                      {block.htmlReady ? (
                        <div 
                          className="text-gray-800"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : (
                        <p className="text-gray-800">{block.description}</p>
                      )}
                    </div>
                  )}

                  {block.type === 'clinical_scenario' && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-green-900 mb-2">💡 Clinical Scenario: {block.title}</h4>
                      {block.htmlReady ? (
                        <div 
                          className="text-gray-800"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : (
                        <p className="text-gray-800">{block.description}</p>
                      )}
                    </div>
                  )}

                  {block.type === 'detailed_adme' && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-blue-900 mb-2">{block.title}</h4>
                      {block.content ? (
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      ) : (
                        <p className="text-gray-500 italic">Content not available</p>
                      )}
                    </div>
                  )}

                  {block.type === 'section_header' && (
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{block.title}</h3>
                      {block.content && (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {block.type === 'key_point' && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-red-900 mb-2">⚠️ Key Point: {block.title}</h4>
                      {block.htmlReady ? (
                        <div 
                          className="text-gray-800"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : (
                        <p className="text-gray-800">{block.content}</p>
                      )}
                    </div>
                  )}

                  {block.type === 'procedure' && (
                    <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg mb-6">
                      <h4 className="font-bold text-gray-900 mb-4">{block.title}</h4>
                      {block.steps && (
                        <ol className="space-y-3">
                          {block.steps.map((step, idx) => (
                            <li key={idx} className="flex gap-4 text-gray-800">
                              <span className="font-bold text-gray-600 flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-300 rounded-full text-sm">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  )}

                  {block.type === 'clinical_process' && (
                    <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg mb-6">
                      <h4 className="font-bold text-gray-900 mb-4">{block.title}</h4>
                      {block.steps && (
                        <ol className="space-y-3">
                          {block.steps.map((step, idx) => (
                            <li key={idx} className="flex gap-4 text-gray-800">
                              <span className="font-bold text-gray-600 flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-300 rounded-full text-sm">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  )}

                  {block.type === 'list' && (
                    <div className="my-6 p-6 bg-gray-50 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-4">{block.title}</h4>
                      <ul className="space-y-2">
                        {block.items && block.items.map((item, idx) => (
                          <li key={idx} className="flex gap-3 text-gray-800">
                            <span className="text-teal-600 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {block.type === 'table' && (
                    <div className="my-6 overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <tbody>
                          {block.rows && block.rows.map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              {row.map((cell, cellIdx) => (
                                <td 
                                  key={cellIdx}
                                  className="border border-gray-300 p-3 text-gray-800"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {block.type === 'quote' && (
                    <blockquote className="border-l-4 border-teal-500 pl-6 py-2 my-6 italic text-gray-700 bg-teal-50 p-6 rounded-r-lg">
                      "{block.content}"
                    </blockquote>
                  )}

                  {/* Timeline block */}
                  {block.type === 'timeline' && (
                    <div className="my-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-6">{block.title}</h4>
                      <div className="space-y-4">
                        {block.events && block.events.map((event, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-4 h-4 bg-blue-600 rounded-full" />
                              {idx < block.events.length - 1 && (
                                <div className="w-1 bg-blue-300 flex-grow mt-2 mb-2" style={{ minHeight: '60px' }} />
                              )}
                            </div>
                            <div className="pb-4">
                              <p className="font-bold text-blue-900">{event.period}</p>
                              <p className="font-semibold text-blue-800">{event.era}</p>
                              <p className="text-gray-700">{event.keyMilestone}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comparison Table / HTML Ready block */}
                  {block.type === 'comparison_table' && (
                    <div className="my-6 overflow-x-auto">
                      {block.title && (
                        <h4 className="font-bold text-gray-900 mb-4">{block.title}</h4>
                      )}
                      {block.htmlReady ? (
                        <div 
                          className="text-gray-800"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : null}
                    </div>
                  )}

                  {/* Reference Guide - Drug name patterns */}
                  {block.type === 'reference_guide' && (
                    <div className="my-6 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
                      <h4 className="font-bold text-indigo-900 mb-4">{block.title}</h4>
                      <div className="space-y-4">
                        {block.patterns && block.patterns.map((pattern, idx) => (
                          <div key={idx} className="bg-white p-4 rounded border border-indigo-100">
                            <p className="font-bold text-indigo-900">Ending: <span className="text-lg">{pattern.ending}</span></p>
                            <p className="text-indigo-800 font-semibold">{pattern.class}</p>
                            <p className="text-gray-700"><strong>Examples:</strong> {pattern.examples}</p>
                            <p className="text-gray-700"><strong>Effect:</strong> {pattern.predictableEffect}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Taxonomy block */}
                  {block.type === 'taxonomy' && (
                    <div className="my-6 p-6 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-bold text-orange-900 mb-4">{block.title}</h4>
                      {block.categories ? (
                        <div className="space-y-4">
                          {block.categories.map((category, idx) => (
                            <div key={idx} className="bg-white p-4 rounded border border-orange-100">
                              <p className="font-bold text-orange-900">{category.name}</p>
                              <p className="text-gray-700">{category.examples}</p>
                            </div>
                          ))}
                        </div>
                      ) : block.items ? (
                        <ul className="space-y-2">
                          {block.items.map((item, idx) => (
                            <li key={idx} className="flex gap-3 text-gray-800">
                              <span className="text-orange-600 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  )}

                  {/* Calculation Method block */}
                  {block.type === 'calculation_method' && (
                    <div className="my-6 p-6 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-bold text-green-900 mb-4">{block.title}</h4>
                      {block.formula && (
                        <div className="bg-white p-4 rounded mb-4 border-2 border-green-400">
                          <p className="text-sm text-gray-600 font-semibold">Formula:</p>
                          <p className="text-lg font-mono font-bold text-green-900">{block.formula}</p>
                        </div>
                      )}
                      {block.components && (
                        <div className="bg-white p-4 rounded mb-4 border border-green-100">
                          <p className="font-semibold text-green-900 mb-3">Components:</p>
                          <ul className="space-y-2">
                            {Object.entries(block.components).map(([key, value], idx) => (
                              <li key={idx} className="text-gray-700">
                                <strong className="text-green-800">{key.replace(/_/g, ' ')}:</strong> {value}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {block.examples && (
                        <div>
                          <p className="font-semibold text-green-900 mb-3">Examples:</p>
                          <div className="space-y-3">
                            {block.examples.map((example, idx) => (
                              <div key={idx} className="bg-white p-4 rounded border border-green-100">
                                <p className="text-gray-700"><strong>Scenario:</strong> {example.scenario}</p>
                                <p className="text-gray-700 font-mono"><strong>Calculation:</strong> {example.calculation}</p>
                                <p className="text-green-900 font-bold"><strong>Answer:</strong> {example.answer}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Process Diagram / FDA Approval Phases */}
                  {block.type === 'process_diagram' && (
                    <div className="my-6 p-6 bg-cyan-50 rounded-lg border border-cyan-200">
                      <h4 className="font-bold text-cyan-900 mb-4">{block.title}</h4>
                      <div className="space-y-3">
                        {block.phases && block.phases.map((phase, idx) => (
                          <div key={idx} className="bg-white p-4 rounded border border-cyan-100">
                            <p className="font-bold text-cyan-900">{phase.phase}</p>
                            <p className="text-gray-700"><strong>Description:</strong> {phase.description}</p>
                            {phase.volunteers && (
                              <p className="text-gray-700"><strong>Volunteers:</strong> {phase.volunteers}</p>
                            )}
                            {phase.successRate && (
                              <p className="text-gray-700"><strong>Success Rate:</strong> {phase.successRate}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Regulatory Agencies block */}
                  {block.type === 'regulatory_agencies' && (
                    <div className="my-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-4">{block.title}</h4>
                      <div className="space-y-4">
                        {block.agencies && block.agencies.map((agency, idx) => (
                          <div key={idx} className="bg-white p-4 rounded border border-slate-200">
                            <p className="font-bold text-slate-900">{agency.name}</p>
                            <p className="text-gray-700"><strong>Role:</strong> {agency.role}</p>
                            <p className="text-gray-700"><strong>Authority:</strong> {agency.authority}</p>
                            <p className="text-gray-700"><strong>Nursing Action:</strong> {agency.nursingAction}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interaction Taxonomy */}
                  {block.type === 'interaction_taxonomy' && (
                    <div className="my-6 p-6 bg-rose-50 rounded-lg border border-rose-200">
                      <h4 className="font-bold text-rose-900 mb-4">{block.title}</h4>
                      {block.categories ? (
                        <div className="space-y-4">
                          {block.categories.map((category, idx) => (
                            <div key={idx} className="bg-white p-4 rounded border border-rose-100">
                              <p className="font-bold text-rose-900">{category.name}</p>
                              {category.examples && (
                                <p className="text-gray-700">{category.examples}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Regulatory Schedule (DEA Classifications) */}
                  {block.type === 'regulatory_schedule' && (
                    <div className="my-6 p-6 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-bold text-red-900 mb-4">{block.title}</h4>
                      <div className="space-y-3">
                        {block.schedules && block.schedules.map((schedule, idx) => (
                          <div key={idx} className="bg-white p-4 rounded border border-red-100">
                            <p className="font-bold text-red-900 text-lg">Schedule {schedule.schedule}</p>
                            <p className="text-gray-700"><strong>Description:</strong> {schedule.description}</p>
                            <p className="text-gray-700"><strong>Examples:</strong> {schedule.examples}</p>
                            <p className="text-gray-700"><strong>Nursing Role:</strong> {schedule.nursingRole}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dangerous Combinations Reference */}
                  {block.type === 'dangerous_combinations_reference' && (
                    <div className="my-6 p-6 bg-red-50 rounded-lg border-2 border-red-400">
                      <h4 className="font-bold text-red-900 mb-4">⚠️ {block.title}</h4>
                      <div className="space-y-4">
                        {block.combinations && block.combinations.map((combo, idx) => (
                          <div key={idx} className="bg-white p-4 rounded border-l-4 border-red-500">
                            <p className="font-bold text-red-900">{combo.drugs}</p>
                            <p className="text-gray-700"><strong>Interaction:</strong> {combo.interaction}</p>
                            <p className="text-red-700 font-semibold"><strong>Risk:</strong> {combo.risk}</p>
                            <p className="text-gray-700"><strong>Nursing Action:</strong> {combo.nursingAction}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Glossary */}
                  {block.type === 'glossary' && (
                    <div className="my-6">
                      <h4 className="font-bold text-gray-900 mb-4">{block.title}</h4>
                      <div className="grid gap-3">
                        {block.terms && block.terms.map((term, idx) => (
                          <details key={idx} className="bg-gray-50 p-4 rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
                            <summary className="font-bold text-gray-900 cursor-pointer">
                              {term.term}
                            </summary>
                            <p className="text-gray-700 mt-3 ml-2">{term.definition}</p>
                          </details>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Practice Problems */}
                  {block.type === 'practice_problems' && (
                    <div className="my-6 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-bold text-yellow-900 mb-4">💪 {block.title}</h4>
                      <div className="space-y-4">
                        {block.problems && block.problems.map((problem, idx) => (
                          <details key={idx} className="bg-white p-4 rounded border border-yellow-100 cursor-pointer">
                            <summary className="font-bold text-yellow-900 cursor-pointer">
                              Problem {idx + 1}: {problem.scenario}
                            </summary>
                            <div className="mt-4 ml-2 space-y-2">
                              <p className="text-gray-700"><strong>Calculation:</strong> {problem.calculation}</p>
                              <p className="text-yellow-900 font-bold"><strong>Answer:</strong> {problem.answer}</p>
                              {problem.explanation && (
                                <p className="text-gray-700"><strong>Why:</strong> {problem.explanation}</p>
                              )}
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Case Study */}
                  {block.type === 'case_study' && (
                    <div className="my-6 p-6 bg-indigo-50 rounded-lg border border-indigo-300">
                      <h4 className="font-bold text-indigo-900 mb-4">📖 {block.title}</h4>
                      
                      {/* Scenario */}
                      {block.scenario && (
                        <div className="bg-white p-4 rounded mb-4 border border-indigo-100">
                          <p className="font-bold text-indigo-900 mb-2">Scenario</p>
                          <p className="text-gray-700"><strong>Patient:</strong> {block.scenario.patient}</p>
                          <p className="text-gray-700"><strong>Presentation:</strong> {block.scenario.presentation}</p>
                          <p className="text-gray-700"><strong>Diagnosis:</strong> {block.scenario.diagnosis}</p>
                          <p className="text-gray-700"><strong>Concern:</strong> {block.scenario.medication_concern}</p>
                          <p className="text-gray-700"><strong>Order:</strong> {block.scenario.prescriber_order}</p>
                        </div>
                      )}

                      {/* Decision Points */}
                      {block.decisionPoint1 && (
                        <div className="bg-white p-4 rounded mb-4 border-l-4 border-indigo-500">
                          <p className="font-bold text-indigo-900 mb-3">{block.decisionPoint1.title}</p>
                          <p className="text-gray-700 mb-3">{block.decisionPoint1.prompt}</p>
                          <div className="space-y-2 mb-3">
                            {block.decisionPoint1.options && block.decisionPoint1.options.map((opt, optIdx) => (
                              <div key={optIdx} className="p-2 bg-gray-50 rounded">
                                <p className="font-semibold text-gray-800">{opt.option}. {opt.text}</p>
                                <p className="text-sm italic text-gray-600 mt-1">{opt.feedback}</p>
                              </div>
                            ))}
                          </div>
                          <p className="text-indigo-900 font-semibold">Correct Answer: {block.decisionPoint1.correctAnswer}</p>
                          <p className="text-gray-700 mt-2"><strong>Reasoning:</strong> {block.decisionPoint1.clinicalReasoning}</p>
                        </div>
                      )}

                      {block.decisionPoint2 && (
                        <div className="bg-white p-4 rounded mb-4 border-l-4 border-indigo-500">
                          <p className="font-bold text-indigo-900 mb-3">{block.decisionPoint2.title}</p>
                          <p className="text-gray-700 mb-3">{block.decisionPoint2.prompt}</p>
                          <div className="space-y-2 mb-3">
                            {block.decisionPoint2.options && block.decisionPoint2.options.map((opt, optIdx) => (
                              <div key={optIdx} className="p-2 bg-gray-50 rounded">
                                <p className="font-semibold text-gray-800">{opt.option}. {opt.text}</p>
                                <p className="text-sm italic text-gray-600 mt-1">{opt.feedback}</p>
                              </div>
                            ))}
                          </div>
                          <p className="text-indigo-900 font-semibold">Correct Answer: {block.decisionPoint2.correctAnswer}</p>
                          <p className="text-gray-700 mt-2"><strong>Reasoning:</strong> {block.decisionPoint2.clinicalReasoning}</p>
                        </div>
                      )}

                      {block.decisionPoint3 && (
                        <div className="bg-white p-4 rounded mb-4 border-l-4 border-indigo-500">
                          <p className="font-bold text-indigo-900 mb-3">{block.decisionPoint3.title}</p>
                          <p className="text-gray-700 mb-3">{block.decisionPoint3.prompt}</p>
                          <div className="space-y-2 mb-3">
                            {block.decisionPoint3.options && block.decisionPoint3.options.map((opt, optIdx) => (
                              <div key={optIdx} className="p-2 bg-gray-50 rounded">
                                <p className="font-semibold text-gray-800">{opt.option}. {opt.text}</p>
                                <p className="text-sm italic text-gray-600 mt-1">{opt.feedback}</p>
                              </div>
                            ))}
                          </div>
                          <p className="text-indigo-900 font-semibold">Correct Answer: {block.decisionPoint3.correctAnswer}</p>
                          <p className="text-gray-700 mt-2"><strong>Reasoning:</strong> {block.decisionPoint3.clinicalReasoning}</p>
                        </div>
                      )}

                      {/* Allergy Clarification */}
                      {block.allergy_clarification && (
                        <div className="bg-blue-50 p-4 rounded mb-4 border border-blue-200">
                          <p className="font-bold text-blue-900 mb-2">Allergy Clarification</p>
                          <p className="text-gray-700"><strong>Patient Reports:</strong> {block.allergy_clarification.whatJacobReports}</p>
                          <p className="text-gray-700"><strong>Assessment:</strong> {block.allergy_clarification.assessment}</p>
                          <p className="text-gray-700"><strong>Risk Level:</strong> {block.allergy_clarification.riskLevel}</p>
                        </div>
                      )}

                      {/* Prescriber Communication */}
                      {block.prescriber_communication && (
                        <div className="bg-green-50 p-4 rounded mb-4 border border-green-200">
                          <p className="font-bold text-green-900 mb-2">Prescriber Communication</p>
                          <p className="text-gray-700 italic">{block.prescriber_communication.yourMessage}</p>
                          <p className="text-green-900 font-semibold mt-2">Result: {block.prescriber_communication.result}</p>
                        </div>
                      )}

                      {/* Implementation */}
                      {block.implementation && (
                        <div className="bg-purple-50 p-4 rounded mb-4 border border-purple-200">
                          <p className="font-bold text-purple-900 mb-3">Implementation Steps</p>
                          <ol className="space-y-2 ml-4">
                            {block.implementation.steps && block.implementation.steps.map((step, idx) => (
                              <li key={idx} className="text-gray-700">{idx + 1}. {step}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Outcome */}
                      {block.outcome && (
                        <div className="bg-teal-50 p-4 rounded border border-teal-200">
                          <p className="font-bold text-teal-900 mb-2">Outcome</p>
                          <p className="text-gray-700">{block.outcome}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Assessment Section */}
                  {block.type === 'assessment_section' && (
                    <div className="my-6 p-6 bg-slate-50 rounded-lg border border-slate-300">
                      <h4 className="font-bold text-slate-900 mb-4">❓ {block.title}</h4>
                      <div className="space-y-6">
                        {block.questions && block.questions.map((question, qIdx) => (
                          <details key={qIdx} className="bg-white p-4 rounded border border-slate-200 cursor-pointer">
                            <summary className="font-bold text-slate-900 cursor-pointer">
                              Question {qIdx + 1}: {question.question}
                            </summary>
                            <div className="mt-4 ml-2 space-y-3">
                              {question.options && question.options.map((option, optIdx) => (
                                <div key={optIdx} className="p-2 bg-slate-50 rounded">
                                  <p className="font-semibold text-slate-800">{option.option}. {option.text}</p>
                                </div>
                              ))}
                              {question.correctAnswer && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                                  <p className="text-green-900 font-bold">Correct Answer: {question.correctAnswer}</p>
                                  {question.explanation && (
                                    <p className="text-gray-700 mt-2">{question.explanation}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* narrative_introduction */}
                  {block.type === 'narrative_introduction' && (
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg mb-6">
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-800 whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* narrative_summary */}
                  {block.type === 'narrative_summary' && (
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-amber-900 mb-3">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-800 whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* clinical_context */}
                  {block.type === 'clinical_context' && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-green-900 mb-2">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-800">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* clinical_examples (plural) */}
                  {block.type === 'clinical_examples' && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-green-900 mb-2">💡 Clinical Examples: {block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-800">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* detailed_content */}
                  {block.type === 'detailed_content' && (
                    <div className="my-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                      {block.title && (
                        <h4 className="font-bold text-blue-900 mb-4">{block.title}</h4>
                      )}
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* historical_era */}
                  {block.type === 'historical_era' && (
                    <div className="my-6 p-6 bg-amber-50 rounded-lg border border-amber-300">
                      <h4 className="font-bold text-amber-900 mb-3">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* timeline_summary */}
                  {block.type === 'timeline_summary' && (
                    <div className="my-6 p-6 bg-amber-50 rounded-lg border border-amber-300">
                      <h4 className="font-bold text-amber-900 mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* classification_system */}
                  {block.type === 'classification_system' && (
                    <div className="my-6 p-6 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-bold text-orange-900 mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* process_timeline */}
                  {block.type === 'process_timeline' && (
                    <div className="my-6 p-6 bg-cyan-50 rounded-lg border border-cyan-200">
                      <h4 className="font-bold text-cyan-900 mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* definition_comparison */}
                  {block.type === 'definition_comparison' && (
                    <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-purple-900 mb-2">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-800 whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* section_header */}
                  {block.type === 'section_header' && (
                    <div className="my-8 py-4 border-b-2 border-gray-300">
                      <h3 className="text-2xl font-bold text-gray-900">{block.title}</h3>
                      {block.content && (
                        <p className="text-gray-700 mt-2 leading-relaxed">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* detailed_adme */}
                  {block.type === 'detailed_adme' && (
                    <div className="my-6 p-6 bg-indigo-50 rounded-lg border border-indigo-300">
                      <h4 className="font-bold text-indigo-900 mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* detailed_pd */}
                  {block.type === 'detailed_pd' && (
                    <div className="my-6 p-6 bg-pink-50 rounded-lg border border-pink-300">
                      <h4 className="font-bold text-pink-900 mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* interaction_types */}
                  {block.type === 'interaction_types' && (
                    <div className="my-6 p-6 bg-rose-50 rounded-lg border border-rose-200">
                      <h4 className="font-bold text-rose-900 mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* dangerous_combinations */}
                  {block.type === 'dangerous_combinations' && (
                    <div className="my-6 p-6 bg-red-50 rounded-lg border-2 border-red-400">
                      <h4 className="font-bold text-red-900 mb-4">⚠️ {block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* complex_calculations */}
                  {block.type === 'complex_calculations' && (
                    <div className="my-6 p-6 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-bold text-green-900 mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* case_scenario (distinct from clinical_scenario) */}
                  {block.type === 'case_scenario' && (
                    <div className="my-6 p-6 bg-indigo-50 rounded-lg border border-indigo-300">
                      <h4 className="font-bold text-indigo-900 mb-3">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* clinical_assessment */}
                  {block.type === 'clinical_assessment' && (
                    <div className="my-6 p-6 bg-blue-50 rounded-lg border border-blue-300">
                      <h4 className="font-bold text-blue-900 mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* decision_point */}
                  {block.type === 'decision_point' && (
                    <div className="my-6 p-6 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                      <h4 className="font-bold text-orange-900 mb-3">{block.title}</h4>
                      {block.prompt && (
                        <p className="text-gray-700 mb-4 italic">{block.prompt}</p>
                      )}
                      {block.options && (
                        <div className="space-y-3 mb-4">
                          {block.options.map((opt, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border border-orange-200">
                              <p className="font-semibold text-orange-900">{opt.option}. {opt.text}</p>
                              {opt.feedback && (
                                <p className="text-sm text-gray-600 mt-1 italic">{opt.feedback}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {block.correctAnswer && (
                        <div className="bg-green-50 p-3 rounded border border-green-300">
                          <p className="font-bold text-green-900">✓ Correct Answer: {block.correctAnswer}</p>
                          {block.clinicalReasoning && (
                            <p className="text-gray-700 mt-2">{block.clinicalReasoning}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* learning_summary */}
                  {block.type === 'learning_summary' && (
                    <div className="my-6 p-6 bg-teal-50 rounded-lg border border-teal-300">
                      <h4 className="font-bold text-teal-900 mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* clinical_outcome */}
                  {block.type === 'clinical_outcome' && (
                    <div className="my-6 p-6 bg-green-50 rounded-lg border border-green-300">
                      <h4 className="font-bold text-green-900 mb-3">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-700 leading-relaxed">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* assessment_question */}
                  {block.type === 'assessment_question' && (
                    <details className="my-6 p-6 bg-slate-50 rounded-lg border border-slate-300 cursor-pointer">
                      <summary className="font-bold text-slate-900 text-lg cursor-pointer">
                        {block.title}
                      </summary>
                      <div className="mt-4 space-y-3">
                        {block.options && block.options.map((option, optIdx) => (
                          <div key={optIdx} className="p-3 bg-white rounded border border-slate-200">
                            <p className="font-semibold text-slate-800">{option} {block.options[optIdx] ? `- ${block.options[optIdx]}` : ''}</p>
                          </div>
                        ))}
                        {block.correctAnswer && (
                          <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded">
                            <p className="text-green-900 font-bold">✓ Answer: {block.correctAnswer}</p>
                            {block.explanation && (
                              <p className="text-gray-700 mt-2">{block.explanation}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </details>
                  )}

                  {/* short_answer */}
                  {block.type === 'short_answer' && (
                    <div className="my-6 p-6 bg-yellow-50 rounded-lg border border-yellow-300">
                      <h4 className="font-bold text-yellow-900 mb-3">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* case_based */}
                  {block.type === 'case_based' && (
                    <div className="my-6 p-6 bg-indigo-50 rounded-lg border-2 border-indigo-400">
                      <h4 className="font-bold text-indigo-900 mb-4">📋 {block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* Interactive Diagram / Description blocks */}
                  {(block.type === 'interactive_diagram' || block.type === 'detailed_section' || block.type === 'safety_guide' || block.type === 'verification_checklist') && (
                    <div className="my-6 p-6 bg-sky-50 rounded-lg border border-sky-200">
                      {block.title && (
                        <h4 className="font-bold text-sky-900 mb-4">{block.title}</h4>
                      )}
                      {block.htmlReady ? (
                        <div 
                          className="text-gray-800 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : block.description ? (
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{block.description}</p>
                      ) : block.content ? (
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      ) : (
                        <p className="text-gray-500 italic">Content not available</p>
                      )}
                    </div>
                  )}

                  {/* Generic handler for htmlReady blocks (comparison_table, detailed_section, etc.) */}
                  {['comparison_table', 'definition_set', 'clinical_scenario', 'detailed_section'].includes(block.type) && block.htmlReady && block.type !== 'comparison_table' && (
                    <div className="my-6">
                      {block.title && (
                        <h4 className="font-bold text-gray-900 mb-4">{block.title}</h4>
                      )}
                      <div 
                        className="text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                      />
                    </div>
                  )}

                  {/* Fallback for any other block types */}
                  {!['narrative', 'narrative_introduction', 'narrative_summary', 'definition', 'definition_set', 'definition_comparison', 'clinical_example', 'clinical_examples', 'clinical_context', 'clinical_scenario', 'clinical_assessment', 'clinical_outcome', 'key_point', 'procedure', 'list', 'table', 'quote', 'timeline', 'timeline_summary', 'comparison_table', 'reference_guide', 'taxonomy', 'calculation_method', 'complex_calculations', 'process_diagram', 'process_timeline', 'regulatory_agencies', 'regulatory_schedule', 'interaction_taxonomy', 'interaction_types', 'clinical_process', 'detailed_section', 'detailed_content', 'detailed_adme', 'detailed_pd', 'interactive_diagram', 'dangerous_combinations_reference', 'dangerous_combinations', 'practice_problems', 'glossary', 'case_study', 'case_scenario', 'case_based', 'assessment_section', 'assessment_question', 'safety_guide', 'verification_checklist', 'historical_era', 'classification_system', 'section_header', 'decision_point', 'learning_summary', 'short_answer'].includes(block.type) && (
                    <div className="my-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                      {block.title && (
                        <h4 className="font-bold text-gray-900 mb-4">{block.title}</h4>
                      )}
                      {block.htmlReady ? (
                        <div 
                          className="text-gray-800 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : block.content ? (
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {block.content}
                        </p>
                      ) : block.description ? (
                        <p className="text-gray-800 leading-relaxed">
                          {block.description}
                        </p>
                      ) : (
                        <p className="text-gray-500 italic">Block content not available</p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Key Takeaways */}
              {currentSection.keyTakeaways && currentSection.keyTakeaways.length > 0 && (
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 my-8">
                  <h3 className="font-bold text-teal-900 mb-4">📌 Key Takeaways</h3>
                  <ul className="space-y-3">
                    {currentSection.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex gap-3 text-teal-900">
                        <span className="text-teal-600 font-bold">✓</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-12 pt-8 border-t border-gray-200">
              <button
                onClick={() => handleSectionClick(Math.max(0, activeSection - 1))}
                disabled={activeSection === 0}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                ← Previous Section
              </button>
              <button
                onClick={() => handleSectionClick(Math.min(sections.length - 1, activeSection + 1))}
                disabled={activeSection === sections.length - 1}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-lg hover:from-teal-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
              >
                Next Section →
              </button>
            </div>

            {/* Section Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center p-6 bg-gray-50 rounded-lg">
              <div>
                <p className="text-2xl font-bold text-teal-600">
                  {activeSection + 1}/{sections.length}
                </p>
                <p className="text-sm text-gray-600">Sections</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {progressPercentage}%
                </p>
                <p className="text-sm text-gray-600">Completion</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-600">
                  {formatTime(timeSpent)}
                </p>
                <p className="text-sm text-gray-600">Time Spent</p>
              </div>
            </div>

            {/* Study Materials */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">📚 Study Materials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => setCurrentViewMode('flashcards')}
                  className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all text-left"
                >
                  <BookOpen className="text-blue-600 mb-3" size={28} />
                  <h4 className="font-bold text-blue-900 text-lg mb-1">Flashcards</h4>
                  <p className="text-sm text-blue-700">Study all 60 flashcards with interactive features</p>
                </button>
                <button
                  onClick={() => setCurrentViewMode('quiz')}
                  className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-lg hover:from-red-100 hover:to-red-200 transition-all text-left"
                >
                  <HelpCircle className="text-red-600 mb-3" size={28} />
                  <h4 className="font-bold text-red-900 text-lg mb-1">Quiz</h4>
                  <p className="text-sm text-red-700">Test your knowledge with 8 practice questions</p>
                </button>
                <button
                  onClick={() => setCurrentViewMode('cases')}
                  className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg hover:from-green-100 hover:to-green-200 transition-all text-left"
                >
                  <BookOpen className="text-green-600 mb-3" size={28} />
                  <h4 className="font-bold text-green-900 text-lg mb-1">Case Studies</h4>
                  <p className="text-sm text-green-700">Work through 5 realistic clinical scenarios</p>
                </button>
                <button
                  onClick={() => setCurrentViewMode('outcomes')}
                  className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all text-left"
                >
                  <BookOpen className="text-purple-600 mb-3" size={28} />
                  <h4 className="font-bold text-purple-900 text-lg mb-1">Learning Outcomes</h4>
                  <p className="text-sm text-purple-700">Master all 9 learning objectives</p>
                </button>
                <button
                  onClick={() => setCurrentViewMode('problems')}
                  className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-lg hover:from-yellow-100 hover:to-yellow-200 transition-all text-left"
                >
                  <BookOpen className="text-yellow-600 mb-3" size={28} />
                  <h4 className="font-bold text-yellow-900 text-lg mb-1">Practice Problems</h4>
                  <p className="text-sm text-yellow-700">Complete 10 dosage calculation problems</p>
                </button>
                <button
                  onClick={() => navigate(`/chapter/${chapterId}/hub`)}
                  className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-300 rounded-lg hover:from-pink-100 hover:to-pink-200 transition-all text-left"
                >
                  <BookOpen className="text-pink-600 mb-3" size={28} />
                  <h4 className="font-bold text-pink-900 text-lg mb-1">Complete Hub</h4>
                  <p className="text-sm text-pink-700">All materials + progress tracking</p>
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Study Tools (only in content mode) */}
      {currentViewMode === 'content' && (
        <ChapterTools
          chapterId={chapterId}
          sectionId={currentSection.id}
          sectionTitle={currentSection.title}
          isOpen={rightSidebarOpen}
          onClose={() => setRightSidebarOpen(false)}
          chapter={chapter}
          bookmarks={progress.bookmarks}
        />
      )}

      {/* Mobile Right Sidebar Toggle (only in content mode) */}
      {currentViewMode === 'content' && (
        <button
          onClick={() => setRightSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 rounded-full flex items-center justify-center shadow-lg z-30 text-white transition-all"
        >
          <Search size={24} />
        </button>
      )}
    </div>
  );
};

export default ChapterReader;
