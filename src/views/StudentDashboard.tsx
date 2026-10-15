import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  Clock, 
  FileSpreadsheet, 
  CheckSquare, 
  FileDown, 
  BookMarked, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  UserCheck, 
  Building2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import { useAuth } from '../context/AuthContext';
import { Student, Assignment } from '../types';
import { generateStudentMarksheetPDF } from '../utils/pdfGenerator';
import { SubmitAssignmentModal } from '../components/AssignmentModals';
import { COLLEGE_INFO } from '../data/initialData';

interface StudentDashboardProps {
  currentTab: string;
  onOpenAnnouncements: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  currentTab, 
  onOpenAnnouncements 
}) => {
  const { students, assignments, announcements } = useAcademic();
  const { currentUser } = useAuth();

  // Find target student: Arusudhan or first student
  const student: Student = 
    students.find(s => s.regNo === currentUser?.regNo || s.name.toLowerCase().includes('arusudhan')) || 
    students[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'marks' | 'attendance' | 'assignments' | 'results' | 'remarks'>('overview');
  const [selectedAssignmentForSubmit, setSelectedAssignmentForSubmit] = useState<Assignment | null>(null);

  // Sync with sidebar tab if provided
  React.useEffect(() => {
    if (['overview', 'marks', 'attendance', 'assignments', 'results', 'remarks'].includes(currentTab)) {
      setActiveTab(currentTab as any);
    } else if (currentTab === 'marksheet') {
      generateStudentMarksheetPDF(student);
    }
  }, [currentTab]);

  const isShortage = student.overallAttendance < 75;

  return (
    <div className="space-y-6">
      
      {/* Student Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-1 shadow-lg shrink-0 ring-4 ring-white/10">
              <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center font-extrabold text-2xl text-white">
                {student.name.charAt(0)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Welcome, {student.name}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Reg: {student.regNo}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-200/90 mt-1">
                {student.department} • Year {student.year} (Semester {student.semester}) • Section {student.section}
              </p>
              <div className="flex items-center gap-4 text-xs text-blue-300/80 mt-2 flex-wrap">
                <span>Class Advisor: <strong>Prof. {student.advisorName}</strong></span>
                <span>•</span>
                <span>HOD: <strong>Dr. {student.hodName}</strong></span>
                <span>•</span>
                <span>Batch: {student.batch}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => generateStudentMarksheetPDF(student)}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs flex items-center gap-2 shadow-md transition transform active:scale-95"
            >
              <FileDown className="w-4 h-4 text-blue-700" />
              <span>Download Official Marksheet (PDF)</span>
            </button>
          </div>
        </div>

        {/* Academic Stat Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider flex items-center justify-between">
              <span>Overall Attendance</span>
              <Clock className="w-4 h-4 text-emerald-300" />
            </div>
            <div className={`text-2xl font-black mt-1 ${isShortage ? 'text-rose-400' : 'text-white'}`}>
              {student.overallAttendance}%
            </div>
            <div className="text-[10px] mt-0.5 flex items-center gap-1">
              {isShortage ? (
                <span className="text-rose-300 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Shortage (&lt;75%)
                </span>
              ) : (
                <span className="text-emerald-300 font-semibold">✓ Eligible for Sem VI Exams</span>
              )}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider flex items-center justify-between">
              <span>Cumulative CGPA</span>
              <Award className="w-4 h-4 text-amber-300" />
            </div>
            <div className="text-2xl font-black mt-1 text-white">{student.cgpa.toFixed(2)}</div>
            <div className="text-[10px] text-amber-200 mt-0.5">Sem V GPA: {student.currentGpa.toFixed(2)}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider flex items-center justify-between">
              <span>Arrears Status</span>
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="text-2xl font-black mt-1 text-white">
              {student.arrearsCount === 0 ? 'All Clear' : `${student.arrearsCount} Standing`}
            </div>
            <div className="text-[10px] text-cyan-200 mt-0.5">
              {student.arrearsCount === 0 ? 'Zero backlogs verified' : 'Requires remedial test'}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider flex items-center justify-between">
              <span>Mentor Remarks</span>
              <BookMarked className="w-4 h-4 text-indigo-300" />
            </div>
            <div className="text-2xl font-black mt-1 text-white">{student.remarks.length} Recorded</div>
            <div className="text-[10px] text-indigo-200 mt-0.5">From Advisor & HOD</div>
          </div>
        </div>

      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        {[
          { id: 'overview', label: 'Academic Overview' },
          { id: 'marks', label: 'Internal Assessment Marks' },
          { id: 'attendance', label: 'Subject-wise Attendance' },
          { id: 'assignments', label: 'Assignments & Deadlines' },
          { id: 'results', label: 'Semester Results History' },
          { id: 'remarks', label: 'Faculty Remarks' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick Internal Marks Table */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Current Internal Marks (Semester VI)
                  </h3>
                  <p className="text-xs text-slate-500">Continuous Assessment Tests: IAT-1, IAT-2, Model Exam</p>
                </div>
                <button
                  onClick={() => setActiveTab('marks')}
                  className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Full Sheet →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Course</th>
                      <th className="py-2.5 px-3 text-center">IAT-1 (50)</th>
                      <th className="py-2.5 px-3 text-center">IAT-2 (50)</th>
                      <th className="py-2.5 px-3 text-center">Model (100)</th>
                      <th className="py-2.5 px-3 text-center">Total (40)</th>
                      <th className="py-2.5 px-3 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {student.internalMarks.map((m) => (
                      <tr key={m.subjectCode} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3">
                          <span className="font-mono text-blue-600 dark:text-blue-400 font-bold block">{m.subjectCode}</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px] block">{m.subjectName}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-semibold text-slate-700 dark:text-slate-300">{m.iat1}</td>
                        <td className="py-2.5 px-3 text-center font-semibold text-slate-700 dark:text-slate-300">{m.iat2}</td>
                        <td className="py-2.5 px-3 text-center font-semibold text-slate-700 dark:text-slate-300">{m.modelExam}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-blue-600 dark:text-blue-400">{m.totalInternal}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            {m.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Attendance & Counseling Snapshot */}
            <div className="space-y-6">
              
              {/* Attendance Card */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Attendance Meter</h4>
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                    Anna Univ 75%
                  </span>
                </div>

                <div className="flex items-center space-x-4 pt-1">
                  <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                      <circle 
                        cx="40" 
                        cy="40" 
                        r="32" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        className={isShortage ? "text-rose-500" : "text-emerald-500"} 
                        strokeDasharray={201} 
                        strokeDashoffset={201 - (201 * student.overallAttendance) / 100}
                        strokeLinecap="round"
                        fill="transparent" 
                      />
                    </svg>
                    <span className="absolute font-black text-sm text-slate-900 dark:text-white">
                      {student.overallAttendance}%
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {isShortage ? 'Attendance Warning' : 'Regular Attendance'}
                    </div>
                    <p className="text-slate-500 text-[11px] leading-tight">
                      {isShortage 
                        ? 'Your attendance has dropped below 75%. Please contact Class Advisor Prof. Madhesh.'
                        : 'Attendance is above 90%. Eligible for university theory and practical exams.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('attendance')}
                  className="w-full mt-2 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 transition"
                >
                  View Subject Breakdown →
                </button>
              </div>

              {/* Latest Advisor Remark */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Advisor Mentoring Remark</h4>
                  <BookMarked className="w-4 h-4 text-purple-600" />
                </div>

                {student.remarks.length > 0 ? (
                  <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 text-xs">
                    <div className="flex justify-between items-center text-[10px] text-purple-700 dark:text-purple-300 font-semibold mb-1">
                      <span>{student.remarks[0].authorName} ({student.remarks[0].authorRole})</span>
                      <span>{student.remarks[0].date}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                      "{student.remarks[0].remark}"
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No remarks recorded yet.</p>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Internal Assessment Marks */}
      {activeTab === 'marks' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Continuous Internal Assessment (CIA) - Semester VI
              </h3>
              <p className="text-xs text-slate-500">
                Official records evaluated by Course Faculty & Approved by Dr. Palani, HOD
              </p>
            </div>
            
            <button
              onClick={() => generateStudentMarksheetPDF(student)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition self-start sm:self-auto"
            >
              <FileDown className="w-4 h-4" />
              <span>Download PDF Marksheet</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Subject Code & Name</th>
                  <th className="py-3 px-4 text-center">IAT-1 (50)</th>
                  <th className="py-3 px-4 text-center">IAT-2 (50)</th>
                  <th className="py-3 px-4 text-center">Model Exam (100)</th>
                  <th className="py-3 px-4 text-center">Assignment (20)</th>
                  <th className="py-3 px-4 text-center">Converted Total (40)</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {student.internalMarks.map((m) => (
                  <tr key={m.subjectCode} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold block">{m.subjectCode}</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm block">{m.subjectName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800 dark:text-slate-200 text-sm">{m.iat1}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800 dark:text-slate-200 text-sm">{m.iat2}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800 dark:text-slate-200 text-sm">{m.modelExam}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800 dark:text-slate-200 text-sm">{m.assignmentMark}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-black text-blue-700 dark:text-blue-300 text-base">
                        {m.totalInternal}
                      </span>
                      <span className="text-[10px] text-slate-400 block">/ 40</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                        {m.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Note: Anna University internal marks conversion weightage: IATs (15) + Model (15) + Assignment (10) = 40.</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Verified by Prof. Madhesh</span>
          </div>
        </div>
      )}

      {/* Tab 3: Subject-wise Attendance */}
      {activeTab === 'attendance' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Cumulative Subject-wise Attendance Status
              </h3>
              <p className="text-xs text-slate-500">
                Minimum mandatory attendance requirement for Anna University examinations is 75%
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                isShortage ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                Overall: {student.overallAttendance}% {isShortage ? '(Shortage Alert)' : '(Eligible)'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {student.attendanceDetails.map((item) => {
              const itemShortage = item.percentage < 75;
              return (
                <div key={item.subjectCode} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">{item.subjectCode}</span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.subjectName}</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      itemShortage ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.percentage}%
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Attended: {item.attendedHours} hrs / {item.conductedHours} conducted</span>
                      <span>Target: &gt;75%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all ${itemShortage ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Assignments & Deadlines */}
      {activeTab === 'assignments' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Coursework Assignments & Submission Portal
              </h3>
              <p className="text-xs text-slate-500">
                Submit assignments before deadline to obtain maximum internal assessment weightage
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {assignments.map((asg) => {
              const isSubmitted = asg.studentStatus === 'submitted';
              return (
                <div 
                  key={asg.id} 
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                        {asg.subjectCode}
                      </span>
                      <span className="text-xs text-slate-500">{asg.subjectName}</span>
                      <span className="text-xs text-slate-400">• Due: <strong>{asg.dueDate}</strong></span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {asg.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {asg.description}
                    </p>

                    {asg.feedback && (
                      <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-200 dark:border-emerald-900">
                        <strong>Advisor Feedback:</strong> {asg.feedback}
                        {asg.obtainedMarks && (
                          <span className="ml-2 font-bold bg-emerald-200 dark:bg-emerald-900 px-1.5 py-0.5 rounded">
                            Score: {asg.obtainedMarks} / {asg.maxMarks}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                    <span className="text-xs text-slate-400">Max Marks: <strong>{asg.maxMarks}</strong></span>
                    
                    {isSubmitted ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submitted Successfully</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedAssignmentForSubmit(asg)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Solution</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: Semester Results History */}
      {activeTab === 'results' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Anna University Semester Examination Records
              </h3>
              <p className="text-xs text-slate-500">
                Cumulative Performance across Semester I to V • B.E. Computer Science & Engineering
              </p>
            </div>
            
            <div className="text-right">
              <span className="text-xs text-slate-400">Graduating CGPA:</span>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {student.cgpa.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {student.semesterResults.map((sem) => (
              <div key={sem.semester} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      S{sem.semester}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Semester {sem.semester} Examination
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      {sem.status}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      GPA: {sem.gpa.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-2">
                      Credits: {sem.creditsEarned} / {sem.totalCredits}
                    </span>
                  </div>
                </div>

                {sem.courses.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    {sem.courses.map((c) => (
                      <div key={c.code} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono text-[10px] text-blue-600 font-semibold">{c.code}</span>
                          <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[190px]">{c.name}</div>
                        </div>
                        <span className="font-black px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-xs">
                          {c.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Faculty Remarks */}
      {activeTab === 'remarks' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Faculty Counseling & Mentoring Log
            </h3>
            <p className="text-xs text-slate-500">
              Official academic guidance notes from Class Advisor Prof. Madhesh and Dr. Palani, HOD
            </p>
          </div>

          <div className="space-y-3">
            {student.remarks.map((rem) => (
              <div key={rem.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{rem.authorName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {rem.authorRole}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 capitalize">
                      {rem.type}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">{rem.date}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                  {rem.remark}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Assignment Modal */}
      {selectedAssignmentForSubmit && (
        <SubmitAssignmentModal
          isOpen={!!selectedAssignmentForSubmit}
          onClose={() => setSelectedAssignmentForSubmit(null)}
          assignment={selectedAssignmentForSubmit}
        />
      )}

    </div>
  );
};
