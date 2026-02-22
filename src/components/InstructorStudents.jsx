import React, { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { StudentProgressDetail } from './StudentProgressDetail';

export const InstructorStudents = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortBy, setSortBy] = useState('name');

  const filteredStudents = useMemo(() => {
    let filtered = students.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGrade = gradeFilter === 'all' || 
        (gradeFilter === 'atrisk' && student.currentGrade < 80) ||
        (gradeFilter === 'warning' && student.currentGrade >= 80 && student.currentGrade < 90) ||
        (gradeFilter === 'excellent' && student.currentGrade >= 90);
      
      const matchesStatus = statusFilter === 'all' || student.enrollmentStatus === statusFilter;

      return matchesSearch && matchesGrade && matchesStatus;
    });

    // Sort
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'grade') {
      filtered.sort((a, b) => b.currentGrade - a.currentGrade);
    } else if (sortBy === 'progress') {
      filtered.sort((a, b) => b.progress - a.progress);
    }

    return filtered;
  }, [students, searchTerm, gradeFilter, statusFilter, sortBy]);

  if (selectedStudent) {
    return (
      <StudentProgressDetail 
        student={selectedStudent} 
        onBack={() => setSelectedStudent(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Students ({filteredStudents.length})</h2>
        <p className="text-cyan-100">View and manage student progress</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Grade Filter */}
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        >
          <option value="all">All Grades</option>
          <option value="excellent">Excellent (90%+)</option>
          <option value="warning">Warning (80-89%)</option>
          <option value="atrisk">At-Risk (&lt;80%)</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        >
          <option value="name">Sort: Name</option>
          <option value="grade">Sort: Grade</option>
          <option value="progress">Sort: Progress</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Grade</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Progress</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Last Active</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  let gradeColor = 'text-emerald-600';
                  if (student.currentGrade < 80) gradeColor = 'text-red-600';
                  else if (student.currentGrade < 90) gradeColor = 'text-yellow-600';

                  return (
                    <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {student.enrollmentStatus}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-bold ${gradeColor}`}>
                        {student.currentGrade}%
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-600">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.lastActive}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white rounded text-xs font-medium transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-600">
                    No students found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Enrolled</p>
          <p className="text-2xl font-bold text-gray-900">{students.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Average Grade</p>
          <p className="text-2xl font-bold text-cyan-600">
            {Math.round(students.reduce((sum, s) => sum + s.currentGrade, 0) / students.length)}%
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">At-Risk Count</p>
          <p className="text-2xl font-bold text-red-600">
            {students.filter(s => s.currentGrade < 80).length}
          </p>
        </div>
      </div>
    </div>
  );
};
