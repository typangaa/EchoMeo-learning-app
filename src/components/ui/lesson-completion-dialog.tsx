import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface LessonCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonNumber: number;
  vocabularyType: 'hsk' | 'vietnamese';
  level: number;
  score?: number;
  correctAnswers: number;
  totalQuestions: number;
  onContinue: () => void;
  onRestart?: () => void;
}

export const LessonCompletionDialog: React.FC<LessonCompletionDialogProps> = ({
  open,
  onOpenChange,
  lessonNumber,
  vocabularyType,
  level,
  score: _score,
  correctAnswers,
  totalQuestions,
  onContinue,
  onRestart,
}) => {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const isExcellent = percentage >= 90;
  const isGood = percentage >= 70;

  const handleContinue = () => {
    onContinue();
    onOpenChange(false);
  };

  const handleRestart = () => {
    if (onRestart) {
      onRestart();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="text-4xl">
              {isExcellent ? '🎉' : isGood ? '👏' : '💪'}
            </div>
          </div>
          <DialogTitle className="text-center">
            {isExcellent ? 'Excellent Work!' : isGood ? 'Well Done!' : 'Keep Practicing!'}
          </DialogTitle>
          <DialogDescription className="text-center">
            You completed lesson {lessonNumber} of{' '}
            <Badge variant={vocabularyType === 'hsk' ? 'hsk' : 'vietnamese'} size="sm">
              {vocabularyType === 'hsk' ? `HSK ${level}` : `Vietnamese ${level}`}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Score display */}
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {correctAnswers}/{totalQuestions}
            </div>
            <Progress 
              value={percentage} 
              variant={isExcellent ? 'success' : isGood ? 'default' : 'warning'}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground mt-2">
              {percentage}% correct
            </div>
          </div>

          {/* Encouragement message */}
          <div className="text-center text-sm text-muted-foreground">
            {isExcellent && "Perfect! You've mastered this lesson!"}
            {isGood && !isExcellent && "Great job! You're making excellent progress!"}
            {!isGood && "Don't worry, practice makes perfect. Try again!"}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {!isGood && onRestart && (
            <Button variant="outline" onClick={handleRestart} className="w-full sm:w-auto">
              Try Again
            </Button>
          )}
          <Button onClick={handleContinue} className="w-full sm:w-auto">
            Continue Learning
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};