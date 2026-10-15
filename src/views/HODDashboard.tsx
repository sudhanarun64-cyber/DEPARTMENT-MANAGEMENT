import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  AlertTriangle, 
  Clock, 
  FileDown, 
  Search, 
  Filter, 
  Eye, 
  FileSpreadsheet, 
  CheckCircle, 
  TrendingUp, 
  Sparkles, 
  Calendar,
  Building2,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import { useAuth } from '../context/AuthContext';
import { Student } from '../types';
import { generateDepartmentSummaryPDF, generateStudentMarksheetPDF } from '../utils/pdfGenerator';
import { COLLEGE_INFO } from '../data/initialData';

interface HODDashboardProps {
  currentTab: string;
  onSelectStudent: (student: Student) => void;
  onOpenAnnouncements: () => void;
}

export const HODDashboard: React.FC<HODDashboardProps> = ({ 
  currentTab, 
  onSelectStudent, 
  onOpenAnnouncements 
}) => {
  const { students, assignments } = useAcademic();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'safe' | 'shortage' | 'arrears'>('all');
  const [alertSent, setAlertSent] = useState(false);

  // Department Aggregates
  const totalStudents = students.length;
  const avgAttendance = Math.round((students.reduce((acc, s) => acc + s.overallAttendance, 0) / totalStudents) * 10) / 10;
  const avgCgpa = Math.round((students.reduce((acc, s) => acc + s.cgpa, 0) / totalStudents) * 100) / 100;
  const shortageStudents = students.filter(s => s.overallAttendance < 75);
  const studentsWithArrears = students.filter(s => s.arrearsCount > 0);
  const passPercentage = Math.round(((totalStudents - studentsWithArrears.length) / totalStudents) * 1000) / 10;

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      s.regNo.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase().trim());

    if (!matchesSearch) return false;

    if (filterType === 'safe') return s.overallAttendance >= 75;
    if (filterType === 'shortage') return s.overallAttendance < 75;
    if (filterType === 'arrears') return s.arrearsCount > 0;
    return true;
  });

  const handleDownloadDepartmentPDF = () => {
    generateDepartmentSummaryPDF(students, currentUser?.name || 'Palani');
  };

  const handleNotifyShortage = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Department & HOD Identity */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-semibold text-blue-200 mb-2">
              <Building2 className="w-3.5 h-3.5 text-blue-300" />
              <span>Head of the Department Console • Dr. Palani</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Department of Computer Science & Engineering
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/80 mt-1 max-w-2xl">
              {COLLEGE_INFO.name} • Class In-Charge: Prof. Madhesh (Section A) • Batch 2022-2026
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadDepartmentPDF}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs flex items-center gap-2 shadow-md transition transform active:scale-95"
            >
              <FileDown className="w-4 h-4 text-blue-700" />
              <span>Export Official PDF Report</span>
            </button>
            <button
              onClick={onOpenAnnouncements}
              className="px-4 py-2.5 rounded-xl bg-blue-600/60 hover:bg-blue-600 text-white font-semibold text-xs border border-blue-400/40 flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Post Circular</span>
            </button>
          </div>
        </div>

        {/* Academic KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider flex items-center justify-between">
              <span>Total Enrollment</span>
              <Users className="w-4 h-4 text-blue-300" />
            </div>
            <div className="text-2xl font-black mt-1 text-white">{totalStudents} Students</div>
            <div className="text-[10px] text-blue-200 mt-0.5">Section A • 100% Registered</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider flex items-center justify-between">
              <span>Dept Avg Attendance</span>
              <Clock className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="text-2xl font-black mt-1 text-white">{avgAttendance}%</div>
            <div className="text-[10px] text-emerald-300 mt-0.5">Above Anna Univ norm (75%)</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider flex items-center justify-between">
              <span>Department CGPA</span>
              <Award className="w-4 h-4 text-amber-300" />
            </div>
            <div className="text-2xl font-black mt-1 text-white">{avgCgpa}</div>
            <div className="text-[10px] text-blue-200 mt-0.5">First Class with Distinction</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider flex items-center justify-between">
              <span>All-Clear Pass Rate</span>
              <TrendingUp className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="text-2xl font-black mt-1 text-white">{passPercentage}%</div>
            <div className="text-[10px] text-cyan-200 mt-0.5">{totalStudents - studentsWithArrears.length} of {totalStudents} clear all papers</div>
          </div>
        </div>

      </div>

      {/* Attendance Shortage Alert Bar if any students < 75% */}
      {shortageStudents.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                Attendance Shortage Notice ({shortageStudents.length} Students below 75%)
              </h4>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                Students below 75% attendance are ineligible for Anna University Semester VI examinations without condonation approval.
                Students affected: {shortageStudents.map(s => `${s.name} (${s.overallAttendance}%)`).join(', ')}.
              </p>
            </div>
          </div>

          <button
            onClick={handleNotifyShortage}
            disabled={alertSent}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm transition ${
              alertSent
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {alertSent ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Advisors Notified!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Issue Counseling Alert to Advisor Madhesh</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Performance & Attendance Analytics Visual Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attendance Breakdown Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Attendance Audit</h3>
              <p className="text-xs text-slate-500">Distribution across 75% threshold</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800">
              Anna Univ Norm
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-600 dark:text-slate-400">Above 90% (Distinction Safe)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {students.filter(s => s.overallAttendance >= 90).length} Students
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(students.filter(s => s.overallAttendance >= 90).length / totalStudents) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-600 dark:text-slate-400">75% - 89% (Regular Eligible)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {students.filter(s => s.overallAttendance >= 75 && s.overallAttendance < 90).length} Students
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(students.filter(s => s.overallAttendance >= 75 && s.overallAttendance < 90).length / totalStudents) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-rose-600 dark:text-rose-400 font-semibold">Below 75% (Shortage / Condonation)</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {shortageStudents.length} Students
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-rose-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(shortageStudents.length / totalStudents) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <span>Class In-charge: <strong>Prof. Madhesh</strong></span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Verified Daily</span>
          </div>
        </div>

        {/* Continuous Assessment Subjects Average */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Subject-wise Pass Averages</h3>
              <p className="text-xs text-slate-500">Internal assessment metrics (Max 40)</p>
            </div>
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { code: 'CS3691', name: 'Artificial Intelligence & ML', avg: 36.5, max: 40 },
              { code: 'CS3601', name: 'Compiler Design', avg: 34.2, max: 40 },
              { code: 'CB3491', name: 'Cryptography & Cyber Security', avg: 37.1, max: 40 },
              { code: 'CS3602', name: 'Mobile Application Dev', avg: 35.0, max: 40 },
              { code: 'CS3611', name: 'AI & Mobile Apps Lab', avg: 38.6, max: 40 },
            ].map(sub => (
              <div key={sub.code} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{sub.code}</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">{sub.name}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{sub.avg}</span>
                  <span className="text-[10px] text-slate-400"> / 40</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignment & Lab Completion Rates */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Assignment Submissions</h3>
                <p className="text-xs text-slate-500">Class III-CSE-A oversight</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                Active Cycle
              </span>
            </div>

            <div className="space-y-3">
              {assignments.slice(0, 3).map(asg => {
                const subRate = Math.round(((asg.submissionsCount || 0) / (asg.totalStudents || 60)) * 100);
                return (
                  <div key={asg.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-start text-xs mb-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                        {asg.title}
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">
                        {asg.submissionsCount}/{asg.totalStudents} ({subRate}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${subRate}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Class Advisor: <strong>Prof. Madhesh</strong></span>
            <button 
              onClick={onOpenAnnouncements}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Post Reminder →
            </button>
          </div>
        </div>

      </div>

      {/* Main Student Directory & Performance Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Table Filter & Search Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Student Academic Directory & Audit Table
            </h3>
            <p className="text-xs text-slate-500">
              Department of Computer Science & Engineering • Section A
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by name or Reg No..."
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-56"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                  filterType === 'all'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All ({students.length})
              </button>
              <button
                onClick={() => setFilterType('safe')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                  filterType === 'safe'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Safe &gt;75%
              </button>
              <button
                onClick={() => setFilterType('shortage')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                  filterType === 'shortage'
                    ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Shortage ({shortageStudents.length})
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Register Number</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Section / Advisor</th>
                <th className="py-3.5 px-4 text-center">Attendance %</th>
                <th className="py-3.5 px-4 text-center">Current GPA</th>
                <th className="py-3.5 px-4 text-center">CGPA</th>
                <th className="py-3.5 px-4 text-center">Arrears</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
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
                      isArusudhan ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <span>{student.regNo}</span>
                        {isArusudhan && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-sans font-bold">
                            Target Student
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{student.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">Roll: {student.rollNo}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      <div>Sec {student.section}</div>
                      <div className="text-[11px] text-slate-400">Prof. {student.advisorName}</div>
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

                    <td className="py-3.5 px-4 text-center font-bold text-blue-600 dark:text-blue-400">
                      {student.cgpa.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {student.arrearsCount === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xs">Nil</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                          {student.arrearsCount} Arrear
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-semibold text-xs transition flex items-center gap-1"
                          title="View Full Profile & Remarks"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => generateStudentMarksheetPDF(student)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Download Marksheet PDF"
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

        {/* Table Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Displaying {filteredStudents.length} of {students.length} verified CSE records</span>
          <span className="font-medium text-slate-600 dark:text-slate-400">
            Official records verified by Dr. Palani, HOD
          </span>
        </div>

      </div>

    </div>
  );
};
