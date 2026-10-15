import React, { useState } from 'react';
import { 
  Users, 
  FileSpreadsheet, 
  Clock, 
  CheckSquare, 
  BookMarked, 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  FileDown, 
  CheckCircle, 
  AlertTriangle,
  GraduationCap,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import { useAuth } from '../context/AuthContext';
import { Student, Assignment } from '../types';
import { UpdateMarksModal } from '../components/UpdateMarksModal';
import { UpdateAttendanceModal } from '../components/UpdateAttendanceModal';
import { AddRemarkModal } from '../components/AddRemarkModal';
import { CreateAssignmentModal } from '../components/AssignmentModals';
import { generateStudentMarksheetPDF } from '../utils/pdfGenerator';

interface AdvisorDashboardProps {
  currentTab: string;
  onSelectStudent: (student: Student) => void;
  onOpenAnnouncements: () => void;
}

export const AdvisorDashboard: React.FC<AdvisorDashboardProps> = ({ 
  currentTab, 
  onSelectStudent, 
  onOpenAnnouncements 
}) => {
  const { students, assignments } = useAcademic();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'safe' | 'shortage'>('all');

  // Modals state
  const [targetStudentForMarks, setTargetStudentForMarks] = useState<Student | null>(null);
  const [targetStudentForAttendance, setTargetStudentForAttendance] = useState<Student | null>(null);
  const [targetStudentForRemark, setTargetStudentForRemark] = useState<Student | null>(null);
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);

  // Active view toggle within Advisor dashboard: 'students' or 'assignments'
  const [activeAdvisorTab, setActiveAdvisorTab] = useState<'roster' | 'assignments'>('roster');

  const assignedStudents = students; // Section A
  const shortageCount = assignedStudents.filter(s => s.overallAttendance < 75).length;

  const filteredStudents = assignedStudents.filter(s => {
    const matches = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      s.regNo.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase().trim());
    if (!matches) return false;
    if (filterType === 'safe') return s.overallAttendance >= 75;
    if (filterType === 'shortage') return s.overallAttendance < 75;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Advisor Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-800 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-semibold text-blue-200 mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
              <span>Class Advisor Console • Prof. Madhesh</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Class III Year - CSE 'A' Advisory Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/80 mt-1 max-w-2xl">
              HOD: Dr. Palani • Academic Year 2025-2026 • Semester VI Continuous Assessment Monitoring
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsCreateAssignmentOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs flex items-center gap-2 shadow-md transition"
            >
              <Plus className="w-4 h-4 text-blue-700" />
              <span>Create New Assignment</span>
            </button>
            <button
              onClick={onOpenAnnouncements}
              className="px-4 py-2.5 rounded-xl bg-blue-600/60 hover:bg-blue-600 text-white font-semibold text-xs border border-blue-400/40 flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Post Announcement</span>
            </button>
          </div>
        </div>

        {/* Quick Advisor Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider flex items-center justify-between">
              <span>Class Strength</span>
              <Users className="w-4 h-4 text-blue-300" />
            </div>
            <div className="text-2xl font-black mt-1 text-white">{assignedStudents.length} Students</div>
            <div className="text-[10px] text-blue-200 mt-0.5">Assigned to Prof. Madhesh</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider flex items-center justify-between">
              <span>Attendance Status</span>
              <Clock className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="text-2xl font-black mt-1 text-white">
              {shortageCount === 0 ? '100% Safe' : `${shortageCount} Shortage Cases`}
            </div>
            <div className="text-[10px] text-emerald-300 mt-0.5">&lt; 75% requires counseling</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider flex items-center justify-between">
              <span>Active Assignments</span>
              <CheckSquare className="w-4 h-4 text-amber-300" />
            </div>
            <div className="text-2xl font-black mt-1 text-white">{assignments.length} Tasks</div>
            <div className="text-[10px] text-blue-200 mt-0.5">Due in Semester VI</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider flex items-center justify-between">
              <span>Target Student</span>
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="text-xl font-black mt-1 text-white truncate">Arusudhan</div>
            <div className="text-[10px] text-cyan-200 mt-0.5">Reg: 711122104015 (91.5% Att)</div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveAdvisorTab('roster')}
          className={`px-5 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeAdvisorTab === 'roster'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Assigned Students & Mark Entry ({assignedStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveAdvisorTab('assignments')}
          className={`px-5 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeAdvisorTab === 'assignments'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Class Assignments Management ({assignments.length})</span>
        </button>
      </div>

      {activeAdvisorTab === 'roster' ? (
        /* Student Roster with Action Triggers */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          
          {/* Filters & Search */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Class III-CSE-A Roster & Direct Operations
              </h3>
              <p className="text-xs text-slate-500">
                Click "Edit Marks", "Attendance", or "Remark" to update student records directly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student or Reg No..."
                  className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-56"
                />
              </div>

              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                    filterType === 'all'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('safe')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                    filterType === 'safe'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Safe &gt;75%
                </button>
                <button
                  onClick={() => setFilterType('shortage')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                    filterType === 'shortage'
                      ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Shortage
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Student Details</th>
                  <th className="py-3.5 px-4 text-center">Attendance %</th>
                  <th className="py-3.5 px-4 text-center">Semester GPA</th>
                  <th className="py-3.5 px-4 text-center">Remarks Count</th>
                  <th className="py-3.5 px-4 text-right">Academic Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((student) => {
                  const isShortage = student.overallAttendance < 75;
                  const isArusudhan = student.name.toLowerCase().includes('arusudhan');
                  return (
                    <tr 
                      key={student.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition ${
                        isArusudhan ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{student.name}</span>
                              {isArusudhan && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-bold">
                                  Primary Student
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              Reg: {student.regNo} | Roll: {student.rollNo}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          isShortage 
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' 
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        }`}>
                          {student.overallAttendance}%
                          {isShortage && <AlertTriangle className="w-3 h-3 ml-1" />}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                        {student.currentGpa.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {student.remarks.length} Remarks
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5 flex-wrap gap-y-1">
                          {/* Update Marks Button */}
                          <button
                            onClick={() => setTargetStudentForMarks(student)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-semibold text-xs transition flex items-center gap-1 border border-blue-200 dark:border-blue-800"
                            title="Update IAT 1, IAT 2, Model Exam Marks"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                            <span>Marks</span>
                          </button>

                          {/* Update Attendance Button */}
                          <button
                            onClick={() => setTargetStudentForAttendance(student)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-semibold text-xs transition flex items-center gap-1 border border-emerald-200 dark:border-emerald-800"
                            title="Update Attended Hours"
                          >
                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Attendance</span>
                          </button>

                          {/* Add Remark Button */}
                          <button
                            onClick={() => setTargetStudentForRemark(student)}
                            className="px-2.5 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 font-semibold text-xs transition flex items-center gap-1 border border-purple-200 dark:border-purple-800"
                            title="Add Academic or Mentoring Remark"
                          >
                            <BookMarked className="w-3.5 h-3.5 text-purple-600" />
                            <span>Remark</span>
                          </button>

                          {/* View Full Profile */}
                          <button
                            onClick={() => onSelectStudent(student)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Full Student Bio & History"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Download Marksheet */}
                          <button
                            onClick={() => generateStudentMarksheetPDF(student)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Print / Download PDF Marksheet"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex justify-between items-center">
            <span>Advisor: <strong>Prof. Madhesh</strong> • Class Section III-A</span>
            <span className="text-emerald-600 font-semibold">Changes sync immediately with student portal</span>
          </div>

        </div>
      ) : (
        /* Assignments Management View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Coursework Assignments & Deadlines
              </h3>
              <p className="text-xs text-slate-500">
                Track submissions, assign questions, and review student laboratory code.
              </p>
            </div>

            <button
              onClick={() => setIsCreateAssignmentOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assignment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map(asg => {
              const subPct = Math.round(((asg.submissionsCount || 0) / (asg.totalStudents || 60)) * 100);
              return (
                <div key={asg.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                        {asg.subjectCode}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Due: {asg.dueDate}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">
                      {asg.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                      {asg.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-slate-500">Submissions Progress</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {asg.submissionsCount} / {asg.totalStudents} ({subPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${subPct}%` }} />
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Max Marks: <strong>{asg.maxMarks}</strong></span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        ✓ Assigned by {asg.assignedBy}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Modals */}
      {targetStudentForMarks && (
        <UpdateMarksModal
          isOpen={!!targetStudentForMarks}
          onClose={() => setTargetStudentForMarks(null)}
          student={targetStudentForMarks}
        />
      )}

      {targetStudentForAttendance && (
        <UpdateAttendanceModal
          isOpen={!!targetStudentForAttendance}
          onClose={() => setTargetStudentForAttendance(null)}
          student={targetStudentForAttendance}
        />
      )}

      {targetStudentForRemark && (
        <AddRemarkModal
          isOpen={!!targetStudentForRemark}
          onClose={() => setTargetStudentForRemark(null)}
          student={targetStudentForRemark}
        />
      )}

      {isCreateAssignmentOpen && (
        <CreateAssignmentModal
          isOpen={isCreateAssignmentOpen}
          onClose={() => setIsCreateAssignmentOpen(false)}
        />
      )}

    </div>
  );
};
