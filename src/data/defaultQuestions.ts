export interface Question {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  prizeAmount: number;
  createdAt?: number;
  timeLimit?: number; // in seconds
}

export interface PrizeLevel {
  amount: number;
  label: string;
  isMilestone: boolean;
}

export const PRIZE_LEVELS: PrizeLevel[] = [
  { amount: 100, label: '₹ ૧૦૦', isMilestone: false },
  { amount: 500, label: '₹ ૫૦૦', isMilestone: false },
  { amount: 1000, label: '₹ ૧,૦૦૦', isMilestone: false },
  { amount: 2000, label: '₹ ૨,૦૦૦', isMilestone: false },
  { amount: 5000, label: '₹ ૫,૦૦૦', isMilestone: true },
  { amount: 10000, label: '₹ ૧૦,૦૦૦', isMilestone: false },
  { amount: 20000, label: '₹ ૨૦,૦૦૦', isMilestone: false },
  { amount: 40000, label: '₹ ૪૦,૦૦૦', isMilestone: false },
  { amount: 80000, label: '₹ ૮૦,૦૦૦', isMilestone: false },
  { amount: 160000, label: '₹ ૧,૬૦,૦૦૦', isMilestone: true },
  { amount: 320000, label: '₹ ૩,૨૦,૦૦૦', isMilestone: false },
  { amount: 640000, label: '₹ ૬,૪૦,૦૦૦', isMilestone: false },
  { amount: 1250000, label: '₹ ૧૨,૫૦,૦૦૦', isMilestone: false },
  { amount: 2500000, label: '₹ ૨૫,૦૦,૦૦૦', isMilestone: false },
  { amount: 5000000, label: '₹ ૫૦,૦૦,૦૦૦', isMilestone: true },
  { amount: 10000000, label: '₹ ૧ કરોડ', isMilestone: true },
];

