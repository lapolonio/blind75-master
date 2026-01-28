import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProgressDashboard } from './ProgressDashboard';

export const metadata: Metadata = {
  title: 'Progress - Blind75 Master',
  description: 'Track your coding interview preparation progress',
};

async function getProgressStats(userId: string) {
  const [problems, progress] = await Promise.all([
    prisma.problem.findMany({
      select: {
        id: true,
        difficulty: true,
        category: true,
        pattern: true,
      },
    }),
    prisma.progress.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    }),
  ]);

  const progressMap = new Map(progress.map((p) => [p.problemId, p]));

  // Calculate stats
  const stats = {
    total: problems.length,
    solved: 0,
    attempted: 0,
    byDifficulty: {
      easy: { solved: 0, total: 0 },
      medium: { solved: 0, total: 0 },
      hard: { solved: 0, total: 0 },
    } as Record<string, { solved: number; total: number }>,
    byCategory: {} as Record<string, { solved: number; total: number }>,
    byPattern: {} as Record<string, { solved: number; total: number }>,
  };

  problems.forEach((problem) => {
    const userProgress = progressMap.get(problem.id);

    // Difficulty stats
    if (!stats.byDifficulty[problem.difficulty]) {
      stats.byDifficulty[problem.difficulty] = { solved: 0, total: 0 };
    }
    stats.byDifficulty[problem.difficulty].total++;

    // Category stats
    if (!stats.byCategory[problem.category]) {
      stats.byCategory[problem.category] = { solved: 0, total: 0 };
    }
    stats.byCategory[problem.category].total++;

    // Pattern stats
    if (!stats.byPattern[problem.pattern]) {
      stats.byPattern[problem.pattern] = { solved: 0, total: 0 };
    }
    stats.byPattern[problem.pattern].total++;

    if (userProgress) {
      if (userProgress.status === 'solved') {
        stats.solved++;
        stats.byDifficulty[problem.difficulty].solved++;
        stats.byCategory[problem.category].solved++;
        stats.byPattern[problem.pattern].solved++;
      } else if (userProgress.status === 'attempted') {
        stats.attempted++;
      }
    }
  });

  // Get recent activity
  const recentActivity = progress.slice(0, 10).map((p) => ({
    ...p,
    problem: problems.find((prob) => prob.id === p.problemId),
  }));

  return { stats, recentActivity };
}

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/progress');
  }

  const { stats, recentActivity } = await getProgressStats(session.user.id);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-muted-foreground">
          Track your coding interview preparation journey. Keep practicing to
          improve your skills.
        </p>
      </div>

      <ProgressDashboard stats={stats} recentActivity={recentActivity} />
    </div>
  );
}
