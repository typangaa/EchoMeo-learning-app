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

**Audio Service**: Enhanced singleton service (`audioService.ts`) using Web Speech API for Vietnamese/Chinese pronunciation. Features comprehensive voice management with:
- Automatic Hong Kong SAR voice filtering for better quality
- Yating voice prioritization as default for Chinese
- Configurable settings (volume, rate, pitch) with localStorage persistence
- Audio interruption handling to prevent overlapping playback
- Voice selection algorithms prioritizing local over online voices

**Component Structure**: 
- Common components in `components/common/` (Layout, Navbar, AudioButton, etc.)
- Vocabulary components with type-specific implementations (HSK, Vietnamese, regular)
- Complete flashcard system with 3D flip animations and practice modes for all vocabulary types
- Reading system with parallel text and vocabulary lookup

**Internationalization (i18n)**: Comprehensive interface language support with:
- Translation system in `src/i18n/` with files for English, Vietnamese, Simplified Chinese, and Traditional Chinese
- `useTranslation` hook for accessing translations throughout the application
- Language detection and persistence via Zustand store with localStorage
- Smart browser language detection supporting Traditional Chinese variants (zh-TW, zh-HK, zh-Hant)
- Dynamic array translation support for lists and features
- Language selector in SettingsPage for user preference management

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

**Interface Languages**: Full support for four interface languages:
- English (en): Default fallback language
- Vietnamese (vi): Complete Vietnamese interface
- Simplified Chinese (zh): Mainland China standard
- Traditional Chinese (zh-tw): Taiwan/Hong Kong standard with auto-detection

**Routing**: Complete routing system with HashRouter:
- `/` - Homepage with vocabulary type selection
- `/vocabulary` - Regular vocabulary browsing
- `/vietnamese` - Vietnamese vocabulary levels 1-6
- `/hsk` - HSK vocabulary levels 1-6
- `/flashcards` - General flashcard selection
- `/vietnamese-flashcards` - Vietnamese flashcard practice
- `/hsk-flashcards` - HSK flashcard practice
- `/reading` - Reading passages with vocabulary lookup
- `/settings` - Audio settings and user preferences

## Development Guidelines

When working with vocabulary data:
- Always use the appropriate data loader (`enrichedHSKLoader`, `enrichedVietnameseLoader`)
- Both loaders support levels 1-6 with proper validation and error handling
- Ensure unique IDs across all vocabulary types using the established ID ranges
- Use Zustand stores for state management (migrated from Context for better performance)
- Follow the progressive loading pattern for large datasets

When adding audio features:
- Use the singleton `audioService` for consistency
- Audio interruption is handled automatically via `audioService.stop()` before new playback
- Support both Vietnamese (`vi-VN`) and Chinese (`zh-CN`) language codes
- Handle Web Speech API availability gracefully
- AudioButton component uses optional chaining for robust error handling
- Use SettingsPage for user audio preferences (voice selection, volume, rate, pitch)
- Default audio settings: volume 1.0, rate 0.8x, pitch 1.0

For flashcard development:
- Complete flashcard system available for HSK, Vietnamese, and regular vocabulary
- Integrate with the spaced repetition system
- Use the existing CSS animations in `flashcard.css`
- Support language direction switching (Vietnamese→Chinese or Chinese→Vietnamese)
- Vietnamese flashcards don't show English on the front (focus on VN-CN translation)

For interface translations:
- Always use the `useTranslation` hook for user-facing text
- Keep learning content (vocabulary words) in original languages for educational integrity
- Translation keys use nested structure (e.g., 'vocabulary.hsk.about.title')
- Support dynamic parameter replacement with {param} syntax
- Array translations automatically handled for lists and features
- Language preference persists across sessions via localStorage

## File Organization

- `src/data/`: Data loaders (`enrichedHSKLoader.ts`, `enrichedVietnameseLoader.ts`)
- `src/components/vocabulary/`: Vocabulary-specific UI components  
- `src/components/vocabulary/flashcard/`: Flashcard practice components (HSK, Vietnamese, regular)
- `src/hooks/`: Custom React hooks including spaced repetition, vocabulary hooks, and `useTranslation`
- `src/stores/`: Zustand store slices (migrated from Context) with language state management
- `src/pages/`: Page components including dedicated flashcard pages and SettingsPage with language selector
- `src/i18n/`: Translation files (`en.ts`, `vi.ts`, `zh.ts`, `zh-tw.ts`) and translation utilities
- `scripts/`: Python data processing pipeline
- `assets/data/hsk/`: HSK vocabulary JSON files (levels 1-6)
- `assets/data/vietnamese/`: Vietnamese vocabulary JSON files (levels 1-6)

## Recent Updates (Current Session)

- **Comprehensive Interface Language System**: Implemented full internationalization support:
  * Created translation infrastructure with 4 language files (English, Vietnamese, Simplified Chinese, Traditional Chinese)
  * Built stable `useTranslation` hook with array support and parameter interpolation
  * Added language selector to SettingsPage with auto-detection for Traditional Chinese variants
  * Translated core components: Navbar, HomePage, SettingsPage, HSKVocabularyPage, VietnameseVocabularyPage
  * Enhanced Zustand store with language state management and persistence
  * Implemented smart browser language detection for Traditional Chinese (zh-TW, zh-HK, zh-Hant)
  * Fixed infinite loop issues with proper memoization and stable function references

- **Enhanced Audio System**: Major audio service improvements with comprehensive voice management:
  * Fixed audio interruption bug in flashcards by adding audioService.stop() before new audio
  * Filtered out Hong Kong SAR voices for better Chinese pronunciation quality
  * Prioritized Yating voice as default for Chinese audio
  * Updated default settings: pitch 1.0, rate 0.8x, volume 1.0
  * Added localStorage persistence for all audio settings

- **Settings Page**: Created comprehensive SettingsPage.tsx with:
  * Volume, rate, and pitch sliders with real-time feedback
  * Voice selection dropdowns with test functionality
  * Interface language selector with 4 language options
  * Mobile-responsive design with proper form controls
  * Added `/settings` route and navigation links

- **UI Simplification**: Simplified flashcard practice page descriptions and removed verbose content
- **App Title Update**: Changed app title from "Học Tiếng Việt" to "Học Tiếng Trung" 
- **Build Fixes**: Resolved TypeScript build errors by removing unused isPlayingAudio state variables
- **Extended Vietnamese support**: Vietnamese vocabulary now supports levels 1-6 (A1-C1 CEFR)
- **Extended HSK support**: HSK vocabulary now supports levels 1-6
- **Zustand migration**: Completed migration from Context to Zustand for better state management