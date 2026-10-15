/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AcademicProvider, useAcademic } from './context/AcademicContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './components/LoginPage';
import { HODDashboard } from './views/HODDashboard';
import { AdvisorDashboard } from './views/AdvisorDashboard';
import { StudentDashboard } from './views/StudentDashboard';
import { StudentProfileView } from './views/StudentProfileView';
import { StudentSearchModal } from './components/StudentSearchModal';
import { AnnouncementModal } from './components/AnnouncementModal';
import { Student } from './types';
import { COLLEGE_INFO } from './data/initialData';
import { RefreshCw, GraduationCap, ShieldCheck, Heart, Sparkles } from 'lucide-react';

const MainPortal: React.FC = () => {
  const { isAuthenticated, role, currentUser } = useAuth();
  const { resetToDefaultData, announcements } = useAcademic();

  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [resetMessage, setResetMessage] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // When role changes, reset current tab to overview and clear selected student
  useEffect(() => {
    setCurrentTab('overview');
    setSelectedStudentForProfile(null);
  }, [role]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleResetData = () => {
    if (window.confirm('Reset all demo marks, attendance, and assignments back to default sample data for Info Institute of Engineering?')) {
      resetToDefaultData();
      setSelectedStudentForProfile(null);
      setResetMessage(true);
      setTimeout(() => setResetMessage(false), 3000);
    }
  };

  const urgentAnnouncements = announcements.filter(a => a.urgent);

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Banner for Urgent Announcement (if any) */}
      {urgentAnnouncements.length > 0 && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs px-4 py-2 flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-2 max-w-5xl mx-auto truncate">
            <span className="px-1.5 py-0.5 rounded bg-rose-500 text-[10px] font-bold uppercase tracking-wider">
              Urgent Notice
            </span>
            <span className="font-semibold truncate">
              {urgentAnnouncements[0].title}: {urgentAnnouncements[0].content}
            </span>
          </div>
          <button 
            onClick={() => setIsAnnouncementsOpen(true)}
            className="text-blue-100 hover:text-white underline text-[11px] font-bold ml-2 shrink-0"
          >
            Read Circulars
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAnnouncements={() => setIsAnnouncementsOpen(true)}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* App Body: Sidebar + Main Views */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tabId) => {
            setCurrentTab(tabId);
            setSelectedStudentForProfile(null);
          }}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {selectedStudentForProfile ? (
            <StudentProfileView
              student={selectedStudentForProfile}
              onBack={() => setSelectedStudentForProfile(null)}
            />
          ) : (
            <>
              {role === 'hod' && (
                <HODDashboard
                  currentTab={currentTab}
                  onSelectStudent={(student) => setSelectedStudentForProfile(student)}
                  onOpenAnnouncements={() => setIsAnnouncementsOpen(true)}
                />
              )}

              {role === 'advisor' && (
                <AdvisorDashboard
                  currentTab={currentTab}
                  onSelectStudent={(student) => setSelectedStudentForProfile(student)}
                  onOpenAnnouncements={() => setIsAnnouncementsOpen(true)}
                />
              )}

              {role === 'student' && (
                <StudentDashboard
                  currentTab={currentTab}
                  onOpenAnnouncements={() => setIsAnnouncementsOpen(true)}
                />
              )}
            </>
          )}

          {/* Quick Demo Utilities Footer Bar */}
          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {COLLEGE_INFO.name}
              </span>
              <span>•</span>
              <span>{COLLEGE_INFO.address}</span>
            </div>

            <div className="flex items-center space-x-3">
              {resetMessage ? (
                <span className="text-emerald-600 font-bold">✓ Sample data reset!</span>
              ) : (
                <button
                  onClick={handleResetData}
                  className="flex items-center space-x-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
                  title="Reload default demo marks, students, and attendance"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Sample Demo Data</span>
                </button>
              )}

              <span>•</span>
              <span className="text-[11px] text-slate-400">
                Staff: Dr. Palani (HOD) | Prof. Madhesh (Advisor) | Student: Arusudhan
              </span>
            </div>
          </div>
        </main>

      </div>

      {/* Global Modals */}
      <StudentSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectStudent={(student) => {
          setSelectedStudentForProfile(student);
          setIsSearchOpen(false);
        }}
      />

      <AnnouncementModal
        isOpen={isAnnouncementsOpen}
        onClose={() => setIsAnnouncementsOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AcademicProvider>
        <MainPortal />
      </AcademicProvider>
    </AuthProvider>
  );
}
