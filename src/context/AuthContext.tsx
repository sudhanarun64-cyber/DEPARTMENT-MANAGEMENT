import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { INITIAL_USERS } from '../data/initialData';

interface AuthContextType {
  currentUser: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (role: Role, credentials?: { username?: string; password?: string }) => { success: boolean; message?: string };
  logout: () => void;
  switchRole: (role: Role) => void;
  canEditMarks: boolean;
  canEditAttendance: boolean;
  canManageAssignments: boolean;
  canPostAnnouncements: boolean;
  canAddRemarks: boolean;
  canApproveDepartmentReports: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'iie_academic_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    // Default to Student 'Arusudhan' or null. Starting with Student or HOD gives immediate visual value
    return INITIAL_USERS.student;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = (selectedRole: Role, credentials?: { username?: string; password?: string }) => {
    // If credentials provided, validate
    if (credentials?.username && credentials?.password) {
      // Demo password check - accepts either standard demo password or valid format
      const trimmedUser = credentials.username.trim().toLowerCase();
      const validPasswords = ['123456', 'iie@2026', 'admin', 'password', 'student'];
      
      if (credentials.password.length < 4) {
        return { success: false, message: 'Password must be at least 4 characters.' };
      }

      // Check role specific username patterns
      if (selectedRole === 'hod' && !trimmedUser.includes('palani') && !trimmedUser.includes('hod') && !trimmedUser.includes('admin')) {
        return { success: false, message: 'Invalid HOD ID. Use "palani.cse" or quick demo login.' };
      }
      if (selectedRole === 'advisor' && !trimmedUser.includes('madhesh') && !trimmedUser.includes('advisor') && !trimmedUser.includes('faculty')) {
        return { success: false, message: 'Invalid Class Advisor ID. Use "madhesh.cse" or quick demo login.' };
      }
      if (selectedRole === 'student' && !trimmedUser.includes('711122104015') && !trimmedUser.includes('arusudhan') && !trimmedUser.includes('student')) {
        return { success: false, message: 'Invalid Register Number. Use "711122104015" or "arusudhan".' };
      }
    }

    const targetUser = INITIAL_USERS[selectedRole];
    if (targetUser) {
      setCurrentUser(targetUser);
      return { success: true };
    }
    return { success: false, message: 'User role profile not found.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (newRole: Role) => {
    const targetUser = INITIAL_USERS[newRole];
    if (targetUser) {
      setCurrentUser(targetUser);
    }
  };

  const role = currentUser?.role || null;
  const isAuthenticated = !!currentUser;

  // Strict Permissions Matrix
  const canEditMarks = role === 'hod' || role === 'advisor';
  const canEditAttendance = role === 'hod' || role === 'advisor';
  const canManageAssignments = role === 'hod' || role === 'advisor';
  const canPostAnnouncements = role === 'hod' || role === 'advisor';
  const canAddRemarks = role === 'hod' || role === 'advisor';
  const canApproveDepartmentReports = role === 'hod';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
        login,
        logout,
        switchRole,
        canEditMarks,
        canEditAttendance,
        canManageAssignments,
        canPostAnnouncements,
        canAddRemarks,
        canApproveDepartmentReports,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
