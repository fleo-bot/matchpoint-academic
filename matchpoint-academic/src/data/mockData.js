// MatchPoint Academic — Mock Dataset
// Used for R API responses and local UI rendering

export const FACULTY = [
  {
    id: 'f001',
    name: 'Dr. Maria Santos',
    degree: 'Ph.D. Computer Science',
    specialization: 'Machine Learning & AI',
    yearsExperience: 12,
    currentLoad: 3,
    maxLoad: 5,
    status: 'active',
    avatar: 'MS',
    email: 'm.santos@matchpoint.edu',
    department: 'Computer Science',
    rank: 'Associate Professor',
    courses: ['CS401', 'CS301', 'IT201'],
  },
  {
    id: 'f002',
    name: 'Prof. James Reyes',
    degree: 'M.S. Information Technology',
    specialization: 'Web Development & UX',
    yearsExperience: 8,
    currentLoad: 4,
    maxLoad: 5,
    status: 'active',
    avatar: 'JR',
    email: 'j.reyes@matchpoint.edu',
    department: 'Information Technology',
    rank: 'Assistant Professor',
    courses: ['IT301', 'IT401', 'CS201', 'GE101'],
  },
  {
    id: 'f003',
    name: 'Dr. Angela Cruz',
    degree: 'Ph.D. Mathematics',
    specialization: 'Data Science & Statistics',
    yearsExperience: 15,
    currentLoad: 2,
    maxLoad: 5,
    status: 'active',
    avatar: 'AC',
    email: 'a.cruz@matchpoint.edu',
    department: 'Mathematics',
    rank: 'Full Professor',
    courses: ['MATH301', 'DS401'],
  },
  {
    id: 'f004',
    name: 'Engr. Ramon Dela Cruz',
    degree: 'M.Eng. Software Engineering',
    specialization: 'Systems Architecture',
    yearsExperience: 6,
    currentLoad: 5,
    maxLoad: 5,
    status: 'overloaded',
    avatar: 'RD',
    email: 'r.delacruz@matchpoint.edu',
    department: 'Computer Science',
    rank: 'Instructor',
    courses: ['CS101', 'CS201', 'CS301', 'IT101', 'SE401'],
  },
  {
    id: 'f005',
    name: 'Dr. Liza Fernandez',
    degree: 'Ph.D. Information Systems',
    specialization: 'Database Management',
    yearsExperience: 10,
    currentLoad: 1,
    maxLoad: 5,
    status: 'underutilized',
    avatar: 'LF',
    email: 'l.fernandez@matchpoint.edu',
    department: 'Information Systems',
    rank: 'Associate Professor',
    courses: ['IS301'],
  },
  {
    id: 'f006',
    name: 'Prof. Kevin Tan',
    degree: 'M.S. Computer Engineering',
    specialization: 'Networking & Cybersecurity',
    yearsExperience: 9,
    currentLoad: 3,
    maxLoad: 5,
    status: 'active',
    avatar: 'KT',
    email: 'k.tan@matchpoint.edu',
    department: 'Computer Engineering',
    rank: 'Assistant Professor',
    courses: ['NET301', 'SEC401', 'CE201'],
  },
];

export const COURSES = [
  { id: 'CS401', name: 'Machine Learning', category: 'Specialized Elective', units: 3, level: 4, description: 'Supervised & unsupervised learning algorithms' },
  { id: 'CS301', name: 'Algorithms & Data Structures', category: 'Core IT', units: 3, level: 3, description: 'Fundamental CS algorithms and complexity' },
  { id: 'IT401', name: 'Advanced Web Development', category: 'Specialized Elective', units: 3, level: 4, description: 'Full-stack development with modern frameworks' },
  { id: 'DS401', name: 'Data Science Fundamentals', category: 'Specialized Elective', units: 3, level: 4, description: 'Statistical modeling and data analysis' },
  { id: 'NET301', name: 'Computer Networks', category: 'Core IT', units: 3, level: 3, description: 'Network protocols, TCP/IP, routing' },
  { id: 'SEC401', name: 'Cybersecurity', category: 'Specialized Elective', units: 3, level: 4, description: 'Security principles, cryptography, threats' },
  { id: 'IS301', name: 'Database Management Systems', category: 'Core IT', units: 3, level: 3, description: 'Relational databases, SQL, normalization' },
  { id: 'GE101', name: 'Technical Communication', category: 'General Education', units: 3, level: 1, description: 'Technical writing and presentation skills' },
  { id: 'MATH301', name: 'Probability & Statistics', category: 'Core IT', units: 3, level: 3, description: 'Statistical methods for engineering' },
  { id: 'SE401', name: 'Software Engineering', category: 'Core IT', units: 3, level: 4, description: 'SDLC, agile, project management' },
];

