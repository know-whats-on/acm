import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface StudentNameContextValue {
  studentName: string;
  setStudentName: (name: string) => void;
  isFirstVisit: boolean;
  completeFirstVisit: (name: string) => void;
}

const StudentNameContext = createContext<StudentNameContextValue>({
  studentName: '',
  setStudentName: () => {},
  isFirstVisit: false,
  completeFirstVisit: () => {},
});

export function StudentNameProvider({ children }: { children: ReactNode }) {
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    try {
      return !localStorage.getItem('hasVisited');
    } catch {
      return false;
    }
  });

  const [studentName, setStudentNameState] = useState(() => {
    try {
      const saved = localStorage.getItem('studentName');
      return saved || '';
    } catch {
      return '';
    }
  });

  const setStudentName = useCallback((name: string) => {
    const trimmed = name.trim() || 'Alex';
    setStudentNameState(trimmed);
    try {
      localStorage.setItem('studentName', trimmed);
    } catch {}
  }, []);

  const completeFirstVisit = useCallback((name: string) => {
    const trimmed = name.trim() || 'Alex';
    setStudentNameState(trimmed);
    setIsFirstVisit(false);
    try {
      localStorage.setItem('studentName', trimmed);
      localStorage.setItem('hasVisited', 'true');
    } catch {}
  }, []);

  return (
    <StudentNameContext.Provider value={{ studentName, setStudentName, isFirstVisit, completeFirstVisit }}>
      {children}
    </StudentNameContext.Provider>
  );
}

export function useStudentName() {
  return useContext(StudentNameContext);
}