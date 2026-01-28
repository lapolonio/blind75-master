import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProblemList } from '@/components/problems/ProblemList';
import { ProblemWithProgress } from '@/types/problem';

export const metadata: Metadata = {
  title: 'Problems - Blind75 Master',
  description: 'Browse and practice the Blind 75 coding interview problems',
};

async function getProblems(userId?: string): Promise<ProblemWithProgress[]> {
  const problems = await prisma.problem.findMany({
    orderBy: { order: 'asc' },
  });

  let progressMap: Record<string, any> = {};
  if (userId) {
    const progress = await prisma.progress.findMany({
      where: { userId },
    });
    progressMap = progress.reduce((acc: Record<string, any>, p: { problemId: string; status: string; attempts: number; lastCode: string | null; solvedAt: Date | null }) => {
      acc[p.problemId] = {
        status: p.status,
        attempts: p.attempts,
        lastCode: p.lastCode,
        solvedAt: p.solvedAt,
      };
      return acc;
    }, {} as Record<string, any>);
  }

  return problems.map((problem: any) => ({
    id: problem.id,
    slug: problem.slug,
    title: problem.title,
    difficulty: problem.difficulty as any,
    category: problem.category as any,
    pattern: problem.pattern as any,
    description: problem.description,
    constraints: problem.constraints,
    examples: problem.examples as any,
    starterCode: problem.starterCode as any,
    solution: problem.solution as any,
    testCases: problem.testCases as any,
    hints: problem.hints as any,
    isPremium: problem.isPremium,
    order: problem.order,
    progress: progressMap[problem.id] || undefined,
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
