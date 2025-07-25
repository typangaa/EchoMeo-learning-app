import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useTheme, Theme, Mode } from '@/contexts/ThemeProvider'
import { useTranslation } from '@/hooks/useTranslation'

const themes: Array<{ value: Theme; label: string; color: string; description: string }> = [
  { 
    value: 'default', 
    label: 'Ocean Blue', 
    color: 'bg-blue-500', 
    description: 'Classic and professional' 
  },
  { 
    value: 'forest', 
    label: 'Forest Green', 
    color: 'bg-green-600', 
    description: 'Calm and natural' 
  },
  { 
    value: 'warm', 
    label: 'Sunset Orange', 
    color: 'bg-orange-500', 
    description: 'Energizing and warm' 
  },
  { 
    value: 'purple', 
    label: 'Deep Purple', 
    color: 'bg-purple-500', 
    description: 'Focused and premium' 
  },
  { 
    value: 'rose', 
    label: 'Rose Pink', 
    color: 'bg-rose-500', 
    description: 'Gentle and approachable' 
  }
]

const modes: Array<{ value: Mode; label: string; icon: string; description: string }> = [
  { 
    value: 'light', 
    label: 'Light', 
    icon: '☀️', 
    description: 'Bright interface for day use' 
  },
  { 
    value: 'dark', 
    label: 'Dark', 
    icon: '🌙', 
    description: 'Easy on the eyes for night use' 
  },
  { 
    value: 'system', 
    label: 'System', 
    icon: '💻', 
    description: 'Follows your device setting' 
  }
]

interface ThemeSelectorProps {
  className?: string
}

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const { theme, mode, setTheme, setMode } = useTheme()
  const { t } = useTranslation()

  const currentTheme = themes.find(t => t.value === theme)
  const currentMode = modes.find(m => m.value === mode)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Theme Color Selector */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            {t('settings.theme.colorTitle')}
          </label>
          <p className="text-xs text-muted-foreground mb-3">
            {t('settings.theme.colorDescription')}
          </p>
        </div>
        
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger className="w-full">
            <SelectValue>
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${currentTheme?.color}`} />
                <div className="text-left">
                  <div className="font-medium">{currentTheme?.label}</div>
                  <div className="text-xs text-muted-foreground">{currentTheme?.description}</div>
                </div>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {themes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                <div className="flex items-center gap-3 py-1">
                  <div className={`w-4 h-4 rounded-full ${t.color}`} />
                  <div>
                    <div className="font-medium">{t.label}</div>
                    <div className="text-xs text-muted-foreground">{t.description}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Light/Dark Mode Selector */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            {t('settings.theme.modeTitle')}
          </label>
          <p className="text-xs text-muted-foreground mb-3">
            {t('settings.theme.modeDescription')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {modes.map((m) => (
            <Button 
              key={m.value}
              variant={mode === m.value ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setMode(m.value)}
              className="flex flex-col h-auto p-3 gap-1"
            >
              <span className="text-lg">{m.icon}</span>
              <span className="text-sm font-medium">{m.label}</span>
              <span className="text-xs text-muted-foreground">{m.description}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Current Selection Preview */}
      <div className="rounded-lg border bg-card p-4">
        <h4 className="text-sm font-medium mb-2">{t('settings.theme.preview')}</h4>
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full ${currentTheme?.color}`} />
          <div className="flex-1">
            <div className="text-sm font-medium">
              {currentTheme?.label} • {currentMode?.label} {currentMode?.icon}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentTheme?.description} • {currentMode?.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}