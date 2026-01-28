'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import {
  CheckCircle2,
  Circle,
  TrendingUp,
  Target,
  Flame,
  Calendar,
} from 'lucide-react';

interface ProgressStats {
  total: number;
  solved: number;
  attempted: number;
  byDifficulty: Record<string, { solved: number; total: number }>;
  byCategory: Record<string, { solved: number; total: number }>;
  byPattern: Record<string, { solved: number; total: number }>;
}

interface RecentActivity {
  id: string;
  status: string;
  attempts: number;
  updatedAt: Date;
  problem?: {
    id: string;
    difficulty: string;
    category: string;
    pattern: string;
  };
}

interface ProgressDashboardProps {
  stats: ProgressStats;
  recentActivity: RecentActivity[];
}

export function ProgressDashboard({ stats, recentActivity }: ProgressDashboardProps) {
  const progressPercentage = Math.round((stats.solved / stats.total) * 100) || 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.solved}/{stats.total}
            </div>
            <Progress value={progressPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {progressPercentage}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attempted</CardTitle>
            <Circle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attempted}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Problems in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 days</div>
            <p className="text-xs text-muted-foreground mt-2">
              Keep practicing daily!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total - stats.solved}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Problems to solve
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress by Difficulty */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>By Difficulty</CardTitle>
            <CardDescription>
              Track your progress across difficulty levels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.byDifficulty).map(([difficulty, data]) => {
              const percentage = Math.round((data.solved / data.total) * 100) || 0;
              const colors: Record<string, string> = {
                easy: 'bg-green-500',
                medium: 'bg-yellow-500',
                hard: 'bg-red-500',
              };
              return (
                <div key={difficulty} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize font-medium">{difficulty}</span>
                    <span className="text-muted-foreground">
                      {data.solved}/{data.total}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[difficulty] || 'bg-primary'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By Category</CardTitle>
            <CardDescription>Progress across data structures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(stats.byCategory)
              .sort((a, b) => b[1].total - a[1].total)
              .slice(0, 6)
              .map(([category, data]) => {
                const percentage =
                  Math.round((data.solved / data.total) * 100) || 0;
                return (
                  <div key={category} className="flex items-center gap-4">
                    <span className="text-sm capitalize w-24 truncate">
                      {category.replace('-', ' ')}
                    </span>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {data.solved}/{data.total}
                    </span>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </div>

      {/* Pattern Mastery */}
      <Card>
        <CardHeader>
          <CardTitle>Pattern Mastery</CardTitle>
          <CardDescription>
            Track your understanding of common algorithm patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(stats.byPattern)
              .sort((a, b) => b[1].total - a[1].total)
              .map(([pattern, data]) => {
                const percentage =
                  Math.round((data.solved / data.total) * 100) || 0;
                return (
                  <div
                    key={pattern}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: `conic-gradient(hsl(var(--primary)) ${percentage}%, hsl(var(--secondary)) 0%)`,
                      }}
                    >
                      <div className="w-7 h-7 bg-background rounded-full flex items-center justify-center">
                        {percentage}%
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium capitalize truncate">
                        {pattern.replace(/-/g, ' ')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {data.solved}/{data.total} solved
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest problem-solving activity</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activity yet. Start solving problems to track your progress!
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {activity.status === 'solved' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-yellow-500" />
                    )}
                    <div>
                      <div className="text-sm font-medium capitalize">
                        {activity.problem?.category || 'Unknown'} Problem
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activity.attempts} attempt(s)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={activity.status === 'solved' ? 'easy' : 'medium'}
                    >
                      {activity.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDate(activity.updatedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
