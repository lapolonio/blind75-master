import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProblemDetail } from './ProblemDetail';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const problem = await prisma.problem.findUnique({
    where: { slug: params.slug },
    select: { title: true, description: true },
  });

  if (!problem) {
    return { title: 'Problem Not Found' };
  }

  return {
    title: `${problem.title} - Blind75 Master`,
    description: problem.description.slice(0, 160),
  };
}

async function getProblem(slug: string, userId?: string) {
  const problem = await prisma.problem.findUnique({
    where: { slug },
  });

  if (!problem) return null;

  let progress = null;
  if (userId) {
    progress = await prisma.progress.findUnique({
      where: {
        userId_problemId: {
          userId,
          problemId: problem.id,
        },
      },
    });
  }

  // Get adjacent problems for navigation
  const [prevProblem, nextProblem] = await Promise.all([
    prisma.problem.findFirst({
      where: { order: { lt: problem.order } },
      orderBy: { order: 'desc' },
      select: { slug: true, title: true },
    }),
    prisma.problem.findFirst({
      where: { order: { gt: problem.order } },
      orderBy: { order: 'asc' },
      select: { slug: true, title: true },
    }),
  ]);

  return {
    problem: {
      id: problem.id,
      slug: problem.slug,
      title: problem.title,
      difficulty: problem.difficulty,
      category: problem.category,
      pattern: problem.pattern,
      description: problem.description,
      constraints: problem.constraints,
      examples: problem.examples as { input: string; output: string; explanation?: string }[],
      starterCode: problem.starterCode as { javascript: string; python: string; typescript: string },
      solution: problem.solution as { approach: string; complexity: { time: string; space: string }; code: { javascript: string; python: string; typescript: string } },
      testCases: problem.testCases as { input: string; expected: string; description?: string }[],
      hints: problem.hints as string[],
      isPremium: problem.isPremium,
      order: problem.order,
    },
    progress: progress
      ? {
          id: progress.id,
          status: progress.status as 'solved' | 'attempted' | 'not-started',
          lastCode: progress.lastCode,
          language: progress.language as 'javascript' | 'python' | 'typescript',
          attempts: progress.attempts,
          solvedAt: progress.solvedAt,
        }
      : null,
    prevProblem,
    nextProblem,
  };
}

export default async function ProblemPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const data = await getProblem(params.slug, session?.user?.id);

  if (!data) {
    notFound();
  }

  const isPremiumUser = session?.user?.subscription === 'premium';
  const isLocked = data.problem.isPremium && !isPremiumUser;

  return (
    <ProblemDetail
      problem={data.problem}
      progress={data.progress}
      prevProblem={data.prevProblem}
      nextProblem={data.nextProblem}
      isLocked={isLocked}
      isAuthenticated={!!session}
    />
  );
}
