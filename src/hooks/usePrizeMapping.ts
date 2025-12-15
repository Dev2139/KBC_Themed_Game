import { useState, useEffect, useCallback } from 'react';
import { PRIZE_LEVELS } from '@/data/defaultQuestions';

const STORAGE_KEY = 'kbc_prize_mapping';

export interface PrizeMapping {
  [amount: number]: string;
}

// Default prize gifts mapping
export const DEFAULT_PRIZE_GIFTS: PrizeMapping = {
  100: '૧ ટોફી',
  200: '૧ પેન્સિલ',
  500: '૧ રબર',
  1000: '૧ શાર્પનર',
  2000: '૧ સ્કેલ',
  5000: '૧ પેન',
  10000: '૧ નોટબુક',
  20000: '૧ રંગપેટી',
  40000: '૧ કલર પેન્સિલ સેટ',
  80000: '૧ જીઓમેટ્રી બોક્સ',
  160000: '૧ વોટર બોટલ',
  320000: '૧ ટિફિન બોક્સ',
  640000: '૧ સ્કૂલ બેગ',
  1250000: '૧ પુસ્તક સેટ',
  5000000: '૧ ચેમ્પિયન ટ્રોફી',
  10000000: '૧ સુવર્ણ ચંદ્રક 🏅',
};

export function usePrizeMapping() {
  const [prizeMapping, setPrizeMapping] = useState<PrizeMapping>(DEFAULT_PRIZE_GIFTS);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPrizeMapping({ ...DEFAULT_PRIZE_GIFTS, ...parsed });
      } catch {
        setPrizeMapping(DEFAULT_PRIZE_GIFTS);
      }
    }
  }, []);

  const updatePrizeGift = useCallback((amount: number, gift: string) => {
    setPrizeMapping((prev) => {
      const updated = { ...prev, [amount]: gift };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getPrizeGift = useCallback((amount: number): string => {
    // Find the closest prize level that is <= amount
    const levels = PRIZE_LEVELS.map(l => l.amount).sort((a, b) => b - a);
    for (const level of levels) {
      if (amount >= level && prizeMapping[level]) {
        return prizeMapping[level];
      }
    }
    return prizeMapping[100] || 'ઇનામ';
  }, [prizeMapping]);

  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPrizeMapping(DEFAULT_PRIZE_GIFTS);
  }, []);

  return {
    prizeMapping,
    updatePrizeGift,
    getPrizeGift,
    resetToDefaults,
  };
}
