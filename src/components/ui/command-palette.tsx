import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../stores';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  const { t: _t } = useTranslation();
  const languagePairPreferences = useAppStore((state) => state.languagePairPreferences);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  // Navigation commands
  const navigationCommands = [
    {
      id: 'home',
      title: 'Go to Home',
      icon: '🏠',
      command: () => navigate('/'),
      shortcut: 'H',
    },
    {
      id: 'settings',
      title: 'Open Settings',
      icon: '⚙️',
      command: () => navigate('/settings'),
      shortcut: 'S',
    },
    {
      id: 'welcome',
      title: 'Welcome Page',
      icon: '👋',
      command: () => navigate('/welcome'),
      shortcut: 'W',
    },
  ];

  // Vocabulary commands (dynamic based on user preferences)
  const vocabularyCommands = [
    ...(languagePairPreferences.toLanguage === 'mandarin' || languagePairPreferences.fromLanguage === 'mandarin' ? [
      {
        id: 'hsk',
        title: 'HSK Vocabulary',
        icon: '🇨🇳',
        command: () => navigate('/hsk'),
        shortcut: 'C',
      },
      {
        id: 'hsk-study',
        title: 'HSK Study Mode',
        icon: '📖',
        command: () => navigate('/hsk-study'),
        shortcut: 'Shift+C',
      },
      {
        id: 'hsk-flashcards',
        title: 'HSK Flashcards',
        icon: '⚡',
        command: () => navigate('/hsk-flashcards'),
        shortcut: 'Ctrl+C',
      },
    ] : []),
    ...(languagePairPreferences.toLanguage === 'vi' || languagePairPreferences.fromLanguage === 'vi' ? [
      {
        id: 'vietnamese',
        title: 'Vietnamese Vocabulary',
        icon: '🇻🇳',
        command: () => navigate('/vietnamese'),
        shortcut: 'V',
      },
      {
        id: 'vietnamese-study',
        title: 'Vietnamese Study Mode',
        icon: '📚',
        command: () => navigate('/vietnamese-study'),
        shortcut: 'Shift+V',
      },
      {
        id: 'vietnamese-flashcards',
        title: 'Vietnamese Flashcards',
        icon: '💫',
        command: () => navigate('/vietnamese-flashcards'),
        shortcut: 'Ctrl+V',
      },
    ] : []),
    {
      id: 'reading',
      title: 'Reading Passages',
      icon: '📖',
      command: () => navigate('/reading'),
      shortcut: 'R',
    },
  ];

  // Study commands
  const studyCommands = [
    {
      id: 'flashcards',
      title: 'All Flashcards',
      icon: '🎯',
      command: () => navigate('/flashcards'),
      shortcut: 'F',
    },
    {
      id: 'vocabulary',
      title: 'Regular Vocabulary',
      icon: '📝',
      command: () => navigate('/vocabulary'),
      shortcut: 'Shift+V',
    },
  ];

  // Theme commands
  const themeCommands = [
    {
      id: 'theme-ocean',
      title: 'Ocean Blue Theme',
      icon: '🌊',
      command: () => {
        // Theme switching would be implemented here
        console.log('Switch to ocean theme');
      },
    },
    {
      id: 'theme-forest',
      title: 'Forest Green Theme',
      icon: '🌲',
      command: () => {
        console.log('Switch to forest theme');
      },
    },
    {
      id: 'theme-sunset',
      title: 'Sunset Orange Theme',
      icon: '🌅',
      command: () => {
        console.log('Switch to sunset theme');
      },
    },
    {
      id: 'theme-purple',
      title: 'Deep Purple Theme',
      icon: '🔮',
      command: () => {
        console.log('Switch to purple theme');
      },
    },
    {
      id: 'theme-rose',
      title: 'Rose Pink Theme',
      icon: '🌸',
      command: () => {
        console.log('Switch to rose theme');
      },
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          {navigationCommands.map((command) => (
            <CommandItem
              key={command.id}
              onSelect={() => runCommand(command.command)}
            >
              <span className="mr-2">{command.icon}</span>
              {command.title}
              {command.shortcut && (
                <CommandShortcut>{command.shortcut}</CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Vocabulary">
          {vocabularyCommands.map((command) => (
            <CommandItem
              key={command.id}
              onSelect={() => runCommand(command.command)}
            >
              <span className="mr-2">{command.icon}</span>
              {command.title}
              {command.shortcut && (
                <CommandShortcut>{command.shortcut}</CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Study">
          {studyCommands.map((command) => (
            <CommandItem
              key={command.id}
              onSelect={() => runCommand(command.command)}
            >
              <span className="mr-2">{command.icon}</span>
              {command.title}
              {command.shortcut && (
                <CommandShortcut>{command.shortcut}</CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Themes">
          {themeCommands.map((command) => (
            <CommandItem
              key={command.id}
              onSelect={() => runCommand(command.command)}
            >
              <span className="mr-2">{command.icon}</span>
              {command.title}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => console.log('Toggle favorites'))}>
            <span className="mr-2">⭐</span>
            Toggle Favorites View
            <CommandShortcut>Ctrl+F</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => console.log('Play audio'))}>
            <span className="mr-2">🔊</span>
            Test Audio
            <CommandShortcut>Ctrl+A</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => console.log('Clear search'))}>
            <span className="mr-2">🗑️</span>
            Clear Search
            <CommandShortcut>Esc</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

// Hook to manage command palette state and keyboard shortcuts
export const useCommandPalette = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return {
    open,
    setOpen,
  };
};