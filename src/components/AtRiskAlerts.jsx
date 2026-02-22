import React, { useState, useMemo } from 'react';
import { AlertTriangle, MessageSquare, Send, Book, TrendingDown } from 'lucide-react';

export const AtRiskAlerts = ({ students }) => {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedReason, setSelectedReason] = useState('all');

  const atRiskStudents = useMemo(() => {
    return students
      .filter(s => s.currentGrade < 80)
      .map(student => {
        let reasons = [];
        
        if (student.currentGrade < 70) {
          reasons.push('critical_grade');
        } else if (student.currentGrade < 80) {
          reasons.push('low_grade');
        }

        const incompletedChapters = student.chapters.filter(c => !c.completed).length;
        if (incompletedChapters >= 2) {
          reasons.push('incomplete_chapters');
        }

        const lowQuizzes = student.chapters.filter(c => c.completed && c.quizScore < 75).length;
        if (lowQuizzes > 0) {
          reasons.push('low_quiz_scores');
        }

        const daysSinceActive = Math.floor(
          (new Date() - new Date(student.lastActive)) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceActive > 5) {
          reasons.push('low_engagement');
        }

        return {
          ...student,
          reasons,
          severity: student.currentGrade < 70 ? 'critical' : student.currentGrade < 75 ? 'high' : 'medium',
          lastActiveDay: daysSinceActive,
        };
      })
      .filter(s => {
        if (severityFilter !== 'all' && s.severity !== severityFilter) return false;
        if (selectedReason !== 'all' && !s.reasons.includes(selectedReason)) return false;
        return true;
      })
      .sort((a, b) => b.currentGrade - a.currentGrade);
  }, [students, severityFilter, selectedReason]);

  const reasonLabels = {
    critical_grade: 'Critical Grade (<70%)',
    low_grade: 'Low Grade (70-79%)',
    incomplete_chapters: 'Incomplete Chapters',
    low_quiz_scores: 'Low Quiz Scores',
    low_engagement: 'Low Engagement',
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'from-red-500 to-red-600';
      case 'high':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-yellow-500 to-yellow-600';
    }
  };

  const getSeverityBadgeColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getSeverityColor('critical')} rounded-lg p-6 text-white`}>
        <div className="flex items-center gap-4">
          <AlertTriangle size={32} />
          <div>
            <h2 className="text-3xl font-bold mb-2">At-Risk Students</h2>
            <p className="text-red-100">{atRiskStudents.length} students need attention</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        >
          <option value="all">All Severity Levels</option>
          <option value="critical">Critical (&lt;70%)</option>
          <option value="high">High (70-79%)</option>
          <option value="medium">Medium (80-89%)</option>
        </select>

        <select
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        >
          <option value="all">All Reasons</option>
          <option value="critical_grade">Critical Grade</option>
          <option value="low_grade">Low Grade</option>
          <option value="incomplete_chapters">Incomplete Chapters</option>
          <option value="low_quiz_scores">Low Quiz Scores</option>
          <option value="low_engagement">Low Engagement</option>
        </select>
      </div>

      {/* At-Risk Students List */}
      <div className="grid grid-cols-1 gap-4">
        {atRiskStudents.length > 0 ? (
          atRiskStudents.map((student) => (
            <div key={student.id} className={`border rounded-lg p-6 ${getSeverityBadgeColor(student.severity)} border`}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-4">
                {/* Student Info */}
                <div className="lg:col-span-1">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Student</p>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                  <div className="mt-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getSeverityBadgeColor(student.severity)}`}>
                      {student.severity.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Grade & Progress */}
                <div className="lg:col-span-1">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Current Grade</p>
                  <p className="text-3xl font-bold text-red-600 mb-2">{student.currentGrade}%</p>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Progress</p>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{student.progress}% complete</p>
                  </div>
                </div>

                {/* Issues */}
                <div className="lg:col-span-1">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Issues</p>
                  <div className="space-y-1">
                    {student.reasons.map((reason) => (
                      <div key={reason} className="flex items-start gap-2">
                        <span className="text-red-600 font-bold mt-0.5">⚠</span>
                        <p className="text-sm font-medium text-gray-700">{reasonLabels[reason]}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:col-span-1 flex flex-col gap-2 justify-center">
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm">
                    <MessageSquare size={16} />
                    Message
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors text-sm">
                    <Send size={16} />
                    Send Reminder
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors text-sm">
                    <Book size={16} />
                    Tutoring
                  </button>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="mt-4 pt-4 border-t border-gray-300 border-opacity-50">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Detailed Breakdown</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Chapters Completed</p>
                    <p className="text-lg font-bold text-gray-900">
                      {student.chapters.filter(c => c.completed).length}/{student.chapters.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Avg Quiz Score</p>
                    <p className="text-lg font-bold text-gray-900">
                      {student.chapters.filter(c => c.completed).length > 0
                        ? Math.round(
                            student.chapters
                              .filter(c => c.completed)
                              .reduce((sum, c) => sum + c.quizScore, 0) /
                              student.chapters.filter(c => c.completed).length
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Last Active</p>
                    <p className="text-lg font-bold text-gray-900">{student.lastActiveDay}d ago</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Flashcard Score</p>
                    <p className="text-lg font-bold text-gray-900">{student.flashcardScore}%</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-lg font-semibold text-gray-900 mb-2">No At-Risk Students</p>
            <p className="text-gray-600">All students are performing at or above 80%. Great job!</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {atRiskStudents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 rounded-lg border border-red-200 p-4">
            <p className="text-sm font-medium text-red-700">Critical Risk</p>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {atRiskStudents.filter(s => s.severity === 'critical').length}
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg border border-orange-200 p-4">
            <p className="text-sm font-medium text-orange-700">High Risk</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {atRiskStudents.filter(s => s.severity === 'high').length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
            <p className="text-sm font-medium text-yellow-700">Medium Risk</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
              {atRiskStudents.filter(s => s.severity === 'medium').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
