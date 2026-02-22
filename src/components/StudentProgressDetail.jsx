import React, { useState } from 'react';
import { ArrowLeft, Download, MessageCircle, TrendingUp } from 'lucide-react';

export const StudentProgressDetail = ({ student, onBack }) => {
  const [activeTab, setActiveTab] = useState('chapters');

  const completedChapters = student.chapters.filter(c => c.completed).length;
  const averageQuizScore = student.chapters
    .filter(c => c.completed)
    .reduce((sum, c) => sum + c.quizScore, 0) / completedChapters || 0;

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'from-emerald-500 to-emerald-600';
    if (grade >= 80) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getStatusColor = (grade) => {
    if (grade >= 90) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (grade >= 80) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Back to Students
        </button>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm">
            <MessageCircle size={16} />
            Message
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors text-sm">
            <Download size={16} />
            Download Report
          </button>
        </div>
      </div>

      {/* Student Info Card */}
      <div className={`bg-gradient-to-r ${getGradeColor(student.currentGrade)} rounded-lg p-8 text-white`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-white text-opacity-80 text-sm font-medium">Student Name</p>
            <p className="text-2xl font-bold">{student.name}</p>
          </div>
          <div>
            <p className="text-white text-opacity-80 text-sm font-medium">Email</p>
            <p className="text-lg font-semibold">{student.email}</p>
          </div>
          <div>
            <p className="text-white text-opacity-80 text-sm font-medium">Enrollment Date</p>
            <p className="text-lg font-semibold">{student.enrollmentDate}</p>
          </div>
          <div>
            <p className="text-white text-opacity-80 text-sm font-medium">Current Grade</p>
            <p className="text-3xl font-bold">{student.currentGrade}%</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Chapters Completed"
          value={`${completedChapters}/${student.chapters.length}`}
          subtext={`${Math.round((completedChapters / student.chapters.length) * 100)}%`}
          icon="📚"
        />
        <StatCard
          label="Average Quiz Score"
          value={`${Math.round(averageQuizScore)}%`}
          subtext={completedChapters > 0 ? 'Based on completed chapters' : 'No quizzes completed'}
          icon="✅"
        />
        <StatCard
          label="Flashcard Score"
          value={`${student.flashcardScore}%`}
          subtext="Practice performance"
          icon="🎯"
        />
        <StatCard
          label="Total Time Spent"
          value={`${student.chapters.reduce((sum, c) => sum + c.timeSpent, 0)} min`}
          subtext="Across all chapters"
          icon="⏱️"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {[
            { id: 'chapters', label: 'Chapter Progress' },
            { id: 'quizzes', label: 'Quiz Scores' },
            { id: 'activity', label: 'Learning Activity' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-cyan-600 border-cyan-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'chapters' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Chapter-by-Chapter Progress</h3>
            {student.chapters.map((chapter) => (
              <div key={chapter.id} className={`border rounded-lg p-4 ${chapter.completed ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">Chapter {chapter.number}: {chapter.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Status: {chapter.completed ? '✅ Completed' : '⏳ In Progress'}
                    </p>
                  </div>
                  <div className="text-right">
                    {chapter.completed && (
                      <>
                        <p className="text-2xl font-bold text-emerald-600">{chapter.quizScore}%</p>
                        <p className="text-xs text-gray-600">Quiz Score</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Reading Progress</p>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${chapter.completed ? 'bg-emerald-500' : 'bg-cyan-500'}`}
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">100% read</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Time Spent</p>
                    <p className="text-xl font-bold text-gray-900">{chapter.timeSpent}</p>
                    <p className="text-xs text-gray-600">minutes</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quiz Performance</h3>
            <div className="space-y-3">
              {student.chapters.map(chapter => (
                <div key={chapter.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">Chapter {chapter.number}: {chapter.title}</p>
                    <p className="text-sm text-gray-600">Quiz Assessment</p>
                  </div>
                  <div className="text-right">
                    {chapter.completed ? (
                      <>
                        <p className="text-2xl font-bold text-emerald-600">{chapter.quizScore}%</p>
                        <p className="text-xs text-gray-600">Passed</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg text-gray-400">—</p>
                        <p className="text-xs text-gray-600">Not taken</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <p className="text-sm font-medium text-cyan-900">📊 Class Average: 84%</p>
              <p className="text-xs text-cyan-700 mt-1">
                {student.currentGrade >= 84 ? 'This student is performing above average' : 'This student is performing below class average'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Learning Activity & Engagement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-3">📚 Reading Engagement</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reading Position</span>
                    <span className="font-semibold">{student.readingPosition}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-cyan-500 h-2 rounded-full"
                      style={{ width: `${student.readingPosition}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-3">🎯 Flashcard Practice</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Practice Score</span>
                    <span className="font-semibold">{student.flashcardScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${student.flashcardScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-900 mb-2">💡 Recommendations</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Student is showing consistent engagement</li>
                <li>✓ Quiz performance indicates solid understanding</li>
                {student.currentGrade < 80 && <li>⚠ Consider providing additional support materials</li>}
                {student.flashcardScore < 70 && <li>⚠ Encourage more flashcard practice</li>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, subtext, icon }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-xs text-gray-600 mt-1">{subtext}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};
