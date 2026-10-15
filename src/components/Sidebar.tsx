import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileSpreadsheet, 
  Clock, 
  FileText, 
  Award, 
  MessageSquare, 
  BookMarked, 
  AlertTriangle, 
  FileDown, 
  CheckSquare, 
  Compass,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAcademic } from '../context/AcademicContext';
import { Role } from '../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab, 
  isMobileOpen, 
  onCloseMobile 
}) => {
  const { role, currentUser } = useAuth();
  const { students, assignments } = useAcademic();

  const shortageCount = students.filter(s => s.overallAttendance < 75).length;
  const pendingAssignmentsCount = assignments.filter(a => a.studentStatus === 'pending').length;

  const getNavItems = () => {
    switch (role) {
      case 'hod':
        return [
          { id: 'overview', label: 'Department Overview', icon: LayoutDashboard },
          { id: 'students', label: 'Student Directory', icon: Users, badge: `${students.length}` },
          { id: 'marks', label: 'Internal Marks Audit', icon: FileSpreadsheet },
          { 
            id: 'attendance', 
            label: 'Attendance Monitor', 
            icon: Clock, 
            alertBadge: shortageCount > 0 ? `${shortageCount} Shortage` : undefined 
          },
          { id: 'results', label: 'Semester Results & GPA', icon: Award },
          { id: 'reports', label: 'Consolidated Reports', icon: FileDown },
          { id: 'announcements', label: 'Announcements Board', icon: MessageSquare },
        ];
      case 'advisor':
        return [
          { id: 'overview', label: 'Class Overview (CSE-A)', icon: LayoutDashboard },
          { id: 'students', label: 'Assigned Students', icon: Users, badge: `${students.length}` },
          { id: 'marks', label: 'Update Internal Marks', icon: FileSpreadsheet },
          { 
            id: 'attendance', 
            label: 'Update Attendance', 
            icon: Clock,
            alertBadge: shortageCount > 0 ? `${shortageCount} Alerts` : undefined
          },
          { 
            id: 'assignments', 
            label: 'Manage Assignments', 
            icon: CheckSquare, 
            badge: `${assignments.length}` 
          },
          { id: 'remarks', label: 'Academic Remarks', icon: BookMarked },
          { id: 'announcements', label: 'Announcements Board', icon: MessageSquare },
        ];
      case 'student':
      default:
        return [
          { id: 'overview', label: 'Academic Dashboard', icon: LayoutDashboard },
          { id: 'marks', label: 'Internal Marks', icon: FileSpreadsheet },
          { id: 'attendance', label: 'Attendance Record', icon: Clock },
          { 
            id: 'assignments', 
            label: 'Assignments & Deadlines', 
            icon: CheckSquare,
            alertBadge: pendingAssignmentsCount > 0 ? `${pendingAssignmentsCount} Due` : undefined 
          },
          { id: 'results', label: 'Semester Results', icon: Award },
          { id: 'remarks', label: 'Advisor Remarks', icon: BookMarked },
          { id: 'marksheet', label: 'Download Marksheet', icon: FileDown },
        ];
    }
  };

  const navItems = getNavItems();

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors">
      
      {/* Role Banner Badge */}
      <div className="p-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-3.5 rounded-xl shadow-md">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-blue-200">
            <GraduationCap className="w-4 h-4" />
            <span>{role === 'hod' ? 'Department Head' : role === 'advisor' ? 'Class In-Charge' : 'Student Portal'}</span>
          </div>
          <div className="font-bold text-sm text-white mt-1 truncate">
            {currentUser?.name}
          </div>
          <div className="text-[11px] text-blue-100 opacity-90 truncate mt-0.5">
            {role === 'student' ? 'Reg: 711122104015 | III Year' : 'Dept of Computer Science & Engg'}
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-blue-600'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center space-x-1.5">
                {item.alertBadge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-rose-500 text-white">
                    {item.alertBadge}
                  </span>
                )}
                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* College Info Footer */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Semester VI (2026) Active</span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
          Info Institute of Engineering, Kovilpalaiyam, Coimbatore
        </p>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-5rem)] sticky top-20">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
