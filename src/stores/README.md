# Zustand Store Migration

This document tracks the migration from React Context API to Zustand state management.

## Progress Status

### ✅ Phase 1: Foundation & Setup (COMPLETED)
- [x] Install Zustand dependencies
- [x] Create store directory structure
- [x] Define TypeScript interfaces for all stores
- [x] Setup persistence and devtools middleware
- [x] Implement App store (theme, language, online status)
- [x] Test integration and fix TypeScript errors

### ✅ Phase 2: Core Stores (COMPLETED)
- [x] Create UI Store (modal management, navigation, layout)
- [x] Create Audio Store (migrate AudioContext)
- [x] Update main store index with all stores
- [x] Create example components demonstrating usage
- [x] Test core stores integration

### ✅ Phase 3: Vocabulary System (COMPLETED)
- [x] Analyze current VocabularyContext implementation
- [x] Create unified Vocabulary Store with all vocabulary types
- [x] Migrate vocabulary loading hooks (HSK, Vietnamese)
- [x] Implement unified favorites system with Sets
- [x] Add filtering and search functionality
- [x] Create comprehensive example component
- [x] Test vocabulary functionality and data flow

### ✅ Phase 4: Progress & Spaced Repetition (COMPLETED)
- [x] Create Progress Store with spaced repetition algorithm
- [x] Implement study session tracking
- [x] Add user progress metrics (streak, study time, accuracy)
- [x] Migrate useSpacedRepetition logic to store
- [x] Add computed selectors for due items and stats
- [x] Prepare for future user sync functionality

### ⏳ Phase 5: Future-Ready Features (PENDING)
- [ ] User Store preparation
- [ ] Mobile optimization
- [ ] Offline support

### ⏳ Phase 6: Testing & Cleanup (PENDING)
- [ ] Comprehensive testing
- [ ] Remove old Context files
- [ ] Documentation update

## Current Implementation

### App Store ✅
**Location**: `src/stores/slices/appSlice.ts`

**Features**:
- Theme management (light/dark)
- Language selection (en/vi/zh)
- Online/offline status detection
- Automatic system preference detection

**Usage**:
```tsx
import { useTheme, useLanguage, useThemeActions } from '../stores';

const MyComponent = () => {
  const theme = useTheme();
  const language = useLanguage();
  const { setTheme, setLanguage } = useThemeActions();
  
  return (
    <div>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
      <button onClick={() => setLanguage('vi')}>Vietnamese</button>
    </div>
  );
};
```

### UI Store ✅
**Location**: `src/stores/slices/uiSlice.ts`

**Features**:
- Modal management
- Navigation tracking
- Popover state
- Layout mode (list/grid/cards)
- Sidebar state

**Usage**:
```tsx
import { useActiveModal, useModalActions, useLayoutMode } from '../stores';

const MyComponent = () => {
  const activeModal = useActiveModal();
  const { openModal, closeModal } = useModalActions();
  const layoutMode = useLayoutMode();
  
  return (
    <div>
      <button onClick={() => openModal('settings')}>Open Settings</button>
      <p>Layout: {layoutMode}</p>
    </div>
  );
};
```

### Audio Store ✅
**Location**: `src/stores/slices/audioSlice.ts`

**Features**:
- Audio playback management
- Queue system for continuous playback
- Settings (volume, playback rate, autoplay)
- Integration with audioService

**Usage**:
```tsx
import { useIsPlaying, useAudioPlayback, useAudioSettings } from '../stores';

const MyComponent = () => {
  const isPlaying = useIsPlaying();
  const { play, stop } = useAudioPlayback();
  const { setVolume } = useAudioSettings();
  
  const handlePlay = () => {
    play({
      id: 'example',
      text: 'Xin chào',
      language: 'vi',
      type: 'vocabulary'
    });
  };
  
  return (
    <div>
      <button onClick={handlePlay} disabled={isPlaying}>Play</button>
      <input type="range" onChange={(e) => setVolume(e.target.value)} />
    </div>
  );
};
```

### Vocabulary Store ✅
**Location**: `src/stores/slices/vocabularySlice.ts`

**Features**:
- Unified management for regular, HSK, and Vietnamese vocabulary
- Async data loading with progress tracking
- Set-based favorites system for performance
- Advanced filtering (search, levels, categories, favorites)
- Computed selectors for filtered data

