import { cn } from '@/lib/utils';

interface OptionButtonProps {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
  onClick: () => void;
  disabled: boolean;
  isSelected: boolean;
  isCorrect: boolean | null;
  showResult: boolean;
}

export function OptionButton({
  label,
  text,
  onClick,
  disabled,
  isSelected,
  isCorrect,
  showResult,
}: OptionButtonProps) {
  const getStyles = () => {
    if (showResult) {
      if (isCorrect === true) {
        return 'bg-success/30 border-success glow-green animate-correct';
      }
      if (isSelected && isCorrect === false) {
        return 'bg-destructive/30 border-destructive glow-red';
      }
    }
    if (isSelected && !showResult) {
      return 'bg-primary/30 border-primary glow-gold';
    }
    return 'bg-secondary/50 border-border hover:bg-secondary hover:border-primary/50';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full option-hexagon py-4 px-6 border-2 transition-all duration-300',
        'flex items-center gap-4 text-left',
        'disabled:cursor-not-allowed',
        getStyles()
      )}
    >
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary font-bold">
        {label}
      </span>
      <span className="text-foreground font-medium text-lg">{text}</span>
    </button>
  );
}
