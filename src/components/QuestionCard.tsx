import { useState, useCallback, useEffect, useRef } from 'react';
import { Question, PRIZE_LEVELS, formatPrizeLabel } from '@/data/defaultQuestions';
import { OptionButton } from './OptionButton';
import { Button } from '@/components/ui/button';
import { Lock, Clock } from 'lucide-react';
import { useSound } from '@/hooks/useSound';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  onAnswer: (isCorrect: boolean) => void;
}

const CHEERING_EMOJIS = ['🎉', '🥳', '👏', '🌟', '✨', '🎊', '💪', '🔥', '⭐', '💯'];

export function QuestionCard({ question, questionNumber, onAnswer }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [cheerEmojis, setCheerEmojis] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(question.timeLimit || 30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const { playSelectSound, playLockSound, playCorrectSound, playWrongSound, playTickSound } = useSound();

  const currentPrize = PRIZE_LEVELS.find(p => p.amount === question.prizeAmount) || 
    { amount: question.prizeAmount, label: formatPrizeLabel(question.prizeAmount), isMilestone: false };

  // Timer effect
  useEffect(() => {
    if (isLocked || showResult) return;

    const initialTime = question.timeLimit || 30;
    setTimeLeft(initialTime);

    // Tick every second
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - trigger wrong answer
          clearInterval(timerRef.current!);
          clearInterval(tickRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Tick sound every second when time is low (last 10 seconds)
    tickRef.current = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 10 && current > 0 && !isLocked) {
          playTickSound();
        }
        return current;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [question.id, question.timeLimit, isLocked, showResult, playTickSound]);

  // Handle timeout
  useEffect(() => {
    if (timeLeft === 0 && !isLocked && !showResult) {
      playWrongSound();
      setShowResult(true);
      setTimeout(() => {
        onAnswer(false);
      }, 2000);
    }
  }, [timeLeft, isLocked, showResult, onAnswer, playWrongSound]);

  const handleOptionSelect = useCallback((option: 'A' | 'B' | 'C' | 'D') => {
    if (!isLocked && timeLeft > 0) {
      playSelectSound();
      setSelectedOption(option);
    }
  }, [isLocked, timeLeft, playSelectSound]);

  const handleLock = useCallback(() => {
    if (selectedOption && timeLeft > 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
      
      playLockSound();
      setIsLocked(true);
      
      // Show result after a brief delay for dramatic effect
      setTimeout(() => {
        setShowResult(true);
        const isCorrect = selectedOption === question.correctAnswer;
        
        if (isCorrect) {
          playCorrectSound();
          // Show cheering emojis
          const randomEmojis = Array(5).fill(null).map(() => 
            CHEERING_EMOJIS[Math.floor(Math.random() * CHEERING_EMOJIS.length)]
          );
          setCheerEmojis(randomEmojis);
        } else {
          playWrongSound();
        }
        
        // Proceed to next question after showing result
        setTimeout(() => {
          onAnswer(isCorrect);
        }, 2500);
      }, 1500);
    }
  }, [selectedOption, timeLeft, question.correctAnswer, onAnswer, playLockSound, playCorrectSound, playWrongSound]);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsLocked(false);
    setShowResult(false);
    setCheerEmojis([]);
    setTimeLeft(question.timeLimit || 30);
  }, [question.id, question.timeLimit]);

  const options: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  const getTimerColor = () => {
    if (timeLeft <= 5) return 'text-destructive';
    if (timeLeft <= 10) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="animate-fade-in">
      {/* Timer and Prize Display */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${getTimerColor()}`} />
          <span className={`text-2xl font-bold ${getTimerColor()} ${timeLeft <= 10 ? 'animate-pulse' : ''}`}>
            {timeLeft} સેકન્ડ
          </span>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-sm">પ્રશ્ન {questionNumber}</p>
          <p className="text-primary text-2xl font-bold text-shadow-gold">
            {currentPrize?.label || '₹ ૧૦૦'}
          </p>
        </div>
        <div className="w-24" />
      </div>

      {/* Question */}
      <div className="gradient-border rounded-xl p-6 mb-8">
        <p className="text-xl md:text-2xl font-semibold text-center text-foreground leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {options.map((opt) => (
          <OptionButton
            key={opt}
            label={opt}
            text={question.options[opt]}
            onClick={() => handleOptionSelect(opt)}
            disabled={isLocked || timeLeft === 0}
            isSelected={selectedOption === opt}
            isCorrect={showResult ? opt === question.correctAnswer : null}
            showResult={showResult}
          />
        ))}
      </div>

      {/* Lock Button */}
      {!isLocked && timeLeft > 0 && (
        <div className="text-center">
          <Button
            onClick={handleLock}
            disabled={!selectedOption}
            size="lg"
            className="gap-2 px-8"
          >
            <Lock className="w-5 h-5" />
            જવાબ લૉક કરો
          </Button>
        </div>
      )}

      {/* Status Messages */}
      {isLocked && !showResult && (
        <div className="text-center">
          <p className="text-xl text-primary animate-pulse">
            કોમ્પ્યુટરજી, જવાબ લૉક...
          </p>
        </div>
      )}

      {timeLeft === 0 && !showResult && (
        <div className="text-center">
          <p className="text-xl text-destructive animate-pulse">
            ⏰ સમય પૂરો!
          </p>
        </div>
      )}

      {showResult && (
        <div className="text-center animate-scale-in">
          {selectedOption === question.correctAnswer ? (
            <div>
              <p className="text-2xl text-success font-bold mb-2">
                ✓ સાચો જવાબ! અભિનંદન!
              </p>
              <div className="flex justify-center gap-2 text-3xl animate-bounce">
                {cheerEmojis.map((emoji, i) => (
                  <span key={i} style={{ animationDelay: `${i * 100}ms` }}>
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-2xl text-destructive font-bold">
              ✗ {timeLeft === 0 ? 'સમય પૂરો!' : 'ખોટો જવાબ!'} સાચો જવાબ: {question.correctAnswer}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