**Usage**:
```tsx
import { 
  useFilteredVocabulary, 
  useVocabularyLoader, 
  useFavoritesActions 
} from '../stores';

const VocabularyComponent = () => {
  const { loadVocabulary } = useVocabularyLoader();
  const { toggleFavorite } = useFavoritesActions();
  const hskLevel1 = useFilteredVocabulary('hsk', 1);
  
  useEffect(() => {
    loadVocabulary('hsk', 1);
  }, []);
  
  return (
    <div>
      {hskLevel1.map(item => (
        <div key={item.id}>
          {item.vietnamese} - {item.chinese}
          <button onClick={() => toggleFavorite('hsk', item.id)}>⭐</button>
        </div>
      ))}
    </div>
  );
};
```

### Progress Store ✅
**Location**: `src/stores/slices/progressSlice.ts`

**Features**:
- Spaced repetition algorithm with configurable intervals
- Study session tracking with accuracy metrics
- User progress analytics (streak, study time, words learned)
- Due items calculation
- Future-ready for user sync

**Usage**:
```tsx
import { 
  useSpacedRepetitionActions,
  useStudySessionActions,
  useDueItems,
  useStudyStats 
} from '../stores';

const StudyComponent = () => {
  const { updateSpacedRepetition } = useSpacedRepetitionActions();
  const { startStudySession, recordAnswer } = useStudySessionActions();
  const dueItems = useDueItems();
  const stats = useStudyStats();
  
  const handleAnswer = (itemId: number, correct: boolean) => {
    recordAnswer(correct);
    updateSpacedRepetition(itemId, correct);
  };
  
  return (
    <div>
      <p>Due items: {dueItems.length}</p>
      <p>Session accuracy: {stats.accuracy.toFixed(1)}%</p>
      <p>Study streak: {stats.streak} days</p>
    </div>
  );
};
```

**Benefits**:
- ✅ Persistent state (localStorage)
- ✅ Redux DevTools integration
- ✅ Type-safe selectors
- ✅ Automatic browser preference detection
- ✅ Mobile-ready architecture
- ✅ Simplified audio management (vs complex AudioContext)

## Store Architecture

### Modular Design
Each store slice is independent and focused:
- **AppStore**: Global app settings
- **UserStore**: Authentication and user data (future)
- **VocabularyStore**: All vocabulary data and filtering
- **ProgressStore**: Spaced repetition and user progress
- **AudioStore**: Audio playback and queue management
- **UIStore**: UI state and navigation

### Middleware Stack
1. **Persistence**: Automatic localStorage/AsyncStorage
2. **DevTools**: Redux DevTools integration
3. **Logger**: Development debugging (optional)
4. **Subscriptions**: Selective component subscriptions

### Mobile Compatibility
- ✅ Platform detection (web vs React Native)
- ✅ AsyncStorage adapter ready
- ✅ Offline-first architecture
- ✅ Optimized bundle size

## Migration Benefits

### Performance
- **Selective subscriptions**: Components only re-render when their data changes
- **No provider nesting**: Eliminates React Context performance issues
- **Smaller bundle**: ~2KB vs Context overhead

### Developer Experience
- **Type safety**: Full TypeScript support with inference
- **DevTools**: Time-travel debugging and state inspection
- **Hot reloading**: State persists across development reloads

### Mobile Ready
- **Shared codebase**: 80%+ code reuse between web and React Native
- **Consistent patterns**: Same hooks work across platforms
- **Offline support**: Built-in persistence and sync capabilities

## Next Steps

1. **UI Store** - Modal and navigation state management
2. **Audio Store** - Simplify complex audio state from AudioContext
3. **Vocabulary Store** - Migrate the main vocabulary functionality
4. **Progress Store** - Move spaced repetition logic
5. **Testing** - Comprehensive test coverage
6. **Cleanup** - Remove old Context providers

## Example Migration Pattern

### Before (Context API):
```tsx
// Provider setup
<VocabularyContext.Provider value={vocabularyState}>
  <Component />
</VocabularyContext.Provider>

// Component usage
const { vocabularyItems, favorites, toggleFavorite } = useContext(VocabularyContext);
```

### After (Zustand):
```tsx
// No provider needed!
// Component usage
const vocabularyItems = useVocabularyItems();
const favorites = useFavorites();
const toggleFavorite = useToggleFavorite();
```

### Migration Checklist for Each Store:
1. [ ] Define TypeScript interfaces
2. [ ] Create store slice with actions
3. [ ] Add persistence configuration
4. [ ] Create utility hooks
5. [ ] Update components
6. [ ] Test functionality
7. [ ] Remove old context

## Resources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TypeScript Best Practices](https://zustand-demo.pmnd.rs/)
- [Mobile Migration Guide](https://github.com/react-native-async-storage/async-storage)