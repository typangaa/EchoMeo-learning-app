import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface FilterOptions {
  levels: number[];
  categories: string[];
  favorites: boolean;
  cefrLevels: string[];
}

interface AdvancedFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  availableLevels: number[];
  availableCategories: string[];
  availableCefrLevels: string[];
  currentFilters: FilterOptions;
  vocabularyType: 'hsk' | 'vietnamese';
}

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  onFilterChange,
  availableLevels,
  availableCategories,
  availableCefrLevels,
  currentFilters,
  vocabularyType,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLevelToggle = (level: number, checked: boolean) => {
    const newLevels = checked
      ? [...currentFilters.levels, level]
      : currentFilters.levels.filter(l => l !== level);
    
    onFilterChange({
      ...currentFilters,
      levels: newLevels,
    });
  };

  const handleCategoryToggle = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...currentFilters.categories, category]
      : currentFilters.categories.filter(c => c !== category);
    
    onFilterChange({
      ...currentFilters,
      categories: newCategories,
    });
  };

  const handleCefrToggle = (cefrLevel: string, checked: boolean) => {
    const newCefrLevels = checked
      ? [...currentFilters.cefrLevels, cefrLevel]
      : currentFilters.cefrLevels.filter(c => c !== cefrLevel);
    
    onFilterChange({
      ...currentFilters,
      cefrLevels: newCefrLevels,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      levels: [],
      categories: [],
      favorites: false,
      cefrLevels: [],
    });
  };

  const activeFilterCount = 
    currentFilters.levels.length +
    currentFilters.categories.length +
    currentFilters.cefrLevels.length +
    (currentFilters.favorites ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="start">
          <div className="flex items-center justify-between">
            <DropdownMenuLabel>Filters</DropdownMenuLabel>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-auto p-1 text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
          <DropdownMenuSeparator />

          {/* Levels */}
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
            {vocabularyType === 'hsk' ? 'HSK Levels' : 'Vietnamese Levels'}
          </DropdownMenuLabel>
          {availableLevels.map((level) => (
            <DropdownMenuCheckboxItem
              key={level}
              checked={currentFilters.levels.includes(level)}
              onCheckedChange={(checked) => handleLevelToggle(level, checked)}
            >
              {vocabularyType === 'hsk' ? `HSK ${level}` : `Level ${level}`}
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator />

          {/* Favorites */}
          <DropdownMenuCheckboxItem
            checked={currentFilters.favorites}
            onCheckedChange={(checked) => onFilterChange({ ...currentFilters, favorites: checked })}
          >
            ⭐ Favorites Only
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          {/* CEFR Levels (for Vietnamese) */}
          {vocabularyType === 'vietnamese' && availableCefrLevels.length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                CEFR Levels
              </DropdownMenuLabel>
              {availableCefrLevels.map((cefrLevel) => (
                <DropdownMenuCheckboxItem
                  key={cefrLevel}
                  checked={currentFilters.cefrLevels.includes(cefrLevel)}
                  onCheckedChange={(checked) => handleCefrToggle(cefrLevel, checked)}
                >
                  {cefrLevel}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}

          {/* Categories */}
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
            Categories
          </DropdownMenuLabel>
          {availableCategories.slice(0, 8).map((category) => (
            <DropdownMenuCheckboxItem
              key={category}
              checked={currentFilters.categories.includes(category)}
              onCheckedChange={(checked) => handleCategoryToggle(category, checked)}
            >
              {category}
            </DropdownMenuCheckboxItem>
          ))}
          {availableCategories.length > 8 && (
            <div className="px-2 py-1 text-xs text-muted-foreground">
              +{availableCategories.length - 8} more categories
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active filter badges */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1">
          {currentFilters.levels.map(level => (
            <Badge key={`level-${level}`} variant="secondary" className="text-xs">
              {vocabularyType === 'hsk' ? `HSK ${level}` : `Level ${level}`}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleLevelToggle(level, false)}
              />
            </Badge>
          ))}
          {currentFilters.favorites && (
            <Badge variant="secondary" className="text-xs">
              ⭐ Favorites
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => onFilterChange({ ...currentFilters, favorites: false })}
              />
            </Badge>
          )}
          {currentFilters.categories.slice(0, 3).map(category => (
            <Badge key={`category-${category}`} variant="secondary" className="text-xs">
              {category}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleCategoryToggle(category, false)}
              />
            </Badge>
          ))}
          {currentFilters.categories.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{currentFilters.categories.length - 3} more
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};