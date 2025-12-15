import { useState, useCallback, useEffect, useRef } from 'react';
import { Question, PRIZE_LEVELS } from '@/data/defaultQuestions';
import { OptionButton } from './OptionButton';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
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
  const { playSelectSound, playLockSound, playCorrectSound, playWrongSound } = useSound();

  // 🔔 Submit Audio Ref
  const submitAudioRef = useRef<HTMLAudioElement | null>(null);

  const playSubmitSound = useCallback(() => {
    const audio = submitAudioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.volume = 0.8;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }, []);
  // 🔔 END Submit Audio

  const currentPrize = PRIZE_LEVELS[questionNumber - 1];

  const handleOptionSelect = useCallback((option: 'A' | 'B' | 'C' | 'D') => {
    if (!isLocked) {
      playSelectSound();
      setSelectedOption(option);
    }
  }, [isLocked, playSelectSound]);

  const handleLock = useCallback(() => {
    if (selectedOption) {
      playLockSound();
      playSubmitSound(); // 🔔 Play submit sound immediately on lock
      setIsLocked(true);
      
      // Wait for 6000ms (6 seconds) before showing result.
      setTimeout(() => {
        setShowResult(true);
        const isCorrect = selectedOption === question.correctAnswer;
        
        let nextQuestionDelay = 2500; // Default delay for correct answers

        if (isCorrect) {
          playCorrectSound();
          // Show cheering emojis
          const randomEmojis = Array(5).fill(null).map(() => 
            CHEERING_EMOJIS[Math.floor(Math.random() * CHEERING_EMOJIS.length)]
          );
          setCheerEmojis(randomEmojis);
        } else {
          // 🚨 Use wrong.mpeg sound (via playWrongSound hook call)
          playWrongSound();
            
            // 🚨 Change: Delay for wrong answer is 5 seconds (5000ms)
            nextQuestionDelay = 5000;
        }
        
        // Proceed to next question/game over after the appropriate delay
        setTimeout(() => {
          onAnswer(isCorrect);
        }, nextQuestionDelay); // Uses 5000ms if wrong, 2500ms if correct
      }, 6000); // 6 second delay for the main reveal
    }
  }, [selectedOption, question.correctAnswer, onAnswer, playLockSound, playSubmitSound, playCorrectSound, playWrongSound]);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsLocked(false);
    setShowResult(false);
    setCheerEmojis([]);
  }, [question.id]);

  const options: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  return (
    <div className="animate-fade-in">
      {/* 🔔 Submit Answer Sound (NEW) */}
      <audio ref={submitAudioRef} src="/submit.mpeg" preload="auto" />

      {/* Prize Display */}
      <div className="text-center mb-6">
        <p className="text-muted-foreground text-sm">પ્રશ્ન {questionNumber}</p>
        <p className="text-primary text-2xl font-bold text-shadow-gold">
          {currentPrize?.label || '₹ ૧૦૦'}
        </p>
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
            disabled={isLocked}
            isSelected={selectedOption === opt}
            isCorrect={showResult ? opt === question.correctAnswer : null}
            showResult={showResult}
          />
        ))}
      </div>

      {/* Lock Button */}
      {!isLocked && (
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
              ✗ ખોટો જવાબ! સાચો જવાબ: {question.correctAnswer}
            </p>
          )}
        </div>
      )}
    </div>
  );
}