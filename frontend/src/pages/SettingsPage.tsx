import { Moon, Sun } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/store/useTheme';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Currently using {theme === 'dark' ? 'dark' : 'light'} mode
          </p>
          <Button variant="outline" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            Switch to {theme === 'dark' ? 'light' : 'dark'}
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keyboard shortcuts</CardTitle>
        </CardHeader>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-center justify-between">
            <span>Focus search on My URLs</span>
            <kbd className="rounded border border-gray-300 bg-gray-50 px-2 py-0.5 font-mono text-xs dark:border-gray-700 dark:bg-gray-800">
              /
            </kbd>
          </li>
          <li className="flex items-center justify-between">
            <span>Create a new URL</span>
            <kbd className="rounded border border-gray-300 bg-gray-50 px-2 py-0.5 font-mono text-xs dark:border-gray-700 dark:bg-gray-800">
              n
            </kbd>
          </li>
        </ul>
      </Card>
    </div>
  );
}
