import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Assignment, Announcement, AcademicRemark } from '../types';
import { INITIAL_STUDENTS, INITIAL_ASSIGNMENTS, INITIAL_ANNOUNCEMENTS } from '../data/initialData';
import { useAuth } from './AuthContext';

interface AcademicContextType {
  students: Student[];
  assignments: Assignment[];
  announcements: Announcement[];
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  updateStudentMarks: (
    studentId: string,
    subjectCode: string,
    field: 'iat1' | 'iat2' | 'modelExam' | 'assignmentMark',
    value: number
  ) => void;
  updateStudentAttendance: (
    studentId: string,
    subjectCode: string,
    attendedHours: number,
    conductedHours: number
  ) => void;
  addAcademicRemark: (
    studentId: string,
    remarkText: string,
    type: AcademicRemark['type']
  ) => void;
  createAssignment: (newAssignment: Omit<Assignment, 'id' | 'submissionsCount' | 'studentStatus'>) => void;
  submitAssignment: (assignmentId: string, submissionNotes?: string) => void;
  gradeAssignment: (assignmentId: string, marks: number, feedback: string) => void;
  createAnnouncement: (newAnn: Omit<Announcement, 'id' | 'date'>) => void;
  deleteAnnouncement: (id: string) => void;
  resetToDefaultData: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  getStudentById: (id: string) => Student | undefined;
  getStudentByRegNo: (regNo: string) => Student | undefined;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

const STUDENTS_STORAGE_KEY = 'iie_academic_students_data_v2';
const ASSIGNMENTS_STORAGE_KEY = 'iie_academic_assignments_data_v2';
const ANNOUNCEMENTS_STORAGE_KEY = 'iie_academic_announcements_data_v2';
const THEME_STORAGE_KEY = 'iie_academic_theme';

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, canEditMarks, canEditAttendance, canAddRemarks, canManageAssignments, canPostAnnouncements } = useAuth();

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STUDENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_STUDENTS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ASSIGNMENTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved !== null) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const calculateGrade = (totalInternal: number, maxInternal: number = 40): string => {
    const pct = (totalInternal / maxInternal) * 100;
    if (pct >= 90) return 'O';
    if (pct >= 80) return 'A+';
    if (pct >= 70) return 'A';
    if (pct >= 60) return 'B+';
    if (pct >= 50) return 'B';
    return 'RA';
  };

  const updateStudentMarks = (
    studentId: string,
    subjectCode: string,
    field: 'iat1' | 'iat2' | 'modelExam' | 'assignmentMark',
    value: number
  ) => {
    if (!canEditMarks) {
      console.warn('Unauthorized: Students cannot update marks.');
      return;
    }

    setStudents(prevStudents =>
      prevStudents.map(student => {
        if (student.id !== studentId) return student;

        const updatedMarks = student.internalMarks.map(item => {
          if (item.subjectCode !== subjectCode) return item;

          const updatedItem = {
            ...item,
            [field]: Number(value) || 0,
          };

          // Recalculate total internal out of 40:
          // Formula: (IAT1(50) + IAT2(50)) / 100 * 15 + (ModelExam(100)/100)*15 + Assignment(20)/20*10 = 40
          const iatContribution = ((updatedItem.iat1 + updatedItem.iat2) / 100) * 15;
          const modelContribution = (updatedItem.modelExam / 100) * 15;
          const asgContribution = (updatedItem.assignmentMark / 20) * 10;
          const totalInt = Math.round((iatContribution + modelContribution + asgContribution) * 10) / 10;

          updatedItem.totalInternal = Math.min(40, totalInt);
          updatedItem.grade = calculateGrade(updatedItem.totalInternal, 40);

          return updatedItem;
        });

        // Recalculate student GPA/CGPA average
        const pointsMap: Record<string, number> = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'RA': 0 };
        const totalPoints = updatedMarks.reduce((acc, m) => acc + (pointsMap[m.grade] || 7), 0);
        const newGpa = Math.round((totalPoints / updatedMarks.length) * 100) / 100;

        return {
          ...student,
          internalMarks: updatedMarks,
          currentGpa: newGpa,
        };
      })
    );
  };

  const updateStudentAttendance = (
    studentId: string,
    subjectCode: string,
    attendedHours: number,
    conductedHours: number
  ) => {
    if (!canEditAttendance) {
      console.warn('Unauthorized: Students cannot edit attendance.');
      return;
    }

    setStudents(prevStudents =>
      prevStudents.map(student => {
        if (student.id !== studentId) return student;

        const updatedAttendance = student.attendanceDetails.map(item => {
          if (item.subjectCode !== subjectCode) return item;

          const validConducted = Math.max(1, conductedHours);
          const validAttended = Math.min(validConducted, Math.max(0, attendedHours));
          const percentage = Math.round((validAttended / validConducted) * 1000) / 10;

          return {
            ...item,
            conductedHours: validConducted,
            attendedHours: validAttended,
            percentage,
          };
        });

        // Overall attendance calculation
        const totalConducted = updatedAttendance.reduce((sum, a) => sum + a.conductedHours, 0);
        const totalAttended = updatedAttendance.reduce((sum, a) => sum + a.attendedHours, 0);
        const overall = totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 1000) / 10 : 0;

        return {
          ...student,
          attendanceDetails: updatedAttendance,
          overallAttendance: overall,
        };
      })
    );
  };

  const addAcademicRemark = (
    studentId: string,
    remarkText: string,
    type: AcademicRemark['type']
  ) => {
    if (!canAddRemarks) return;

    const newRemark: AcademicRemark = {
      id: `rem-${Date.now()}`,
      studentId,
      authorName: currentUser?.name || 'Class Advisor',
      authorRole: currentUser?.role === 'hod' ? 'HOD' : 'Class Advisor',
      date: new Date().toISOString().split('T')[0],
      type,
      remark: remarkText,
    };

    setStudents(prev =>
      prev.map(stud => {
        if (stud.id !== studentId) return stud;
        return {
          ...stud,
          remarks: [newRemark, ...stud.remarks],
        };
      })
    );
  };

  const createAssignment = (newAssignment: Omit<Assignment, 'id' | 'submissionsCount' | 'studentStatus'>) => {
    if (!canManageAssignments) return;

    const created: Assignment = {
      ...newAssignment,
      id: `asg-${Date.now()}`,
      submissionsCount: 0,
      totalStudents: students.length,
      studentStatus: 'pending',
    };

    setAssignments(prev => [created, ...prev]);
  };

  const submitAssignment = (assignmentId: string, submissionNotes?: string) => {
    setAssignments(prev =>
      prev.map(asg => {
        if (asg.id !== assignmentId) return asg;
        return {
          ...asg,
          studentStatus: 'submitted',
          submissionsCount: (asg.submissionsCount || 0) + 1,
          feedback: submissionNotes ? `Submitted with note: "${submissionNotes}". Awaiting review.` : 'Submitted on time.',
        };
      })
    );
  };

  const gradeAssignment = (assignmentId: string, marks: number, feedback: string) => {
    if (!canManageAssignments) return;

    setAssignments(prev =>
      prev.map(asg => {
        if (asg.id !== assignmentId) return asg;
        return {
          ...asg,
          studentStatus: 'graded',
          obtainedMarks: marks,
          feedback,
        };
      })
    );
  };

  const createAnnouncement = (newAnn: Omit<Announcement, 'id' | 'date'>) => {
    if (!canPostAnnouncements) return;

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const announcement: Announcement = {
      ...newAnn,
      id: `ann-${Date.now()}`,
      date: dateStr,
    };

    setAnnouncements(prev => [announcement, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    if (!canPostAnnouncements) return;
    setAnnouncements(prev => prev.filter(item => item.id !== id));
  };

  const resetToDefaultData = () => {
    setStudents(INITIAL_STUDENTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    localStorage.removeItem(STUDENTS_STORAGE_KEY);
    localStorage.removeItem(ASSIGNMENTS_STORAGE_KEY);
    localStorage.removeItem(ANNOUNCEMENTS_STORAGE_KEY);
  };

  const getStudentById = (id: string) => students.find(s => s.id === id);
  const getStudentByRegNo = (regNo: string) => students.find(s => s.regNo === regNo);

  return (
    <AcademicContext.Provider
      value={{
        students,
        assignments,
        announcements,
        selectedStudent,
        setSelectedStudent,
        updateStudentMarks,
        updateStudentAttendance,
        addAcademicRemark,
        createAssignment,
        submitAssignment,
        gradeAssignment,
        createAnnouncement,
        deleteAnnouncement,
        resetToDefaultData,
        darkMode,
        toggleDarkMode,
        getStudentById,
        getStudentByRegNo,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademic must be used within an AcademicProvider');
  }
  return context;
};
