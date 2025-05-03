# Vietnamese-Chinese Learning Platform

A web application focused on helping users learn Vietnamese from Chinese or Chinese from Vietnamese.

## Features

- **Vocabulary Learning**: Organized by CEFR levels (A1, A2, B1, B2, C1, C2) and categories
- **Reading Practice**: Parallel texts in Vietnamese and Chinese
- **Interactive Learning**: Flashcards, favorites, and progress tracking
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- React with TypeScript
- Vite for fast development and building
- React Router for navigation
- Tailwind CSS for styling
- GitHub Pages for deployment

## Project Structure

```
src/
├── assets/           # Static assets like images and audio
├── components/       # Reusable UI components
│   ├── common/       # Shared components
│   ├── vocabulary/   # Vocabulary-specific components
│   └── reading/      # Reading-specific components
├── context/          # React context for global state
├── data/             # Static data files (vocabulary lists, readings)
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── services/         # API services and external integrations
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (>= 16.0.0)
- npm (>= 8.0.0)

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

4. Build for production:
   ```bash
   npm run build
   ```

## Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions. When you push to the main branch, the site will automatically be built and deployed.

## Data Structure

### Vocabulary Items

```typescript
interface VocabularyItem {
  id: number;
  vietnamese: string;
  chinese: string;
  pinyin: string;
  english?: string; 
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  category: string;
  examples?: Array<{
    vietnamese: string;
    chinese: string;
    pinyin: string;
  }>;
  audioUrl?: string;
}
```

### Reading Passages

```typescript
interface ReadingPassage {
  id: string;
  title: {
    vietnamese: string;
    chinese: string;
  };
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  paragraphs: Array<{
    vietnamese: string;
    chinese: string;
  }>;
  vocabulary: VocabularyItem[];
  questions?: Array<{
    question: {
      vietnamese: string;
      chinese: string;
    };
    options: Array<{
      vietnamese: string;
      chinese: string;
      isCorrect: boolean;
    }>;
  }>;
}
```

## License

MIT

## Acknowledgments

- Noto Sans fonts for Vietnamese and Chinese character support
- React and Vite communities for excellent documentation