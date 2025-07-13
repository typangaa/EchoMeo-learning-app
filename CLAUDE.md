# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (starts Vite dev server on port 5173)
- **Build for production**: `npm run build` (TypeScript compilation + Vite build)
- **Lint code**: `npm run lint` (ESLint with TypeScript rules)
- **Preview production build**: `npm run preview`
- **Deploy to GitHub Pages**: `npm run deploy`

## Architecture Overview

This is a React-based Vietnamese-Chinese learning platform with TypeScript, built using Vite and deployed on GitHub Pages.

### Core Data Systems

**Vocabulary Management**: Three separate vocabulary systems with unified favorites management:
- Regular vocabulary (CEFR levels A1-C2)
- HSK vocabulary (Chinese proficiency levels 1-6) with enriched data from `assets/data/hsk/`
- Vietnamese vocabulary (levels 1-6, mapped to CEFR A1-C1) with enriched data from `assets/data/vietnamese/`

**Data Loading**: Progressive loading system implemented in `enrichedHSKLoader.ts` and `enrichedVietnameseLoader.ts` for large datasets. Uses dynamic imports from assets folder and caching for performance. Both loaders support levels 1-6 with proper error handling and data validation.

**Spaced Repetition**: Custom algorithm in `useSpacedRepetition.ts` with localStorage persistence, using intervals [1, 3, 7, 14, 30, 90] days.

### Key Architectural Patterns

**Zustand State Management**: Migrated from Context to Zustand for better performance. Provides centralized vocabulary state, filtering, and favorites across all vocabulary types. Handles three separate favorites systems (regular, HSK, Vietnamese) with localStorage persistence.

**Audio Service**: Singleton service (`audioService.ts`) using Web Speech API for Vietnamese/Chinese pronunciation. Supports text-to-speech with language-specific settings and error handling. Integrated with Zustand audio store to prevent duplicate playback.

**Component Structure**: 
- Common components in `components/common/` (Layout, Navbar, AudioButton, etc.)
- Vocabulary components with type-specific implementations (HSK, Vietnamese, regular)
- Complete flashcard system with 3D flip animations and practice modes for all vocabulary types
- Reading system with parallel text and vocabulary lookup

### Data Processing Pipeline

The project includes extensive Python scripts in `scripts/` for:
- HSK vocabulary processing and enrichment (`05_vocabulary_processing/`)
- Vietnamese vocabulary generation and analysis
- Audio file generation and mapping
- Data validation and duplicate detection

### Important Technical Details

**Base Path Configuration**: Uses `/vietnamese-chinese-learning/` base path in `vite.config.ts` for GitHub Pages deployment.

**Routing**: Uses HashRouter for GitHub Pages compatibility instead of BrowserRouter.

**ID Generation**: Unique ID systems for each vocabulary type to prevent conflicts:
- HSK: 100000+ range with level-based offsets (levels 1-6 supported)
- Vietnamese: 200000+ range with level-based offsets (levels 1-6 supported)
- Regular: Standard incremental IDs

**TypeScript Types**: Core interfaces in `types/index.ts` with `VocabularyItem` and `ReadingPassage` as main data structures.

**Routing**: Complete routing system with HashRouter:
- `/` - Homepage with vocabulary type selection
- `/vocabulary` - Regular vocabulary browsing
- `/vietnamese` - Vietnamese vocabulary levels 1-6
- `/hsk` - HSK vocabulary levels 1-6
- `/flashcards` - General flashcard selection
- `/vietnamese-flashcards` - Vietnamese flashcard practice
- `/hsk-flashcards` - HSK flashcard practice
- `/reading` - Reading passages with vocabulary lookup

## Development Guidelines

When working with vocabulary data:
- Always use the appropriate data loader (`enrichedHSKLoader`, `enrichedVietnameseLoader`)
- Both loaders support levels 1-6 with proper validation and error handling
- Ensure unique IDs across all vocabulary types using the established ID ranges
- Use Zustand stores for state management (migrated from Context for better performance)
- Follow the progressive loading pattern for large datasets

When adding audio features:
- Use the singleton `audioService` for consistency
- Audio is integrated with Zustand store to prevent duplicate playback
- Support both Vietnamese (`vi-VN`) and Chinese (`zh-CN`) language codes
- Handle Web Speech API availability gracefully
- AudioButton component uses optional chaining for robust error handling

For flashcard development:
- Complete flashcard system available for HSK, Vietnamese, and regular vocabulary
- Integrate with the spaced repetition system
- Use the existing CSS animations in `flashcard.css`
- Support language direction switching (Vietnamese→Chinese or Chinese→Vietnamese)
- Vietnamese flashcards don't show English on the front (focus on VN-CN translation)

## File Organization

- `src/data/`: Data loaders (`enrichedHSKLoader.ts`, `enrichedVietnameseLoader.ts`)
- `src/components/vocabulary/`: Vocabulary-specific UI components  
- `src/components/vocabulary/flashcard/`: Flashcard practice components (HSK, Vietnamese, regular)
- `src/hooks/`: Custom React hooks including spaced repetition and vocabulary hooks
- `src/stores/`: Zustand store slices (migrated from Context)
- `src/pages/`: Page components including dedicated flashcard pages
- `scripts/`: Python data processing pipeline
- `assets/data/hsk/`: HSK vocabulary JSON files (levels 1-6)
- `assets/data/vietnamese/`: Vietnamese vocabulary JSON files (levels 1-6)

## Recent Updates (Current Session)

- **Extended Vietnamese support**: Vietnamese vocabulary now supports levels 1-6 (A1-C1 CEFR)
- **Extended HSK support**: HSK vocabulary now supports levels 1-6
- **Fixed Vietnamese loading**: Resolved TypeError in Vietnamese loader for proper data validation
- **Audio improvements**: Fixed duplicate audio playback issue in AudioButton component
- **Complete Vietnamese flashcards**: Added VietnameseFlashcardPage with full routing support
- **UI improvements**: Updated level descriptions and buttons for both Vietnamese and HSK vocabularies
- **Zustand migration**: Completed migration from Context to Zustand for better state management