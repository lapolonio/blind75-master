export type Difficulty = 'easy' | 'medium' | 'hard';

export type Category =
  | 'array'
  | 'string'
  | 'linked-list'
  | 'tree'
  | 'graph'
  | 'dynamic-programming'
  | 'binary-search'
  | 'heap'
  | 'backtracking'
  | 'math';

export type Pattern =
  | 'hash-table'
  | 'two-pointers'
  | 'sliding-window'
  | 'stack'
  | 'queue'
  | 'binary-search'
  | 'dfs'
  | 'bfs'
  | 'recursion'
  | 'dynamic-programming'
  | 'greedy'
  | 'bit-manipulation';

export type ProgressStatus = 'not-started' | 'attempted' | 'solved';

export type Language = 'javascript' | 'python' | 'typescript';

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expected: string;
  description?: string;
}

export interface StarterCode {
  javascript: string;
  python: string;
  typescript: string;
}

export interface SolutionCode {
  javascript: string;
  python: string;
  typescript: string;
}

export interface Solution {
  approach: string;
  complexity: {
    time: string;
    space: string;
  };
  code: SolutionCode;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  category: Category;
  pattern: Pattern;
  description: string;
  constraints: string;
  examples: Example[];
  starterCode: StarterCode;
  solution: Solution;
  testCases: TestCase[];
  hints?: string[];
  isPremium: boolean;
  order: number;
}

export interface ProblemWithProgress extends Problem {
  progress?: {
    status: ProgressStatus;
    attempts: number;
    lastCode?: string;
    solvedAt?: Date;
  };
}

export interface UserProgress {
  id: string;
  status: ProgressStatus;
  lastCode?: string;
  language: Language;
  attempts: number;
  solvedAt?: Date;
  notes?: string;
}

export interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  executionTime?: number;
  error?: string;
}

export interface ProgressStats {
  total: number;
  solved: number;
  attempted: number;
  byDifficulty: {
    easy: { solved: number; total: number };
    medium: { solved: number; total: number };
    hard: { solved: number; total: number };
  };
  byCategory: Record<string, { solved: number; total: number }>;
  byPattern: Record<string, { solved: number; total: number }>;
  streak: number;
  lastActivityDate?: Date;
}

export interface FilterOptions {
  difficulty?: Difficulty | 'all';
  category?: Category | 'all';
  pattern?: Pattern | 'all';
  status?: ProgressStatus | 'all';
  search?: string;
}

export interface SortOption {
  field: 'order' | 'difficulty' | 'title';
  direction: 'asc' | 'desc';
}
