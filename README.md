# Vietnamese-Chinese Learning Platform

A web application focused on helping users learn Vietnamese from Chinese or Chinese from Vietnamese, with vocabulary lists, flashcards, and reading practice.

## Features

- **Vocabulary Learning**: Organized by CEFR levels (A1, A2, B1, B2, C1, C2) and categories
- **Flashcard Practice**: Spaced repetition system for optimized learning
- **Reading Practice**: Parallel texts in Vietnamese and Chinese with interactive vocabulary lookup
- **Progress Tracking**: User progress tracking across vocabulary and reading
- **Responsive Design**: Mobile-friendly interface with dark mode support

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or later)
- npm (v8.0.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vietnamese-chinese-learning.git
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

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

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
├── services/         # API services and external integrations
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Key Features Implementation

### Vocabulary System

- Vocabulary items are organized by CEFR levels and categories
- Each item includes Vietnamese text, Chinese characters, pinyin pronunciation, and example usage
- Users can filter by level, category, or search by text
- Favoriting functionality to save important words

### Flashcard Learning

- Spaced repetition system (SRS) for optimized learning
- Cards due for review are prioritized based on previous performance
- Detailed statistics and progress tracking
- Visual feedback for correct/incorrect answers

### Reading Practice

- Parallel texts with Vietnamese and Chinese versions side by side
- Interactive vocabulary - click on words to see translations
- Progress tracking for each reading passage
- Comprehension quizzes to test understanding

### User Experience

- Dark/light mode toggle
- Mobile-responsive design
- Progress tracking across sessions using localStorage
- Clean, intuitive interface

## Development Roadmap

- [ ] Expand vocabulary database
- [ ] Add audio pronunciation
- [ ] Implement user accounts and cloud synchronization
- [ ] Add writing practice module
- [ ] Develop more interactive learning exercises

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Noto Sans fonts for Vietnamese and Chinese text support
- React and Vite communities for excellent documentation
- Contributors to the open-source libraries used in this project