import { useState } from 'react';
import { useQuestions } from '@/hooks/useQuestions';
import { usePrizeMapping, DEFAULT_PRIZE_GIFTS } from '@/hooks/usePrizeMapping';
import { PRIZE_LEVELS } from '@/data/defaultQuestions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Plus, Trash2, Clock, Gift, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function TeacherPanel() {
  const navigate = useNavigate();
  const { teacherQuestions, addQuestion, deleteQuestion, getTimeRemaining } = useQuestions();
  const { prizeMapping, updatePrizeGift, resetToDefaults } = usePrizeMapping();

  const [formData, setFormData] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '' as 'A' | 'B' | 'C' | 'D' | '',
    prizeAmount: '',
  });

  const [editingPrize, setEditingPrize] = useState<number | null>(null);
  const [editGiftValue, setEditGiftValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.question ||
      !formData.optionA ||
      !formData.optionB ||
      !formData.optionC ||
      !formData.optionD ||
      !formData.correctAnswer ||
      !formData.prizeAmount
    ) {
      toast.error('કૃપા કરીને બધી માહિતી ભરો');
      return;
    }

    addQuestion({
      question: formData.question,
      options: {
        A: formData.optionA,
        B: formData.optionB,
        C: formData.optionC,
        D: formData.optionD,
      },
      correctAnswer: formData.correctAnswer as 'A' | 'B' | 'C' | 'D',
      prizeAmount: parseInt(formData.prizeAmount),
    });

    setFormData({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: '',
      prizeAmount: '',
    });

    toast.success('પ્રશ્ન સફળતાપૂર્વક ઉમેરાયો!');
  };

  const handleDelete = (id: string) => {
    deleteQuestion(id);
    toast.success('પ્રશ્ન કાઢી નાખ્યો');
  };

  const handleSaveGift = (amount: number) => {
    if (editGiftValue.trim()) {
      updatePrizeGift(amount, editGiftValue.trim());
      toast.success('ઇનામ અપડેટ થયું!');
    }
    setEditingPrize(null);
    setEditGiftValue('');
  };

  const handleResetGifts = () => {
    resetToDefaults();
    toast.success('ઇનામ ડિફોલ્ટ પર રીસેટ થયા!');
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="gap-2">
            <Home className="w-4 h-4" />
            હોમ
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-primary text-shadow-gold">
            શિક્ષક પેનલ
          </h1>
          <div className="w-20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Question Form */}
          <Card className="gradient-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Plus className="w-5 h-5" />
                નવો પ્રશ્ન ઉમેરો
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="question">પ્રશ્ન (ગુજરાતીમાં)</Label>
                  <Input
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="તમારો પ્રશ્ન લખો..."
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="optionA">વિકલ્પ A</Label>
                    <Input
                      id="optionA"
                      value={formData.optionA}
                      onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                      placeholder="વિકલ્પ A"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="optionB">વિકલ્પ B</Label>
                    <Input
                      id="optionB"
                      value={formData.optionB}
                      onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                      placeholder="વિકલ્પ B"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="optionC">વિકલ્પ C</Label>
                    <Input
                      id="optionC"
                      value={formData.optionC}
                      onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                      placeholder="વિકલ્પ C"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="optionD">વિકલ્પ D</Label>
                    <Input
                      id="optionD"
                      value={formData.optionD}
                      onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                      placeholder="વિકલ્પ D"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>સાચો જવાબ</Label>
                    <Select
                      value={formData.correctAnswer}
                      onValueChange={(value) =>
                        setFormData({ ...formData, correctAnswer: value as 'A' | 'B' | 'C' | 'D' })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="પસંદ કરો" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>ઇનામ રકમ</Label>
                    <Select
                      value={formData.prizeAmount}
                      onValueChange={(value) => setFormData({ ...formData, prizeAmount: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="પસંદ કરો" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIZE_LEVELS.map((level) => (
                          <SelectItem key={level.amount} value={level.amount.toString()}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  પ્રશ્ન ઉમેરો
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Prize Mapping Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Gift className="w-5 h-5" />
                  ઇનામ સેટિંગ
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetGifts}
                  className="gap-1 text-xs"
                >
                  <RotateCcw className="w-3 h-3" />
                  રીસેટ
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                દરેક રકમ માટે ઇનામ સેટ કરો
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {PRIZE_LEVELS.map((level) => (
                  <div
                    key={level.amount}
                    className="flex items-center gap-2 bg-secondary/30 rounded-lg p-2"
                  >
                    <span className="text-sm font-medium text-primary min-w-[80px]">
                      {level.label}
                    </span>
                    <span className="text-muted-foreground">=</span>
                    {editingPrize === level.amount ? (
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={editGiftValue}
                          onChange={(e) => setEditGiftValue(e.target.value)}
                          placeholder="ઇનામ લખો..."
                          className="h-8 text-sm"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleSaveGift(level.amount)}
                        >
                          સેવ
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingPrize(level.amount);
                          setEditGiftValue(prizeMapping[level.amount] || '');
                        }}
                        className="flex-1 text-left text-sm text-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                      >
                        🎁 {prizeMapping[level.amount] || DEFAULT_PRIZE_GIFTS[level.amount]}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Question List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                સક્રિય પ્રશ્નો ({teacherQuestions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teacherQuestions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>હજુ કોઈ પ્રશ્ન ઉમેર્યો નથી</p>
                  <p className="text-sm mt-2">પ્રશ્નો ૨૪ કલાક પછી આપમેળે કાઢી નખાશે</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {teacherQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="bg-secondary/50 rounded-lg p-3 border border-border"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{q.question}</p>
                          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                            <span className="text-success">
                              જવાબ: {q.correctAnswer}
                            </span>
                            <span className="text-primary">
                              ₹{q.prizeAmount.toLocaleString('gu-IN')}
                            </span>
                          </div>
                          {q.createdAt && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>બાકી: {getTimeRemaining(q.createdAt)}</span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(q.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
