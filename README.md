# Vietnamese-Chinese Learning Platform

A web application focused on helping users learn Vietnamese from Chinese or Chinese from Vietnamese, with vocabulary lists, flashcards, and reading practice.

## Live Demo

Visit the live application at: [https://typangaa.github.io/vietnamese-chinese-learning/](https://typangaa.github.io/vietnamese-chinese-learning/)

## Features

- **Vocabulary Learning**: Organized by CEFR levels (A1, A2, B1, B2, C1, C2) and categories
- **Flashcard Practice**: Spaced repetition system for optimized learning
- **Reading Practice**: Parallel texts in Vietnamese and Chinese with interactive vocabulary lookup
- **Progress Tracking**: User progress tracking across vocabulary and reading
- **Responsive Design**: Mobile-friendly interface with dark mode support

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: React Router with HashRouter for GitHub Pages compatibility
- **Styling**: Tailwind CSS
- **Deployment**: GitHub Pages

## Project Setup

### Prerequisites

- Node.js (v16.0.0 or later)
- npm (v8.0.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/typangaa/vietnamese-chinese-learning.git
   cd vietnamese-chinese-learning
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
src/
├── assets/           # Static assets like images and audio
├── components/       # Reusable UI components
│   ├── common/       # Shared components (Layout, Navbar, Footer)
│   ├── vocabulary/   # Vocabulary-specific components
│   │   ├── flashcard/  # Flashcard practice components
│   ├── reading/      # Reading-specific components
│   │   ├── passage/    # Reading passage components
│   └── user/         # User-related components (profile, progress)
├── context/          # React context for global state
├── data/             # Static data files (vocabulary lists, readings)
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Key Components

### Vocabulary System

- **VocabularyContext**: Manages vocabulary state, filtering, and favorites
- **VocabularyList/Card**: Components for displaying vocabulary items
- **VocabularyFilters**: Controls for filtering by CEFR level and category

### Flashcard System

- **useSpacedRepetition**: Custom hook implementing spaced repetition algorithm
- **FlashcardPractice**: Manages flashcard session with progress tracking
- **Flashcard**: Interactive card with 3D flip effect

### Reading System

- **ReadingList/Card**: Components for browsing reading passages
- **PassageDetail**: Interactive reading component with vocabulary lookup
- **PassageQuiz**: Comprehension quiz component for reading passages

## Progress Tracking

The application uses the browser's localStorage to track user progress, including:

- Vocabulary mastery levels
- Reading completion percentages
- Quiz scores
- Study time statistics
- Login streak

## Development Roadmap

- [ ] Expand vocabulary database
- [ ] Add audio pronunciation
- [ ] Implement user accounts and cloud synchronization
- [ ] Add writing practice module
- [ ] Develop more interactive learning exercises

## Troubleshooting

### Common Issues

- **Blank page on GitHub Pages**: Make sure base path is correctly set in vite.config.ts
- **Routing issues**: The application uses HashRouter for GitHub Pages compatibility
- **MIME type errors**: Check asset path references in index.html and vite.config.ts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Noto Sans fonts for Vietnamese and Chinese text support
- React and Vite communities for excellent documentation
- Contributors to the open-source libraries used in this project
