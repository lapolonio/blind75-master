'use client';

import { useEffect, useState } from 'react';
import { ProblemWithProgress, Difficulty, Category, Pattern, ProgressStatus } from '@/types/problem';
import { ProblemCard } from './ProblemCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useFilterStore } from '@/lib/store';
import { Search, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProblemListProps {
  problems: ProblemWithProgress[];
  isPremiumUser?: boolean;
}

const difficulties: (Difficulty | 'all')[] = ['all', 'easy', 'medium', 'hard'];
const categories: (Category | 'all')[] = [
  'all',
  'array',
  'string',
  'linked-list',
  'tree',
  'graph',
  'dynamic-programming',
  'binary-search',
  'heap',
  'backtracking',
  'math',
];
const patterns: (Pattern | 'all')[] = [
  'all',
  'hash-table',
  'two-pointers',
  'sliding-window',
  'stack',
  'queue',
  'binary-search',
  'dfs',
  'bfs',
  'recursion',
  'dynamic-programming',
  'greedy',
  'bit-manipulation',
];
const statuses: (ProgressStatus | 'all')[] = [
  'all',
  'solved',
  'attempted',
  'not-started',
];

export function ProblemList({ problems, isPremiumUser = false }: ProblemListProps) {
  const { filters, setFilters, resetFilters } = useFilterStore();
  const [filteredProblems, setFilteredProblems] = useState<ProblemWithProgress[]>(problems);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let result = [...problems];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower) ||
          p.pattern.toLowerCase().includes(searchLower)
      );
    }

    // Apply difficulty filter
    if (filters.difficulty && filters.difficulty !== 'all') {
      result = result.filter((p) => p.difficulty === filters.difficulty);
    }

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Apply pattern filter
    if (filters.pattern && filters.pattern !== 'all') {
      result = result.filter((p) => p.pattern === filters.pattern);
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter(
        (p) => (p.progress?.status || 'not-started') === filters.status
      );
    }

    setFilteredProblems(result);
    setIsLoading(false);
  }, [problems, filters]);

  const hasActiveFilters =
    (filters.search && filters.search.length > 0) ||
    (filters.difficulty && filters.difficulty !== 'all') ||
    (filters.category && filters.category !== 'all') ||
    (filters.pattern && filters.pattern !== 'all') ||
    (filters.status && filters.status !== 'all');

  const solvedCount = problems.filter(
    (p) => p.progress?.status === 'solved'
  ).length;
  const totalCount = problems.length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">
          Progress:{' '}
          <span className="font-medium text-foreground">
            {solvedCount}/{totalCount}
          </span>{' '}
          solved
        </span>
        <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${(solvedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.difficulty || 'all'}
          onValueChange={(value: Difficulty | 'all') =>
            setFilters({ difficulty: value })
          }
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((d) => (
              <SelectItem key={d} value={d} className="capitalize">
                {d === 'all' ? 'All Difficulties' : d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.category || 'all'}
          onValueChange={(value: Category | 'all') =>
            setFilters({ category: value })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c} className="capitalize">
                {c === 'all' ? 'All Categories' : c.replace('-', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.pattern || 'all'}
          onValueChange={(value: Pattern | 'all') =>
            setFilters({ pattern: value })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Pattern" />
          </SelectTrigger>
          <SelectContent>
            {patterns.map((p) => (
              <SelectItem key={p} value={p} className="capitalize">
                {p === 'all' ? 'All Patterns' : p.replace('-', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status || 'all'}
          onValueChange={(value: ProgressStatus | 'all') =>
            setFilters({ status: value })
          }
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s === 'all' ? 'All Status' : s.replace('-', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Problem List */}
      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))
        ) : filteredProblems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No problems found matching your filters.
          </div>
        ) : (
          filteredProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              isPremiumUser={isPremiumUser}
            />
          ))
        )}
      </div>
    </div>
  );
}
