import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuestions } from '@/hooks/useQuestions';
import { usePrizeMapping } from '@/hooks/usePrizeMapping';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { QuestionCard } from './QuestionCard';
import { PrizeLadder } from './PrizeLadder';
import { CameraBox } from './CameraBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, RotateCcw, Trophy, School, Gift, User, GraduationCap, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRIZE_LEVELS } from '@/data/defaultQuestions';
import { useSound } from '@/hooks/useSound';
import { toast } from 'sonner';

interface StudentInfo {
  name: string;
  className: string;
}

// Define the time limit for each question in seconds
const INITIAL_TIME = 30; // 30 seconds per question

export function StudentQuiz() {
  const navigate = useNavigate();

  const { getAllQuestions } = useQuestions();
  const { getPrizeGift } = usePrizeMapping();
  const { addEntry } = useLeaderboard();

  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [wonAmount, setWonAmount] = useState(0);
  const [lastWonAmount, setLastWonAmount] = useState(0);
  const [gameState, setGameState] =
    useState<'register' | 'playing' | 'won' | 'lost'>('register');
  
  // ⏱️ NEW STATE FOR TIMER
  const [timer, setTimer] = useState(INITIAL_TIME);

  const { playWinSound, playGameOverSound } = useSound();

  const [nameInput, setNameInput] = useState('');
  const [classInput, setClassInput] = useState('');

  const questions = getAllQuestions();
  const currentQuestion = questions[currentQuestionIndex];

  const totalQuestions = Math.min(questions.length, PRIZE_LEVELS.length);

  /* 🔊 QUESTION, BACKGROUND MUSIC (EXISTING) */
  const questionAudioRef = useRef<HTMLAudioElement | null>(null);
  const mainMusicRef = useRef<HTMLAudioElement | null>(null);

  // 🔊 NEW TIMER SOUND
  const tickTockAudioRef = useRef<HTMLAudioElement | null>(null);


  // --- TIMER LOGIC ---
  useEffect(() => {
    if (gameState !== 'playing') {
      // Stop the sound and timer if not playing
      if (tickTockAudioRef.current) {
        tickTockAudioRef.current.pause();
      }
      return;
    }

    // Reset timer when a new question starts
    setTimer(INITIAL_TIME);
    
    // Start tick-tock sound when question starts
    const tickTockAudio = tickTockAudioRef.current;
    if (tickTockAudio) {
        tickTockAudio.loop = true;
        tickTockAudio.volume = 0.5;
        const playPromise = tickTockAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {});
        }
    }

    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          
          // Time's up! Handle as a lost state.
          // We use a special flag in the answer handler to differentiate from a wrong answer.
          handleAnswer(false, true); 
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      // Clean up sound on unmount/re-run
      if (tickTockAudio) {
        tickTockAudio.pause();
      }
    };
  }, [currentQuestionIndex, gameState]); // Added handleAnswer to dependencies for completeness


  /* 🔊 NEW QUESTION SOUND (EXISTING) */
  useEffect(() => {
    if (gameState !== 'playing') return;
    const audio = questionAudioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.volume = 0.6;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }, [currentQuestionIndex, gameState]);
  /* 🔊 END NEW QUESTION SOUND */

  /* 🎶 MAIN BACKGROUND MUSIC (EXISTING) */
  useEffect(() => {
    const music = mainMusicRef.current;
    if (!music) return;

    if (gameState === 'playing') {
      music.loop = true;
      music.volume = 0.4;
      const playPromise = music.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      music.pause();
    }

    return () => {
      if (music) {
        music.pause();
      }
    };
  }, [gameState, currentQuestionIndex]);
  /* 🎶 END MAIN BACKGROUND MUSIC */

  const handleStartGame = useCallback(() => {
    if (!questions || questions.length === 0) {
        toast.error('શિક્ષક દ્વારા હજુ સુધી કોઈ પ્રશ્નો સેટ કરવામાં આવ્યા નથી. કૃપા કરીને પછીથી પ્રયાસ કરો.');
        return;
    }

    if (!nameInput.trim()) {
      toast.error('કૃપા કરીને તમારું નામ લખો');
      return;
    }
    if (!classInput.trim()) {
      toast.error('કૃપા કરીને તમારો ધોરણ લખો');
      return;
    }
    setStudentInfo({ name: nameInput.trim(), className: classInput.trim() });
    setGameState('playing');
  }, [nameInput, classInput, questions]);

  const saveToLeaderboard = useCallback(
    (amount: number) => {
      if (studentInfo && amount > 0) {
        const prize = getPrizeGift(amount);
        addEntry({
          studentName: studentInfo.name,
          className: studentInfo.className,
          wonAmount: amount,
          prize: prize,
        });
      }
    },
    [studentInfo, getPrizeGift, addEntry]
  );

  // Modified handleAnswer to accept an optional isTimeout flag
  const handleAnswer = useCallback(
    (isCorrect: boolean, isTimeout: boolean = false) => {
      // 🎶 Pause background music and timer sound immediately when answer is clicked or time runs out
      if (mainMusicRef.current) {
          mainMusicRef.current.pause();
      }
      if (tickTockAudioRef.current) {
          tickTockAudioRef.current.pause();
      }
      
      if (isCorrect) {
        const newAmount = PRIZE_LEVELS[currentQuestionIndex]?.amount || 0;
        setLastWonAmount(newAmount);
        setWonAmount(newAmount);

        if (currentQuestionIndex + 1 >= totalQuestions) {
          setGameState('won');
          saveToLeaderboard(newAmount);
          playWinSound();
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
          // useEffect for currentQuestionIndex will handle next state/music
        }
      } else {
        // Handle Loss (Wrong Answer OR Time Out)
        const amountToSave = lastWonAmount; // Save the amount won in the previous *safe* level
        saveToLeaderboard(amountToSave);
        setGameState('lost');
        playGameOverSound();
        
        // Give a specific toast message for time out
        if (isTimeout) {
            toast.error('સમય પૂરો! તમે સમયસર જવાબ આપી શક્યા નહીં.');
        } else {
            toast.error('ખોટો જવાબ!');
        }
      }
    },
    [
      currentQuestionIndex,
      totalQuestions,
      lastWonAmount,
      saveToLeaderboard,
      playWinSound,
      playGameOverSound,
    ]
  );

  const handleRestart = useCallback(() => {
    setCurrentQuestionIndex(0);
    setWonAmount(0);
    setLastWonAmount(0);
    setGameState('register');
    setStudentInfo(null);
    setNameInput('');
    setClassInput('');
  }, []);

  if (gameState === 'register') {
    // ... (Existing 'register' JSX)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md gradient-border bg-card animate-scale-in">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 border-2 border-primary mb-4 mx-auto">
              <User className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl text-primary text-shadow-gold">
              રમત શરૂ કરો
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-2">
              તમારી માહિતી ભરો
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                તમારું નામ
              </Label>
              <Input
                id="name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="દા.ત. દેવ પટેલ"
                className="mt-1"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="class" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                ધોરણ
              </Label>
              <Input
                id="class"
                value={classInput}
                onChange={(e) => setClassInput(e.target.value)}
                placeholder="દા.ત. ધોરણ 5"
                className="mt-1"
              />
            </div>
            <Button onClick={handleStartGame} className="w-full gap-2" size="lg">
              <Trophy className="w-5 h-5" />
              રમત શરૂ કરો
            </Button>
            <Button onClick={() => navigate('/')} variant="ghost" className="w-full gap-2">
              <Home className="w-4 h-4" />
              હોમ પર જાઓ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'won') {
    // ... (Existing 'won' JSX)
    const wonGift = getPrizeGift(wonAmount);
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center animate-scale-in">
          <Trophy className="w-24 h-24 text-primary mx-auto mb-6 animate-pulse-gold" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary text-shadow-gold mb-4">
            અભિનંદન! 🎉🥳🎊
          </h1>
          {studentInfo && (
            <p className="text-xl text-foreground mb-2">
              {studentInfo.name} ({studentInfo.className})
            </p>
          )}
          <p className="text-2xl text-foreground mb-2">
            તમે કરોડપતિ બની ગયા!
          </p>
          <p className="text-3xl text-success font-bold mb-2">
            જીત: ₹ {wonAmount.toLocaleString('en-IN')}
          </p>
          <div className="bg-linear-to-r from-primary/20 via-accent/20 to-primary/20 rounded-xl p-4 mb-4 border border-primary/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="w-6 h-6 text-primary animate-bounce" />
              <span className="text-lg text-muted-foreground">તમારું ઇનામ:</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-primary">
              🎁 {wonGift}
            </p>
          </div>
          <div className="text-4xl mb-8">🏆💰🌟✨🎯</div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleRestart} size="lg" className="gap-2">
              <RotateCcw className="w-5 h-5" />
              ફરીથી રમો
            </Button>
            <Button onClick={() => navigate('/leaderboard')} variant="outline" size="lg" className="gap-2">
              <Trophy className="w-5 h-5" />
              લીડરબોર્ડ જુઓ
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" size="lg" className="gap-2">
              <Home className="w-5 h-5" />
              હોમ પર જાઓ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'lost') {
    // ... (Existing 'lost' JSX)
    const lostGift = lastWonAmount > 0 ? getPrizeGift(lastWonAmount) : null;
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center animate-scale-in">
          <div className="text-6xl mb-6">😔</div>
          <h1 className="text-3xl md:text-4xl font-bold text-destructive mb-4">
            રમત સમાપ્ત
          </h1>
          {studentInfo && (
            <p className="text-lg text-muted-foreground mb-2">
              {studentInfo.name} ({studentInfo.className})
            </p>
          )}
          <p className="text-xl text-muted-foreground mb-2">
            જવાબ ખોટો હતો
          </p>
          {lastWonAmount > 0 && lostGift ? (
            <div>
              <p className="text-xl text-muted-foreground mb-1">
                તમારી છેલ્લી જીત:
              </p>
              <p className="text-2xl text-success font-bold mb-2">
                ₹ {lastWonAmount.toLocaleString('en-IN')} 💵
              </p>
              <div className="bg-linear-to-r from-success/20 via-accent/20 to-success/20 rounded-xl p-4 mb-6 border border-success/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="w-6 h-6 text-success" />
                  <span className="text-lg text-muted-foreground">તમારું ઇનામ:</span>
                </div>
                <p className="text-2xl font-bold text-success">
                  🎁 {lostGift}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xl text-muted-foreground mb-8">
              કોઈ રકમ જીતી નથી
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleRestart} size="lg" className="gap-2">
              <RotateCcw className="w-5 h-5" />
              ફરીથી રમો
            </Button>
            <Button onClick={() => navigate('/leaderboard')} variant="outline" size="lg" className="gap-2">
              <Trophy className="w-5 h-5" />
              લીડરબોર્ડ જુઓ
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" size="lg" className="gap-2">
              <Home className="w-5 h-5" />
              હોમ પર જાઓ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- PLAYING GAME STATE ---
  return (
    <div className="min-h-screen p-4">
      {/* 🔊 Sound Refs */}
      <audio ref={questionAudioRef} src="/new_question.mpeg" preload="auto" />
      <audio ref={mainMusicRef} src="/main.mpeg" preload="auto" />
      {/* ⏱️ NEW TIMER SOUND (You will need an audio file named 'tick_tock.mp3' or similar) */}
      <audio ref={tickTockAudioRef} src="/tick_tock.mp3" preload="auto" />

      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="gap-2">
            <Home className="w-4 h-4" />
            હોમ
          </Button>

          {/* ⏱️ CENTERED TIMER DISPLAY */}
          <div className={`
              text-center p-2 rounded-full border-2 
              shadow-lg transition-colors duration-500
              ${timer <= 5 ? 'bg-destructive/80 border-destructive animate-pulse-danger' : 
                timer <= 10 ? 'bg-yellow-500/80 border-yellow-500' : 
                'bg-primary/20 border-primary'}
          `}>
            <div className={`flex items-center justify-center font-bold text-xl md:text-2xl 
                            ${timer <= 5 ? 'text-destructive-foreground' : 'text-foreground'}`}>
                <Clock className="w-6 h-6 mr-2" />
                {timer}
            </div>
          </div>
          {/* END TIMER DISPLAY */}

          <div className="w-20" /> {/* Spacer for alignment */}
        </div>

        <div className="text-center mt-2">
          <div className="flex items-center justify-center gap-2 text-primary text-sm mb-1">
            <School className="w-4 h-4" />
            <span className="font-semibold">જડિયાણા પ્રાથમિક શાળા</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-primary text-shadow-gold">
            મે બનુંગા કરોડપતિ
          </h1>
          {studentInfo && (
            <p className="text-sm text-muted-foreground mt-1">
              {studentInfo.name} • {studentInfo.className}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="hidden lg:block">
          <PrizeLadder currentLevel={currentQuestionIndex} wonAmount={wonAmount} />
        </div>

        <div className="lg:col-span-3">
          {currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              onAnswer={handleAnswer}
            />
          )}
        </div>
      </div>

      <div className="lg:hidden fixed top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
        <p className="text-xs text-muted-foreground">જીત</p>
        <p className="text-sm text-success font-bold">
          ₹ {wonAmount.toLocaleString('en-IN')}
        </p>
      </div>

      <CameraBox />
    </div>
  );
}