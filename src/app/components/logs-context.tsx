import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { deleteAllMediaFiles, type MediaFile } from './media-store';

export type LogType = 'note' | 'evidence' | 'assessment';

export interface LogEntry {
  id: string;
  date: string;
  time: string;
  type: LogType;
  title: string;
  description: string;
  tags: string[];
  unitId?: string;
  assessmentId?: string;
  /** Legacy placeholder-only attachments (kept for backward compat) */
  attachments?: { name: string; type: string }[];
  /** Real media files stored via media-store */
  mediaFiles?: MediaFile[];
}

interface LogsContextValue {
  logs: LogEntry[];
  addLog: (entry: Omit<LogEntry, 'id' | 'date' | 'time'>) => void;
  updateLog: (id: string, updates: Partial<Omit<LogEntry, 'id' | 'date' | 'time'>>) => void;
  deleteLog: (id: string) => void;
  getLogsByType: (type: LogType) => LogEntry[];
  getLogsByUnit: (unitId: string) => LogEntry[];
}

const STORAGE_KEY = 'wildlife-logs';

function loadLogs(): LogEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function generateId(): string {
  return `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatDate(): { date: string; time: string } {
  const now = new Date();
  const date = now.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const time = now.toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return { date, time };
}

const LogsContext = createContext<LogsContextValue | null>(null);

export function LogsProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>(loadLogs);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  const addLog = useCallback((entry: Omit<LogEntry, 'id' | 'date' | 'time'>) => {
    const { date, time } = formatDate();
    const newLog: LogEntry = {
      ...entry,
      id: generateId(),
      date,
      time,
    };
    setLogs(prev => [newLog, ...prev]);
  }, []);

  const updateLog = useCallback((id: string, updates: Partial<Omit<LogEntry, 'id' | 'date' | 'time'>>) => {
    setLogs(prev => prev.map(log => {
      if (log.id !== id) return log;
      return { ...log, ...updates };
    }));
  }, []);

  const deleteLog = useCallback((id: string) => {
    setLogs(prev => {
      const entry = prev.find(l => l.id === id);
      // Clean up media files when deleting a log
      if (entry?.mediaFiles) {
        deleteAllMediaFiles(entry.mediaFiles);
      }
      return prev.filter(l => l.id !== id);
    });
  }, []);

  const getLogsByType = useCallback((type: LogType) => {
    return logs.filter(l => l.type === type);
  }, [logs]);

  const getLogsByUnit = useCallback((unitId: string) => {
    return logs.filter(l => l.unitId === unitId);
  }, [logs]);

  return (
    <LogsContext.Provider value={{ logs, addLog, updateLog, deleteLog, getLogsByType, getLogsByUnit }}>
      {children}
    </LogsContext.Provider>
  );
}

export function useLogs() {
  const ctx = useContext(LogsContext);
  if (!ctx) throw new Error('useLogs must be used within LogsProvider');
  return ctx;
}
