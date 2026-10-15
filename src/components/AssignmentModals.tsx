import React, { useState } from 'react';
import { X, Check, CheckSquare, Upload, Sparkles, BookOpen } from 'lucide-react';
import { Assignment } from '../types';
import { useAcademic } from '../context/AcademicContext';
import { useAuth } from '../context/AuthContext';

// 1. Create Assignment Modal (for Advisor/HOD)
export const CreateAssignmentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { createAssignment } = useAcademic();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [subjectCode, setSubjectCode] = useState('CS3691');
  const [subjectName, setSubjectName] = useState('Artificial Intelligence & Machine Learning');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState(20);

  if (!isOpen) return null;

  const subjects = [
    { code: 'CS3691', name: 'Artificial Intelligence & Machine Learning' },
    { code: 'CS3601', name: 'Compiler Design' },
    { code: 'CB3491', name: 'Cryptography & Cyber Security' },
    { code: 'CS3602', name: 'Mobile Application Development' },
    { code: 'GE3791', name: 'Human Values and Ethics' },
    { code: 'CS3611', name: 'AI & Mobile Apps Laboratory' },
  ];

  const handleSubjectChange = (code: string) => {
    setSubjectCode(code);
    const sub = subjects.find(s => s.code === code);
    if (sub) setSubjectName(sub.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    createAssignment({
      title: title.trim(),
      subjectCode,
      subjectName,
      description: description.trim(),
      dueDate,
      maxMarks,
      assignedBy: currentUser?.name || 'Prof. Madhesh',
      assignedDate: new Date().toISOString().split('T')[0],
      totalStudents: 60,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95">
        
        <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-blue-200" />
            <h3 className="font-bold text-sm">Create New Academic Assignment</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Subject:
            </label>
            <select
              value={subjectCode}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {subjects.map(s => (
                <option key={s.code} value={s.code}>
                  [{s.code}] {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assignment Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Assignment 3: Convolutional Neural Network Analysis"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Submission Due Date:
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Maximum Marks:
              </label>
              <input
                type="number"
                min="5"
                max="50"
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Problem Statement & Submission Requirements:
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specify requirements, submission format (PDF, GitHub repo, zip), and grading rubric..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
            >
              Publish Assignment
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

// 2. Submit Assignment Modal (for Student: Arusudhan)
export const SubmitAssignmentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
}> = ({ isOpen, onClose, assignment }) => {
  const { submitAssignment } = useAcademic();
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [fileLink, setFileLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !assignment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullNote = fileLink ? `Repository: ${fileLink} | Notes: ${submissionNotes}` : submissionNotes;

    setTimeout(() => {
      submitAssignment(assignment.id, fullNote);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95">
        
        <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-teal-200" />
            <div>
              <h3 className="font-bold text-sm">Submit Assignment Solution</h3>
              <p className="text-xs text-teal-100 opacity-90 truncate max-w-xs">{assignment.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <div className="font-semibold text-slate-800 dark:text-slate-200">{assignment.subjectName}</div>
            <div className="text-slate-500 dark:text-slate-400 mt-1">Due Date: <strong>{assignment.dueDate}</strong> | Max Marks: <strong>{assignment.maxMarks}</strong></div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Project / GitHub / Drive Link:
            </label>
            <input
              type="url"
              value={fileLink}
              onChange={(e) => setFileLink(e.target.value)}
              placeholder="https://github.com/arusudhan/assignment-submission"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Submission Remarks / Methodology Summary:
            </label>
            <textarea
              rows={3}
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              placeholder="Explain model architecture, test results, or code execution steps..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Uploading...' : 'Confirm Submission'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
