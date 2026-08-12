import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-xl font-semibold text-gray-100">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Keyboard shortcuts</CardTitle>
        </CardHeader>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-center justify-between">
            <span>Focus link search</span>
            <kbd className="rounded-xl border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs">
              /
            </kbd>
          </li>
          <li className="flex items-center justify-between">
            <span>Focus shorten form</span>
            <kbd className="rounded-xl border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs">
              n
            </kbd>
          </li>
        </ul>
      </Card>
    </div>
  );
}
