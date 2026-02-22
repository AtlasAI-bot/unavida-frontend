import React, { useState } from 'react';
import { Download, Printer, BarChart3 } from 'lucide-react';

export const InstructorReports = ({ students }) => {
  const [reportType, setReportType] = useState('overview');

  const calculateMetrics = () => {
    const totalStudents = students.length;
    const avgGrade = Math.round(students.reduce((sum, s) => sum + s.currentGrade, 0) / totalStudents);
    
    // Chapter completion rates
    const chapterCompletionRates = [1, 2, 3, 4].map(chNum => {
      const completed = students.filter(s =>
        s.chapters.find(c => c.number === chNum && c.completed)
      ).length;
      return {
        chapter: chNum,
        rate: Math.round((completed / totalStudents) * 100),
        completed,
        total: totalStudents
      };
    });

    // Average quiz scores by chapter
    const avgQuizScores = [1, 2, 3, 4].map(chNum => {
      const scores = students
        .flatMap(s => s.chapters.filter(c => c.number === chNum && c.completed).map(c => c.quizScore));
      const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : 0;
      return {
        chapter: chNum,
        avgScore: avg,
        studentCount: scores.length
      };
    });

    const avgEngagementScore = Math.round(
      students.reduce((sum, s) => sum + s.flashcardScore, 0) / totalStudents
    );

    const mostCompletedChapter = chapterCompletionRates.reduce((max, current) =>
      current.rate > max.rate ? current : max
    );

    const leastCompletedChapter = chapterCompletionRates.reduce((min, current) =>
      current.rate < min.rate ? current : min
    );

    return {
      totalStudents,
      avgGrade,
      chapterCompletionRates,
      avgQuizScores,
      avgEngagementScore,
      mostCompletedChapter,
      leastCompletedChapter,
    };
  };

  const metrics = calculateMetrics();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('PDF download feature coming soon!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Class Reports</h2>
            <p className="text-cyan-100">Analytics and insights for your class</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg font-medium transition-all"
            >
              <Printer size={20} />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg font-medium transition-all"
            >
              <Download size={20} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'progress', label: '📈 Progress' },
          { id: 'quizzes', label: '✅ Quizzes' },
          { id: 'engagement', label: '🎯 Engagement' },
        ].map(type => (
          <button
            key={type.id}
            onClick={() => setReportType(type.id)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              reportType === type.id
                ? 'text-cyan-600 border-cyan-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Overview Report */}
      {reportType === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              label="Total Students"
              value={metrics.totalStudents}
              trend="+2 this week"
              trendColor="green"
              icon="👥"
            />
            <MetricCard
              label="Class Average Grade"
              value={`${metrics.avgGrade}%`}
              trend={metrics.avgGrade >= 85 ? 'Excellent performance' : 'Room for improvement'}
              trendColor={metrics.avgGrade >= 85 ? 'green' : 'orange'}
              icon="📊"
            />
            <MetricCard
              label="Engagement Score"
              value={`${metrics.avgEngagementScore}%`}
              trend="Flashcard practice"
              trendColor="blue"
              icon="🎯"
            />
            <MetricCard
              label="Completion Rate"
              value={`${Math.round((metrics.chapterCompletionRates[0].rate + metrics.chapterCompletionRates[1].rate) / 2)}%`}
              trend="First 2 chapters"
              trendColor="green"
              icon="✅"
            />
          </div>

          {/* Chapter Completion Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Chapter Completion Rates</h3>
              <div className="space-y-4">
                {metrics.chapterCompletionRates.map(ch => (
                  <div key={ch.chapter}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Chapter {ch.chapter}</span>
                      <span className="text-sm font-bold text-gray-900">
                        {ch.rate}% ({ch.completed}/{ch.total})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full transition-all"
                        style={{ width: `${ch.rate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <p className="text-sm font-medium text-cyan-900">
                  📌 Most Completed: Chapter {metrics.mostCompletedChapter.chapter} ({metrics.mostCompletedChapter.rate}%)
                </p>
                <p className="text-sm font-medium text-cyan-900 mt-1">
                  📌 Least Completed: Chapter {metrics.leastCompletedChapter.chapter} ({metrics.leastCompletedChapter.rate}%)
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Grade Distribution</h3>
              <div className="space-y-4">
                {[
                  { range: 'A (90-100%)', count: students.filter(s => s.currentGrade >= 90).length, color: 'from-emerald-500 to-emerald-600' },
                  { range: 'B (80-89%)', count: students.filter(s => s.currentGrade >= 80 && s.currentGrade < 90).length, color: 'from-yellow-500 to-yellow-600' },
                  { range: 'C (70-79%)', count: students.filter(s => s.currentGrade >= 70 && s.currentGrade < 80).length, color: 'from-orange-500 to-orange-600' },
                  { range: 'D (<70%)', count: students.filter(s => s.currentGrade < 70).length, color: 'from-red-500 to-red-600' },
                ].map(grade => (
                  <div key={grade.range}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{grade.range}</span>
                      <span className="text-sm font-bold text-gray-900">{grade.count} students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`bg-gradient-to-r ${grade.color} h-3 rounded-full transition-all`}
                        style={{ width: `${(grade.count / metrics.totalStudents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Report */}
      {reportType === 'progress' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Student Progress Summary</h3>
            <div className="space-y-4">
              {students.slice(0, 10).map(student => (
                <div key={student.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-gray-600">{student.progress}% complete</span>
                      <span className="text-xs text-gray-600">Grade: {student.currentGrade}%</span>
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              {students.length > 10 && (
                <p className="text-center text-gray-600 text-sm py-2">
                  ... and {students.length - 10} more students
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quizzes Report */}
      {reportType === 'quizzes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Average Quiz Scores by Chapter</h3>
              <div className="space-y-4">
                {metrics.avgQuizScores.map(quiz => (
                  <div key={quiz.chapter}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Chapter {quiz.chapter}
                        <span className="text-xs text-gray-500 ml-2">({quiz.studentCount} completed)</span>
                      </span>
                      <span className="text-sm font-bold text-gray-900">{quiz.avgScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          quiz.avgScore >= 85
                            ? 'bg-emerald-500'
                            : quiz.avgScore >= 75
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${quiz.avgScore}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quiz Completion Analysis</h3>
              <div className="space-y-3">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="font-semibold text-emerald-900">✅ Strong Performance</p>
                  <p className="text-sm text-emerald-800 mt-1">Chapters 1-2 show excellent quiz performance</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="font-semibold text-yellow-900">⚠️ Attention Needed</p>
                  <p className="text-sm text-yellow-800 mt-1">Chapter 3-4 completion rates need improvement</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-semibold text-blue-900">💡 Recommendation</p>
                  <p className="text-sm text-blue-800 mt-1">Consider additional resources for Chapters 3-4</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Engagement Report */}
      {reportType === 'engagement' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Student Engagement Levels</h3>
              <div className="space-y-3">
                {[
                  { level: 'Highly Engaged (80%+)', count: students.filter(s => s.flashcardScore >= 80).length, color: 'from-emerald-500 to-emerald-600' },
                  { level: 'Moderately Engaged (60-79%)', count: students.filter(s => s.flashcardScore >= 60 && s.flashcardScore < 80).length, color: 'from-yellow-500 to-yellow-600' },
                  { level: 'Low Engagement (<60%)', count: students.filter(s => s.flashcardScore < 60).length, color: 'from-red-500 to-red-600' },
                ].map(level => (
                  <div key={level.level}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{level.level}</span>
                      <span className="text-sm font-bold text-gray-900">{level.count} students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`bg-gradient-to-r ${level.color} h-3 rounded-full transition-all`}
                        style={{ width: `${(level.count / metrics.totalStudents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Time Spent Analysis</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Average Time per Student</p>
                  <p className="text-2xl font-bold text-blue-900 mt-2">
                    {Math.round(students.reduce((sum, s) => sum + s.chapters.reduce((s2, c) => s2 + c.timeSpent, 0), 0) / metrics.totalStudents)} min
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Total Class Hours</p>
                  <p className="text-2xl font-bold text-purple-900 mt-2">
                    {Math.round(students.reduce((sum, s) => sum + s.chapters.reduce((s2, c) => s2 + c.timeSpent, 0), 0) / 60)} hrs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .hidden, button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

const MetricCard = ({ label, value, trend, trendColor, icon }) => {
  const trendColorMap = {
    green: 'text-emerald-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className={`text-xs font-medium mt-2 ${trendColorMap[trendColor]}`}>
            {trend}
          </p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};
