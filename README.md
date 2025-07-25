# EchoMeo Learning App

A comprehensive Asian language learning platform that helps users learn Vietnamese, Chinese, Korean, and Japanese through interactive vocabulary, flashcards, and reading practice.

## Live Demo

Visit the live application at: [https://typangaa.github.io/EchoMeo-learning-app/](https://typangaa.github.io/EchoMeo-learning-app/)

## Features

- **Vocabulary Learning**: Organized by CEFR levels (A1, A2, B1, B2, C1, C2) and categories
- **Flashcard Practice**: Spaced repetition system for optimized learning
- **Reading Practice**: Parallel texts in Vietnamese and Chinese with interactive vocabulary lookup
- **Audio Pronunciation**: Text-to-speech functionality using Web Speech API for vocabulary and examples
- **Progress Tracking**: User progress tracking across vocabulary and reading
- **Responsive Design**: Mobile-friendly interface with dark mode support

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: React Router with HashRouter for GitHub Pages compatibility
- **Styling**: Tailwind CSS
- **Speech Synthesis**: Web Speech API for text-to-speech
- **Deployment**: GitHub Pages

## Project Setup

### Prerequisites

- Node.js (v16.0.0 or later)
- npm (v8.0.0 or later)
- Modern browser with Web Speech API support (Chrome, Edge, Safari, Firefox)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/typangaa/EchoMeo-learning-app.git
   cd EchoMeo-learning-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deployment

The project is configured for automatic deployment to GitHub Pages using GitHub Actions. Any push to the main branch will trigger a deployment.

To manually deploy:

```bash
npm run deploy
```

## Project Structure

```
EchoMeo-learning-app/
├── dist/               # Production build files
├── public/             # Static files served as-is
├── scripts/            # Utility scripts for development and data processing
│   ├── data/           # Data files for scripts
│   ├── hsk_vocabulary_processor.py   # Script for processing HSK vocabulary
│   └── vocabulary_enrichment.py      # Script for enriching vocabulary data
├── src/                # Source code
│   ├── assets/         # Static assets like images
│   ├── components/     # Reusable UI components
│   │   ├── common/     # Shared components (Layout, Navbar, Footer)
│   │   ├── vocabulary/ # Vocabulary-specific components
│   │   │   ├── flashcard/  # Flashcard practice components
│   │   ├── reading/    # Reading-specific components
│   │   │   ├── passage/  # Reading passage components
│   │   └── user/       # User-related components (profile, progress)
│   ├── context/        # React context for global state
│   ├── data/           # Static data files (vocabulary lists, readings)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # Service modules for external functionality
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
└── ...                 # Configuration files
```

## Key Components

### Vocabulary System

- **VocabularyContext**: Manages vocabulary state, filtering, and favorites. Provides a central store for vocabulary items and filtering functions.
- **VocabularyList/Card**: Components for displaying vocabulary items with interactive elements.
- **VocabularyFilters**: Controls for filtering by CEFR level and category, offering a clean user interface for narrowing down vocabulary items.
- **HSKVocabularyList**: Special component for browsing HSK (Chinese Proficiency Test) vocabulary with level-based filtering.

### Flashcard System

- **useSpacedRepetition**: Custom hook implementing a spaced repetition algorithm for optimal learning retention. It tracks user performance and schedules reviews at increasing intervals.
- **FlashcardPractice**: Manages flashcard session with progress tracking, statistics, and session control.
- **Flashcard**: Interactive card with 3D flip effect for an engaging study experience.
- **LanguageDirectionToggle**: Component that allows users to switch between learning Chinese from Vietnamese, or Vietnamese from Chinese.

### Reading System

- **ReadingList/Card**: Components for browsing reading passages by difficulty level.
- **PassageDetail**: Interactive reading component with vocabulary lookup and parallel text display.
- **ReadingFilters**: Filters for finding appropriate reading material by level and topic.
- **PassageQuiz**: Comprehension quiz component for testing understanding of reading passages.

### Audio Feature System

- **AudioService**: A singleton service that manages text-to-speech playback using the Web Speech API. It handles both Vietnamese and Chinese pronunciation.
- **AudioButton**: A reusable component that triggers audio playback for vocabulary items and example sentences.

#### Audio Feature Implementation Details

1. **Audio Service (`audioService.ts`)**:
   - Provides a centralized interface for playing audio across the application
   - Uses the Web Speech API to synthesize speech for Vietnamese and Chinese text
   - Offers different voices and speed settings optimized for language learning
   - Controls audio volume and playback settings
   - Handles browser compatibility and fallbacks

2. **Audio Button Component**:
   - Renders a small speaker icon next to vocabulary items
   - Handles click events to trigger audio playback
   - Shows animation during playback
   - Adapts to different sizes for various UI contexts

3. **Integration with Learning Components**:
   - Vocabulary cards include audio buttons for both languages
   - Example sentences feature pronunciation
   - Reading passages can be played for pronunciation practice
   - Flashcards incorporate audio for immersive learning

## Progress Tracking

The application uses the browser's localStorage to track user progress, including:

- Vocabulary mastery levels
- Reading completion percentages
- Quiz scores
- Study time statistics
- Login streak

The progress tracking system is implemented in `progressTracking.ts` and provides functions for updating and retrieving user progress data.

## Development Roadmap

- [x] Implement audio pronunciation
- [ ] Expand vocabulary database
- [ ] Implement user accounts and cloud synchronization
- [ ] Add writing practice module
- [ ] Develop more interactive learning exercises

## Scripts Usage

### HSK Vocabulary Processing

To process HSK vocabulary data:

```bash
cd scripts
python hsk_vocabulary_processor.py
```

## Troubleshooting

### Common Issues

- **Blank page on GitHub Pages**: Make sure base path is correctly set in vite.config.ts
- **Routing issues**: The application uses HashRouter for GitHub Pages compatibility
- **MIME type errors**: Check asset path references in index.html and vite.config.ts
- **Audio not playing**: Ensure your browser supports the Web Speech API and has the appropriate language packs installed. Check if the browser allows autoplay of audio content.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Noto Sans fonts for Vietnamese and Chinese text support
- React and Vite communities for excellent documentation
- Web Speech API for providing text-to-speech functionality
- Contributors to the open-source libraries used in this project