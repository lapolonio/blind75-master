'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface VisualizerProps {
  problemSlug: string;
  pattern: string;
}

export function Visualizer({ problemSlug, pattern }: VisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);

  // Placeholder visualization data
  const maxSteps = 5;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleNextStep = () => {
    setStep((prev) => Math.min(maxSteps - 1, prev + 1));
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <span className="text-sm font-medium">Visualization</span>
        <span className="text-xs text-muted-foreground capitalize">
          Pattern: {pattern.replace('-', ' ')}
        </span>
      </div>

      {/* Visualization Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          {/* Placeholder visualization */}
          <div className="w-full max-w-md mx-auto">
            {problemSlug === 'two-sum' && (
              <TwoSumVisualization step={step} />
            )}
            {problemSlug === 'best-time-to-buy-and-sell-stock' && (
              <StockVisualization step={step} />
            )}
            {problemSlug === 'contains-duplicate' && (
              <HashSetVisualization step={step} />
            )}
            {problemSlug === 'valid-anagram' && (
              <AnagramVisualization step={step} />
            )}
            {problemSlug === 'valid-parentheses' && (
              <StackVisualization step={step} />
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            Step {step + 1} of {maxSteps}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 px-4 py-3 border-t bg-muted/50">
        <Button variant="outline" size="icon" onClick={handleReset}>
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handlePrevStep}>
          <SkipForward className="h-4 w-4 rotate-180" />
        </Button>
        <Button variant="default" size="icon" onClick={handlePlayPause}>
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button variant="outline" size="icon" onClick={handleNextStep}>
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Simple visualization components for each problem type

function TwoSumVisualization({ step }: { step: number }) {
  const nums = [2, 7, 11, 15];
  const target = 9;
  const highlights = [
    [],
    [0],
    [0, 1],
    [0, 1],
    [0, 1],
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {nums.map((num, i) => (
          <div
            key={i}
            className={`w-12 h-12 flex items-center justify-center border-2 rounded-lg font-mono text-lg transition-all ${
              highlights[step]?.includes(i)
                ? 'border-green-500 bg-green-500/20 text-green-600'
                : 'border-border'
            }`}
          >
            {num}
          </div>
        ))}
      </div>
      <div className="text-sm">
        Target: <span className="font-mono font-bold">{target}</span>
      </div>
      <div className="text-xs text-muted-foreground">
        {step === 0 && 'Looking for pairs that sum to 9...'}
        {step === 1 && 'Check nums[0] = 2, need 7'}
        {step === 2 && 'Found! 2 + 7 = 9'}
        {step >= 3 && 'Solution: indices [0, 1]'}
      </div>
    </div>
  );
}

function StockVisualization({ step }: { step: number }) {
  const prices = [7, 1, 5, 3, 6, 4];
  const highlights = [
    { buy: -1, sell: -1 },
    { buy: 1, sell: -1 },
    { buy: 1, sell: 2 },
    { buy: 1, sell: 4 },
    { buy: 1, sell: 4 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-center items-end gap-1 h-32">
        {prices.map((price, i) => (
          <div
            key={i}
            className={`w-8 rounded-t transition-all ${
              i === highlights[step]?.buy
                ? 'bg-green-500'
                : i === highlights[step]?.sell
                ? 'bg-blue-500'
                : 'bg-muted'
            }`}
            style={{ height: `${(price / 7) * 100}%` }}
          >
            <div className="text-xs text-center -mt-5 font-mono">{price}</div>
          </div>
        ))}
      </div>
      <div className="text-xs text-muted-foreground">
        {step === 0 && 'Finding best buy/sell points...'}
        {step === 1 && 'Min price so far: 1 (day 2)'}
        {step === 2 && 'Profit if sell on day 3: 5-1=4'}
        {step === 3 && 'Best profit: sell on day 5: 6-1=5'}
        {step >= 4 && 'Max Profit: $5'}
      </div>
    </div>
  );
}

function HashSetVisualization({ step }: { step: number }) {
  const nums = [1, 2, 3, 1];
  const seen = [
    new Set<number>(),
    new Set([1]),
    new Set([1, 2]),
    new Set([1, 2, 3]),
    new Set([1, 2, 3]),
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {nums.map((num, i) => (
          <div
            key={i}
            className={`w-10 h-10 flex items-center justify-center border-2 rounded font-mono ${
              i === step - 1 && step < nums.length
                ? 'border-primary bg-primary/20'
                : i === nums.length - 1 && step >= nums.length - 1
                ? 'border-red-500 bg-red-500/20'
                : 'border-border'
            }`}
          >
            {num}
          </div>
        ))}
      </div>
      <div className="text-sm">
        Seen: {`{${Array.from(seen[Math.min(step, 4)]).join(', ')}}`}
      </div>
      <div className="text-xs text-muted-foreground">
        {step === 0 && 'Checking for duplicates...'}
        {step === 1 && 'Add 1 to set'}
        {step === 2 && 'Add 2 to set'}
        {step === 3 && 'Add 3 to set'}
        {step >= 4 && '1 already in set! Duplicate found!'}
      </div>
    </div>
  );
}

function AnagramVisualization({ step }: { step: number }) {
  const s = 'anagram';
  const t = 'nagaram';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-center gap-1">
          {s.split('').map((char, i) => (
            <div
              key={i}
              className="w-8 h-8 flex items-center justify-center border rounded font-mono text-sm"
            >
              {char}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-1">
          {t.split('').map((char, i) => (
            <div
              key={i}
              className="w-8 h-8 flex items-center justify-center border rounded font-mono text-sm"
            >
              {char}
            </div>
          ))}
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        {step === 0 && 'Comparing character frequencies...'}
        {step === 1 && 'Count chars in "anagram"'}
        {step === 2 && 'Count chars in "nagaram"'}
        {step === 3 && 'Compare counts...'}
        {step >= 4 && 'Same frequencies - Valid Anagram!'}
      </div>
    </div>
  );
}

function StackVisualization({ step }: { step: number }) {
  const input = '([{}])';
  const stacks = [
    [],
    ['('],
    ['(', '['],
    ['(', '[', '{'],
    ['(', '['],
    ['('],
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-1">
        {input.split('').map((char, i) => (
          <div
            key={i}
            className={`w-8 h-8 flex items-center justify-center border-2 rounded font-mono ${
              i === step ? 'border-primary bg-primary/20' : 'border-border'
            }`}
          >
            {char}
          </div>
        ))}
      </div>
      <div className="flex justify-center items-end gap-1 h-20 border-b-2 border-l-2 rounded-bl w-16 mx-auto px-1">
        {stacks[Math.min(step, 5)].map((char, i) => (
          <div
            key={i}
            className="w-6 h-6 flex items-center justify-center bg-primary/20 border border-primary rounded font-mono text-xs"
          >
            {char}
          </div>
        ))}
      </div>
      <div className="text-xs text-muted-foreground">
        Stack: [{stacks[Math.min(step, 5)].join(', ')}]
      </div>
    </div>
  );
}
