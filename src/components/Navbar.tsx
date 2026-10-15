import React, { useState } from 'react';
import { 
  GraduationCap, 
  Moon, 
  Sun, 
  LogOut, 
  Search, 
  Bell, 
  UserCheck, 
  ShieldCheck, 
  Sparkles,
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAcademic } from '../context/AcademicContext';
import { COLLEGE_INFO } from '../data/initialData';
import { Role } from '../types';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenAnnouncements: () => void;
  toggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenSearch, 
  onOpenAnnouncements,
  toggleMobileMenu,
  isMobileMenuOpen 
}) => {
  const { currentUser, role, logout, switchRole } = useAuth();
  const { darkMode, toggleDarkMode, announcements } = useAcademic();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const urgentCount = announcements.filter(a => a.urgent).length;

  const roleLabelMap: Record<Role, { title: string; color: string; badge: string }> = {
    hod: { title: 'Head of Department', color: 'bg-indigo-700 text-white', badge: 'HOD Portal' },
    advisor: { title: 'Class Advisor', color: 'bg-blue-600 text-white', badge: 'Advisor Portal' },
    student: { title: 'Student', color: 'bg-emerald-600 text-white', badge: 'Student Portal' },
  };

  const currentRoleInfo = role ? roleLabelMap[role] : { title: 'Guest', color: 'bg-slate-600 text-white', badge: 'Portal' };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: College Brand & Logo */}
          <div className="flex items-center space-x-3">
            {toggleMobileMenu && (
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Toggle Navigation"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}

            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-lg sm:text-xl font-display">
                    {COLLEGE_INFO.name}
                  </span>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {COLLEGE_INFO.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate max-w-md">
                  {COLLEGE_INFO.address}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Search & Role Quick Switch */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Quick Search trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm border border-slate-200/80 dark:border-slate-700/80 transition shadow-inner"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search student (Reg No / Name)...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded">
                Ctrl+K
              </kbd>
            </button>

            {/* Quick Role Switcher Banner */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition ${currentRoleInfo.color}`}
                title="Switch role view for demo testing"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{currentRoleInfo.badge}</span>
                <span className="opacity-75 text-[10px] bg-black/20 px-1 rounded">Switch ▾</span>
              </button>

              {showRoleDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setShowRoleDropdown(false)}
                >
                  <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                    Switch Active Persona:
                  </div>
                  <button
                    onClick={() => { switchRole('hod'); setShowRoleDropdown(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-700/50 transition ${role === 'hod' ? 'font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    <span>Dr. Palani (HOD)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold">HOD</span>
                  </button>
                  <button
                    onClick={() => { switchRole('advisor'); setShowRoleDropdown(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-blue-50 dark:hover:bg-slate-700/50 transition ${role === 'advisor' ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    <span>Prof. Madhesh (Advisor)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold">Advisor</span>
                  </button>
                  <button
                    onClick={() => { switchRole('student'); setShowRoleDropdown(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-slate-700/50 transition ${role === 'student' ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    <span>Arusudhan (Student)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-semibold">Student</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions, Theme Toggle, Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile search button */}
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Announcements button */}
            <button
              onClick={onOpenAnnouncements}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title="College Announcements"
            >
              <Bell className="w-5 h-5" />
              {urgentCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* User Profile Pill / Logout */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {currentUser?.name.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left text-xs pr-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {currentUser?.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                    {role === 'hod' ? 'Dr. Palani (HOD)' : role === 'advisor' ? 'Prof. Madhesh' : 'Arusudhan (Student)'}
                  </div>
                </div>
              </button>

              {showProfileMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in"
                  onMouseLeave={() => setShowProfileMenu(false)}
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{currentUser?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser?.email}</p>
                    {currentUser?.regNo && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-mono bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800">
                        Reg: {currentUser.regNo}
                      </span>
                    )}
                  </div>

                  <div className="px-2 py-1">
                    <div className="px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <strong>Department:</strong> {COLLEGE_INFO.department}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-700 pt-1 mt-1 px-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out of Portal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
