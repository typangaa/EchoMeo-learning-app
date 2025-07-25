# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (starts Vite dev server on port 5173)
- **Build for production**: `npm run build` (TypeScript compilation + Vite build + PWA generation)
- **Lint code**: `npm run lint` (ESLint with TypeScript rules)
- **Preview production build**: `npm run preview`
- **Deploy to GitHub Pages**: `npm run deploy`
- **PWA Commands**:
  - **Build PWA**: Service worker and manifest generation included in build
  - **Capacitor sync**: `npx cap sync` (sync web assets to native platforms)
  - **iOS build**: `npx cap run ios` (requires Xcode and iOS development setup)
  - **Android build**: `npx cap run android` (requires Android Studio and SDK)
- **shadcn/ui Commands**:
  - **Add component**: `npx shadcn@latest add <component-name>` (adds UI components to `src/components/ui/`)
  - **List components**: `npx shadcn@latest list` (shows available components)
  - **Update components**: `npx shadcn@latest update` (updates existing components)

## Architecture Overview

This is a React-based multi-language learning platform with TypeScript, built using Vite as a Progressive Web App (PWA) with Capacitor wrapper for cross-platform deployment. The application features a mobile-first design with comprehensive vocabulary study tools and supports multiple language pairs for flexible language learning.

### Core Data Systems

**Vocabulary Management**: Extensible vocabulary systems with unified favorites management supporting multiple language pairs:
- Regular vocabulary (CEFR levels A1-C2) - foundational language learning content
- HSK vocabulary (Chinese proficiency levels 1-6) with enriched data from `assets/data/hsk/`
- Vietnamese vocabulary (levels 1-6, mapped to CEFR A1-C1) with enriched data from `assets/data/vietnamese/`
- **Multi-Language Pair Architecture**: Designed to support additional language pairs (e.g., English-Spanish, French-German, Japanese-Korean) through the same data loading and component patterns

**Data Loading**: Progressive loading system implemented in `enrichedHSKLoader.ts` and `enrichedVietnameseLoader.ts` for large datasets. Uses dynamic imports from assets folder and caching for performance. Both loaders support levels 1-6 with proper error handling and data validation.

**Spaced Repetition**: Custom algorithm in `useSpacedRepetition.ts` with localStorage persistence, using intervals [1, 3, 7, 14, 30, 90] days.

**Progress Tracking Systems**: 
- Reading progress tracking in `readingProgress.ts` for maintaining vocabulary position across study sessions
- Lesson completion tracking in `lessonCompletion.ts` with localStorage persistence for flashcard lesson progress
- Both systems use singleton patterns for consistent state management

### Key Architectural Patterns

**Zustand State Management**: Comprehensive store architecture with middleware:
- Modular store slices: `appSlice`, `uiSlice`, `audioSlice`, `vocabularySlice`, `progressSlice`
- **Language Pair Preferences**: User-configurable learning direction with English supplement toggle
- Persistent state with localStorage via `persist` middleware
- DevTools integration for debugging
- Memoized selectors for performance optimization
- Stable hook patterns to prevent re-renders

**Audio Service**: Enhanced singleton service (`audioService.ts`) using Web Speech API for Vietnamese/Chinese pronunciation. Features comprehensive voice management with:
- Automatic Hong Kong SAR voice filtering for better quality
- Yating voice prioritization as default for Chinese
- Configurable settings (volume, rate, pitch) with localStorage persistence
- Audio interruption handling to prevent overlapping playback
- Voice selection algorithms prioritizing local over online voices

**Component Structure**: 
- Common components in `components/common/` (Layout, Navbar, AudioButton, etc.)
- **Dynamic Navigation**: Navbar that adapts based on user's target language preferences
- Vocabulary components with type-specific implementations (HSK, Vietnamese, regular)
- **Simplified Vocabulary Cards**: Cleaner design with reduced visual complexity and better focus
- Mobile-optimized study components with swipe navigation and touch gestures
- **Language-Aware Flashcards**: Show only relevant flashcard options based on learning direction
- Complete flashcard system with 3D flip animations and practice modes for all vocabulary types
- Reading system with parallel text and vocabulary lookup
- Bug reporting system integrated into vocabulary cards
- **English Supplement Support**: Consistent optional English display across all vocabulary components

