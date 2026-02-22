import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Settings, LogOut, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mockData = {
    totalUsers: 150,
    totalInstructors: 12,
    totalStudents: 138,
    activeCourses: 8,
    platformHealth: 99.8,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white bg-opacity-90 backdrop-blur-md border-b border-emerald-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-black text-emerald-500">U</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome, {user?.name}!</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-2">System Administration</h2>
          <p className="text-lg opacity-90">
            Manage users, courses, and platform settings.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs uppercase font-semibold">Total Users</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{mockData.totalUsers}</p>
              </div>
              <Users className="text-blue-500 opacity-20" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs uppercase font-semibold">Instructors</p>
                <p className="text-2xl font-bold text-purple-600 mt-2">{mockData.totalInstructors}</p>
              </div>
              <Users className="text-purple-500 opacity-20" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-cyan-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs uppercase font-semibold">Students</p>
                <p className="text-2xl font-bold text-cyan-600 mt-2">{mockData.totalStudents}</p>
              </div>
              <Users className="text-cyan-500 opacity-20" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs uppercase font-semibold">Courses</p>
                <p className="text-2xl font-bold text-orange-600 mt-2">{mockData.activeCourses}</p>
              </div>
              <BookOpen className="text-orange-500 opacity-20" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs uppercase font-semibold">Health</p>
                <p className="text-2xl font-bold text-emerald-600 mt-2">{mockData.platformHealth}%</p>
              </div>
              <TrendingUp className="text-emerald-500 opacity-20" size={40} />
            </div>
          </div>
        </div>

        {/* Admin Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">User Management</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Create, edit, and manage user accounts and roles
            </p>
            <button className="text-emerald-600 font-semibold text-sm hover:text-emerald-700">
              Manage Users →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="text-purple-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Course Management</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Create, edit, and delete courses
            </p>
            <button className="text-emerald-600 font-semibold text-sm hover:text-emerald-700">
              Manage Courses →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Settings className="text-emerald-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">System Settings</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Configure platform settings and preferences
            </p>
            <button className="text-emerald-600 font-semibold text-sm hover:text-emerald-700">
              Settings →
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">System Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              { action: 'New user registered', details: 'Student account created', time: '2 minutes ago' },
              { action: 'Course updated', details: 'Pharmacology 101 content updated', time: '45 minutes ago' },
              { action: 'System backup', details: 'Daily backup completed successfully', time: '2 hours ago' },
              { action: 'User login', details: 'Instructor access granted', time: '3 hours ago' },
            ].map((activity, idx) => (
              <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                  </div>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
