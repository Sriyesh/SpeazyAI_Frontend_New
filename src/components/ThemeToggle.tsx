import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`text-gray-400 hover:text-gray-300 hover:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 light:text-gray-600 light:hover:text-gray-900 light:hover:bg-gray-100 ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </Button>
  );
}