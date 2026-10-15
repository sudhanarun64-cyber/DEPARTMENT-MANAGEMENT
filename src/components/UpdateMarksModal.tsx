import React, { useState } from 'react';
import { X, Check, FileSpreadsheet, Sparkles, AlertCircle } from 'lucide-react';
import { Student } from '../types';
import { useAcademic } from '../context/AcademicContext';

interface UpdateMarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export const UpdateMarksModal: React.FC<UpdateMarksModalProps> = ({ 
  isOpen, 
  onClose, 
  student 
}) => {
  const { updateStudentMarks } = useAcademic();
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(
    student.internalMarks[0]?.subjectCode || ''
  );

  const currentSubjectMark = student.internalMarks.find(m => m.subjectCode === selectedSubjectCode) || student.internalMarks[0];

  const [iat1, setIat1] = useState<number>(currentSubjectMark?.iat1 || 0);
  const [iat2, setIat2] = useState<number>(currentSubjectMark?.iat2 || 0);
  const [modelExam, setModelExam] = useState<number>(currentSubjectMark?.modelExam || 0);
  const [assignmentMark, setAssignmentMark] = useState<number>(currentSubjectMark?.assignmentMark || 0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if user changes subject
  const handleSubjectChange = (code: string) => {
    setSelectedSubjectCode(code);
    const sub = student.internalMarks.find(m => m.subjectCode === code);
    if (sub) {
      setIat1(sub.iat1);
      setIat2(sub.iat2);
      setModelExam(sub.modelExam);
      setAssignmentMark(sub.assignmentMark);
      setSaveSuccess(false);
    }
  };

  if (!isOpen) return null;

  // Live preview calculation:
  const iatContribution = ((iat1 + iat2) / 100) * 15;
  const modelContribution = (modelExam / 100) * 15;
  const asgContribution = (assignmentMark / 20) * 10;
  const calculatedTotal = Math.min(40, Math.round((iatContribution + modelContribution + asgContribution) * 10) / 10);

  const getGradePreview = (tot: number) => {
    const pct = (tot / 40) * 100;
    if (pct >= 90) return 'O (Outstanding)';
    if (pct >= 80) return 'A+ (Excellent)';
    if (pct >= 70) return 'A (Very Good)';
    if (pct >= 60) return 'B+ (Good)';
    if (pct >= 50) return 'B (Average)';
    return 'RA (Re-Appear / Fail)';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentMarks(student.id, selectedSubjectCode, 'iat1', iat1);
    updateStudentMarks(student.id, selectedSubjectCode, 'iat2', iat2);
    updateStudentMarks(student.id, selectedSubjectCode, 'modelExam', modelExam);
    updateStudentMarks(student.id, selectedSubjectCode, 'assignmentMark', assignmentMark);

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

      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-200" />
            <div>
              <h3 className="font-bold text-sm">Update Internal Assessment Marks</h3>
              <p className="text-xs text-blue-100 opacity-90">
                {student.name} ({student.regNo}) • Sec {student.section}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          
          {/* Subject Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Subject / Course:
            </label>
            <select
              value={selectedSubjectCode}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {student.internalMarks.map(m => (
                <option key={m.subjectCode} value={m.subjectCode}>
                  [{m.subjectCode}] {m.subjectName}
                </option>
              ))}
            </select>
          </div>

          {/* Marks Input Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                IAT-1 Mark (Max: 50)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={iat1}
                onChange={(e) => setIat1(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                IAT-2 Mark (Max: 50)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={iat2}
                onChange={(e) => setIat2(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Model Exam (Max: 100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={modelExam}
                onChange={(e) => setModelExam(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Assignment / Seminar (Max: 20)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={assignmentMark}
                onChange={(e) => setAssignmentMark(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Computed Preview Card */}
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-blue-700 dark:text-blue-300 font-semibold uppercase tracking-wider">
                Anna University Converted Internal
              </div>
              <div className="text-xl font-black text-blue-900 dark:text-blue-200 mt-0.5">
                {calculatedTotal} <span className="text-xs text-blue-600 dark:text-blue-400 font-normal">/ 40 marks</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                Estimated Grade
              </div>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {getGradePreview(calculatedTotal)}
              </div>
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
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved Successfully!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Update & Save Marks</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
