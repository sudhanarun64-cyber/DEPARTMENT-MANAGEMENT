import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileDown, 
  Edit3, 
  Clock, 
  BookMarked, 
  Phone, 
  Mail, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Award,
  GraduationCap,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { Student } from '../types';
import { useAuth } from '../context/AuthContext';
import { generateStudentMarksheetPDF } from '../utils/pdfGenerator';
import { UpdateMarksModal } from '../components/UpdateMarksModal';
import { UpdateAttendanceModal } from '../components/UpdateAttendanceModal';
import { AddRemarkModal } from '../components/AddRemarkModal';

interface StudentProfileViewProps {
  student: Student;
  onBack: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({ student, onBack }) => {
  const { canEditMarks, canEditAttendance, canAddRemarks } = useAuth();
  
  const [isEditMarksOpen, setIsEditMarksOpen] = useState(false);
  const [isEditAttendanceOpen, setIsEditAttendanceOpen] = useState(false);
  const [isAddRemarkOpen, setIsAddRemarkOpen] = useState(false);

  const isShortage = student.overallAttendance < 75;

  return (
    <div className="space-y-6">
      
      {/* Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Student Roster</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {canEditMarks && (
            <button
              onClick={() => setIsEditMarksOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-blue-100 transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              <span>Update Marks</span>
            </button>
          )}

          {canEditAttendance && (
            <button
              onClick={() => setIsEditAttendanceOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-100 transition"
            >
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Update Attendance</span>
            </button>
          )}

          {canAddRemarks && (
            <button
              onClick={() => setIsAddRemarkOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-purple-100 transition"
            >
              <BookMarked className="w-4 h-4 text-purple-600" />
              <span>Add Remark</span>
            </button>
          )}

          <button
            onClick={() => generateStudentMarksheetPDF(student)}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Marksheet PDF</span>
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-black text-3xl flex items-center justify-center shadow-lg shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {student.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                  {student.regNo}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {student.department} • Year {student.year} (Semester {student.semester}) • Section {student.section}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                <span>Roll No: <strong>{student.rollNo}</strong></span>
                <span>•</span>
                <span>Advisor: <strong>Prof. {student.advisorName}</strong></span>
                <span>•</span>
                <span>HOD: <strong>Dr. {student.hodName}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-center min-w-[100px]">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Attendance</span>
              <span className={`text-xl font-black block mt-0.5 ${isShortage ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {student.overallAttendance}%
              </span>
              <span className="text-[9px] text-slate-400 block">{isShortage ? 'Shortage' : 'Safe'}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-center min-w-[100px]">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">CGPA</span>
              <span className="text-xl font-black text-blue-600 dark:text-blue-400 block mt-0.5">
                {student.cgpa.toFixed(2)}
              </span>
              <span className="text-[9px] text-slate-400 block">Sem V: {student.currentGpa.toFixed(2)}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-center min-w-[100px]">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Standing Arrears</span>
              <span className={`text-xl font-black block mt-0.5 ${student.arrearsCount === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {student.arrearsCount === 0 ? 'Nil' : student.arrearsCount}
              </span>
              <span className="text-[9px] text-slate-400 block">{student.arrearsCount === 0 ? 'All Clear' : 'Active'}</span>
            </div>
          </div>

        </div>

        {/* Bio Particulars Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Email Address</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block mt-0.5">{student.email}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Student Phone</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">{student.phone}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Date of Birth / Blood Group</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">{student.dob} ({student.bloodGroup})</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Father / Guardian Contact</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">{student.fatherName} ({student.parentPhone})</span>
          </div>
        </div>
      </div>

      {/* Internal Marks Audit Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Continuous Internal Assessment (CIA) Performance
            </h3>
            <p className="text-xs text-slate-500">Marks converted as per Anna University regulation out of 40</p>
          </div>
          {canEditMarks && (
            <button
              onClick={() => setIsEditMarksOpen(true)}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Modify Scores →
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Subject Code & Name</th>
                <th className="py-2.5 px-3 text-center">IAT-1 (50)</th>
                <th className="py-2.5 px-3 text-center">IAT-2 (50)</th>
                <th className="py-2.5 px-3 text-center">Model Exam (100)</th>
                <th className="py-2.5 px-3 text-center">Assignment (20)</th>
                <th className="py-2.5 px-3 text-center">Internal (40)</th>
                <th className="py-2.5 px-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {student.internalMarks.map((m) => (
                <tr key={m.subjectCode} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3">
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold block">{m.subjectCode}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{m.subjectName}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-semibold text-slate-700 dark:text-slate-300">{m.iat1}</td>
                  <td className="py-2.5 px-3 text-center font-semibold text-slate-700 dark:text-slate-300">{m.iat2}</td>
                  <td className="py-2.5 px-3 text-center font-semibold text-slate-700 dark:text-slate-300">{m.modelExam}</td>
                  <td className="py-2.5 px-3 text-center font-semibold text-slate-700 dark:text-slate-300">{m.assignmentMark}</td>
                  <td className="py-2.5 px-3 text-center font-black text-blue-600 dark:text-blue-400 text-sm">{m.totalInternal}</td>
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

      {/* Subject Attendance Breakdown & Remarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Attendance Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Subject Attendance Log</h3>
            <span className="text-xs text-slate-400">Anna Univ Min: 75%</span>
          </div>

          <div className="space-y-3">
            {student.attendanceDetails.map(a => (
              <div key={a.subjectCode} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-blue-600 font-semibold">{a.subjectCode}</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{a.subjectName}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{a.attendedHours} / {a.conductedHours} hours</div>
                </div>

                <div className="text-right">
                  <span className={`text-sm font-bold ${a.percentage < 75 ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {a.percentage}%
                  </span>
                  <span className="text-[10px] text-slate-400 block">{a.percentage < 75 ? 'Shortage' : 'Eligible'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mentoring Remarks History */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Academic & Counseling Remarks</h3>
            {canAddRemarks && (
              <button
                onClick={() => setIsAddRemarkOpen(true)}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                + Add Remark
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {student.remarks.map(rem => (
              <div key={rem.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white">{rem.authorName}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-purple-100 text-purple-700 rounded font-semibold">{rem.authorRole}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{rem.date}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rem.remark}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modals */}
      {isEditMarksOpen && (
        <UpdateMarksModal
          isOpen={isEditMarksOpen}
          onClose={() => setIsEditMarksOpen(false)}
          student={student}
        />
      )}

      {isEditAttendanceOpen && (
        <UpdateAttendanceModal
          isOpen={isEditAttendanceOpen}
          onClose={() => setIsEditAttendanceOpen(false)}
          student={student}
        />
      )}

      {isAddRemarkOpen && (
        <AddRemarkModal
          isOpen={isAddRemarkOpen}
          onClose={() => setIsAddRemarkOpen(false)}
          student={student}
        />
      )}

    </div>
  );
};
