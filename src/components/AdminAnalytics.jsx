import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Clock, Award, Zap } from 'lucide-react';

const AdminAnalytics = () => {
  const [selectedMetric, setSelectedMetric] = useState('engagement');

  // Mock analytics data
  const chapterEngagement = [
    { chapter: 'Ch1: Introduction', avgTime: 34, completion: 92, students: 156 },
    { chapter: 'Ch2: Drug Classes', avgTime: 42, completion: 87, students: 156 },
    { chapter: 'Ch3: Cardiovascular', avgTime: 38, completion: 79, students: 145 },
    { chapter: 'Ch4: Neurological', avgTime: 45, completion: 71, students: 91 },
    { chapter: 'Ch5: Endocrine', avgTime: 40, completion: 68, students: 91 },
    { chapter: 'Ch6: Immune', avgTime: 48, completion: 55, students: 91 }
  ];

  const quizPerformance = [
    { chapter: 'Ch1: Introduction', avgScore: 87, passRate: 95, attempts: 142 },
    { chapter: 'Ch2: Drug Classes', avgScore: 82, passRate: 88, attempts: 156 },
    { chapter: 'Ch3: Cardiovascular', avgScore: 79, passRate: 84, attempts: 145 },
    { chapter: 'Ch4: Neurological', avgScore: 76, passRate: 78, attempts: 91 },
    { chapter: 'Ch5: Endocrine', avgScore: 74, passRate: 72, attempts: 91 },
    { chapter: 'Ch6: Immune', avgScore: 71, passRate: 65, attempts: 50 }
  ];

  const completionRates = [
    { course: 'NUR1100', completion: 92, students: 156, avgTime: '12 days' },
    { course: 'NUR2110', completion: 68, students: 91, avgTime: '18 days' },
    { course: 'NUR1101', completion: 96, students: 67, avgTime: '9 days' }
  ];

  const studentProgress = [
    { name: 'Highly Engaged', count: 142, percentage: 42, color: 'bg-green-500' },
    { name: 'Moderately Engaged', count: 128, percentage: 38, color: 'bg-blue-500' },
    { name: 'Low Engagement', count: 68, percentage: 20, color: 'bg-yellow-500' }
  ];

  const maxEngagement = Math.max(...chapterEngagement.map(c => c.avgTime));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics & Engagement Metrics</h2>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Avg Completion</p>
              <Award size={20} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">85%</p>
            <p className="text-xs text-gray-500 mt-1">+3% vs last week</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Avg Quiz Score</p>
              <Zap size={20} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">79%</p>
            <p className="text-xs text-gray-500 mt-1">338 total attempts</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Avg Study Time</p>
              <Clock size={20} className="text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">40 min</p>
            <p className="text-xs text-gray-500 mt-1">Per chapter</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Active Students</p>
              <TrendingUp size={20} className="text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-600">338</p>
            <p className="text-xs text-gray-500 mt-1">100% enrolled</p>
          </div>
        </div>
      </div>

      {/* Engagement by Chapter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 size={20} className="text-blue-500" />
          Engagement by Chapter - Avg Study Time
        </h3>

        <div className="space-y-4">
          {chapterEngagement.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.chapter}</p>
                  <p className="text-xs text-gray-500">{item.students} students</p>
                </div>
                <p className="text-sm font-bold text-gray-900">{item.avgTime} min</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-blue-400 to-cyan-500 transition-all"
                  style={{ width: `${(item.avgTime / maxEngagement) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-green-600 mt-1">{item.completion}% completion rate</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Performance vs Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Performance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quiz Performance by Chapter</h3>

          <div className="space-y-4">
            {quizPerformance.slice(0, 4).map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-cyan-400 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-gray-900">{item.chapter}</p>
                  <p className="text-xl font-bold text-green-600">{item.avgScore}%</p>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Pass Rate:</span>
                  <span className="font-semibold text-gray-900">{item.passRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 bg-green-500 transition-all"
                    style={{ width: `${item.passRate}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{item.attempts} total attempts</p>
              </div>
            ))}
          </div>
        </div>

        {/* Course Completion Rates */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Course Completion Rates</h3>

          <div className="space-y-4">
            {completionRates.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{item.course}</p>
                    <p className="text-xs text-gray-500">{item.students} students</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{item.completion}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
                  <div
                    className="h-2 bg-gradient-to-r from-blue-400 to-purple-500 transition-all"
                    style={{ width: `${item.completion}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">Average completion time: {item.avgTime}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Engagement Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <PieChart size={20} className="text-purple-500" />
          Student Engagement Distribution
        </h3>

        <div className="flex items-center gap-12">
          {/* Pie Chart */}
          <div className="relative w-40 h-40 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
              {studentProgress.map((item, idx) => {
                const circumference = 2 * Math.PI * 40;
                const offset = circumference - (item.percentage / 100) * circumference;

                return (
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={item.color.replace('bg-', '').replace('500', '')}
                    strokeWidth="20"
                    strokeDasharray={`${(item.percentage / 100) * circumference} ${circumference}`}
                    strokeDashoffset={-offset}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-2xl font-bold text-gray-900">338</p>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-4 flex-1">
            {studentProgress.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.count} students</p>
                </div>
                <p className="font-bold text-gray-900">{item.percentage}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Definitions */}
        <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">Highly Engaged</p>
            <p className="text-xs text-gray-600">4+ chapters completed</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">Moderately Engaged</p>
            <p className="text-xs text-gray-600">2-3 chapters completed</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">Low Engagement</p>
            <p className="text-xs text-gray-600">0-1 chapters completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
