import React, { useState } from 'react';
import { Search, Download, Mail, Ban, ChevronDown, Edit2 } from 'lucide-react';

const AdminStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchool, setFilterSchool] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Mock student data
  const students = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      school: 'CompuMed Vocational',
      course: 'NUR1100',
      paymentStatus: 'paid',
      enrollmentDate: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      school: 'CompuMed Vocational',
      course: 'NUR2110',
      paymentStatus: 'pending',
      enrollmentDate: '2024-02-10',
      status: 'active'
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      school: 'American Healthcare',
      course: 'NUR1100',
      paymentStatus: 'paid',
      enrollmentDate: '2024-01-20',
      status: 'active'
    },
    {
      id: 4,
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      school: 'CompuMed Vocational',
      course: 'NUR1100',
      paymentStatus: 'overdue',
      enrollmentDate: '2023-11-05',
      status: 'inactive'
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      school: 'American Healthcare',
      course: 'NUR2110',
      paymentStatus: 'paid',
      enrollmentDate: '2024-02-01',
      status: 'active'
    },
    {
      id: 6,
      name: 'Robert Martinez',
      email: 'robert.martinez@email.com',
      school: 'CompuMed Vocational',
      course: 'NUR1100',
      paymentStatus: 'pending',
      enrollmentDate: '2024-02-15',
      status: 'active'
    },
  ];

  const schools = ['all', 'CompuMed Vocational', 'American Healthcare'];
  const courses = ['all', 'NUR1100', 'NUR2110', 'NUR3120'];

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool = filterSchool === 'all' || student.school === filterSchool;
    const matchesCourse = filterCourse === 'all' || student.course === filterCourse;
    return matchesSearch && matchesSchool && matchesCourse;
  });

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleAllSelection = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Management</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={filterSchool}
            onChange={(e) => setFilterSchool(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            {schools.map(school => (
              <option key={school} value={school}>
                {school === 'all' ? 'All Schools' : school}
              </option>
            ))}
          </select>

          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            {courses.map(course => (
              <option key={course} value={course}>
                {course === 'all' ? 'All Courses' : course}
              </option>
            ))}
          </select>

          <button className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all">
            <Download size={18} />
            Export
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedStudents.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
            <p className="text-sm text-blue-900 font-semibold">{selectedStudents.length} student(s) selected</p>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-all">
                <Mail size={16} />
                Message
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-all">
                <Ban size={16} />
                Suspend
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={toggleAllSelection}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">School</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Course</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Payment</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Enrolled</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudentSelection(student.id)}
                      className="w-4 h-4 rounded cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-3 font-semibold text-gray-900">{student.name}</td>
                  <td className="px-6 py-3 text-gray-600">{student.email}</td>
                  <td className="px-6 py-3 text-gray-600">{student.school}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                      {student.course}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getPaymentBadge(student.paymentStatus)}`}>
                      {student.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getStatusBadge(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600 text-xs">
                    {new Date(student.enrollmentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    <button className="p-2 hover:bg-gray-200 rounded transition-all">
                      <Edit2 size={16} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredStudents.length} of {students.length} students
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-all">Previous</button>
            <button className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-all">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-all">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
