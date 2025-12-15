import { PRIZE_LEVELS } from '@/data/defaultQuestions';
import { cn } from '@/lib/utils';

interface PrizeLadderProps {
  currentLevel: number;
  wonAmount: number;
}

export function PrizeLadder({ currentLevel, wonAmount }: PrizeLadderProps) {
  const reversedLevels = [...PRIZE_LEVELS].reverse();

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border">
      <h3 className="text-center text-primary font-bold mb-4 text-lg">
        પુરસ્કાર સીડી 🏆
      </h3>
      <div className="space-y-1.5">
        {reversedLevels.map((level, index) => {
          const actualIndex = PRIZE_LEVELS.length - 1 - index;
          const isCurrent = actualIndex === currentLevel;
          const isWon = actualIndex < currentLevel;
          const isMilestone = level.isMilestone;

          return (
            <div
              key={level.amount}
              className={cn(
                'flex items-center justify-between px-3 py-1.5 rounded transition-all duration-300',
                isCurrent && 'bg-primary/20 glow-gold animate-pulse-gold',
                isWon && 'bg-success/20',
                isMilestone && 'border-l-2 border-primary bg-primary/5',
                !isCurrent && !isWon && 'opacity-60'
              )}
            >
              <span
                className={cn(
                  'text-sm font-medium',
                  isCurrent && 'text-primary',
                  isWon && 'text-success',
                  isMilestone && 'font-bold'
                )}
              >
                {actualIndex + 1}.
              </span>
              <span
                className={cn(
                  'text-sm font-bold',
                  isCurrent && 'text-primary text-shadow-gold',
                  isWon && 'text-success',
                  isMilestone && 'text-primary'
                )}
              >
                {level.label} {isMilestone && '⭐'}
              </span>
            </div>
          );
        })}
      </div>
      {wonAmount > 0 && (
        <div className="mt-4 pt-4 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">જીતેલી રકમ</p>
          <p className="text-success font-bold text-xl">₹ {wonAmount.toLocaleString('en-IN')} 💰</p>
        </div>
      )}
    </div>
  );
}