**shadcn/ui Integration**: Modern UI component library built on Radix UI and Tailwind CSS:
- **Component Library**: High-quality, accessible components with consistent design system
- **Setup**: Configured with TypeScript support and proper path aliases (`@/components`, `@/lib/utils`)
- **Theme System**: CSS variables for light/dark theme support integrated with existing dark mode
- **Utility Function**: `cn()` utility in `src/lib/utils.ts` for className merging with clsx and tailwind-merge
- **Configuration**: `components.json` for shadcn/ui CLI configuration with proper aliases
- **Dependencies**: Includes class-variance-authority, clsx, tailwind-merge, and lucide-react for icons
- **Adding Components**: Use `npx shadcn@latest add <component-name>` to add new components
- **Customization**: Components can be customized by editing files in `src/components/ui/`
- **Integration**: Works seamlessly with existing Tailwind CSS setup and mobile-first design

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
- Cantonese vocabulary generation from HSK data using Ollama AI
- Audio file generation and mapping
- Data validation and duplicate detection

### Important Technical Details

**PWA Configuration**: Progressive Web App features with:
- Service worker for offline functionality and caching strategies
- Web app manifest (`manifest.json`) for app-like installation
- Background sync for offline data synchronization
- Push notifications for study reminders (future enhancement)
- Responsive design optimized for all device sizes

**Capacitor Integration**: Cross-platform deployment with:
- Native iOS and Android app generation from web codebase
- Native device API access (camera, storage, notifications)
- App store deployment capabilities
- Platform-specific optimizations and native feel

**Base Path Configuration**: 
- Uses `/EchoMeo-learning-app/` base path in `vite.config.ts` for GitHub Pages deployment
- Capacitor builds use root path (`/`) for native app deployment

**Routing**: Uses HashRouter for GitHub Pages compatibility instead of BrowserRouter.

**Theme**: Dark theme is the default with system preference detection and persistence.

**ID Generation**: Unique ID systems for each vocabulary type to prevent conflicts:
- HSK: 100000+ range with level-based offsets (levels 1-6 supported)
- Vietnamese: 200000+ range with level-based offsets (levels 1-6 supported)
- Regular: Standard incremental IDs

**TypeScript Types**: Core interfaces in `types/index.ts` with `VocabularyItem` and `ReadingPassage` as main data structures:
- **Language Pair Types**: `LearningLanguage` and `LanguagePairPreferences` interfaces for user preferences
- **Enhanced Examples**: VocabularyItem examples now include optional English field for trilingual support
- **Store Types**: Comprehensive type definitions for all Zustand store slices and state management

**Interface Languages**: Full support for four interface languages with EchoMeo branding:
- English (en): Default fallback language with 🐱 EchoMeo branding
- Vietnamese (vi): Complete Vietnamese interface
- Simplified Chinese (zh): Mainland China standard
- Traditional Chinese (zh-tw): Taiwan/Hong Kong standard with auto-detection

**Routing**: Complete routing system with HashRouter:
- `/` - Homepage (redirects to welcome for new users)
- `/welcome` - Welcome page with onboarding flow
- `/vocabulary` - Regular vocabulary browsing
- `/vietnamese` - Vietnamese vocabulary browsing (levels 1-6)
- `/vietnamese-study` - Mobile-optimized Vietnamese study page
- `/hsk` - HSK vocabulary browsing (levels 1-6)
- `/hsk-study` - Mobile-optimized HSK study page
- `/flashcards` - General flashcard selection
- `/vietnamese-flashcards` - Vietnamese flashcard practice
- `/hsk-flashcards` - HSK flashcard practice
- `/reading` - Reading passages with vocabulary lookup
- `/settings` - Audio settings and user preferences

## Development Guidelines

When using shadcn/ui components:
- Import components from `@/components/ui/` using the configured path alias
- Use the `cn()` utility function from `@/lib/utils` for conditional className merging
- Prefer shadcn/ui components over custom implementations for common UI patterns (buttons, inputs, modals, etc.)
- Customize components by editing the generated files in `src/components/ui/` rather than overriding with CSS
- Follow the component's built-in prop interface for theming and variants
- Use `npx shadcn@latest add <component>` to add new components as needed
- Components automatically respect the existing dark/light theme system via CSS variables
- Ensure mobile responsiveness when using shadcn/ui components in the mobile-first design

When working with dynamic navigation and language pairs:
- Use `useAppStore((state) => state.languagePairPreferences)` to access current language learning direction
- Check `toLanguage` property to determine which navigation items to show (HSK for 'mandarin', Vietnamese for 'vi')
- Always validate language pair combinations against supported pairs: EN→Mandarin, EN→Vietnamese, VI→Mandarin, Mandarin→Vietnamese
- Use `showEnglishSupplement` setting consistently across all vocabulary components
- English supplement should auto-disable when `fromLanguage` is 'en' to avoid redundancy

