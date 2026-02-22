import React, { useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Users, FileText } from 'lucide-react';

const AdminCourses = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);

  // Mock course data
  const courses = [
    {
      id: 1,
      code: 'NUR1100',
      title: 'Pharmacology I',
      description: 'Foundation pharmacology concepts for nursing practice',
      students: 156,
      chapters: 3,
      units: 3,
      status: 'active',
      school: 'CompuMed Vocational',
      startDate: '2024-01-15',
      instructors: 4,
      enrollmentRate: 87
    },
    {
      id: 2,
      code: 'NUR2110',
      title: 'Advanced Pharmacology',
      description: 'Advanced drug therapies and specialized pharmacology',
      students: 91,
      chapters: 3,
      units: 3,
      status: 'active',
      school: 'CompuMed Vocational',
      startDate: '2024-02-01',
      instructors: 3,
      enrollmentRate: 72
    },
    {
      id: 3,
      code: 'NUR1101',
      title: 'Basic Pharmacology',
      description: 'Introduction to drug properties and basic mechanisms',
      students: 67,
      chapters: 2,
      units: 2,
      status: 'active',
      school: 'American Healthcare',
      startDate: '2024-01-20',
      instructors: 2,
      enrollmentRate: 91
    },
    {
      id: 4,
      code: 'NUR3120',
      title: 'Clinical Pharmacology',
      description: 'Real-world clinical applications and case studies',
      students: 24,
      chapters: 0,
      units: 0,
      status: 'draft',
      school: 'CompuMed Vocational',
      startDate: null,
      instructors: 0,
      enrollmentRate: 0
    }
  ];

  const getStatusBadge = (status) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Courses Management</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all font-semibold"
          >
            <Plus size={18} />
            Add Course
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Courses</p>
            <p className="text-3xl font-bold text-blue-600">8</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Active Courses</p>
            <p className="text-3xl font-bold text-green-600">7</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Draft Courses</p>
            <p className="text-3xl font-bold text-orange-600">1</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-3xl font-bold text-purple-600">338</p>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
            {/* Course Header */}
            <div
              onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
              className="p-6 bg-gradient-to-r from-cyan-50 to-purple-50 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-100 hover:to-purple-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="text-cyan-600" size={20} />
                    <p className="text-sm font-semibold text-cyan-600">{course.code}</p>
                    <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getStatusBadge(course.status)}`}>
                      {course.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="p-2 hover:bg-white rounded transition-all">
                    <Edit2 size={18} className="text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-white rounded transition-all">
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{course.students}</p>
                  <p className="text-xs text-gray-600">Students</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{course.chapters}</p>
                  <p className="text-xs text-gray-600">Chapters</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{course.units}</p>
                  <p className="text-xs text-gray-600">Units</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{course.enrollmentRate}%</p>
                  <p className="text-xs text-gray-600">Enrolled</p>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedCourse === course.id && (
              <div className="p-6 border-t border-gray-200 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">School</p>
                    <p className="text-sm text-gray-900">{course.school}</p>
                  </div>
                  {course.startDate && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Start Date</p>
                      <p className="text-sm text-gray-900">{new Date(course.startDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {course.instructors > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Instructors</p>
                      <p className="text-sm text-gray-900">{course.instructors}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Avg Grade</p>
                    <p className="text-sm text-gray-900">3.47/4.0</p>
                  </div>
                </div>

                {/* Enrollment Progress */}
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-700">Enrollment</p>
                    <p className="text-sm text-gray-500">{course.students}/{Math.round(course.students / (course.enrollmentRate / 100))} possible</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-green-400 to-cyan-500 transition-all"
                      style={{ width: `${course.enrollmentRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <button className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold text-sm transition-all flex items-center justify-center gap-2">
                    <Users size={16} />
                    View Students
                  </button>
                  <button className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded font-semibold text-sm transition-all flex items-center justify-center gap-2">
                    <FileText size={16} />
                    Manage Content
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Add New Course</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Course Code</label>
                <input
                  type="text"
                  placeholder="e.g., NUR3120"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Course Title</label>
                <input
                  type="text"
                  placeholder="Course title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">School</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500">
                  <option>CompuMed Vocational</option>
                  <option>American Healthcare</option>
                  <option>New School</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Course description"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-900 font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all"
                >
                  Create Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
