import React, { useState } from 'react';
import { X, Check, BookMarked, Sparkles } from 'lucide-react';
import { Student, AcademicRemark } from '../types';
import { useAcademic } from '../context/AcademicContext';

interface AddRemarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export const AddRemarkModal: React.FC<AddRemarkModalProps> = ({ 
  isOpen, 
  onClose, 
  student 
}) => {
  const { addAcademicRemark } = useAcademic();
  const [remarkText, setRemarkText] = useState('');
  const [remarkType, setRemarkType] = useState<AcademicRemark['type']>('academic');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarkText.trim()) return;

    addAcademicRemark(student.id, remarkText.trim(), remarkType);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setRemarkText('');
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
            <BookMarked className="w-5 h-5 text-blue-200" />
            <div>
              <h3 className="font-bold text-sm">Add Academic / Counseling Remark</h3>
              <p className="text-xs text-blue-100 opacity-90">
                Student: {student.name} ({student.regNo})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Remark Category:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['academic', 'attendance', 'achievement', 'counseling', 'discipline'] as AcademicRemark['type'][]).map(type => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setRemarkType(type)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold capitalize border transition ${
                    remarkType === type
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observation / Remark Note:
            </label>
            <textarea
              rows={4}
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              placeholder="Enter official mentor observation, performance feedback, or recommendation..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

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
              <span>{saveSuccess ? 'Remark Saved!' : 'Add to Student Record'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