When implementing English supplement support:
- Access setting via `useAppStore((state) => state.languagePairPreferences.showEnglishSupplement)`
- Apply conditional rendering: `{item.english && showEnglishSupplement && (<EnglishContent />)}`
- Ensure examples include English when supplement is enabled: `{example.english && showEnglishSupplement && ...}`
- Maintain consistent English styling: `text-green-600 dark:text-green-400` for English content
- English content should always be supplementary/secondary in visual hierarchy

When working with vocabulary data:
- Always use the appropriate data loader (`enrichedHSKLoader`, `enrichedVietnameseLoader`)
- Both loaders support levels 1-6 with proper validation and error handling
- Ensure unique IDs across all vocabulary types using the established ID ranges
- Use Zustand stores for state management with memoized selectors
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
- Complete lesson-based flashcard system for HSK and Vietnamese vocabulary
- 20 words per lesson with responsive pagination (5 lessons mobile, 10 desktop)
- Lesson completion tracking with visual progress indicators and celebration messages
- Progress summaries with percentage completion and lesson counts
- Integrate with the spaced repetition system and lesson completion tracking
- Use the existing CSS animations in `flashcard.css`
- Support language direction switching (Vietnamese→Chinese or Chinese→Vietnamese)
- Vietnamese flashcards don't show English on the front (focus on VN-CN translation)
- Both HSK and Vietnamese flashcard systems have feature parity

For interface translations:
- Always use the `useTranslation` hook for user-facing text
- Keep learning content (vocabulary words) in original languages for educational integrity
- Translation keys use nested structure (e.g., 'vocabulary.hsk.about.title')
- Support dynamic parameter replacement with {param} syntax
- Array translations automatically handled for lists and features
- Language preference persists across sessions via localStorage

For mobile development:
- Mobile-first design approach for all new features
- Support touch gestures and swipe navigation
- Ensure responsive layouts with proper breakpoints
- Test on various screen sizes and orientations
- Use mobile-specific UI patterns in study pages
- PWA-optimized design for app-like experience
- Capacitor-compatible components for native deployment

For multi-language pair development:
- Follow established data loading patterns when adding new language pairs
- Use consistent ID generation schemes (assign unique ranges for each language pair)
- Implement language pair-specific loaders following `enrichedHSKLoader.ts` pattern
- Create dedicated components for each language pair in appropriate subdirectories
- Maintain unified favorites and progress tracking across all language pairs
- Ensure audio service supports additional language codes and voice selection
- Follow existing routing patterns for new language pair pages

For bug reporting:
- Use `bugReport.ts` utility for vocabulary item issues
- Include structured vocabulary data and technical information
- Generate mailto links for easy user reporting

## File Organization

- `src/data/`: Data loaders (`enrichedHSKLoader.ts`, `enrichedVietnameseLoader.ts`)
- `src/components/vocabulary/`: Vocabulary-specific UI components
  - `hsk/`: HSK-specific components (sidebar, navigation, cards, lists)
  - `vietnamese/`: Vietnamese-specific components
  - `flashcard/`: Flashcard practice components
- `src/hooks/`: Custom React hooks including spaced repetition, vocabulary hooks, and `useTranslation`
- `src/stores/`: Zustand store with modular slices and middleware
- `src/pages/`: Page components including study pages, welcome page, and settings
- `src/i18n/`: Translation files (`en.ts`, `vi.ts`, `zh.ts`, `zh-tw.ts`) and translation utilities
- `src/utils/`: Utility functions including `bugReport.ts`, `readingProgress.ts`, and `lessonCompletion.ts`
- `scripts/`: Python data processing pipeline including Cantonese generation
- `assets/data/hsk/`: HSK vocabulary JSON files (levels 1-6)
- `assets/data/vietnamese/`: Vietnamese vocabulary JSON files (levels 1-6)
- `public/`: PWA assets including `manifest.json`, service worker, and app icons
- `ios/`: Capacitor iOS project files (generated)
- `android/`: Capacitor Android project files (generated)
- `capacitor.config.ts`: Capacitor configuration for native app builds

## Recent Updates

- **Dynamic Language-Based Navigation and English Supplement System** (Latest): Personalized learning experience:
  * **Smart Navigation**: Navbar and flashcard pages dynamically show only relevant language options based on user's target language
  * **English Supplement Support**: Comprehensive optional English translation system throughout vocabulary components
  * **Language Pair Preferences**: User-configurable language learning direction (EN→Mandarin, EN→Vietnamese, VI→Mandarin, Mandarin→Vietnamese)
  * **Simplified Vocabulary Cards**: Cleaner design with reduced visual clutter and better mobile responsiveness
  * **Enhanced Data Loading**: Fixed English examples in vocabulary data loaders for complete trilingual support
  * **Settings Integration**: Language pair configuration with smart auto-disable of English supplement when user speaks English
  * **Consistent UX**: All vocabulary components (cards, examples, flashcards) respect English supplement setting
  * **EchoMeo Branding**: Updated interface with cat icon and new branding throughout the application

