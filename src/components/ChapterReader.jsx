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
  const sectionStorageKey = `unavida:lastSection:${chapterId}`;

  // Helper function to get video URL from mediaAssets
  const getVideoUrl = (videoSegmentId) => {
    if (!videoSegmentId) return null;

    // Local fallback map (used only if media asset URL is missing)
    const localVideoMap = {
      video_00_chapter_intro: 'https://unavida-videos.s3.us-east-2.amazonaws.com/Pharmacology_+Chapter+1+Introduction_1080p_caption.mp4',
      video_01_pharmacokinetics: 'https://unavida-videos.s3.us-east-2.amazonaws.com/4982BE2B-4807-F9DC-41B2-6CCF565CF232.mp4',
      video_02_fda_approval_process: 'https://unavida-videos.s3.us-east-2.amazonaws.com/02_fda_approval_process.mp4',
      video_03_drug_interactions: 'https://unavida-videos.s3.us-east-2.amazonaws.com/03_drug_interactions_and_safety.mp4',
      video_04_dosage_calculations: 'https://unavida-videos.s3.us-east-2.amazonaws.com/04_dosage_calculations.mp4',
      video_05_clinical_story: 'https://unavida-videos.s3.us-east-2.amazonaws.com/05_clinical_story_allergy_decision.mp4',
      video_06_drug_classification: 'https://unavida-videos.s3.us-east-2.amazonaws.com/06_drug_classification_systems.mp4',
      video_07_definition_scope: 'https://unavida-videos.s3.us-east-2.amazonaws.com/07_definition_and_scope.mp4',
    };

    try {
      const videos = chapter.mediaAssets?.videos || [];
      const video = videos.find(v => v.id === videoSegmentId);

      // Prefer configured media URL first (S3), then fallback to local asset
      return video?.url || localVideoMap[videoSegmentId] || `/videos/chapter1_videos/${videoSegmentId}.mp4`;
    } catch (e) {
      console.error('Error getting video URL:', e);
      return localVideoMap[videoSegmentId] || `/videos/chapter1_videos/${videoSegmentId}.mp4`;
    }
  };

  const sectionVideoMap = {
    sec1_overview_introduction: { id: 'video_00_chapter_intro', title: 'Chapter 1 Introduction', status: 'live' },
    sec1_1_definitions_scope: { id: 'video_07_definition_scope', title: 'Section 1.1 Narration', status: 'live' },
    sec1_3_drug_classification: { id: 'video_06_drug_classification', title: 'Section 1.3 Narration', status: 'live' },
    sec1_4_regulatory_bodies_fda: { id: 'video_02_fda_approval_process', title: 'Section 1.4 Narration', status: 'live' },
    sec1_6_pk_vs_pd: { id: 'video_01_pharmacokinetics', title: 'Section 1.6 Narration', status: 'live' },
    sec1_7_drug_interactions: { id: 'video_03_drug_interactions', title: 'Section 1.7 Narration', status: 'live' },
    sec1_8_dosage_calculations: { id: 'video_04_dosage_calculations', title: 'Section 1.8 Narration', status: 'live' },
    sec1_10_clinical_story_allergy_decision: { id: 'video_05_clinical_story', title: 'Section 1.10 Narration', status: 'live' },
  };

  const getSectionVideoConfig = (section) => {
    if (!section) return null;
    const mapped = sectionVideoMap[section.id];
    if (!mapped) return null;

    if (mapped.status === 'live') {
      return {
        ...mapped,
        url: getVideoUrl(section.videoSegmentId || mapped.id),
        caption: section.videoCaption || 'Watch, then continue reading for deeper detail and practice.'
      };
    }

    return {
      ...mapped,
      url: null,
      caption: 'Video placeholder ready — upcoming narration/video will be added here.'
    };
  };

  const getReadableCards = (content) => {
    if (!content || typeof content !== 'string') return [];

    const bannedPatterns = [
      /^\[\s*EXPANDED CONTENT FOR .*\]\s*$/i,
      /^\(\s*Comprehensive Overview Section\s*\)$/i,
    ];

    const paragraphs = content
      .split(/\n\s*\n/g)
      .map(chunk => chunk.trim())
      .filter(Boolean)
      .filter(chunk => !bannedPatterns.some((re) => re.test(chunk)));

    const grouped = [];
    for (let i = 0; i < paragraphs.length; i++) {
      const current = paragraphs[i];
      const next = paragraphs[i + 1];

      const isHeadingLike =
        current.length < 90 &&
        !current.includes(':') &&
        !current.includes('.') &&
        !current.startsWith('-');

      if (isHeadingLike && next) {
        grouped.push(`${current}\n\n${next}`);
        i += 1;
        continue;
      }

      if (grouped.length > 0 && grouped[grouped.length - 1].split(/\n\n/).length < 4) {
        grouped[grouped.length - 1] = `${grouped[grouped.length - 1]}\n\n${current}`;
      } else {
        grouped.push(current);
      }
    }

    return grouped;
  };

  const sectionIllustrationMap = {
    sec1_overview_introduction: [
      '/images/ch1/section-1-0/ch1_s1_0_v01.png',
      '/images/ch1/section-1-0/Pharmacology Overview.png',
      '/images/ch1/section-1-0/Key Principles.png',
      '/images/ch1/section-1-0/Eight Rights Med.png',
      '/images/ch1/section-1-0/Drug Calcutation.png',
      '/images/ch1/section-1-0/Pharmacokinetics vs. Pharmacodynamics.png',
    ],
    sec1_1_definitions_scope: [
      '/images/ch1/section-1-1/ch1_s1_1_v01.png.png',
      '/images/ch1/section-1-1/Nurses administering care to elderly patient.png',
      '/images/ch1/section-1-1/Pharmacology concepts in a visual grid.png',
    ],
    sec1_2_historical_context: [
      '/images/ch1/section-1-2/ch1_s1_2_v01.png.png',
      '/images/ch1/section-1-2/Antibiotics and the Antibiotic Era.png',
      '/images/ch1/section-1-2/he rise of pharmacogenomics.png',
    ],
    sec1_3_drug_classification: [
      '/images/ch1/section-1-3/ch1_s1_3_v01.png.png',
      '/images/ch1/section-1-3/ch1_s1_3_v02.png',
    ],
    sec1_4_regulatory_bodies_fda: [
      '/images/ch1/section-1-4/ch1_s1_4_v01.png.png',
      '/images/ch1/section-1-4/ch1_s1_4_v02.png',
    ],
    sec1_6_pk_vs_pd: [
      '/images/ch1/section-1-6/ch1_s1_6_v01.png',
    ],
    sec1_7_drug_interactions: [
      '/images/ch1/section-1-7/ch1_s1_7_v01.png.png',
      '/images/ch1/section-1-7/ch1_s1_7_v02.png',
    ],
    sec1_8_dosage_calculations: [
      '/images/ch1/section-1-8/ch1_s1_8_v01.png.png',
      '/images/ch1/section-1-8/ch1_s1_8_v02.png',
    ],
    sec1_9_key_terms_glossary: [
      '/images/ch1/section-1-9/ch1_s1_9_v01.png',
    ],
    sec1_10_clinical_story_allergy_decision: [
      '/images/ch1/section-1-10/ch1_s1_10_v01.png.png',
      '/images/ch1/section-1-10/ch1_s1_10_v02.png',
    ],
    sec1_11_review_questions: [
      '/images/ch1/section-1-11/ch1_s1_11_v01.png',
    ],
  };

  const currentSectionIllustrations = sectionIllustrationMap[currentSection?.id] || [];

  const getOverviewImageForCard = (headingText, cardText) => {
    const heading = (headingText || '').toLowerCase();
    const body = (cardText || '').toLowerCase();
    const combined = `${heading} ${body}`;

    if (combined.includes('understanding pharmacology in context') || combined.includes('pharmacology is the study of drugs')) {
      return '/images/ch1/section-1-0/Pharmacology Overview.png';
    }
    if (combined.includes('key principles for safe medication use') || combined.includes('therapeutic intent') || combined.includes('individualization')) {
      return '/images/ch1/section-1-0/Key Principles.png';
    }
    if (combined.includes('the six rights (extended to eight)') || combined.includes('right patient') || combined.includes('right drug')) {
      return '/images/ch1/section-1-0/Eight Rights Med.png';
    }
    if (combined.includes('dosage') || combined.includes('calculation')) {
      return '/images/ch1/section-1-0/Drug Calcutation.png';
    }
    if (combined.includes('scope of this course') || combined.includes('throughout this chapter')) {
      return '/images/ch1/section-1-0/Pharmacokinetics vs. Pharmacodynamics.png';
    }

    return null;
  };

  // Restore last opened section for this chapter on refresh/revisit
  useEffect(() => {
    try {
      const saved = localStorage.getItem(sectionStorageKey);
      if (saved !== null) {
        const idx = parseInt(saved, 10);
        if (!Number.isNaN(idx) && idx >= 0 && idx < sections.length) {
          setActiveSection(idx);
        }
      }
    } catch (e) {
      console.warn('Could not restore saved section:', e);
    }
  }, [sectionStorageKey, sections.length]);

  // Persist current section so refresh keeps reader location
  useEffect(() => {
    try {
      localStorage.setItem(sectionStorageKey, String(activeSection));
    } catch (e) {
      console.warn('Could not save section state:', e);
    }
  }, [activeSection, sectionStorageKey]);

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
  const currentVideo = getSectionVideoConfig(currentSection);
  const readableCards = getReadableCards(currentSection?.content);

  return (
    <>
      <style>{`
        .reader-theme{--bg:#0f1113;--text:#f5f7fa;--top:#14171a;--panel:#181b1f;--panel2:#22262b;--muted:#c5cbd3;--accent:#39d0c8;}
        .reader-theme{background:var(--bg);color:var(--text)}
        .reader-theme .bg-white{background:var(--panel)!important;color:var(--text)!important}
        .reader-theme .bg-gray-50,.reader-theme .bg-slate-50{background:var(--panel2)!important;color:var(--text)!important}
        .reader-theme .text-gray-900,.reader-theme .text-slate-900{color:var(--text)!important}
        .reader-theme .text-gray-800,.reader-theme .text-slate-800{color:#e6ebf2!important}
        .reader-theme .text-gray-700,.reader-theme .text-slate-700{color:#d1d8e2!important}
        .reader-theme .text-gray-600,.reader-theme .text-slate-600{color:var(--muted)!important}
        .reader-theme .border-gray-200,.reader-theme .border-slate-200,.reader-theme .border-gray-300,.reader-theme .border-slate-300{border-color:rgba(255,255,255,.14)!important}
        .reader-theme .bg-gradient-to-r,.reader-theme .bg-gradient-to-br{background-image:none!important}
        .reader-theme .from-teal-500,.reader-theme .to-purple-500,.reader-theme .from-teal-600,.reader-theme .to-purple-600{background-color:var(--accent)!important;color:#032320!important}
      `}</style>
      <div className="reader-theme h-screen flex bg-[#0f1113] text-[#f5f7fa]">
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
        <div className="sticky top-0 z-20 bg-[#dfe8ff] border-b border-[#cfd9f7] shadow-sm px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-[#1b2542] hover:text-[#5b6a95] transition-colors"
              >
                <Menu size={24} />
              </button>
              <div className="flex-1">
                <p className="text-xs text-[#5b6a95] font-medium">Home / {chapter.metadata.title} / Reader</p>
                <h1 className="text-lg font-bold text-[#1b2542]">
                  {currentViewMode === 'flashcards' 
                    ? '📚 Flashcard Study'
                    : currentViewMode === 'quiz'
                    ? '❓ Chapter Quiz'
                    : currentSection.title}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {currentViewMode !== 'content' && (
                <button
                  onClick={() => setCurrentViewMode('content')}
                  className="px-3 py-2 bg-transparent border border-[#cfd9f7] text-[#1b2542] rounded-lg hover:bg-[#f3f6ff] transition-colors text-xs font-semibold"
                >
                  ← Back
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="px-3 py-2 bg-transparent border border-[#cfd9f7] text-[#1b2542] rounded-lg hover:bg-[#f3f6ff] transition-colors text-xs"
              >
                Close
              </button>
            </div>
          </div>

          {/* Progress Bar - Only show in content mode */}
          {currentViewMode === 'content' && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#5b6a95]">
                  {progressPercentage}% Complete
                </span>
                <span className="text-xs text-[#5b6a95]">
                  {formatTime(timeSpent)} reading
                </span>
              </div>
              <div className="w-full h-2 bg-[#e1eaff] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#39d0c8] transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto bg-[#f7f9ff]"
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
          <div className="max-w-4xl mx-auto px-8 py-12 bg-white rounded-none md:rounded-xl md:m-4 md:shadow-sm">
            {/* Featured Video Panel (only for mapped sections) */}
            {currentVideo && (
              <div className="mb-10 p-6 bg-[#eef3ff] border border-[#cfd9f7] rounded-xl">
                <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                  <div>
                    <h3 className="text-xl font-bold text-[#1b2542]">🎥 Featured Lesson Video</h3>

                  </div>
                </div>

                {currentVideo.url ? (
                  <EmbeddedVideo
                    key={`${currentSection.id || activeSection}-${currentVideo.id}`}
                    videoId={currentVideo.id}
                    videoPath={currentVideo.url}
                    title={`📹 ${currentSection.title}`}
                    caption={currentVideo.caption}
                    showCaption={true}
                  />
                ) : (
                  <div className="rounded-lg border border-dashed border-[#cfd9f7] bg-white p-5">
                    <h4 className="font-semibold text-[#1b2542] mb-1">📹 {currentVideo.title}</h4>
                    <p className="text-sm text-[#5b6a95]">{currentVideo.caption}</p>
                  </div>
                )}
              </div>
            )}

            {/* Section Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-4xl font-bold text-[#1b2542] mb-2">
                    {currentSection.title}
                  </h2>
                  <p className="text-[#5b6a95]">
                    {currentSection.id === 'references'
                      ? 'References'
                      : `${currentSection.duration || 0} min read • ${Number(currentSection.wordCount || 0).toLocaleString()} words`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2 hover:bg-[#f3f6ff] rounded-lg transition-colors text-[#5b6a95]"
                    title="Print section"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    className="p-2 hover:bg-[#f3f6ff] rounded-lg transition-colors text-[#5b6a95]"
                    title="Share section"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Learning Objectives */}
              {currentSection.learningObjectives && currentSection.learningObjectives.length > 0 && (
                <div className="bg-gradient-to-r from-[#eaf0ff] to-[#f3f6ff] border border-[#cfd9f7] rounded-lg p-4 mb-8">
                  <h3 className="font-semibold text-[#1b2542] mb-3">Learning Objectives</h3>
                  <ul className="space-y-2">
                    {currentSection.learningObjectives.map((objective, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-[#122047]">
                        <span className="font-bold text-[#39d0c8] flex-shrink-0">{idx + 1}.</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

            {/* Primary Reading Content */}
            {readableCards.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-[#1b2542] mb-4">📘 Reading Content</h3>

                {currentSection.id === 'sec1_overview_introduction' && currentSectionIllustrations[0] && (
                  <div className="mb-5 rounded-lg overflow-hidden border border-[#cfd9f7] bg-[#f7f9ff]">
                    <img
                      src={currentSectionIllustrations[0]}
                      alt="Chapter 1 overview"
                      className="w-full max-h-[430px] object-contain bg-white"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  {currentSection.id === 'references' ? (
                    <div className="space-y-3">
                      {readableCards.map((refText, idx) => (
                        <p key={`ref-${idx}`} className="text-[#1b2542] leading-relaxed pl-8 -indent-8">
                          {refText}
                        </p>
                      ))}
                    </div>
                  ) : readableCards.map((card, idx) => {
                    const isList = card.split('\n').every(line => line.trim().startsWith('- '));
                    const blocks = card.split(/\n\n/).filter(Boolean);
                    const first = blocks[0] || '';
                    const rest = blocks.slice(1).join('\n\n');
                    const hasInlineHeading =
                      blocks.length > 1 &&
                      first.length < 100 &&
                      !first.includes('.') &&
                      !first.includes(':') &&
                      !first.startsWith('-');

                    return (
                      <div key={`reading-${idx}`} className="bg-white border border-[#cfd9f7] shadow-sm rounded-xl p-6">
                        {hasInlineHeading && (
                          <h4 className="text-xl font-bold text-[#1b2542] mb-3">{first}</h4>
                        )}

                        {isList ? (
                          <ul className="list-disc pl-6 space-y-1 text-[#1b2542]">
                            {card.split('\n').map((line, li) => (
                              <li key={li}>{line.replace(/^-\s*/, '')}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">
                            {hasInlineHeading ? rest : card}
                          </p>
                        )}

                        {(() => {
                          if (currentSection.id !== 'sec1_overview_introduction') {
                            if (currentSectionIllustrations.length === 0) return null;
                            if (idx % 2 !== 1) return null;

                            const imageIndex = Math.floor(idx / 2);
                            if (imageIndex >= currentSectionIllustrations.length) return null;

                            const imgSrc = currentSectionIllustrations[imageIndex];
                            return (
                              <div className="mt-4 rounded-lg overflow-hidden border border-[#cfd9f7] bg-[#f7f9ff]">
                                <img
                                  src={imgSrc}
                                  alt={`Section visual ${imageIndex + 1}`}
                                  className="w-full max-h-72 object-contain bg-white"
                                  loading="lazy"
                                />
                              </div>
                            );
                          }

                          const hasInlineHeading =
                            blocks.length > 1 &&
                            first.length < 100 &&
                            !first.includes('.') &&
                            !first.includes(':') &&
                            !first.startsWith('-');

                          const heading = hasInlineHeading ? first : null;
                          const mappedImage = getOverviewImageForCard(heading, hasInlineHeading ? rest : card);

                          return mappedImage ? (
                            <div className="mt-4 rounded-lg overflow-hidden border border-[#cfd9f7] bg-[#f7f9ff]">
                              <img
                                src={mappedImage}
                                alt={heading}
                                className="w-full max-h-[380px] object-contain bg-white"
                                loading="lazy"
                              />
                            </div>
                          ) : null;
                        })()}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Main Content Blocks */}
            {currentSection.id !== 'references' && (
            <div className="prose prose-lg max-w-none">
              {currentSection.contentBlocks && currentSection.contentBlocks.map((block) => (
                <div key={block.blockId} className="mb-8">
                  {block.type === 'narrative' && (
                    <div className="bg-[#f7eee0] border-l-4 border-[#decfb8] p-6 rounded-r-lg mb-6">
                      {block.htmlReady ? (
                        <div 
                          className="text-[#1b2542] leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : (
                        <p className="text-[#1b2542] whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {block.type === 'definition' && (
                    <div className="bg-[#f5ead8] border-l-4 border-[#decfb8] p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-[#3c2f1f] mb-2">{block.title}</h4>
                      {block.htmlReady ? (
                        <div 
                          className="text-[#1b2542]"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : (
                        <p className="text-[#1b2542]">{block.content}</p>
                      )}
                    </div>
                  )}

                  {block.type === 'definition_set' && (
                    <div className="bg-[#f5ead8] border-l-4 border-[#decfb8] p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-[#3c2f1f] mb-2">{block.title}</h4>
                      {block.htmlReady ? (
                        <div 
                          className="text-[#1b2542]"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : (
                        <p className="text-[#1b2542]">{block.content}</p>
                      )}
                    </div>
                  )}

                  {block.type === 'clinical_example' && (
                    <div className="bg-[#e9f8ff] border-l-4 border-[#b9e7ff] p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-[#14384b] mb-2">💡 Clinical Example: {block.title}</h4>
                      {block.htmlReady ? (
                        <div 
                          className="text-[#1b2542]"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : (
                        <p className="text-[#1b2542]">{block.description}</p>
                      )}
                    </div>
                  )}

                  {block.type === 'clinical_scenario' && (
                    <div className="bg-[#e9f8ff] border-l-4 border-[#b9e7ff] p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-[#14384b] mb-2">💡 Clinical Scenario: {block.title}</h4>
                      {block.htmlReady ? (
                        <div 
                          className="text-[#1b2542]"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : (
                        <p className="text-[#1b2542]">{block.description}</p>
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
                    <div className="bg-[#ffe9e9] border-l-4 border-[#ff8888] p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-[#c41e3a] mb-2">⚠️ Key Point: {block.title}</h4>
                      {block.htmlReady ? (
                        <div 
                          className="text-[#1b2542]"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : (
                        <p className="text-[#1b2542]">{block.content}</p>
                      )}
                    </div>
                  )}

                  {block.type === 'procedure' && (
                    <div className="bg-[#f3f6ff] border border-[#cfd9f7] p-6 rounded-lg mb-6">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      {block.steps && (
                        <ol className="space-y-3">
                          {block.steps.map((step, idx) => (
                            <li key={idx} className="flex gap-4 text-[#1b2542]">
                              <span className="font-bold text-white flex-shrink-0 w-6 h-6 flex items-center justify-center bg-[#39d0c8] rounded-full text-sm">
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
                    <div className="bg-[#f3f6ff] border border-[#cfd9f7] p-6 rounded-lg mb-6">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      {block.steps && (
                        <ol className="space-y-4">
                          {block.steps.map((step, idx) => (
                            <li key={idx} className="flex gap-4 text-[#1b2542]">
                              <span className="font-bold text-white flex-shrink-0 w-6 h-6 flex items-center justify-center bg-[#39d0c8] rounded-full text-sm">
                                {idx + 1}
                              </span>
                              <div className="flex-1">
                                {typeof step === 'string' ? (
                                  <p>{step}</p>
                                ) : (
                                  <div className="bg-white border border-[#cfd9f7] rounded p-3 space-y-1">
                                    {step.action && <p><strong>Action:</strong> {step.action}</p>}
                                    {step.tools && <p><strong>Tools:</strong> {Array.isArray(step.tools) ? step.tools.join(', ') : step.tools}</p>}
                                    {step.levels && <p><strong>Levels:</strong> {Array.isArray(step.levels) ? step.levels.join(' • ') : step.levels}</p>}
                                    {step.options && <p><strong>Options:</strong> {Array.isArray(step.options) ? step.options.join(' • ') : step.options}</p>}
                                    {step.approach && <p><strong>Approach:</strong> {step.approach}</p>}
                                    {step.include && <p><strong>Include:</strong> {step.include}</p>}
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  )}

                  {block.type === 'list' && (
                    <div className="my-6 p-6 bg-[#f3f6ff] rounded-lg">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      <ul className="space-y-2">
                        {block.items && block.items.map((item, idx) => (
                          <li key={idx} className="flex gap-3 text-[#1b2542]">
                            <span className="text-[#39d0c8] font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {block.type === 'table' && (
                    <div className="my-6 overflow-x-auto">
                      <table className="w-full border-collapse border border-[#cfd9f7]">
                        <tbody>
                          {block.rows && block.rows.map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-[#f3f6ff]' : 'bg-white'}>
                              {row.map((cell, cellIdx) => (
                                <td 
                                  key={cellIdx}
                                  className="border border-[#cfd9f7] p-3 text-[#1b2542]"
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
                    <blockquote className="border-l-4 border-[#39d0c8] pl-6 py-2 my-6 italic text-[#1b2542] bg-[#d9f5f1] p-6 rounded-r-lg">
                      "{block.content}"
                    </blockquote>
                  )}

                  {/* Timeline block */}
                  {block.type === 'timeline' && (
                    <div className="my-6 p-6 bg-[#eef3ff] rounded-lg border border-[#cfd9f7]">
                      <h4 className="font-bold text-[#1b2542] mb-6">{block.title}</h4>
                      <div className="space-y-4">
                        {block.events && block.events.map((event, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-4 h-4 bg-[#39d0c8] rounded-full" />
                              {idx < block.events.length - 1 && (
                                <div className="w-1 bg-[#cfd9f7] flex-grow mt-2 mb-2" style={{ minHeight: '60px' }} />
                              )}
                            </div>
                            <div className="pb-4">
                              <p className="font-bold text-[#1b2542]">{event.period}</p>
                              <p className="font-semibold text-[#1b2542]">{event.era}</p>
                              <p className="text-[#5b6a95]">{event.keyMilestone}</p>
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
                        <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      )}
                      {block.htmlReady ? (
                        <div 
                          className="text-[#1b2542]"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : null}
                    </div>
                  )}

                  {/* Reference Guide - Drug name patterns */}
                  {block.type === 'reference_guide' && (
                    <div className="my-6 p-6 bg-[#eaf0ff] rounded-lg border border-[#cfd9f7]">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      <div className="space-y-4">
                        {block.patterns && block.patterns.map((pattern, idx) => (
                          <div key={idx} className="bg-white p-4 rounded border border-[#cfd9f7]">
                            <p className="font-bold text-[#1b2542]">Ending: <span className="text-lg">{pattern.ending}</span></p>
                            <p className="text-[#1b2542] font-semibold">{pattern.class}</p>
                            <p className="text-[#5b6a95]"><strong>Examples:</strong> {pattern.examples}</p>
                            <p className="text-[#5b6a95]"><strong>Effect:</strong> {pattern.predictableEffect}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Taxonomy block */}
                  {block.type === 'taxonomy' && (
                    <div className="my-6 p-6 bg-[#fff5e6] rounded-lg border border-[#f0d9b5]">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      {block.categories ? (
                        <div className="space-y-4">
                          {block.categories.map((category, idx) => (
                            <div key={idx} className="bg-white p-4 rounded border border-[#f0d9b5]">
                              <p className="font-bold text-[#1b2542]">{category.name || category.category}</p>
                              {category.examples && <p className="text-[#5b6a95]">{category.examples}</p>}
                              {category.description && <p className="text-[#5b6a95]">{category.description}</p>}
                            </div>
                          ))}
                        </div>
                      ) : block.items ? (
                        <ul className="space-y-3">
                          {block.items.map((item, idx) => {
                            const itemTitle = typeof item === 'string' ? item : (item.name || item.title || `Item ${idx + 1}`);
                            const itemDesc = typeof item === 'object' ? (item.description || item.examples || '') : '';
                            return (
                              <li key={idx} className="bg-white rounded border border-[#f0d9b5] p-3 text-[#1b2542]">
                                <p className="font-semibold text-[#1b2542]">{itemTitle}</p>
                                {itemDesc && <p className="text-[#5b6a95] mt-1">{itemDesc}</p>}
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </div>
                  )}

                  {/* Calculation Method block */}
                  {block.type === 'calculation_method' && (
                    <div className="my-6 p-6 bg-[#e6f9f5] rounded-lg border border-[#b3e5d1]">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      {block.formula && (
                        <div className="bg-white p-4 rounded mb-4 border-2 border-[#39d0c8]">
                          <p className="text-sm text-[#5b6a95] font-semibold">Formula:</p>
                          <p className="text-lg font-mono font-bold text-[#1b2542]">{block.formula}</p>
                        </div>
                      )}
                      {block.components && (
                        <div className="bg-white p-4 rounded mb-4 border border-[#b3e5d1]">
                          <p className="font-semibold text-[#1b2542] mb-3">Components:</p>
                          <ul className="space-y-2">
                            {Object.entries(block.components).map(([key, value], idx) => (
                              <li key={idx} className="text-[#5b6a95]">
                                <strong className="text-[#1b2542]">{key.replace(/_/g, ' ')}:</strong> {value}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {block.examples && (
                        <div>
                          <p className="font-semibold text-[#1b2542] mb-3">Examples:</p>
                          <div className="space-y-3">
                            {block.examples.map((example, idx) => (
                              <div key={idx} className="bg-white p-4 rounded border border-[#b3e5d1]">
                                <p className="text-[#5b6a95]"><strong>Scenario:</strong> {example.scenario}</p>
                                <p className="text-[#5b6a95] font-mono"><strong>Calculation:</strong> {example.calculation}</p>
                                <p className="text-[#1b2542] font-bold"><strong>Answer:</strong> {example.answer}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Process Diagram / FDA Approval Phases */}
                  {block.type === 'process_diagram' && (
                    <div className="my-6 p-6 bg-[#e9f8ff] rounded-lg border border-[#cfd9f7]">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      <div className="space-y-3">
                        {block.phases && block.phases.map((phase, idx) => (
                          <div key={idx} className="bg-white p-4 rounded border border-[#cfd9f7]">
                            <p className="font-bold text-[#1b2542]">{phase.phase}</p>
                            <p className="text-[#5b6a95]"><strong>Description:</strong> {phase.description}</p>
                            {phase.volunteers && (
                              <p className="text-[#5b6a95]"><strong>Volunteers:</strong> {phase.volunteers}</p>
                            )}
                            {phase.successRate && (
                              <p className="text-[#5b6a95]"><strong>Success Rate:</strong> {phase.successRate}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Regulatory Agencies block */}
                  {block.type === 'regulatory_agencies' && (
                    <div className="my-6 p-6 bg-[#f3f6ff] rounded-lg border border-[#cfd9f7]">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      <div className="space-y-4">
                        {block.agencies && block.agencies.map((agency, idx) => (
                          <div key={idx} className="bg-white p-4 rounded border border-[#cfd9f7]">
                            <p className="font-bold text-[#1b2542]">{agency.name}</p>
                            <p className="text-[#5b6a95]"><strong>Role:</strong> {agency.role}</p>
                            <p className="text-[#5b6a95]"><strong>Authority:</strong> {agency.authority}</p>
                            <p className="text-[#5b6a95]"><strong>Nursing Action:</strong> {agency.nursingAction}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interaction Taxonomy */}
                  {block.type === 'interaction_taxonomy' && (
                    <div className="my-6 p-6 bg-[#ffe9e9] rounded-lg border border-[#f0c9c9]">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      {block.categories ? (
                        <div className="space-y-4">
                          {block.categories.map((category, idx) => (
                            <div key={idx} className="bg-white p-4 rounded border border-[#f0c9c9]">
                              <p className="font-bold text-[#1b2542]">{category.name}</p>
                              {category.examples && (
                                <p className="text-[#5b6a95]">{category.examples}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Regulatory Schedule (DEA Classifications) */}
                  {block.type === 'regulatory_schedule' && (
                    <div className="my-6 p-6 bg-[#ffe9e9] rounded-lg border border-[#ff8888]">
                      <h4 className="font-bold text-[#c41e3a] mb-4">{block.title}</h4>
                      <div className="space-y-3">
                        {block.schedules && block.schedules.map((schedule, idx) => (
                          <div key={idx} className="bg-white p-4 rounded border border-[#ffb3b3]">
                            <p className="font-bold text-[#c41e3a] text-lg">Schedule {schedule.schedule}</p>
                            <p className="text-[#5b6a95]"><strong>Description:</strong> {schedule.description}</p>
                            <p className="text-[#5b6a95]"><strong>Examples:</strong> {schedule.examples}</p>
                            <p className="text-[#5b6a95]"><strong>Nursing Role:</strong> {schedule.nursingRole}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dangerous Combinations Reference */}
                  {block.type === 'dangerous_combinations_reference' && (
                    <div className="my-6 p-6 bg-[#ffe9e9] rounded-lg border-2 border-[#ff8888]">
                      <h4 className="font-bold text-[#c41e3a] mb-4">⚠️ {block.title}</h4>
                      <div className="space-y-4">
                        {block.combinations && block.combinations.map((combo, idx) => (
                          <div key={idx} className="bg-white p-4 rounded border-l-4 border-[#ff8888]">
                            <p className="font-bold text-[#1b2542]">{combo.drugs}</p>
                            <p className="text-[#5b6a95]"><strong>Interaction:</strong> {combo.interaction}</p>
                            <p className="text-[#c41e3a] font-semibold"><strong>Risk:</strong> {combo.risk}</p>
                            <p className="text-[#5b6a95]"><strong>Nursing Action:</strong> {combo.nursingAction}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Glossary */}
                  {block.type === 'glossary' && (
                    <div className="my-6">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      <div className="grid gap-3">
                        {block.terms && block.terms.map((term, idx) => (
                          <details key={idx} className="bg-[#f3f6ff] p-4 rounded border border-[#cfd9f7] cursor-pointer hover:bg-[#e1eaff]">
                            <summary className="font-bold text-[#1b2542] cursor-pointer">
                              {term.term}
                            </summary>
                            <p className="text-[#1b2542] mt-3 ml-2">{term.definition}</p>
                          </details>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Practice Problems */}
                  {block.type === 'practice_problems' && (
                    <div className="my-6 p-6 bg-[#fffaf0] rounded-lg border border-[#f0d9b5]">
                      <h4 className="font-bold text-[#1b2542] mb-4">💪 {block.title}</h4>
                      <div className="space-y-4">
                        {block.problems && block.problems.map((problem, idx) => (
                          <details key={idx} className="bg-white p-4 rounded border border-[#f0d9b5] cursor-pointer">
                            <summary className="font-bold text-[#1b2542] cursor-pointer">
                              Problem {idx + 1}: {problem.scenario}
                            </summary>
                            <div className="mt-4 ml-2 space-y-2">
                              <p className="text-[#5b6a95]"><strong>Calculation:</strong> {problem.calculation}</p>
                              <p className="text-[#1b2542] font-bold"><strong>Answer:</strong> {problem.answer}</p>
                              {problem.explanation && (
                                <p className="text-[#5b6a95]"><strong>Why:</strong> {problem.explanation}</p>
                              )}
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Case Study */}
                  {block.type === 'case_study' && (
                    <div className="my-6 p-6 bg-[#eef3ff] rounded-lg border border-[#cfd9f7]">
                      <h4 className="font-bold text-[#1b2542] mb-4">📖 {block.title}</h4>
                      
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
                    <div className="my-6 p-6 bg-[#f3f6ff] rounded-lg border border-[#cfd9f7]">
                      <h4 className="font-bold text-[#1b2542] mb-4">❓ {block.title}</h4>
                      <div className="space-y-6">
                        {block.questions && block.questions.map((question, qIdx) => (
                          <details key={qIdx} className="bg-white p-4 rounded border border-[#cfd9f7] cursor-pointer">
                            <summary className="font-bold text-[#1b2542] cursor-pointer">
                              Question {qIdx + 1}: {question.question}
                            </summary>
                            <div className="mt-4 ml-2 space-y-3">
                              {question.options && (
                                Array.isArray(question.options)
                                  ? question.options.map((option, optIdx) => (
                                      <div key={optIdx} className="p-2 bg-[#f3f6ff] rounded">
                                        <p className="font-semibold text-[#1b2542]">{option.option}. {option.text}</p>
                                      </div>
                                    ))
                                  : Object.entries(question.options).map(([key, value]) => (
                                      <div key={key} className="p-2 bg-[#f3f6ff] rounded">
                                        <p className="font-semibold text-[#1b2542]">{key}. {value}</p>
                                      </div>
                                    ))
                              )}
                              {question.correctAnswer && (
                                <div className="mt-3 p-3 bg-[#e6f9f5] border border-[#b3e5d1] rounded">
                                  <p className="text-[#1b2542] font-bold">Correct Answer: {question.correctAnswer}</p>
                                  {(question.explanation || question.rationale) && (
                                    <p className="text-[#1b2542] mt-2">{question.explanation || question.rationale}</p>
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
                    <div className="bg-[#f7eee0] border-l-4 border-[#decfb8] p-6 rounded-r-lg mb-6">
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* narrative_summary */}
                  {block.type === 'narrative_summary' && (
                    <div className="bg-[#f7eee0] border-l-4 border-[#decfb8] p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-[#3c2f1f] mb-3">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* clinical_context */}
                  {block.type === 'clinical_context' && (
                    <div className="bg-[#e9f8ff] border-l-4 border-[#b9e7ff] p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-[#14384b] mb-2">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542]" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542]">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* clinical_examples (plural) */}
                  {block.type === 'clinical_examples' && (
                    <div className="bg-[#e9f8ff] border-l-4 border-[#b9e7ff] p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-[#14384b] mb-2">💡 Clinical Examples: {block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542]" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542]">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* detailed_content */}
                  {block.type === 'detailed_content' && (
                    <div className="my-6 p-6 bg-[#eef3ff] rounded-lg border border-[#cfd9f7]">
                      {block.title && (
                        <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      )}
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* historical_era */}
                  {block.type === 'historical_era' && (
                    <div className="my-6 p-6 bg-[#f7eee0] rounded-lg border border-[#decfb8]">
                      <h4 className="font-bold text-[#3c2f1f] mb-3">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* timeline_summary */}
                  {block.type === 'timeline_summary' && (
                    <div className="my-6 p-6 bg-[#f7eee0] rounded-lg border border-[#decfb8]">
                      <h4 className="font-bold text-[#3c2f1f] mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* classification_system */}
                  {block.type === 'classification_system' && (
                    <div className="my-6 p-6 bg-[#fff5e6] rounded-lg border border-[#f0d9b5]">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* process_timeline */}
                  {block.type === 'process_timeline' && (
                    <div className="my-6 p-6 bg-[#e9f8ff] rounded-lg border border-[#cfd9f7]">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* definition_comparison */}
                  {block.type === 'definition_comparison' && (
                    <div className="bg-[#f5ead8] border-l-4 border-[#decfb8] p-6 rounded-r-lg mb-6">
                      <h4 className="font-bold text-[#3c2f1f] mb-2">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542]" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* section_header */}
                  {block.type === 'section_header' && (
                    <div className="my-8 py-4 border-b-2 border-[#cfd9f7]">
                      <h3 className="text-2xl font-bold text-[#1b2542]">{block.title}</h3>
                      {block.content && (
                        <p className="text-[#5b6a95] mt-2 leading-relaxed">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* detailed_adme */}
                  {block.type === 'detailed_adme' && (
                    <div className="my-6 p-6 bg-[#eef3ff] rounded-lg border border-[#cfd9f7]">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* detailed_pd */}
                  {block.type === 'detailed_pd' && (
                    <div className="my-6 p-6 bg-[#ffe9f5] rounded-lg border border-[#ffc9e3]">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* interaction_types */}
                  {block.type === 'interaction_types' && (
                    <div className="my-6 p-6 bg-[#ffe9e9] rounded-lg border border-[#f0c9c9]">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* dangerous_combinations */}
                  {block.type === 'dangerous_combinations' && (
                    <div className="my-6 p-6 bg-[#ffe9e9] rounded-lg border-2 border-[#ff8888]">
                      <h4 className="font-bold text-[#c41e3a] mb-4">⚠️ {block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* complex_calculations */}
                  {block.type === 'complex_calculations' && (
                    <div className="my-6 p-6 bg-[#e6f9f5] rounded-lg border border-[#b3e5d1]">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* case_scenario (distinct from clinical_scenario) */}
                  {block.type === 'case_scenario' && (
                    <div className="my-6 p-6 bg-[#eef3ff] rounded-lg border border-[#cfd9f7]">
                      <h4 className="font-bold text-[#1b2542] mb-3">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* clinical_assessment */}
                  {block.type === 'clinical_assessment' && (
                    <div className="my-6 p-6 bg-[#eef3ff] rounded-lg border border-[#cfd9f7]">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* decision_point */}
                  {block.type === 'decision_point' && (
                    <div className="my-6 p-6 bg-[#fff5e6] rounded-lg border-l-4 border-[#f0d9b5]">
                      <h4 className="font-bold text-[#1b2542] mb-3">{block.title}</h4>
                      {block.prompt && (
                        <p className="text-[#5b6a95] mb-4 italic">{block.prompt}</p>
                      )}
                      {block.options && (
                        <div className="space-y-3 mb-4">
                          {block.options.map((opt, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border border-[#f0d9b5]">
                              <p className="font-semibold text-[#1b2542]">{opt.option}. {opt.text}</p>
                              {opt.feedback && (
                                <p className="text-sm text-[#5b6a95] mt-1 italic">{opt.feedback}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {block.correctAnswer && (
                        <div className="bg-[#e6f9f5] p-3 rounded border border-[#b3e5d1]">
                          <p className="font-bold text-[#1b2542]">✓ Correct Answer: {block.correctAnswer}</p>
                          {block.clinicalReasoning && (
                            <p className="text-[#1b2542] mt-2">{block.clinicalReasoning}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* learning_summary */}
                  {block.type === 'learning_summary' && (
                    <div className="my-6 p-6 bg-[#d9f5f1] rounded-lg border border-[#b3e5d1]">
                      <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* clinical_outcome */}
                  {block.type === 'clinical_outcome' && (
                    <div className="my-6 p-6 bg-[#e6f9f5] rounded-lg border border-[#b3e5d1]">
                      <h4 className="font-bold text-[#1b2542] mb-3">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] leading-relaxed">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* assessment_question */}
                  {block.type === 'assessment_question' && (
                    <details className="my-6 p-6 bg-[#f3f6ff] rounded-lg border border-[#cfd9f7] cursor-pointer">
                      <summary className="font-bold text-[#1b2542] text-lg cursor-pointer">
                        {block.title}
                      </summary>
                      <div className="mt-4 space-y-3">
                        {block.options && block.options.map((option, optIdx) => (
                          <div key={optIdx} className="p-3 bg-white rounded border border-[#cfd9f7]">
                            <p className="font-semibold text-[#1b2542]">{option} {block.options[optIdx] ? `- ${block.options[optIdx]}` : ''}</p>
                          </div>
                        ))}
                        {block.correctAnswer && (
                          <div className="mt-4 p-4 bg-[#e6f9f5] border border-[#b3e5d1] rounded">
                            <p className="text-[#1b2542] font-bold">✓ Answer: {block.correctAnswer}</p>
                            {block.explanation && (
                              <p className="text-[#1b2542] mt-2">{block.explanation}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </details>
                  )}

                  {/* short_answer */}
                  {block.type === 'short_answer' && (
                    <div className="my-6 p-6 bg-[#fffaf0] rounded-lg border border-[#f0d9b5]">
                      <h4 className="font-bold text-[#1b2542] mb-3">{block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* case_based */}
                  {block.type === 'case_based' && (
                    <div className="my-6 p-6 bg-[#eef3ff] rounded-lg border-2 border-[#cfd9f7]">
                      <h4 className="font-bold text-[#1b2542] mb-4">📋 {block.title}</h4>
                      {block.htmlReady ? (
                        <div className="text-[#1b2542] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                      ) : (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      )}
                    </div>
                  )}

                  {/* Interactive Diagram / Description blocks */}
                  {(block.type === 'interactive_diagram' || block.type === 'detailed_section' || block.type === 'safety_guide' || block.type === 'verification_checklist') && (
                    <div className="my-6 p-6 bg-[#eef3ff] rounded-lg border border-[#cfd9f7]">
                      {block.title && (
                        <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      )}
                      {block.htmlReady ? (
                        <div 
                          className="text-[#1b2542] leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : block.description ? (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">{block.description}</p>
                      ) : block.content ? (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">{block.content}</p>
                      ) : (
                        <p className="text-[#5b6a95] italic">Content not available</p>
                      )}
                    </div>
                  )}

                  {/* Generic handler for htmlReady blocks (comparison_table, detailed_section, etc.) */}
                  {['comparison_table', 'definition_set', 'clinical_scenario', 'detailed_section'].includes(block.type) && block.htmlReady && block.type !== 'comparison_table' && (
                    <div className="my-6">
                      {block.title && (
                        <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      )}
                      <div 
                        className="text-[#1b2542] leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                      />
                    </div>
                  )}

                  {/* Fallback for any other block types */}
                  {!['narrative', 'narrative_introduction', 'narrative_summary', 'definition', 'definition_set', 'definition_comparison', 'clinical_example', 'clinical_examples', 'clinical_context', 'clinical_scenario', 'clinical_assessment', 'clinical_outcome', 'key_point', 'procedure', 'list', 'table', 'quote', 'timeline', 'timeline_summary', 'comparison_table', 'reference_guide', 'taxonomy', 'calculation_method', 'complex_calculations', 'process_diagram', 'process_timeline', 'regulatory_agencies', 'regulatory_schedule', 'interaction_taxonomy', 'interaction_types', 'clinical_process', 'detailed_section', 'detailed_content', 'detailed_adme', 'detailed_pd', 'interactive_diagram', 'dangerous_combinations_reference', 'dangerous_combinations', 'practice_problems', 'glossary', 'case_study', 'case_scenario', 'case_based', 'assessment_section', 'assessment_question', 'safety_guide', 'verification_checklist', 'historical_era', 'classification_system', 'section_header', 'decision_point', 'learning_summary', 'short_answer'].includes(block.type) && (
                    <div className="my-6 p-6 bg-[#f3f6ff] rounded-lg border border-[#cfd9f7]">
                      {block.title && (
                        <h4 className="font-bold text-[#1b2542] mb-4">{block.title}</h4>
                      )}
                      {block.htmlReady ? (
                        <div 
                          className="text-[#1b2542] leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: block.htmlReady }}
                        />
                      ) : block.content ? (
                        <p className="text-[#1b2542] leading-relaxed whitespace-pre-wrap">
                          {block.content}
                        </p>
                      ) : block.description ? (
                        <p className="text-[#1b2542] leading-relaxed">
                          {block.description}
                        </p>
                      ) : (
                        <p className="text-[#5b6a95] italic">Block content not available</p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Key Takeaways */}
              {currentSection.keyTakeaways && currentSection.keyTakeaways.length > 0 && (
                <div className="bg-[#d9f5f1] border border-[#b3e5d1] rounded-lg p-6 my-8">
                  <h3 className="font-bold text-[#1b2542] mb-4">📌 Key Takeaways</h3>
                  <ul className="space-y-3">
                    {currentSection.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex gap-3 text-[#1b2542]">
                        <span className="text-[#39d0c8] font-bold">✓</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-12 pt-8 border-t border-[#cfd9f7]">
              <button
                onClick={() => handleSectionClick(Math.max(0, activeSection - 1))}
                disabled={activeSection === 0}
                className="flex-1 px-6 py-3 bg-[#f3f6ff] text-[#1b2542] rounded-lg hover:bg-[#e1eaff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold border border-[#cfd9f7]"
              >
                ← Previous Section
              </button>
              <button
                onClick={() => handleSectionClick(Math.min(sections.length - 1, activeSection + 1))}
                disabled={activeSection === sections.length - 1}
                className="flex-1 px-6 py-3 bg-[#39d0c8] text-white rounded-lg hover:bg-[#2fb8ad] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
              >
                Next Section →
              </button>
            </div>

            {/* Section Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center p-6 bg-[#f3f6ff] rounded-lg border border-[#cfd9f7]">
              <div>
                <p className="text-2xl font-bold text-[#39d0c8]">
                  {activeSection + 1}/{sections.length}
                </p>
                <p className="text-sm text-[#5b6a95]">Sections</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1b2542]">
                  {progressPercentage}%
                </p>
                <p className="text-sm text-[#5b6a95]">Completion</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#39d0c8]">
                  {formatTime(timeSpent)}
                </p>
                <p className="text-sm text-[#5b6a95]">Time Spent</p>
              </div>
            </div>

            {/* Study Materials */}
            <div className="mt-12 pt-8 border-t border-[#cfd9f7]">
              <h3 className="text-2xl font-bold text-[#1b2542] mb-6">📚 Study Materials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => setCurrentViewMode('flashcards')}
                  className="p-6 bg-gradient-to-br from-[#e9f8ff] to-[#d9f5f1] border-2 border-[#b9e7ff] rounded-lg hover:from-[#d9f5f1] hover:to-[#c9eceb] transition-all text-left"
                >
                  <BookOpen className="text-[#39d0c8] mb-3" size={28} />
                  <h4 className="font-bold text-[#1b2542] text-lg mb-1">Flashcards</h4>
                  <p className="text-sm text-[#5b6a95]">Study all 60 flashcards with interactive features</p>
                </button>
                <button
                  onClick={() => setCurrentViewMode('quiz')}
                  className="p-6 bg-gradient-to-br from-[#ffe9e9] to-[#ffd6d6] border-2 border-[#ffb3b3] rounded-lg hover:from-[#ffd6d6] hover:to-[#ffc3c3] transition-all text-left"
                >
                  <HelpCircle className="text-[#c41e3a] mb-3" size={28} />
                  <h4 className="font-bold text-[#1b2542] text-lg mb-1">Quiz</h4>
                  <p className="text-sm text-[#5b6a95]">Test your knowledge with 8 practice questions</p>
                </button>
                <button
                  onClick={() => setCurrentViewMode('cases')}
                  className="p-6 bg-gradient-to-br from-[#e9f8ff] to-[#d9f0ff] border-2 border-[#b9e7ff] rounded-lg hover:from-[#d9f0ff] hover:to-[#c9e8ff] transition-all text-left"
                >
                  <BookOpen className="text-[#39d0c8] mb-3" size={28} />
                  <h4 className="font-bold text-[#1b2542] text-lg mb-1">Case Studies</h4>
                  <p className="text-sm text-[#5b6a95]">Work through 7 realistic clinical scenarios</p>
                </button>
                <button
                  onClick={() => setCurrentViewMode('outcomes')}
                  className="p-6 bg-gradient-to-br from-[#f5ead8] to-[#f0d9b5] border-2 border-[#e0c9a0] rounded-lg hover:from-[#f0d9b5] hover:to-[#e5cfa0] transition-all text-left"
                >
                  <BookOpen className="text-[#1b2542] mb-3" size={28} />
                  <h4 className="font-bold text-[#1b2542] text-lg mb-1">Learning Outcomes</h4>
                  <p className="text-sm text-[#5b6a95]">Master all 9 learning objectives</p>
                </button>
                <button
                  onClick={() => setCurrentViewMode('problems')}
                  className="p-6 bg-gradient-to-br from-[#fffaf0] to-[#fff5e6] border-2 border-[#f0d9b5] rounded-lg hover:from-[#fff5e6] hover:to-[#ffead0] transition-all text-left"
                >
                  <BookOpen className="text-[#1b2542] mb-3" size={28} />
                  <h4 className="font-bold text-[#1b2542] text-lg mb-1">Practice Problems</h4>
                  <p className="text-sm text-[#5b6a95]">Complete 10 dosage calculation problems</p>
                </button>
                <button
                  onClick={() => navigate(`/chapter/${chapterId}/hub`)}
                  className="p-6 bg-gradient-to-br from-[#e9f8ff] to-[#d9f5f1] border-2 border-[#b9e7ff] rounded-lg hover:from-[#d9f5f1] hover:to-[#c9eceb] transition-all text-left"
                >
                  <BookOpen className="text-[#39d0c8] mb-3" size={28} />
                  <h4 className="font-bold text-[#1b2542] text-lg mb-1">Complete Hub</h4>
                  <p className="text-sm text-[#5b6a95]">All materials + progress tracking</p>
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
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#39d0c8] hover:bg-[#2fb8ad] rounded-full flex items-center justify-center shadow-lg z-30 text-white transition-all"
        >
          <Search size={24} />
        </button>
      )}
    </div>
    </>
  );
};

export default ChapterReader;
