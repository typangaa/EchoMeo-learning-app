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
- HSK vocabulary (Chinese proficiency levels 1-7) with enriched data from `assets/data/hsk/`
- Vietnamese vocabulary with CEFR leveling

**Data Loading**: Progressive loading system implemented in `enrichedHSKLoader.ts` and `enrichedVietnameseLoader.ts` for large datasets. Uses dynamic imports from assets folder and caching for performance.

**Spaced Repetition**: Custom algorithm in `useSpacedRepetition.ts` with localStorage persistence, using intervals [1, 3, 7, 14, 30, 90] days.

### Key Architectural Patterns

**Context-Based State**: `VocabularyContext` provides centralized vocabulary state, filtering, and favorites across all vocabulary types. Handles three separate favorites systems (regular, HSK, Vietnamese).

**Audio Service**: Singleton service (`audioService.ts`) using Web Speech API for Vietnamese/Chinese pronunciation. Supports text-to-speech with language-specific settings and error handling.

**Component Structure**: 
- Common components in `components/common/` (Layout, Navbar, AudioButton, etc.)
- Vocabulary components with type-specific implementations (HSK, Vietnamese, regular)
- Flashcard system with 3D flip animations and practice modes
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
- HSK: 100000+ range with level-based offsets
- Vietnamese: Separate ID counter system
- Regular: Standard incremental IDs

**TypeScript Types**: Core interfaces in `types/index.ts` with `VocabularyItem` and `ReadingPassage` as main data structures.

## Development Guidelines

When working with vocabulary data:
- Always use the appropriate data loader (`enrichedHSKLoader`, `enrichedVietnameseLoader`)
- Ensure unique IDs across all vocabulary types
- Use the VocabularyContext for state management
- Follow the progressive loading pattern for large datasets

When adding audio features:
- Use the singleton `audioService` for consistency
- Support both Vietnamese (`vi-VN`) and Chinese (`zh-CN`) language codes
- Handle Web Speech API availability gracefully

For flashcard development:
- Integrate with the spaced repetition system
- Use the existing CSS animations in `flashcard.css`
- Support language direction switching (Vietnamese→Chinese or Chinese→Vietnamese)

## File Organization

- `src/data/`: Static data and loaders
- `src/components/vocabulary/`: Vocabulary-specific UI components  
- `src/components/flashcard/`: Flashcard practice components
- `src/hooks/`: Custom React hooks including spaced repetition
- `src/context/`: React context providers
- `scripts/`: Python data processing pipeline
- `assets/data/`: Enriched vocabulary JSON files