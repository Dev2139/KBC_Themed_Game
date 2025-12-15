import { useState, useEffect, useCallback } from 'react';
import { Question, defaultQuestions } from '@/data/defaultQuestions';

const STORAGE_KEY = 'kbc_teacher_questions';
const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function useQuestions() {
  const [teacherQuestions, setTeacherQuestions] = useState<Question[]>([]);

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

  const addQuestion = useCallback((question: Omit<Question, 'id' | 'createdAt'>) => {
    const newQuestion: Question = {
      ...question,
      id: `teacher-${Date.now()}`,
      createdAt: Date.now(),
    };
    
    const updated = [...teacherQuestions, newQuestion];
    setTeacherQuestions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    return newQuestion;
  }, [teacherQuestions]);

  const deleteQuestion = useCallback((id: string) => {
    const updated = teacherQuestions.filter((q) => q.id !== id);
    setTeacherQuestions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [teacherQuestions]);

  const getAllQuestions = useCallback(() => {
    // Combine teacher questions with default questions
    // Teacher questions take priority based on prize amount
    const allQuestions = [...teacherQuestions, ...defaultQuestions];
    
    // Sort by prize amount
    return allQuestions.sort((a, b) => a.prizeAmount - b.prizeAmount);
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
    addQuestion,
    deleteQuestion,
    getAllQuestions,
    getTimeRemaining,
  };
}
