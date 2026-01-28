import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Get all problems
    const problems = await prisma.problem.findMany({
      orderBy: { order: 'asc' },
    });

    interface ProgressFromDB {
      problemId: string;
      status: string;
      attempts: number;
      lastCode: string | null;
      solvedAt: Date | null;
    }

    interface ProblemFromDB {
      id: string;
      [key: string]: unknown;
    }

    // If user is logged in, get their progress
    let progressMap: Record<string, { status: string; attempts: number; lastCode: string | null; solvedAt: Date | null }> = {};
    if (session?.user?.id) {
      const progress = await prisma.progress.findMany({
        where: { userId: session.user.id },
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

    // Combine problems with progress
    const problemsWithProgress = problems.map((problem: ProblemFromDB) => ({
      ...problem,
      progress: progressMap[problem.id] || null,
    }));

    return NextResponse.json(problemsWithProgress);
  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    );
  }
}