// Compatibility scores for Recommendation Engine (simulating R output)
export const RECOMMENDATION_DATA = {
  'CS401': [
    { facultyId: 'f001', name: 'Dr. Maria Santos', score: 96, historicalFit: 98, academicProfile: 97, workloadScore: 92, timesTaught: 8, status: 'Highly Recommended' },
    { facultyId: 'f003', name: 'Dr. Angela Cruz', score: 82, historicalFit: 75, academicProfile: 90, workloadScore: 82, timesTaught: 3, status: 'Recommended' },
    { facultyId: 'f002', name: 'Prof. James Reyes', score: 54, historicalFit: 40, academicProfile: 55, workloadScore: 65, timesTaught: 1, status: 'Possible' },
    { facultyId: 'f006', name: 'Prof. Kevin Tan', score: 48, historicalFit: 35, academicProfile: 50, workloadScore: 60, timesTaught: 0, status: 'Possible' },
    { facultyId: 'f004', name: 'Engr. Ramon Dela Cruz', score: 38, historicalFit: 45, academicProfile: 42, workloadScore: 10, timesTaught: 2, status: 'Not Recommended' },
    { facultyId: 'f005', name: 'Dr. Liza Fernandez', score: 42, historicalFit: 20, academicProfile: 58, workloadScore: 95, timesTaught: 0, status: 'Possible' },
  ],
  'IT401': [
    { facultyId: 'f002', name: 'Prof. James Reyes', score: 91, historicalFit: 95, academicProfile: 88, workloadScore: 72, timesTaught: 6, status: 'Highly Recommended' },
    { facultyId: 'f004', name: 'Engr. Ramon Dela Cruz', score: 70, historicalFit: 72, academicProfile: 74, workloadScore: 10, timesTaught: 3, status: 'Possible' },
    { facultyId: 'f001', name: 'Dr. Maria Santos', score: 65, historicalFit: 50, academicProfile: 72, workloadScore: 80, timesTaught: 1, status: 'Possible' },
    { facultyId: 'f006', name: 'Prof. Kevin Tan', score: 58, historicalFit: 45, academicProfile: 60, workloadScore: 72, timesTaught: 1, status: 'Possible' },
    { facultyId: 'f005', name: 'Dr. Liza Fernandez', score: 44, historicalFit: 30, academicProfile: 48, workloadScore: 95, timesTaught: 0, status: 'Not Recommended' },
    { facultyId: 'f003', name: 'Dr. Angela Cruz', score: 40, historicalFit: 20, academicProfile: 50, workloadScore: 82, timesTaught: 0, status: 'Not Recommended' },
  ],
  'DS401': [
    { facultyId: 'f003', name: 'Dr. Angela Cruz', score: 94, historicalFit: 96, academicProfile: 95, workloadScore: 88, timesTaught: 7, status: 'Highly Recommended' },
    { facultyId: 'f001', name: 'Dr. Maria Santos', score: 88, historicalFit: 85, academicProfile: 92, workloadScore: 88, timesTaught: 4, status: 'Highly Recommended' },
    { facultyId: 'f005', name: 'Dr. Liza Fernandez', score: 72, historicalFit: 65, academicProfile: 78, workloadScore: 95, timesTaught: 2, status: 'Recommended' },
    { facultyId: 'f004', name: 'Engr. Ramon Dela Cruz', score: 40, historicalFit: 30, academicProfile: 45, workloadScore: 10, timesTaught: 0, status: 'Not Recommended' },
    { facultyId: 'f002', name: 'Prof. James Reyes', score: 38, historicalFit: 25, academicProfile: 42, workloadScore: 65, timesTaught: 0, status: 'Not Recommended' },
    { facultyId: 'f006', name: 'Prof. Kevin Tan', score: 35, historicalFit: 20, academicProfile: 40, workloadScore: 72, timesTaught: 0, status: 'Not Recommended' },
  ],
  'NET301': [
    { facultyId: 'f006', name: 'Prof. Kevin Tan', score: 93, historicalFit: 97, academicProfile: 92, workloadScore: 88, timesTaught: 7, status: 'Highly Recommended' },
    { facultyId: 'f004', name: 'Engr. Ramon Dela Cruz', score: 68, historicalFit: 70, academicProfile: 72, workloadScore: 10, timesTaught: 3, status: 'Not Recommended' },
    { facultyId: 'f002', name: 'Prof. James Reyes', score: 55, historicalFit: 40, academicProfile: 58, workloadScore: 65, timesTaught: 1, status: 'Possible' },
    { facultyId: 'f001', name: 'Dr. Maria Santos', score: 48, historicalFit: 35, academicProfile: 52, workloadScore: 88, timesTaught: 0, status: 'Possible' },
    { facultyId: 'f003', name: 'Dr. Angela Cruz', score: 32, historicalFit: 10, academicProfile: 38, workloadScore: 88, timesTaught: 0, status: 'Not Recommended' },
    { facultyId: 'f005', name: 'Dr. Liza Fernandez', score: 42, historicalFit: 25, academicProfile: 48, workloadScore: 95, timesTaught: 0, status: 'Not Recommended' },
  ],
};

