import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface VocabularyTabsProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  showHSK?: boolean;
  showVietnamese?: boolean;
  showReading?: boolean;
}

export const VocabularyTabs: React.FC<VocabularyTabsProps> = ({
  defaultValue = 'hsk',
  onValueChange,
  children,
  showHSK = true,
  showVietnamese = true,
  showReading = true,
}) => {
  return (
    <Tabs defaultValue={defaultValue} onValueChange={onValueChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {showHSK && (
          <TabsTrigger value="hsk" className="flex items-center gap-2">
            <Badge variant="hsk" size="sm">HSK</Badge>
            <span className="hidden sm:inline">Chinese</span>
          </TabsTrigger>
        )}
        {showVietnamese && (
          <TabsTrigger value="vietnamese" className="flex items-center gap-2">
            <Badge variant="vietnamese" size="sm">VN</Badge>
            <span className="hidden sm:inline">Vietnamese</span>
          </TabsTrigger>
        )}
        {showReading && (
          <TabsTrigger value="reading" className="flex items-center gap-2">
            <Badge variant="outline" size="sm">📚</Badge>
            <span className="hidden sm:inline">Reading</span>
          </TabsTrigger>
        )}
      </TabsList>
      {children}
    </Tabs>
  );
};

interface StudyModeTabsProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export const StudyModeTabs: React.FC<StudyModeTabsProps> = ({
  defaultValue = 'cards',
  onValueChange,
  children,
}) => {
  return (
    <Tabs defaultValue={defaultValue} onValueChange={onValueChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="cards" className="flex items-center gap-2">
          <span>📋</span>
          <span className="hidden sm:inline">Cards</span>
        </TabsTrigger>
        <TabsTrigger value="flashcards" className="flex items-center gap-2">
          <span>⚡</span>
          <span className="hidden sm:inline">Flashcards</span>
        </TabsTrigger>
        <TabsTrigger value="practice" className="flex items-center gap-2">
          <span>🎯</span>
          <span className="hidden sm:inline">Practice</span>
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};