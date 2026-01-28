'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Problem, UserProgress, Language } from '@/types/problem';
import { CodeEditor } from '@/components/problems/CodeEditor';
import { TestRunner } from '@/components/problems/TestRunner';
import { Visualizer } from '@/components/problems/Visualizer';
import { SolutionTab } from '@/components/problems/SolutionTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEditorStore, useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  CheckCircle2,
  Bookmark,
  Share2,
} from 'lucide-react';

interface ProblemDetailProps {
  problem: Problem;
  progress: UserProgress | null;
  prevProblem: { slug: string; title: string } | null;
  nextProblem: { slug: string; title: string } | null;
  isLocked: boolean;
  isAuthenticated: boolean;
}

export function ProblemDetail({
  problem,
  progress,
  prevProblem,
  nextProblem,
  isLocked,
  isAuthenticated,
}: ProblemDetailProps) {
  const router = useRouter();
  const { language } = useEditorStore();
  const { editorFullscreen, setEditorFullscreen, activeTab, setActiveTab } = useUIStore();
  const [code, setCode] = useState(problem.starterCode[language]);
  const [isSaving, setIsSaving] = useState(false);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  const handleMarkComplete = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsSaving(true);
    try {
      await fetch(`/api/problems/${problem.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'solved',
          lastCode: code,
          language,
        }),
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to save progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const difficultyVariant = problem.difficulty as 'easy' | 'medium' | 'hard';

  if (isLocked) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
            <Lock className="h-10 w-10 text-purple-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
          <Badge variant="premium" className="mb-4">
            Premium Problem
          </Badge>
          <p className="text-muted-foreground mb-6 max-w-md">
            This problem is part of our premium collection. Upgrade to access all
            75 problems with detailed solutions and explanations.
          </p>
          <Button asChild>
            <Link href="/pricing">Upgrade to Premium</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-[calc(100vh-3.5rem)]', editorFullscreen && 'h-screen')}>
      {/* Header */}
      {!editorFullscreen && (
        <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{problem.order}.</span>
              <h1 className="text-lg font-semibold">{problem.title}</h1>
            </div>
            <Badge variant={difficultyVariant} className="capitalize">
              {problem.difficulty}
            </Badge>
            {progress?.status === 'solved' && (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            {progress?.status !== 'solved' && (
              <Button
                variant="success"
                onClick={handleMarkComplete}
                disabled={isSaving}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Description */}
        {!editorFullscreen && (
          <div className="w-1/2 border-r overflow-auto">
            <Tabs
              value={activeTab}
              onValueChange={(v: any) => setActiveTab(v)}
              className="h-full flex flex-col"
            >
              <div className="border-b px-4">
                <TabsList className="h-12 bg-transparent">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="solution">Solution</TabsTrigger>
                  <TabsTrigger value="discuss">Discuss</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="description" className="flex-1 overflow-auto m-0">
                <div className="p-6 space-y-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="capitalize">
                      {problem.category}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {problem.pattern.replace('-', ' ')}
                    </Badge>
                  </div>

                  {/* Description */}
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {problem.description.split('\n').map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>

                  {/* Examples */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Examples</h3>
                    {problem.examples.map((example, i) => (
                      <div
                        key={i}
                        className="p-4 bg-muted rounded-lg space-y-2"
                      >
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">
                            Input:
                          </span>
                          <pre className="mt-1 text-sm font-mono">
                            {example.input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">
                            Output:
                          </span>
                          <pre className="mt-1 text-sm font-mono">
                            {example.output}
                          </pre>
                        </div>
                        {example.explanation && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">
                              Explanation:
                            </span>
                            <p className="mt-1 text-sm">{example.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  <div>
                    <h3 className="font-semibold mb-2">Constraints</h3>
                    <div className="text-sm text-muted-foreground font-mono whitespace-pre-line">
                      {problem.constraints}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="solution" className="flex-1 overflow-auto m-0">
                <SolutionTab
                  solution={problem.solution}
                  hints={problem.hints}
                  hasAccess={true}
                />
              </TabsContent>

              <TabsContent value="discuss" className="flex-1 m-0">
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Discussion feature coming soon
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Right Panel - Editor & Tests */}
        <div className={cn('flex flex-col', editorFullscreen ? 'w-full' : 'w-1/2')}>
          {/* Code Editor */}
          <div className="flex-1 min-h-0">
            <CodeEditor
              problemSlug={problem.slug}
              starterCode={problem.starterCode}
              onCodeChange={handleCodeChange}
              isFullscreen={editorFullscreen}
              onToggleFullscreen={() => setEditorFullscreen(!editorFullscreen)}
            />
          </div>

          {/* Test Runner / Visualizer */}
          {!editorFullscreen && (
            <div className="h-1/3 min-h-[200px] border-t">
              <Tabs defaultValue="tests" className="h-full flex flex-col">
                <div className="border-b px-4">
                  <TabsList className="h-10 bg-transparent">
                    <TabsTrigger value="tests">Test Cases</TabsTrigger>
                    <TabsTrigger value="visualizer">Visualizer</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="tests" className="flex-1 m-0 overflow-hidden">
                  <TestRunner testCases={problem.testCases} code={code} />
                </TabsContent>
                <TabsContent value="visualizer" className="flex-1 m-0">
                  <Visualizer
                    problemSlug={problem.slug}
                    pattern={problem.pattern}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      {!editorFullscreen && (
        <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30">
          <div>
            {prevProblem && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/problems/${prevProblem.slug}`}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {prevProblem.title}
                </Link>
              </Button>
            )}
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/problems">All Problems</Link>
          </Button>
          <div>
            {nextProblem && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/problems/${nextProblem.slug}`}>
                  {nextProblem.title}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
