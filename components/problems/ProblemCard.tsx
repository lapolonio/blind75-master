'use client';

import Link from 'next/link';
import { ProblemWithProgress } from '@/types/problem';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Lock, MinusCircle } from 'lucide-react';

interface ProblemCardProps {
  problem: ProblemWithProgress;
  isPremiumUser?: boolean;
}

export function ProblemCard({ problem, isPremiumUser = false }: ProblemCardProps) {
  const isLocked = problem.isPremium && !isPremiumUser;
  const status = problem.progress?.status || 'not-started';

  const StatusIcon = () => {
    switch (status) {
      case 'solved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'attempted':
        return <MinusCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const difficultyVariant = problem.difficulty as 'easy' | 'medium' | 'hard';

  return (
    <Link
      href={isLocked ? '/pricing' : `/problems/${problem.slug}`}
      className={cn(
        'group flex items-center justify-between rounded-lg border p-4 transition-all hover:border-primary/50 hover:bg-accent/50',
        isLocked && 'opacity-75'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {isLocked ? (
            <Lock className="h-5 w-5 text-purple-500" />
          ) : (
            <StatusIcon />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {problem.order}.
            </span>
            <h3 className="font-medium truncate group-hover:text-primary">
              {problem.title}
            </h3>
            {problem.isPremium && (
              <Badge variant="premium" className="text-xs">
                Premium
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={difficultyVariant} className="text-xs capitalize">
              {problem.difficulty}
            </Badge>
            <span className="text-xs text-muted-foreground capitalize">
              {problem.category}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground capitalize">
              {problem.pattern.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {problem.progress?.attempts && problem.progress.attempts > 0 && (
          <span className="text-xs text-muted-foreground">
            {problem.progress.attempts} attempts
          </span>
        )}
      </div>
    </Link>
  );
}
