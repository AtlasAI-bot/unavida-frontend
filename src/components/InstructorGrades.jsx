import React, { useState, useMemo } from 'react';
import { Download, Filter } from 'lucide-react';

export const InstructorGrades = ({ students }) => {
  const [sortBy, setSortBy] = useState('name');
  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false);

  const sortedStudents = useMemo(() => {
    let sorted = [...students];
    
    if (sortBy === 'grade') {
      sorted.sort((a, b) => b.currentGrade - a.currentGrade);
    } else {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (showOnlyIncomplete) {
      sorted = sorted.filter(s => s.currentGrade < 90);
    }

    return sorted;
  }, [students, sortBy, showOnlyIncomplete]);

  const calculateStats = () => {
    const allGrades = students.flatMap(s => s.chapters.map(c => c.quizScore).filter(score => score > 0));
    const classAverage = allGrades.length > 0 ? Math.round(allGrades.reduce((a, b) => a + b) / allGrades.length) : 0;
    const highest = Math.max(...students.map(s => s.currentGrade));
    const lowest = Math.min(...students.map(s => s.currentGrade));

    return { classAverage, highest, lowest };
  };

  const stats = calculateStats();

  const handleExportCSV = () => {
    let csv = 'Student Name,Email,Current Grade,Chapter 1 Quiz,Chapter 2 Quiz,Chapter 3 Quiz,Chapter 4 Quiz,Progress %\n';
    
    students.forEach(student => {
      const chapterScores = student.chapters.map(c => c.completed ? c.quizScore : '-').join(',');
      csv += `${student.name},${student.email},${student.currentGrade}%,${chapterScores},${student.progress}%\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instructor_grades_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Grades & Assessments</h2>
        <p className="text-cyan-100">View and manage student grades across all chapters</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm font-medium">Class Average</p>
          <p className="text-4xl font-bold text-cyan-600 mt-2">{stats.classAverage}%</p>
          <p className="text-xs text-gray-600 mt-2">Across all quizzes</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm font-medium">Highest Grade</p>
          <p className="text-4xl font-bold text-emerald-600 mt-2">{stats.highest}%</p>
          <p className="text-xs text-gray-600 mt-2">Top performer</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm font-medium">Lowest Grade</p>
          <p className="text-4xl font-bold text-red-600 mt-2">{stats.lowest}%</p>
          <p className="text-xs text-gray-600 mt-2">Needs support</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          >
            <option value="name">Sort: Name</option>
            <option value="grade">Sort: Grade</option>
          </select>

          <button
            onClick={() => setShowOnlyIncomplete(!showOnlyIncomplete)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              showOnlyIncomplete
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            <Filter size={16} />
            Below 90%
          </button>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
        >
          <Download size={20} />
          Export to CSV
        </button>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-gray-50 z-10">Student Name</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Current Grade</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Ch1 Quiz</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Ch2 Quiz</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Ch3 Quiz</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Ch4 Quiz</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Average Quiz</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Flashcard</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student) => {
                const quizScores = student.chapters
                  .filter(c => c.completed)
                  .map(c => c.quizScore);
                const avgQuiz = quizScores.length > 0 
                  ? Math.round(quizScores.reduce((a, b) => a + b) / quizScores.length)
                  : 0;

                const getGradeStyle = (grade) => {
                  if (!grade || grade === 0) return 'text-gray-400';
                  if (grade >= 90) return 'text-emerald-600 font-bold';
                  if (grade >= 80) return 'text-yellow-600 font-bold';
                  return 'text-red-600 font-bold';
                };

                const getGradeBackground = (grade) => {
                  if (!grade || grade === 0) return '';
                  if (grade >= 90) return 'bg-emerald-50';
                  if (grade >= 80) return 'bg-yellow-50';
                  return 'bg-red-50';
                };

                return (
                  <tr key={student.id} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${getGradeBackground(student.currentGrade)}`}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-inherit">{student.name}</td>
                    <td className={`px-6 py-4 text-sm text-center ${getGradeStyle(student.currentGrade)}`}>
                      {student.currentGrade}%
                    </td>
                    {student.chapters.map(chapter => (
                      <td key={chapter.id} className={`px-6 py-4 text-sm text-center ${getGradeStyle(chapter.quizScore)}`}>
                        {chapter.completed ? `${chapter.quizScore}%` : '—'}
                      </td>
                    ))}
                    <td className={`px-6 py-4 text-sm text-center ${getGradeStyle(avgQuiz)}`}>
                      {avgQuiz > 0 ? `${avgQuiz}%` : '—'}
                    </td>
                    <td className={`px-6 py-4 text-sm text-center ${getGradeStyle(student.flashcardScore)}`}>
                      {student.flashcardScore}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Grade Distribution</h3>
          <div className="space-y-3">
            {[
              { range: 'A+ (90-100%)', count: students.filter(s => s.currentGrade >= 90).length, color: 'bg-emerald-500' },
              { range: 'B (80-89%)', count: students.filter(s => s.currentGrade >= 80 && s.currentGrade < 90).length, color: 'bg-yellow-500' },
              { range: 'C (70-79%)', count: students.filter(s => s.currentGrade >= 70 && s.currentGrade < 80).length, color: 'bg-orange-500' },
              { range: 'D (<70%)', count: students.filter(s => s.currentGrade < 70).length, color: 'bg-red-500' },
            ].map(({ range, count, color }) => (
              <div key={range}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{range}</span>
                  <span className="text-sm font-bold text-gray-900">{count} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${color} h-2 rounded-full transition-all`}
                    style={{ width: `${(count / students.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quiz Completion Status</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(chNum => {
              const completed = students.filter(s => 
                s.chapters.find(c => c.number === chNum && c.completed)
              ).length;
              
              return (
                <div key={chNum}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Chapter {chNum}</span>
                    <span className="text-sm font-bold text-gray-900">{completed}/{students.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-cyan-500 h-2 rounded-full transition-all"
                      style={{ width: `${(completed / students.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
