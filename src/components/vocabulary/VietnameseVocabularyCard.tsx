import { useState } from 'react';
import { VocabularyItem } from '../../types';
import { useToggleFavorite, useIsFavorite } from '../../stores';
import AudioButton from '../common/AudioButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VietnameseVocabularyCardProps {
  item: VocabularyItem;
}

const VietnameseVocabularyCard: React.FC<VietnameseVocabularyCardProps> = ({ item }) => {
  const [showDetails, setShowDetails] = useState(false);
  const toggleFavorite = useToggleFavorite();
  const isItemFavorite = useIsFavorite('vietnamese', item.id);
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite('vietnamese', item.id);
  };
  
  // Create a wrapper for AudioButton that prevents event propagation
  const AudioButtonWrapper = ({ text, language, className, size }: { 
    text: string; 
    language: 'vietnamese' | 'chinese'; 
    className?: string; 
    size?: 'sm' | 'md' | 'lg' 
  }) => {
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent the click from reaching the parent div
    };
    
    return (
      <span onClick={handleClick} className={className}>
        <AudioButton 
          text={text} 
          language={language} 
          size={size} 
        />
      </span>
    );
  };
  
  return (
    <Card 
      className="cursor-pointer border-l-4 border-green-500"
      hover="lift"
      onClick={toggleDetails}
    >
      <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <h3 className="text-xl font-bold vietnamese-text text-green-700 dark:text-green-400">{item.vietnamese}</h3>
          <AudioButtonWrapper 
            text={item.vietnamese} 
            language="vietnamese" 
            className="ml-2" 
            size="sm" 
          />
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="vietnamese" size="sm">
            VN {item.level}
          </Badge>
          <button
            onClick={handleToggleFavorite}
            aria-label={isItemFavorite ? "Remove from favorites" : "Add to favorites"}
            title={isItemFavorite ? "Remove from favorites" : "Add to favorites"}
            className={`text-lg transition-colors ${
              isItemFavorite 
                ? 'text-yellow-500 hover:text-yellow-600' 
                : 'text-gray-300 hover:text-yellow-400'
            }`}
          >
            {isItemFavorite ? "★" : "☆"}
          </button>
        </div>
      </div>
      
      <div className="mb-2">
        {item.pinyin && (
          <p className="text-sm text-muted-foreground mb-1">
            <span className="font-medium">Pinyin:</span> {item.pinyin}
          </p>
        )}
        <div className="flex items-center">
          <p className="text-lg chinese-text font-medium">{item.chinese}</p>
          {item.chinese && (
            <AudioButtonWrapper 
              text={item.chinese} 
              language="chinese" 
              className="ml-2" 
              size="sm" 
            />
          )}
        </div>
      </div>
      
      {item.english && (
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-medium">English:</span> {item.english}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <Badge variant="outline" size="sm">
          {item.category}
        </Badge>
        {showDetails && item.examples && item.examples.length > 0 && (
          <span className="text-xs text-primary">
            {item.examples.length} example{item.examples.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      {showDetails && item.examples && item.examples.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold mb-3 text-foreground">Examples:</h4>
          <div className="space-y-3">
            {item.examples.slice(0, 2).map((example, index) => (
              <div key={index} className="bg-muted p-3 rounded-md">
                <div className="flex items-center mb-1">
                  <p className="text-sm vietnamese-text font-medium">{example.vietnamese}</p>
                  <AudioButtonWrapper 
                    text={example.vietnamese} 
                    language="vietnamese" 
                    className="ml-2" 
                    size="sm" 
                  />
                </div>
                <div className="flex items-center mb-1">
                  <p className="text-sm chinese-text">{example.chinese}</p>
                  <AudioButtonWrapper 
                    text={example.chinese} 
                    language="chinese" 
                    className="ml-2" 
                    size="sm" 
                  />
                </div>
                {example.pinyin && (
                  <p className="text-xs text-muted-foreground">{example.pinyin}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!showDetails && (
        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">
            Click to see {item.examples && item.examples.length > 0 ? 'examples and ' : ''}more details
          </p>
        </div>
      )}
      </CardContent>
    </Card>
  );
};

export default VietnameseVocabularyCard;
