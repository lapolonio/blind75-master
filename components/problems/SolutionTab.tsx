'use client';

import { useState } from 'react';
import { Solution, Language } from '@/types/problem';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, HardDrive, Lightbulb, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SolutionTabProps {
  solution: Solution;
  hints?: string[];
  isPremium?: boolean;
  hasAccess?: boolean;
}

const languages: { value: Language; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'typescript', label: 'TypeScript' },
];

export function SolutionTab({
  solution,
  hints,
  hasAccess = true,
}: SolutionTabProps) {
  const [language, setLanguage] = useState<Language>('javascript');
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(solution.code[language]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const revealHint = (index: number) => {
    if (!revealedHints.includes(index)) {
      setRevealedHints([...revealedHints, index]);
    }
  };

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
          <Lightbulb className="h-8 w-8 text-purple-500" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Premium Solution</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">
          Upgrade to Premium to access detailed solutions with explanations,
          complexity analysis, and code in multiple languages.
        </p>
        <Button asChild>
          <a href="/pricing">Unlock Solutions</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 overflow-auto">
      {/* Hints Section */}
      {hints && hints.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              Hints
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHints(!showHints)}
            >
              {showHints ? 'Hide' : 'Show'} Hints
            </Button>
          </div>
          {showHints && (
            <div className="space-y-2">
              {hints.map((hint, index) => (
                <div
                  key={index}
                  className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                >
                  {revealedHints.includes(index) ? (
                    <p className="text-sm">{hint}</p>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => revealHint(index)}
                      className="w-full justify-start text-yellow-600 hover:text-yellow-700"
                    >
                      Click to reveal hint {index + 1}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Approach */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Approach</h3>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {solution.approach.split('\n').map((paragraph, i) => (
            <p key={i} className="text-sm text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Complexity */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
          <Clock className="h-4 w-4 text-blue-500" />
          <div>
            <div className="text-xs text-muted-foreground">Time</div>
            <div className="text-sm font-medium">{solution.complexity.time}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
          <HardDrive className="h-4 w-4 text-green-500" />
          <div>
            <div className="text-xs text-muted-foreground">Space</div>
            <div className="text-sm font-medium">{solution.complexity.space}</div>
          </div>
        </div>
      </div>

      {/* Code Solution */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Solution Code</h3>
          <div className="flex items-center gap-2">
            <Select
              value={language}
              onValueChange={(v: Language) => setLanguage(v)}
            >
              <SelectTrigger className="w-[130px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyCode}
              className="h-8"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
          <code className="text-sm font-mono">{solution.code[language]}</code>
        </pre>
      </div>
    </div>
  );
}
