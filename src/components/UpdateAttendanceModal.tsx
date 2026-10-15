import React, { useState } from 'react';
import { X, Check, Clock, AlertTriangle } from 'lucide-react';
import { Student } from '../types';
import { useAcademic } from '../context/AcademicContext';

interface UpdateAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export const UpdateAttendanceModal: React.FC<UpdateAttendanceModalProps> = ({ 
  isOpen, 
  onClose, 
  student 
}) => {
  const { updateStudentAttendance } = useAcademic();
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(
    student.attendanceDetails[0]?.subjectCode || ''
  );

  const currentItem = student.attendanceDetails.find(a => a.subjectCode === selectedSubjectCode) || student.attendanceDetails[0];

  const [attendedHours, setAttendedHours] = useState<number>(currentItem?.attendedHours || 0);
  const [conductedHours, setConductedHours] = useState<number>(currentItem?.conductedHours || 40);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubjectChange = (code: string) => {
    setSelectedSubjectCode(code);
    const item = student.attendanceDetails.find(a => a.subjectCode === code);
    if (item) {
      setAttendedHours(item.attendedHours);
      setConductedHours(item.conductedHours);
      setSaveSuccess(false);
    }
  };

  if (!isOpen) return null;

  const validConducted = Math.max(1, conductedHours);
  const validAttended = Math.min(validConducted, Math.max(0, attendedHours));
  const livePct = Math.round((validAttended / validConducted) * 1000) / 10;
  const isShortage = livePct < 75;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentAttendance(student.id, selectedSubjectCode, validAttended, validConducted);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-200" />
            <div>
              <h3 className="font-bold text-sm">Update Student Attendance</h3>
              <p className="text-xs text-blue-100 opacity-90">
                {student.name} ({student.regNo})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Subject:
            </label>
            <select
              value={selectedSubjectCode}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {student.attendanceDetails.map(item => (
                <option key={item.subjectCode} value={item.subjectCode}>
                  [{item.subjectCode}] {item.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Hours Attended
              </label>
              <input
                type="number"
                min="0"
                max={conductedHours}
                value={attendedHours}
                onChange={(e) => setAttendedHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Total Conducted Hours
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={conductedHours}
                onChange={(e) => setConductedHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Live Attendance Percentage Preview */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isShortage 
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60' 
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-900/60'
          }`}>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Calculated Percentage
              </div>
              <div className={`text-2xl font-black mt-0.5 ${isShortage ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-300'}`}>
                {livePct}%
              </div>
            </div>

            <div className="text-right">
              {isShortage ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Below 75% Limit!</span>
                </div>
              ) : (
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  ✓ Eligible for Exams
                </div>
              )}
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                Anna Univ Minimum: 75.0%
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveSuccess}
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center space-x-1.5 transition ${
                saveSuccess ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{saveSuccess ? 'Attendance Updated!' : 'Save Attendance'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
