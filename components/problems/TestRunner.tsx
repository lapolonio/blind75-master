'use client';

import { useState } from 'react';
import { TestCase, TestResult } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Play, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';

interface TestRunnerProps {
  testCases: TestCase[];
  code: string;
  onRunTests?: () => void;
}

export function TestRunner({ testCases, onRunTests }: TestRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState('0');

  const handleRunTests = async () => {
    setIsRunning(true);
    setResults([]);

    // Simulate test execution (in a real app, this would call a backend service)
    // For now, we'll just show mock results after a delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockResults: TestResult[] = testCases.map((testCase) => ({
      passed: Math.random() > 0.3, // 70% pass rate for demo
      input: testCase.input,
      expected: testCase.expected,
      actual: testCase.expected, // In demo, actual equals expected for passes
      executionTime: Math.floor(Math.random() * 100) + 10,
    }));

    setResults(mockResults);
    setIsRunning(false);
    onRunTests?.();
  };

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Test Cases</span>
          {results.length > 0 && (
            <span
              className={cn(
                'text-sm',
                passedCount === totalCount
                  ? 'text-green-500'
                  : 'text-yellow-500'
              )}
            >
              {passedCount}/{totalCount} passed
            </span>
          )}
        </div>
        <Button
          size="sm"
          onClick={handleRunTests}
          disabled={isRunning}
          className="h-8"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" />
              Run Tests
            </>
          )}
        </Button>
      </div>

      {/* Test Cases */}
      <div className="flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="border-b px-4">
            <TabsList className="h-10 bg-transparent">
              {testCases.map((_, index) => {
                const result = results[index];
                return (
                  <TabsTrigger
                    key={index}
                    value={String(index)}
                    className={cn(
                      'data-[state=active]:bg-muted relative',
                      result?.passed === true && 'text-green-500',
                      result?.passed === false && 'text-red-500'
                    )}
                  >
                    Case {index + 1}
                    {result && (
                      <span className="absolute -top-1 -right-1">
                        {result.passed ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {testCases.map((testCase, index) => {
            const result = results[index];
            return (
              <TabsContent
                key={index}
                value={String(index)}
                className="p-4 space-y-4 mt-0"
              >
                {testCase.description && (
                  <div className="text-sm text-muted-foreground">
                    {testCase.description}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Input
                    </label>
                    <pre className="mt-1 p-3 bg-muted rounded-md text-sm font-mono overflow-x-auto">
                      {testCase.input}
                    </pre>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Expected Output
                    </label>
                    <pre className="mt-1 p-3 bg-muted rounded-md text-sm font-mono overflow-x-auto">
                      {testCase.expected}
                    </pre>
                  </div>

                  {result && (
                    <>
                      <div>
                        <label
                          className={cn(
                            'text-xs font-medium uppercase tracking-wide',
                            result.passed
                              ? 'text-green-500'
                              : 'text-red-500'
                          )}
                        >
                          Actual Output
                        </label>
                        <pre
                          className={cn(
                            'mt-1 p-3 rounded-md text-sm font-mono overflow-x-auto border',
                            result.passed
                              ? 'bg-green-500/10 border-green-500/20'
                              : 'bg-red-500/10 border-red-500/20'
                          )}
                        >
                          {result.actual}
                        </pre>
                      </div>

                      {result.executionTime && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {result.executionTime}ms
                        </div>
                      )}

                      {result.error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                          <label className="text-xs font-medium text-red-500 uppercase tracking-wide">
                            Error
                          </label>
                          <pre className="mt-1 text-sm text-red-500 font-mono">
                            {result.error}
                          </pre>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
