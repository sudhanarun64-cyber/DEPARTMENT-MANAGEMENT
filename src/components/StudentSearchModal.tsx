import React, { useState } from 'react';
import { Search, X, User, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import { Student } from '../types';

interface StudentSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (student: Student) => void;
}

export const StudentSearchModal: React.FC<StudentSearchModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectStudent 
}) => {
  const { students } = useAcademic();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredStudents = students.filter(student => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      student.name.toLowerCase().includes(q) ||
      student.regNo.toLowerCase().includes(q) ||
      student.rollNo.toLowerCase().includes(q) ||
      student.advisorName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search student by Register No (e.g. 711122104015), Name, or Roll No..."
            className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 divide-y divide-slate-100 dark:divide-slate-800">
          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No students found matching "{query}". Try searching by name or register number.
            </div>
          ) : (
            filteredStudents.map((student) => {
              const isShortage = student.overallAttendance < 75;
              return (
                <div
                  key={student.id}
                  onClick={() => {
                    onSelectStudent(student);
                    onClose();
                  }}
                  className="p-3 rounded-xl hover:bg-blue-50/70 dark:hover:bg-slate-800/60 cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          {student.name}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {student.regNo}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Sec: {student.section}</span>
                        <span>•</span>
                        <span>Advisor: Prof. {student.advisorName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-xs">
                    {/* Attendance Pill */}
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Attendance</div>
                      <div className={`font-bold flex items-center gap-1 ${isShortage ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {isShortage && <AlertTriangle className="w-3.5 h-3.5" />}
                        <span>{student.overallAttendance}%</span>
                      </div>
                    </div>

                    {/* CGPA Pill */}
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">CGPA</div>
                      <div className="font-bold text-blue-600 dark:text-blue-400">
                        {student.cgpa.toFixed(2)}
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
          <span>{filteredStudents.length} student records found</span>
          <span>Click any student to view detailed academic profile</span>
        </div>

      </div>
    </div>
  );
};
