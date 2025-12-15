import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'kbc_leaderboard';
const MAX_ENTRIES = 50;

export interface LeaderboardEntry {
  id: string;
  studentName: string;
  className: string;
  wonAmount: number;
  prize: string;
  date: number;
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setLeaderboard(JSON.parse(stored));
      } catch {
        setLeaderboard([]);
      }
    }
  }, []);

  const addEntry = useCallback((entry: Omit<LeaderboardEntry, 'id' | 'date'>) => {
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
      date: Date.now(),
    };

    setLeaderboard((prev) => {
      const updated = [newEntry, ...prev]
        .sort((a, b) => b.wonAmount - a.wonAmount)
        .slice(0, MAX_ENTRIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return newEntry;
  }, []);

  const clearLeaderboard = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLeaderboard([]);
  }, []);

  const getTopEntries = useCallback((count: number = 10) => {
    return leaderboard.slice(0, count);
  }, [leaderboard]);

  return {
    leaderboard,
    addEntry,
    clearLeaderboard,
    getTopEntries,
  };
}