- **Lesson-Based Flashcard System**: Complete overhaul of flashcard learning:
  * 20 words per lesson structure for both HSK and Vietnamese vocabulary
  * Lesson completion tracking with localStorage persistence
  * Visual progress indicators with checkmarks and progress bars
  * Responsive pagination (5 lessons mobile, 10 desktop)
  * Celebration messages on lesson completion
  * Feature parity between HSK and Vietnamese flashcard systems

- **Reading Progress Tracking**: Added position persistence for study pages:
  * `readingProgress.ts` utility with singleton pattern
  * Tracks current vocabulary index across level changes and page switches
  * Integrated into HSK and Vietnamese study pages

- **Mobile-First Study Pages**: Added comprehensive study pages for HSK and Vietnamese vocabulary:
  * `HSKVocabularyViewPage.tsx` and `VietnameseVocabularyViewPage.tsx`
  * Swipe navigation, search functionality, favorites filtering
  * Mobile-responsive design with touch gestures
  * List panels and level selection

- **Enhanced Flashcard Navigation**: Improved user flow:
  * Direct level selection on main flashcard page
  * Centralized audio settings on flashcard selection page
  * State-based navigation returning to lesson selection after practice
  * Consistent navigation patterns across HSK and Vietnamese systems

- **Welcome Page Onboarding**: Enhanced welcome page with multi-step onboarding:
  * Language selection and theme preferences
  * Audio configuration and voice testing
  * First-time user detection with redirect

- **Bug Reporting System**: Integrated bug reporting for vocabulary items:
  * `bugReport.ts` utility for generating reports
  * Structured data inclusion in mailto links
  * Bug report buttons in vocabulary cards

- **Cantonese Generation System**: Added Python scripts for Cantonese vocabulary:
  * Ollama-based AI generation from HSK data
  * Batch processing with logging
  * Structured prompts for consistent output

- **Dark Theme Default**: Application now defaults to dark theme with persistence

- **Enhanced Store Architecture**: Complete Zustand implementation:
  * Modular slices for different state domains
  * Middleware for persistence and debugging
  * Memoized selectors for performance
  * Stable hook patterns

- **Comprehensive Interface Language System**: Full internationalization support:
  * 4 language files with complete translations
  * Smart browser language detection
  * Traditional Chinese variant support
  * Dynamic parameter and array handling

- **PWA and Capacitor Integration**: Cross-platform deployment capabilities:
  * Progressive Web App features with offline support
  * Service worker for caching and background sync
  * Native iOS and Android app generation via Capacitor
  * App store deployment readiness with proper manifests and icons

- **Multi-Language Pair Architecture**: Extensible platform design:
  * Scalable data loading patterns for new language pairs
  * Unified progress tracking across all language combinations
  * Consistent component architecture for language-specific features
  * Flexible audio service supporting multiple language codes

## Monetization Strategy

### Google Ads Integration Plan

**Ad Placement Strategy:**
- **Layout.tsx**: Global banner ads between navbar and main content
- **HomePage.tsx**: Strategic placements after hero section and between learning sections
- **Study Pages**: Interstitial ads every 10-15 vocabulary items (non-intrusive timing)
- **Flashcard Pages**: Between practice sessions at natural break points

**Component Architecture:**
```
src/components/ads/
├── AdBanner.tsx          # Responsive banner advertisements
├── AdSidebar.tsx         # Sidebar/skyscraper ad formats
├── AdInterstitial.tsx    # Between-content advertising
├── AdProvider.tsx        # Context provider for ad configuration
├── types.ts              # TypeScript interfaces for ad components
└── constants.ts          # Ad unit IDs and responsive size configurations
```

**Technical Requirements:**
- Mobile-first responsive ad design matching existing UI patterns
- Dark/light theme compatibility for all ad placements
- Performance optimization with lazy loading below the fold
- Non-interference with touch gestures and swipe navigation
- AdSense script integration in index.html with proper CSP headers

**Content Guidelines:**
- Educational content compliance for premium ad rates
- Family-friendly advertiser requirements
- International audience considerations (Vietnamese/Chinese learners)
- Performance monitoring to maintain learning experience quality

## Code Style Guidelines

- TypeScript strict mode enabled
- React functional components with hooks
- Memoization for performance-critical components
- Comprehensive error handling and loading states
- Mobile-first responsive design
- Accessibility considerations (ARIA labels, keyboard navigation)
- Consistent naming conventions (camelCase for functions, PascalCase for components)