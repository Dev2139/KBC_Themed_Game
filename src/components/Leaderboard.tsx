import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Home, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function Leaderboard() {
  const navigate = useNavigate();
  const { leaderboard, clearLeaderboard } = useLeaderboard();

  const handleClear = () => {
    if (confirm('શું તમે ખરેખર લીડરબોર્ડ સાફ કરવા માંગો છો?')) {
      clearLeaderboard();
      toast.success('લીડરબોર્ડ સાફ થયું!');
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/30';
      default:
        return 'bg-secondary/30 border-border';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('gu-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="gap-2">
            <Home className="w-4 h-4" />
            હોમ
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-primary text-shadow-gold flex items-center gap-2">
            <Trophy className="w-8 h-8" />
            લીડરબોર્ડ
          </h1>
          <Button
            onClick={handleClear}
            variant="ghost"
            size="sm"
            className="gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <Card className="gradient-border bg-card">
          <CardHeader>
            <CardTitle className="text-center text-foreground">
              🏆 ટોપ વિજેતાઓ 🏆
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">હજુ કોઈ વિજેતા નથી</p>
                <p className="text-sm mt-2">રમત રમો અને લીડરબોર્ડમાં આવો!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 p-3 rounded-lg border ${getRankBg(index + 1)} transition-all hover:scale-[1.02]`}
                  >
                    <div className="shrink-0">
                      {getRankIcon(index + 1)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground truncate">
                        {entry.studentName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ધોરણ: {entry.className}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-success">
                        ₹{entry.wonAmount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-primary truncate max-w-[100px]">
                        🎁 {entry.prize}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(entry.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button onClick={() => navigate('/student')} size="lg" className="gap-2">
            <Trophy className="w-5 h-5" />
            રમત શરૂ કરો
          </Button>
        </div>
      </div>
    </div>
  );
}
