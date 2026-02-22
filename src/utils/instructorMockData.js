// Mock data for instructor dashboard with 20+ students with varied progress

export const getMockStudents = () => {
  const students = [
    {
      id: 'STU001',
      name: 'Amanda Garcia',
      email: 'amanda.garcia@email.com',
      enrollmentDate: '2024-01-15',
      enrollmentStatus: 'Active',
      currentGrade: 95,
      progress: 100,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 95, timeSpent: 240 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 92, timeSpent: 210 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: true, quizScore: 98, timeSpent: 230 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: true, quizScore: 95, timeSpent: 250 },
      ],
      flashcardScore: 88,
      readingPosition: 100,
      lastActive: '2024-02-19'
    },
    {
      id: 'STU002',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      enrollmentDate: '2024-01-16',
      enrollmentStatus: 'Active',
      currentGrade: 88,
      progress: 85,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 90, timeSpent: 220 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 85, timeSpent: 200 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: true, quizScore: 88, timeSpent: 210 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: false, quizScore: 0, timeSpent: 0 },
      ],
      flashcardScore: 82,
      readingPosition: 85,
      lastActive: '2024-02-18'
    },
    {
      id: 'STU003',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      enrollmentDate: '2024-01-15',
      enrollmentStatus: 'Active',
      currentGrade: 75,
      progress: 60,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 78, timeSpent: 180 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 72, timeSpent: 160 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: false, quizScore: 0, timeSpent: 90 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: false, quizScore: 0, timeSpent: 0 },
      ],
      flashcardScore: 65,
      readingPosition: 60,
      lastActive: '2024-02-15'
    },
    {
      id: 'STU004',
      name: 'David Martinez',
      email: 'david.martinez@email.com',
      enrollmentDate: '2024-01-16',
      enrollmentStatus: 'Active',
      currentGrade: 82,
      progress: 75,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 85, timeSpent: 200 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 80, timeSpent: 190 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: true, quizScore: 82, timeSpent: 180 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: false, quizScore: 0, timeSpent: 0 },
      ],
      flashcardScore: 78,
      readingPosition: 75,
      lastActive: '2024-02-17'
    },
    {
      id: 'STU005',
      name: 'Lisa Wang',
      email: 'lisa.wang@email.com',
      enrollmentDate: '2024-01-15',
      enrollmentStatus: 'Active',
      currentGrade: 91,
      progress: 95,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 94, timeSpent: 230 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 91, timeSpent: 220 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: true, quizScore: 92, timeSpent: 240 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: true, quizScore: 88, timeSpent: 210 },
      ],
      flashcardScore: 85,
      readingPosition: 95,
      lastActive: '2024-02-19'
    },
    {
      id: 'STU006',
      name: 'James Brown',
      email: 'james.brown@email.com',
      enrollmentDate: '2024-01-16',
      enrollmentStatus: 'Active',
      currentGrade: 68,
      progress: 45,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 70, timeSpent: 140 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: false, quizScore: 0, timeSpent: 80 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: false, quizScore: 0, timeSpent: 0 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: false, quizScore: 0, timeSpent: 0 },
      ],
      flashcardScore: 55,
      readingPosition: 45,
      lastActive: '2024-02-12'
    },
    {
      id: 'STU007',
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@email.com',
      enrollmentDate: '2024-01-15',
      enrollmentStatus: 'Active',
      currentGrade: 86,
      progress: 80,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 88, timeSpent: 210 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 85, timeSpent: 195 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: true, quizScore: 86, timeSpent: 205 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: false, quizScore: 0, timeSpent: 0 },
      ],
      flashcardScore: 80,
      readingPosition: 80,
      lastActive: '2024-02-18'
    },
    {
      id: 'STU008',
      name: 'Robert Thompson',
      email: 'robert.thompson@email.com',
      enrollmentDate: '2024-01-16',
      enrollmentStatus: 'Active',
      currentGrade: 72,
      progress: 55,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 75, timeSpent: 160 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 70, timeSpent: 150 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: false, quizScore: 0, timeSpent: 110 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: false, quizScore: 0, timeSpent: 0 },
      ],
      flashcardScore: 62,
      readingPosition: 55,
      lastActive: '2024-02-16'
    },
    {
      id: 'STU009',
      name: 'Jessica Lee',
      email: 'jessica.lee@email.com',
      enrollmentDate: '2024-01-15',
      enrollmentStatus: 'Active',
      currentGrade: 79,
      progress: 70,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 82, timeSpent: 190 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 78, timeSpent: 170 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: false, quizScore: 0, timeSpent: 100 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: false, quizScore: 0, timeSpent: 0 },
      ],
      flashcardScore: 72,
      readingPosition: 70,
      lastActive: '2024-02-17'
    },
    {
      id: 'STU010',
      name: 'Christopher Davis',
      email: 'christopher.davis@email.com',
      enrollmentDate: '2024-01-16',
      enrollmentStatus: 'Active',
      currentGrade: 89,
      progress: 90,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 92, timeSpent: 220 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 88, timeSpent: 200 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: true, quizScore: 90, timeSpent: 220 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: true, quizScore: 86, timeSpent: 200 },
      ],
      flashcardScore: 84,
      readingPosition: 90,
      lastActive: '2024-02-19'
    },
    {
      id: 'STU011',
      name: 'Nicole Anderson',
      email: 'nicole.anderson@email.com',
      enrollmentDate: '2024-01-15',
      enrollmentStatus: 'Active',
      currentGrade: 65,
      progress: 40,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 68, timeSpent: 130 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: false, quizScore: 0, timeSpent: 60 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: false, quizScore: 0, timeSpent: 0 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: false, quizScore: 0, timeSpent: 0 },
      ],
      flashcardScore: 48,
      readingPosition: 40,
      lastActive: '2024-02-10'
    },
    {
      id: 'STU012',
      name: 'Thomas White',
      email: 'thomas.white@email.com',
      enrollmentDate: '2024-01-16',
      enrollmentStatus: 'Active',
      currentGrade: 84,
      progress: 80,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 86, timeSpent: 210 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 82, timeSpent: 195 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: true, quizScore: 84, timeSpent: 200 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: false, quizScore: 0, timeSpent: 0 },
      ],
      flashcardScore: 76,
      readingPosition: 80,
      lastActive: '2024-02-18'
    },
    {
      id: 'STU013',
      name: 'Karen Smith',
      email: 'karen.smith@email.com',
      enrollmentDate: '2024-01-15',
      enrollmentStatus: 'Active',
      currentGrade: 92,
      progress: 95,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 95, timeSpent: 240 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 92, timeSpent: 225 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: true, quizScore: 93, timeSpent: 235 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: true, quizScore: 90, timeSpent: 220 },
      ],
      flashcardScore: 87,
      readingPosition: 95,
      lastActive: '2024-02-19'
    },
    {
      id: 'STU014',
      name: 'Mark Wilson',
      email: 'mark.wilson@email.com',
      enrollmentDate: '2024-01-16',
      enrollmentStatus: 'Active',
      currentGrade: 77,
      progress: 65,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 80, timeSpent: 175 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 75, timeSpent: 160 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: false, quizScore: 0, timeSpent: 105 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: false, quizScore: 0, timeSpent: 0 },
      ],
      flashcardScore: 68,
      readingPosition: 65,
      lastActive: '2024-02-14'
    },
    {
      id: 'STU015',
      name: 'Sophia Jackson',
      email: 'sophia.jackson@email.com',
      enrollmentDate: '2024-01-15',
      enrollmentStatus: 'Active',
      currentGrade: 87,
      progress: 85,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 89, timeSpent: 215 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 86, timeSpent: 200 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: true, quizScore: 87, timeSpent: 210 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: false, quizScore: 0, timeSpent: 0 },
      ],
      flashcardScore: 81,
      readingPosition: 85,
      lastActive: '2024-02-18'
    },
    {
      id: 'STU016',
      name: 'Daniel Lewis',
      email: 'daniel.lewis@email.com',
      enrollmentDate: '2024-01-16',
      enrollmentStatus: 'Active',
      currentGrade: 70,
      progress: 50,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 72, timeSpent: 150 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: false, quizScore: 0, timeSpent: 90 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: false, quizScore: 0, timeSpent: 0 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: false, quizScore: 0, timeSpent: 0 },
      ],
      flashcardScore: 58,
      readingPosition: 50,
      lastActive: '2024-02-13'
    },
    {
      id: 'STU017',
      name: 'Michelle Harris',
      email: 'michelle.harris@email.com',
      enrollmentDate: '2024-01-15',
      enrollmentStatus: 'Active',
      currentGrade: 93,
      progress: 100,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 96, timeSpent: 250 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 94, timeSpent: 235 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: true, quizScore: 92, timeSpent: 240 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: true, quizScore: 92, timeSpent: 230 },
      ],
      flashcardScore: 89,
      readingPosition: 100,
      lastActive: '2024-02-19'
    },
    {
      id: 'STU018',
      name: 'Andrew Taylor',
      email: 'andrew.taylor@email.com',
      enrollmentDate: '2024-01-16',
      enrollmentStatus: 'Active',
      currentGrade: 81,
      progress: 75,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 84, timeSpent: 205 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 80, timeSpent: 190 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: true, quizScore: 80, timeSpent: 185 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: false, quizScore: 0, timeSpent: 0 },
      ],
      flashcardScore: 75,
      readingPosition: 75,
      lastActive: '2024-02-17'
    },
    {
      id: 'STU019',
      name: 'Rachel Green',
      email: 'rachel.green@email.com',
      enrollmentDate: '2024-01-15',
      enrollmentStatus: 'Active',
      currentGrade: 76,
      progress: 62,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 79, timeSpent: 185 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 74, timeSpent: 165 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: false, quizScore: 0, timeSpent: 95 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: false, quizScore: 0, timeSpent: 0 },
      ],
      flashcardScore: 70,
      readingPosition: 62,
      lastActive: '2024-02-16'
    },
    {
      id: 'STU020',
      name: 'Kevin Anderson',
      email: 'kevin.anderson@email.com',
      enrollmentDate: '2024-01-16',
      enrollmentStatus: 'Active',
      currentGrade: 85,
      progress: 80,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 88, timeSpent: 215 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 84, timeSpent: 195 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: true, quizScore: 84, timeSpent: 205 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: false, quizScore: 0, timeSpent: 0 },
      ],
      flashcardScore: 79,
      readingPosition: 80,
      lastActive: '2024-02-18'
    },
    {
      id: 'STU021',
      name: 'Victoria Parker',
      email: 'victoria.parker@email.com',
      enrollmentDate: '2024-01-15',
      enrollmentStatus: 'Active',
      currentGrade: 88,
      progress: 85,
      chapters: [
        { id: 'ch1', number: 1, title: 'Introduction to Pharmacology', completed: true, quizScore: 91, timeSpent: 220 },
        { id: 'ch2', number: 2, title: 'Drug Classifications', completed: true, quizScore: 87, timeSpent: 205 },
        { id: 'ch3', number: 3, title: 'Cardiovascular Medications', completed: true, quizScore: 86, timeSpent: 210 },
        { id: 'ch4', number: 4, title: 'Neurological Medications', completed: false, quizScore: 0, timeSpent: 0 },
      ],
      flashcardScore: 82,
      readingPosition: 85,
      lastActive: '2024-02-19'
    }
  ];

  return students;
};

export const getInstructorStats = (students) => {
  const totalStudents = students.length;
  const averageGrade = Math.round(students.reduce((sum, s) => sum + s.currentGrade, 0) / totalStudents);
  const atRiskCount = students.filter(s => s.currentGrade < 80).length;
  const assignmentsDue = Math.floor(Math.random() * 5) + 2; // 2-6 assignments

  return {
    totalStudents,
    averageGrade,
    atRiskCount,
    assignmentsDue,
  };
};

export const getStudentById = (id) => {
  const students = getMockStudents();
  return students.find(s => s.id === id);
};
