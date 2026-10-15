import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  User, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COLLEGE_INFO, INITIAL_USERS } from '../data/initialData';
import { Role } from '../types';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<Role>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tab configurations
  const tabs: { role: Role; label: string; icon: string; staffName: string; defaultId: string }[] = [
    { role: 'hod', label: '1. HOD Login', icon: '👔', staffName: 'Dr. Palani (HOD - CSE)', defaultId: 'palani.cse' },
    { role: 'advisor', label: '2. Class Advisor', icon: '👨‍🏫', staffName: 'Prof. Madhesh (Advisor)', defaultId: 'madhesh.cse' },
    { role: 'student', label: '3. Student Login', icon: '🎓', staffName: 'Arusudhan (Student)', defaultId: '711122104015' },
  ];

  const handleTabChange = (role: Role) => {
    setActiveTab(role);
    setErrorMsg('');
    setUsername('');
    setPassword('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = login(activeTab, { username, password });
      if (!res.success) {
        setErrorMsg(res.message || 'Invalid credentials.');
      }
      setIsSubmitting(false);
    }, 300);
  };

  const handleQuickDemoLogin = (role: Role) => {
    setIsSubmitting(true);
    setTimeout(() => {
      login(role);
      setIsSubmitting(false);
    }, 200);
  };

  const currentTabConfig = tabs.find(t => t.role === activeTab)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      
      {/* Background ambient decorative glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* College Logo & Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-4 ring-4 ring-blue-500/20">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white font-display uppercase">
            {COLLEGE_INFO.name}
          </h2>
          <p className="mt-1 text-xs text-blue-200/80 font-medium">
            {COLLEGE_INFO.address}
          </p>
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-400/30 text-blue-300">
            Academic Management & Continuous Assessment Portal
          </div>
        </div>

        {/* Card Box */}
        <div className="mt-8 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Role Navigation Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/50 p-1.5 gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.role;
              return (
                <button
                  key={tab.role}
                  onClick={() => handleTabChange(tab.role)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6 sm:p-8">
            {/* Persona Target Info */}
            <div className="mb-5 p-3 rounded-xl bg-blue-950/40 border border-blue-800/50 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-blue-200 block">
                  Target Account: {currentTabConfig.staffName}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {activeTab === 'hod' && 'Full administrative authority: view all students, approve marks, attendance audits, consolidated reports.'}
                  {activeTab === 'advisor' && 'Assigned Class: III Year CSE-A. Can update marks, update attendance, manage assignments, add remarks.'}
                  {activeTab === 'student' && 'Student access: view marks, attendance %, submit assignments, download marksheets. (Read-only for academic records).'}
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick 1-Click Demo Login Button */}
            <button
              onClick={() => handleQuickDemoLogin(activeTab)}
              disabled={isSubmitting}
              className="w-full mb-5 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-teal-900/30 transition transform active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Instant 1-Click Demo Sign-In as {activeTab === 'hod' ? 'Dr. Palani' : activeTab === 'advisor' ? 'Prof. Madhesh' : 'Arusudhan'}</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-3 text-slate-500 font-semibold">Or Sign In with Credentials</span>
              </div>
            </div>

            {/* Credential Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {activeTab === 'student' ? 'Register Number / Username' : 'Faculty ID / Username'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={currentTabConfig.defaultId}
                    required
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Portal Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (e.g. 123456 or iie@2026)"
                    required
                    className="block w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2 rounded-lg border border-slate-800">
                Demo helper: ID = <span className="text-blue-300 font-mono font-semibold">{currentTabConfig.defaultId}</span> | Password = <span className="text-blue-300 font-mono font-semibold">123456</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 shadow-md transition"
              >
                <span>Authorize & Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

          </div>

          {/* Card Footer */}
          <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">
              Demo sample marks & attendance loaded • Info Institute of Engineering, Coimbatore
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
