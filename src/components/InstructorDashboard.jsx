import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, BarChart3, AlertTriangle, FileText, Settings, LogOut, Menu, X } from 'lucide-react';
import { InstructorStudents } from './InstructorStudents';
import { InstructorGrades } from './InstructorGrades';
import { AtRiskAlerts } from './AtRiskAlerts';
import { InstructorReports } from './InstructorReports';
import { getInstructorStats, getMockStudents } from '../utils/instructorMockData';

export const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState('PHARM101');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const students = getMockStudents();
  const stats = getInstructorStats(students);
  const courseOptions = ['PHARM101', 'NURS201', 'ADV301'];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'grades', label: 'Grades', icon: FileText },
    { id: 'at-risk', label: 'At-Risk Alerts', icon: AlertTriangle },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Course Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'students':
        return <InstructorStudents students={students} />;
      case 'grades':
        return <InstructorGrades students={students} />;
      case 'at-risk':
        return <AtRiskAlerts students={students} />;
      case 'reports':
        return <InstructorReports students={students} />;
      case 'settings':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Settings</h2>
            <p className="text-gray-600">Course settings panel coming soon...</p>
          </div>
        );
      default:
        return <DashboardHome stats={stats} students={students} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white bg-opacity-90 backdrop-blur-md border-b border-cyan-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="text-3xl font-black text-cyan-500">U</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
              <p className="text-xs text-gray-500">UnaVida Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:border-cyan-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            >
              {courseOptions.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } lg:w-64 bg-white border-r border-gray-200 shadow-sm transition-all duration-300 overflow-hidden fixed lg:static h-screen lg:h-auto z-30`}
        >
          <div className="p-6 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Navigation</p>
          </div>

          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-cyan-100 text-cyan-700 border-l-4 border-cyan-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardHome = ({ stats, students }) => {
  const atRiskStudents = students.filter(s => s.currentGrade < 80);
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome back, Instructor!</h2>
        <p className="text-cyan-100">Here's your class overview for this semester</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Students"
          value={stats.totalStudents}
          icon="👥"
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          label="Average Grade"
          value={`${stats.averageGrade}%`}
          icon="📊"
          color="from-emerald-500 to-emerald-600"
        />
        <StatCard
          label="At-Risk Students"
          value={stats.atRiskCount}
          icon="⚠️"
          color="from-red-500 to-red-600"
        />
        <StatCard
          label="Assignments Due"
          value={stats.assignmentsDue}
          icon="📝"
          color="from-purple-500 to-purple-600"
        />
      </div>

      {/* Quick Actions & At-Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* At-Risk Overview */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={24} />
            At-Risk Students Overview
          </h3>
          {atRiskStudents.length > 0 ? (
            <div className="space-y-3">
              {atRiskStudents.slice(0, 5).map(student => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-semibold text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">Grade: {student.currentGrade}%</p>
                  </div>
                  <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors">
                    View
                  </button>
                </div>
              ))}
              {atRiskStudents.length > 5 && (
                <p className="text-center text-sm text-gray-600 pt-2">
                  +{atRiskStudents.length - 5} more at-risk students
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-600">No students at risk. Great class engagement!</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors text-sm">
              Message Students
            </button>
            <button className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors text-sm">
              Send Announcement
            </button>
            <button className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors text-sm">
              Download Grades
            </button>
            <button className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className={`text-4xl font-bold mt-2 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
            {value}
          </p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
};
