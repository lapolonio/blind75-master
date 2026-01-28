import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProblemList } from '@/components/problems/ProblemList';
import { ProblemWithProgress, Difficulty, Category, Pattern, ProgressStatus } from '@/types/problem';

export const metadata: Metadata = {
  title: 'Problems - Blind75 Master',
  description: 'Browse and practice the Blind 75 coding interview problems',
};

interface ProblemFromDB {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  category: string;
  pattern: string;
  description: string;
  constraints: string;
  examples: unknown;
  starterCode: unknown;
  solution: unknown;
  testCases: unknown;
  hints: unknown;
  isPremium: boolean;
  order: number;
}

interface ProgressFromDB {
  problemId: string;
  status: string;
  attempts: number;
  lastCode: string | null;
  solvedAt: Date | null;
}

async function getProblems(userId?: string): Promise<ProblemWithProgress[]> {
  const problems = await prisma.problem.findMany({
    orderBy: { order: 'asc' },
  });

  let progressMap: Record<string, { status: string; attempts: number; lastCode: string | null; solvedAt: Date | null }> = {};
  if (userId) {
    const progress = await prisma.progress.findMany({
      where: { userId },
    });
    progressMap = progress.reduce((acc: Record<string, { status: string; attempts: number; lastCode: string | null; solvedAt: Date | null }>, p: ProgressFromDB) => {
      acc[p.problemId] = {
        status: p.status,
        attempts: p.attempts,
        lastCode: p.lastCode,
        solvedAt: p.solvedAt,
      };
      return acc;
    }, {});
  }

  return problems.map((problem: ProblemFromDB) => ({
    id: problem.id,
    slug: problem.slug,
    title: problem.title,
    difficulty: problem.difficulty as Difficulty,
    category: problem.category as Category,
    pattern: problem.pattern as Pattern,
    description: problem.description,
    constraints: problem.constraints,
    examples: problem.examples as { input: string; output: string; explanation?: string }[],
    starterCode: problem.starterCode as { javascript: string; python: string; typescript: string },
    solution: problem.solution as { approach: string; complexity: { time: string; space: string }; code: { javascript: string; python: string; typescript: string } },
    testCases: problem.testCases as { input: string; expected: string; description?: string }[],
    hints: problem.hints as string[],
    isPremium: problem.isPremium,
    order: problem.order,
    progress: progressMap[problem.id] 
      ? {
          status: progressMap[problem.id].status as ProgressStatus,
          attempts: progressMap[problem.id].attempts,
          lastCode: progressMap[problem.id].lastCode ?? undefined,
          solvedAt: progressMap[problem.id].solvedAt ?? undefined,
        }
      : undefined,
  }));
}

export default async function ProblemsPage() {
  const session = await getServerSession(authOptions);
  const problems = await getProblems(session?.user?.id);
  const isPremiumUser = session?.user?.subscription === 'premium';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Problems</h1>
        <p className="text-muted-foreground">
          Master the 75 essential coding interview problems. Filter by difficulty,
          category, or pattern to focus your practice.
        </p>
      </div>

      <ProblemList problems={problems} isPremiumUser={isPremiumUser} />
    </div>
  );
}
