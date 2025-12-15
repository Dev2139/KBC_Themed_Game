import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, Sparkles, School, Trophy } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function HomePage() {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.4;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.log('Autoplay blocked, waiting for user interaction');
      });
    }

    const startAudioOnClick = () => {
      audio.play();
      document.removeEventListener('click', startAudioOnClick);
    };

    document.addEventListener('click', startAudioOnClick);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      document.removeEventListener('click', startAudioOnClick);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Audio */}
      <audio ref={audioRef} src="/main2.mpeg" preload="auto" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto animate-fade-in">
        {/* School Name - Prominent */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center gap-3 bg-primary/10 border-2 border-primary rounded-full px-6 py-3 mb-4">
            <School className="w-8 h-8 text-primary" />
            <span className="text-2xl md:text-3xl font-bold text-primary text-shadow-gold">
              જડિયાણા પ્રાથમિક શાળા
            </span>
            <School className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Logo / Title */}
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border-2 border-primary mb-6 animate-pulse-gold">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary text-shadow-gold mb-4">
            મે બનુંગા કરોડપતિ
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            શાળાના વિદ્યાર્થીઓ માટે ક્વિઝ ગેમ
          </p>
        </div>

        {/* Developer Info (MOVED AND ENHANCED) */}
        <div className="mb-10 p-2 rounded-lg bg-primary/10 border border-primary/30 max-w-sm mx-auto">
          <p className="text-sm text-muted-foreground mb-1">
            Developed by <span className="text-primary font-semibold">Dev Patel</span> 💻
          </p>
          <p className="text-sm text-muted-foreground">
            Contact: <span className="text-primary font-semibold">+91 6354236105</span> 📱
          </p>
        </div>

        {/* Description */}
        <p className="text-lg text-foreground/80 mb-12 leading-relaxed">
          આ રમતમાં તમે પ્રશ્નોના સાચા જવાબ આપીને ઇનામ જીતી શકો છો! 
          દરેક સાચા જવાબ પછી તમારી ઇનામ રકમ વધે છે. 🎯
        </p>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/teacher')}
            className="group gradient-border rounded-xl p-5 transition-all duration-300 hover:scale-105 hover:glow-gold"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <GraduationCap className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground mb-1">શિક્ષક મોડ</h2>
                <p className="text-xs text-muted-foreground">પ્રશ્નો બનાવો</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/student')}
            className="group gradient-border rounded-xl p-5 transition-all duration-300 hover:scale-105 hover:glow-gold"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground mb-1">વિદ્યાર્થી મોડ</h2>
                <p className="text-xs text-muted-foreground">રમત શરૂ કરો</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/leaderboard')}
            className="group gradient-border rounded-xl p-5 transition-all duration-300 hover:scale-105 hover:glow-gold"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Trophy className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground mb-1">લીડરબોર્ડ</h2>
                <p className="text-xs text-muted-foreground">વિજેતાઓ જુઓ</p>
              </div>
            </div>
          </button>
        </div>

        {/* Prize Info */}
        <div className="mt-12 p-4 rounded-lg bg-card/50 border border-border max-w-md mx-auto">
          <p className="text-sm text-muted-foreground mb-2">ઇનામ શ્રેણી</p>
          <p className="text-lg font-bold">
            <span className="text-foreground">₹ ૧૦૦</span>
            <span className="text-muted-foreground mx-2">થી</span>
            <span className="text-primary text-shadow-gold text-2xl">₹ ૧ કરોડ 🏆</span>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 space-y-2">
          <p className="text-sm text-muted-foreground">
            📚 શીખો, રમો અને જીતો! 🏆
          </p>
        </div>
      </div>
    </div>
  );
}