// Specialization history (semester data for charts)
export const SPECIALIZATION_HISTORY = {
  'f001': {
    name: 'Dr. Maria Santos',
    semesters: [
      { label: '2022-S1', AI: 60, DataSci: 20, WebDev: 10, CoreCS: 10 },
      { label: '2022-S2', AI: 65, DataSci: 20, WebDev: 5, CoreCS: 10 },
      { label: '2023-S1', AI: 70, DataSci: 15, WebDev: 5, CoreCS: 10 },
      { label: '2023-S2', AI: 72, DataSci: 18, WebDev: 5, CoreCS: 5 },
      { label: '2024-S1', AI: 75, DataSci: 15, WebDev: 5, CoreCS: 5 },
      { label: '2024-S2', AI: 78, DataSci: 12, WebDev: 5, CoreCS: 5 },
    ],
    prediction: { specialization: 'AI & Machine Learning', probability: 0.91, status: 'Developing Specialist', trend: 'up' },
  },
  'f002': {
    name: 'Prof. James Reyes',
    semesters: [
      { label: '2022-S1', AI: 10, DataSci: 10, WebDev: 50, CoreCS: 30 },
      { label: '2022-S2', AI: 10, DataSci: 10, WebDev: 55, CoreCS: 25 },
      { label: '2023-S1', AI: 5, DataSci: 15, WebDev: 60, CoreCS: 20 },
      { label: '2023-S2', AI: 5, DataSci: 10, WebDev: 65, CoreCS: 20 },
      { label: '2024-S1', AI: 5, DataSci: 10, WebDev: 68, CoreCS: 17 },
      { label: '2024-S2', AI: 5, DataSci: 5, WebDev: 72, CoreCS: 18 },
    ],
    prediction: { specialization: 'Web Development', probability: 0.87, status: 'Developing Specialist', trend: 'up' },
  },
  'f003': {
    name: 'Dr. Angela Cruz',
    semesters: [
      { label: '2022-S1', AI: 15, DataSci: 55, WebDev: 5, CoreCS: 25 },
      { label: '2022-S2', AI: 15, DataSci: 60, WebDev: 5, CoreCS: 20 },
      { label: '2023-S1', AI: 20, DataSci: 62, WebDev: 3, CoreCS: 15 },
      { label: '2023-S2', AI: 18, DataSci: 65, WebDev: 3, CoreCS: 14 },
      { label: '2024-S1', AI: 20, DataSci: 66, WebDev: 2, CoreCS: 12 },
      { label: '2024-S2', AI: 20, DataSci: 68, WebDev: 2, CoreCS: 10 },
    ],
    prediction: { specialization: 'Data Science', probability: 0.89, status: 'Developing Specialist', trend: 'up' },
  },
  'f004': {
    name: 'Engr. Ramon Dela Cruz',
    semesters: [
      { label: '2022-S1', AI: 10, DataSci: 10, WebDev: 30, CoreCS: 50 },
      { label: '2022-S2', AI: 10, DataSci: 10, WebDev: 25, CoreCS: 55 },
      { label: '2023-S1', AI: 15, DataSci: 10, WebDev: 30, CoreCS: 45 },
      { label: '2023-S2', AI: 10, DataSci: 15, WebDev: 25, CoreCS: 50 },
      { label: '2024-S1', AI: 15, DataSci: 10, WebDev: 30, CoreCS: 45 },
      { label: '2024-S2', AI: 10, DataSci: 10, WebDev: 25, CoreCS: 55 },
    ],
    prediction: { specialization: 'Core CS / Systems', probability: 0.62, status: 'Generalist', trend: 'stable' },
  },
};

