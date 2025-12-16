import { useState } from 'react';
import { useQuestions } from '@/hooks/useQuestions';
import { usePrizeMapping, DEFAULT_PRIZE_GIFTS } from '@/hooks/usePrizeMapping';
import { PRIZE_LEVELS, formatPrizeLabel } from '@/data/defaultQuestions';
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
import { Home, Plus, Trash2, Clock, Gift, RotateCcw, Timer, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function TeacherPanel() {
  const navigate = useNavigate();
  const { teacherQuestions, addQuestion, deleteQuestion, getTimeRemaining, settings, updateSettings, addCustomPrizeLevel } = useQuestions();
  const { prizeMapping, updatePrizeGift, resetToDefaults } = usePrizeMapping();

  const [formData, setFormData] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '' as 'A' | 'B' | 'C' | 'D' | '',
    prizeAmount: '',
    customPrizeAmount: '',
    timeLimit: '',
  });

  const [editingPrize, setEditingPrize] = useState<number | null>(null);
  const [editGiftValue, setEditGiftValue] = useState('');
  const [useCustomPrize, setUseCustomPrize] = useState(false);

  // Combine default and custom prize levels
  const allPrizeLevels = [...PRIZE_LEVELS, ...settings.customPrizeLevels]
    .sort((a, b) => a.amount - b.amount)
    .filter((level, index, self) => 
      index === self.findIndex(l => l.amount === level.amount)
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.question ||
      !formData.optionA ||
      !formData.optionB ||
      !formData.optionC ||
      !formData.optionD ||
      !formData.correctAnswer
    ) {
      toast.error('કૃપા કરીને બધી માહિતી ભરો');
      return;
    }

    let prizeAmount: number;
    if (useCustomPrize) {
      if (!formData.customPrizeAmount) {
        toast.error('કૃપા કરીને ઇનામ રકમ લખો');
        return;
      }
      prizeAmount = parseInt(formData.customPrizeAmount);
      if (isNaN(prizeAmount) || prizeAmount <= 0) {
        toast.error('કૃપા કરીને સાચી રકમ લખો');
        return;
      }
      // Add custom prize level if it doesn't exist
      addCustomPrizeLevel(prizeAmount);
    } else {
      if (!formData.prizeAmount) {
        toast.error('કૃપા કરીને ઇનામ રકમ પસંદ કરો');
        return;
      }
      prizeAmount = parseInt(formData.prizeAmount);
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
      prizeAmount,
      timeLimit: formData.timeLimit ? parseInt(formData.timeLimit) : settings.defaultTimeLimit,
    });

    setFormData({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: '',
      prizeAmount: '',
      customPrizeAmount: '',
      timeLimit: '',
    });
    setUseCustomPrize(false);

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

  const handleTimeLimitChange = (value: string) => {
    const timeLimit = parseInt(value);
    if (!isNaN(timeLimit) && timeLimit > 0) {
      updateSettings({ defaultTimeLimit: timeLimit });
      toast.success(`ડિફોલ્ટ સમય ${timeLimit} સેકન્ડ સેટ થયો`);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
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

        {/* Timer Settings */}
        <Card className="mb-6 bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-primary text-lg">
              <Settings className="w-5 h-5" />
              સમય સેટિંગ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-muted-foreground" />
                <Label>ડિફોલ્ટ સમય (સેકન્ડ):</Label>
              </div>
              <Select
                value={settings.defaultTimeLimit.toString()}
                onValueChange={handleTimeLimitChange}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 સેકન્ડ</SelectItem>
                  <SelectItem value="30">30 સેકન્ડ</SelectItem>
                  <SelectItem value="45">45 સેકન્ડ</SelectItem>
                  <SelectItem value="60">60 સેકન્ડ</SelectItem>
                  <SelectItem value="90">90 સેકન્ડ</SelectItem>
                  <SelectItem value="120">120 સેકન્ડ</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                (દરેક પ્રશ્ન માટે અલગ સમય પણ સેટ કરી શકાય છે)
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Question Form */}
          <Card className="gradient-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Plus className="w-5 h-5" />
                નવો પ્રશ્ન ઉમેરો
              </CardTitle>
              {teacherQuestions.length > 0 && (
                <p className="text-xs text-success mt-1">
                  ✓ તમારા પ્રશ્નો જ બતાવાશે (ડિફોલ્ટ પ્રશ્નો છુપાવેલ છે)
                </p>
              )}
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
                    <Label className="flex items-center gap-2">
                      <Timer className="w-3 h-3" />
                      સમય (સેકન્ડ)
                    </Label>
                    <Input
                      type="number"
                      value={formData.timeLimit}
                      onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                      placeholder={`${settings.defaultTimeLimit}`}
                      className="mt-1"
                      min={5}
                      max={300}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>ઇનામ રકમ</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setUseCustomPrize(!useCustomPrize)}
                      className="text-xs h-6"
                    >
                      {useCustomPrize ? 'યાદીમાંથી પસંદ કરો' : '+ કસ્ટમ રકમ'}
                    </Button>
                  </div>
                  {useCustomPrize ? (
                    <Input
                      type="number"
                      value={formData.customPrizeAmount}
                      onChange={(e) => setFormData({ ...formData, customPrizeAmount: e.target.value })}
                      placeholder="દા.ત. 20000000 (૨ કરોડ)"
                      min={1}
                    />
                  ) : (
                    <Select
                      value={formData.prizeAmount}
                      onValueChange={(value) => setFormData({ ...formData, prizeAmount: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="પસંદ કરો" />
                      </SelectTrigger>
                      <SelectContent>
                        {allPrizeLevels.map((level) => (
                          <SelectItem key={level.amount} value={level.amount.toString()}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    ૧ કરોડથી વધુ રકમ માટે કસ્ટમ રકમ વાપરો
                  </p>
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
                {allPrizeLevels.map((level) => (
                  <div
                    key={level.amount}
                    className="flex items-center gap-2 bg-secondary/30 rounded-lg p-2"
                  >
                    <span className="text-sm font-medium text-primary min-w-[100px]">
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
                        🎁 {prizeMapping[level.amount] || DEFAULT_PRIZE_GIFTS[level.amount] || 'સેટ કરો'}
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
              {teacherQuestions.length > 0 && (
                <p className="text-xs text-success">
                  ડિફોલ્ટ પ્રશ્નો છુપાવેલ છે
                </p>
              )}
            </CardHeader>
            <CardContent>
              {teacherQuestions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>હજુ કોઈ પ્રશ્ન ઉમેર્યો નથી</p>
                  <p className="text-sm mt-2">પ્રશ્નો ૨૪ કલાક પછી આપમેળે કાઢી નખાશે</p>
                  <p className="text-xs mt-1 text-warning">
                    ⚠️ જ્યાં સુધી તમે પ્રશ્ન ઉમેરો નહીં ત્યાં સુધી ડિફોલ્ટ પ્રશ્નો બતાવાશે
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {teacherQuestions.map((q, index) => (
                    <div
                      key={q.id}
                      className="bg-secondary/50 rounded-lg p-3 border border-border"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                              #{index + 1}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Timer className="w-3 h-3" />
                              {q.timeLimit || 30}s
                            </span>
                          </div>
                          <p className="font-medium text-foreground truncate">{q.question}</p>
                          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                            <span className="text-success">
                              જવાબ: {q.correctAnswer}
                            </span>
                            <span className="text-primary">
                              {formatPrizeLabel(q.prizeAmount)}
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
