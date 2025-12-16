import { useState, useEffect, useCallback } from 'react';
import { Question, defaultQuestions, PrizeLevel, formatPrizeLabel } from '@/data/defaultQuestions';

const STORAGE_KEY = 'kbc_teacher_questions';
const SETTINGS_KEY = 'kbc_quiz_settings';
const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface QuizSettings {
  defaultTimeLimit: number; // in seconds
  customPrizeLevels: PrizeLevel[];
}

const DEFAULT_SETTINGS: QuizSettings = {
  defaultTimeLimit: 30,
  customPrizeLevels: [],
};

export function useQuestions() {
  const [teacherQuestions, setTeacherQuestions] = useState<Question[]>([]);
  const [settings, setSettings] = useState<QuizSettings>(DEFAULT_SETTINGS);

  // Load settings
  useEffect(() => {
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
    }
  }, []);

  // Load and clean expired questions
  const loadQuestions = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const questions: Question[] = JSON.parse(stored);
      const now = Date.now();
      const validQuestions = questions.filter(
        (q) => q.createdAt && now - q.createdAt < EXPIRY_TIME
      );
      
      if (validQuestions.length !== questions.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validQuestions));
      }
      
      setTeacherQuestions(validQuestions);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
    
    // Check for expired questions every minute
    const interval = setInterval(loadQuestions, 60000);
    return () => clearInterval(interval);
  }, [loadQuestions]);

  const updateSettings = useCallback((newSettings: Partial<QuizSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addCustomPrizeLevel = useCallback((amount: number) => {
    const label = formatPrizeLabel(amount);
    const newLevel: PrizeLevel = {
      amount,
      label,
      isMilestone: false,
    };
    
    setSettings((prev) => {
      const existingLevels = prev.customPrizeLevels.filter(l => l.amount !== amount);
      const updated = { 
        ...prev, 
        customPrizeLevels: [...existingLevels, newLevel].sort((a, b) => a.amount - b.amount)
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    });
    
    return newLevel;
  }, []);

  const addQuestion = useCallback((question: Omit<Question, 'id' | 'createdAt'>) => {
    const newQuestion: Question = {
      ...question,
      id: `teacher-${Date.now()}`,
      createdAt: Date.now(),
      timeLimit: question.timeLimit || settings.defaultTimeLimit,
    };
    
    const updated = [...teacherQuestions, newQuestion];
    setTeacherQuestions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    return newQuestion;
  }, [teacherQuestions, settings.defaultTimeLimit]);

  const deleteQuestion = useCallback((id: string) => {
    const updated = teacherQuestions.filter((q) => q.id !== id);
    setTeacherQuestions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [teacherQuestions]);

  const getAllQuestions = useCallback(() => {
    // If teacher has created at least one question, only show teacher questions
    if (teacherQuestions.length > 0) {
      return teacherQuestions.sort((a, b) => a.prizeAmount - b.prizeAmount);
    }
    
    // Otherwise, show default questions
    return defaultQuestions.sort((a, b) => a.prizeAmount - b.prizeAmount);
  }, [teacherQuestions]);

  const getTimeRemaining = useCallback((createdAt: number) => {
    const elapsed = Date.now() - createdAt;
    const remaining = EXPIRY_TIME - elapsed;
    
    if (remaining <= 0) return 'સમાપ્ત';
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours} કલાક ${minutes} મિનિટ`;
  }, []);

  return {
    teacherQuestions,
    defaultQuestions,
    settings,
    addQuestion,
    deleteQuestion,
    getAllQuestions,
    getTimeRemaining,
    updateSettings,
    addCustomPrizeLevel,
  };
}