// Workload summary
export const WORKLOAD_SUMMARY = [
  { facultyId: 'f001', name: 'Dr. Maria Santos', units: 9, maxUnits: 15, percentage: 60, status: 'active' },
  { facultyId: 'f002', name: 'Prof. James Reyes', units: 12, maxUnits: 15, percentage: 80, status: 'active' },
  { facultyId: 'f003', name: 'Dr. Angela Cruz', units: 6, maxUnits: 15, percentage: 40, status: 'underutilized' },
  { facultyId: 'f004', name: 'Engr. Ramon Dela Cruz', units: 15, maxUnits: 15, percentage: 100, status: 'overloaded' },
  { facultyId: 'f005', name: 'Dr. Liza Fernandez', units: 3, maxUnits: 15, percentage: 20, status: 'underutilized' },
  { facultyId: 'f006', name: 'Prof. Kevin Tan', units: 9, maxUnits: 15, percentage: 60, status: 'active' },
];

// Subject coverage by category
export const SUBJECT_COVERAGE = [
  { category: 'Specialized Electives (AI/ML)', count: 4, qualified: 2, shortage: false, color: '#96ACB7' },
  { category: 'Specialized Electives (Web)', count: 3, qualified: 2, shortage: false, color: '#7a9aaa' },
  { category: 'Core IT / CS', count: 8, qualified: 4, shortage: false, color: '#5e8899' },
  { category: 'General Education', count: 5, qualified: 1, shortage: true, color: '#4a7080' },
  { category: 'Mathematics', count: 3, qualified: 1, shortage: true, color: '#c8d8e0' },
  { category: 'Networking / Security', count: 4, qualified: 1, shortage: true, color: '#3a5f6e' },
];

// Faculty requests
export const FACULTY_REQUESTS = [
  { id: 'req001', facultyId: 'f005', facultyName: 'Dr. Liza Fernandez', course: 'DS401', courseName: 'Data Science Fundamentals', reason: 'Completed advanced statistics certification.', status: 'pending', date: '2024-11-10' },
  { id: 'req002', facultyId: 'f003', facultyName: 'Dr. Angela Cruz', course: 'CS401', courseName: 'Machine Learning', reason: 'Research background in ML models relevant to course.', status: 'approved', date: '2024-10-22' },
  { id: 'req003', facultyId: 'f006', facultyName: 'Prof. Kevin Tan', course: 'SEC401', courseName: 'Cybersecurity', reason: 'Industry certification (CISSP). Taught related topics.', status: 'approved', date: '2024-09-15' },
];

// System stats
export const SYSTEM_STATS = {
  totalFaculty: 6,
  totalCourses: 10,
  activeSemester: '2024-S2',
  coverageRate: 78,
  avgWorkload: 60,
  pendingRequests: 1,
  developingSpecialists: 3,
};