// Helper to format amount as label
export const formatPrizeLabel = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹ ${(amount / 10000000).toLocaleString('gu-IN')} કરોડ`;
  } else if (amount >= 100000) {
    return `₹ ${(amount / 100000).toLocaleString('gu-IN')} લાખ`;
  } else {
    return `₹ ${amount.toLocaleString('gu-IN')}`;
  }
};

export const defaultQuestions: Question[] = [
  {
    id: 'default-1',
    question: 'નીચેનામાંથી કયો આકાર વર્તુળ છે?',
    options: {
      A: '⬜ ચોરસ',
      B: '⚪ વર્તુળ',
      C: '🔺 ત્રિકોણ',
      D: '▬ લંબચોરસ',
    },
    correctAnswer: 'B',
    prizeAmount: 100,
  },
  {
    id: 'default-2',
    question: 'ભારતની રાજધાની કઈ છે?',
    options: {
      A: 'મુંબઈ',
      B: 'કોલકાતા',
      C: 'નવી દિલ્હી',
      D: 'ચેન્નાઈ',
    },
    correctAnswer: 'C',
    prizeAmount: 500,
  },
  {
    id: 'default-3',
    question: 'અઠવાડિયામાં કેટલા દિવસ હોય છે?',
    options: {
      A: '૫ દિવસ',
      B: '૬ દિવસ',
      C: '૭ દિવસ',
      D: '૮ દિવસ',
    },
    correctAnswer: 'C',
    prizeAmount: 1000,
  },
  {
    id: 'default-4',
    question: 'મહાત્મા ગાંધીનું જન્મસ્થળ કયું છે?',
    options: {
      A: 'અમદાવાદ',
      B: 'પોરબંદર',
      C: 'રાજકોટ',
      D: 'સુરત',
    },
    correctAnswer: 'B',
    prizeAmount: 2000,
  },
  {
    id: 'default-5',
    question: 'પાણીનું રાસાયણિક સૂત્ર શું છે?',
    options: {
      A: 'CO2',
      B: 'O2',
      C: 'H2O',
      D: 'NaCl',
    },
    correctAnswer: 'C',
    prizeAmount: 5000,
  },
  {
    id: 'default-6',
    question: 'ગુજરાતનું રાજ્ય પ્રાણી કયું છે?',
    options: {
      A: 'વાઘ',
      B: 'સિંહ',
      C: 'હાથી',
      D: 'ગેંડો',
    },
    correctAnswer: 'B',
    prizeAmount: 10000,
  },
  {
    id: 'default-7',
    question: 'ભારતનો સૌથી મોટો રાજ્ય (વિસ્તારની દ્રષ્ટિએ) કયું છે?',
    options: {
      A: 'મધ્ય પ્રદેશ',
      B: 'ઉત્તર પ્રદેશ',
      C: 'રાજસ્થાન',
      D: 'મહારાષ્ટ્ર',
    },
    correctAnswer: 'C',
    prizeAmount: 20000,
  },
  {
    id: 'default-8',
    question: 'સૂર્ય કઈ દિશામાં ઉગે છે?',
    options: {
      A: 'પશ્ચિમ',
      B: 'ઉત્તર',
      C: 'દક્ષિણ',
      D: 'પૂર્વ',
    },
    correctAnswer: 'D',
    prizeAmount: 40000,
  },
  {
    id: 'default-9',
    question: 'ગુજરાતી ભાષાના પિતા કોણ ગણાય છે?',
    options: {
      A: 'નર્મદ',
      B: 'મહાત્મા ગાંધી',
      C: 'દલપતરામ',
      D: 'પ્રેમાનંદ',
    },
    correctAnswer: 'A',
    prizeAmount: 80000,
  },
  {
    id: 'default-10',
    question: 'ભારતની સૌથી લાંબી નદી કઈ છે?',
    options: {
      A: 'યમુના',
      B: 'ગંગા',
      C: 'નર્મદા',
      D: 'ગોદાવરી',
    },
    correctAnswer: 'B',
    prizeAmount: 160000,
  },
  {
    id: 'default-11',
    question: 'ભારતનું રાષ્ટ્રીય પક્ષી કયું છે?',
    options: {
      A: 'કબૂતર',
      B: 'મોર',
      C: 'કોયલ',
      D: 'પોપટ',
    },
    correctAnswer: 'B',
    prizeAmount: 320000,
  },
  {
    id: 'default-12',
    question: 'ગુજરાતના પ્રથમ મુખ્યમંત્રી કોણ હતા?',
    options: {
      A: 'જીવરાજ મહેતા',
      B: 'હિતેન્દ્ર દેસાઈ',
      C: 'ચીમનભાઈ પટેલ',
      D: 'બાબુભાઈ પટેલ',
    },
    correctAnswer: 'A',
    prizeAmount: 640000,
  },
  {
    id: 'default-13',
    question: 'પૃથ્વી સૂર્યની આસપાસ ફરવામાં કેટલો સમય લે છે?',
    options: {
      A: '૨૪ કલાક',
      B: '૩૦ દિવસ',
      C: '૩૬૫ દિવસ',
      D: '૧૨ મહિના',
    },
    correctAnswer: 'C',
    prizeAmount: 1250000,
  },
  {
    id: 'default-14',
    question: 'ભારતના સૌથી ઊંચા ઈમારત કઈ છે?',
    options: {
      A: 'કુતુબ મિનાર',
      B: 'ચારમિનાર',
      C: 'પલ્સા 330',
      D: 'સ્ટેચ્યુ ઓફ યુનિટી',
    },
    correctAnswer: 'C',
    prizeAmount: 2500000,
  },
  {
    id: 'default-15',
    question: 'ગુજરાતનો સ્થાપના દિવસ ક્યારે છે?',
    options: {
      A: '૧ મે',
      B: '૧૫ ઓગસ્ટ',
      C: '૨૬ જાન્યુઆરી',
      D: '૧૪ નવેમ્બર',
    },
    correctAnswer: 'A',
    prizeAmount: 5000000,
  },
  {
    id: 'default-16',
    question: 'સૌરમંડળમાં સૌથી મોટો ગ્રહ કયો છે?',
    options: {
      A: 'શનિ',
      B: 'પૃથ્વી',
      C: 'ગુરુ',
      D: 'મંગળ',
    },
    correctAnswer: 'C',
    prizeAmount: 10000000,
  },
];
