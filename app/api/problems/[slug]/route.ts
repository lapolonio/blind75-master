import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    const problem = await prisma.problem.findUnique({
      where: { slug: params.slug },
    });

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    // Check if problem is premium and user doesn't have access
    if (problem.isPremium && session?.user?.subscription !== 'premium') {
      // Return limited data for premium problems
      return NextResponse.json({
        ...problem,
        solution: null,
        testCases: (problem.testCases as { input: string; expected: string; description?: string }[]).slice(0, 2),
        isLocked: true,
      });
    }

    // Get user progress if logged in
    let progress = null;
    if (session?.user?.id) {
      progress = await prisma.progress.findUnique({
        where: {
          userId_problemId: {
            userId: session.user.id,
            problemId: problem.id,
          },
        },
      });
    }

    return NextResponse.json({
      ...problem,
      progress,
      isLocked: false,
    });
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problem' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { status, lastCode, language } = await request.json();

    const problem = await prisma.problem.findUnique({
      where: { slug: params.slug },
    });

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    // Update or create progress
    const progress = await prisma.progress.upsert({
      where: {
        userId_problemId: {
          userId: session.user.id,
          problemId: problem.id,
        },
      },
      update: {
        status,
        lastCode,
        language,
        attempts: { increment: 1 },
        solvedAt: status === 'solved' ? new Date() : undefined,
      },
      create: {
        userId: session.user.id,
        problemId: problem.id,
        status,
        lastCode,
        language,
        attempts: 1,
        solvedAt: status === 'solved' ? new Date() : undefined,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
