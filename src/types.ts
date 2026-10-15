export type Role = 'hod' | 'advisor' | 'student';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  department: string;
  designation?: string;
  regNo?: string;
  avatar?: string;
  phone?: string;
}

export interface Subject {
  code: string;
  name: string;
  credits: number;
  faculty: string;
}

export interface InternalMark {
  subjectCode: string;
  subjectName: string;
  iat1: number; // max 50 or 100
  iat2: number;
  modelExam: number;
  assignmentMark: number;
  totalInternal: number; // converted to 20 or 40
  maxInternal: number;
  grade: string;
}

export interface SubjectAttendance {
  subjectCode: string;
  subjectName: string;
  conductedHours: number;
  attendedHours: number;
  percentage: number;
}

export interface SemesterResult {
  semester: number;
  gpa: number;
  creditsEarned: number;
  totalCredits: number;
  status: 'PASS' | 'ARREAR' | 'CURRENT';
  courses: {
    code: string;
    name: string;
    credits: number;
    grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'RA' | 'SA';
    result: 'PASS' | 'RA' | 'WH';
  }[];
}

export interface Assignment {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  assignedBy: string; // Advisor name
  assignedDate: string;
  submissionsCount?: number;
  totalStudents?: number;
  studentStatus?: 'submitted' | 'pending' | 'graded';
  obtainedMarks?: number;
  feedback?: string;
}

export interface AcademicRemark {
  id: string;
  studentId: string;
  authorName: string;
  authorRole: 'HOD' | 'Class Advisor';
  date: string;
  type: 'academic' | 'attendance' | 'discipline' | 'achievement' | 'counseling';
  remark: string;
}

export interface Student {
  id: string;
  regNo: string;
  rollNo: string;
  name: string;
  department: string;
  batch: string; // e.g. 2022 - 2026
  year: number;  // 3
  semester: number; // 6
  section: string; // 'A'
  advisorName: string;
  hodName: string;
  cgpa: number;
  currentGpa: number;
  overallAttendance: number; // percentage
  email: string;
  phone: string;
  dob: string;
  bloodGroup: string;
  address: string;
  fatherName: string;
  parentPhone: string;
  internalMarks: InternalMark[];
  attendanceDetails: SubjectAttendance[];
  semesterResults: SemesterResult[];
  remarks: AcademicRemark[];
  arrearsCount: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Exam' | 'Academic' | 'Department' | 'General' | 'Placement';
  authorName: string;
  authorRole: string;
  urgent?: boolean;
}
