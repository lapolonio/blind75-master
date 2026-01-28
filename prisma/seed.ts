import { PrismaClient } from '@prisma/client';
import { problemsData } from '../lib/problems-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing problems
  await prisma.progress.deleteMany();
  await prisma.problem.deleteMany();

  // Create problems
  for (const problem of problemsData) {
    await prisma.problem.create({
      data: {
        slug: problem.slug,
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        pattern: problem.pattern,
        description: problem.description,
        constraints: problem.constraints,
        examples: problem.examples,
        starterCode: problem.starterCode,
        solution: problem.solution,
        testCases: problem.testCases,
        hints: problem.hints || [],
        isPremium: problem.isPremium,
        order: problem.order,
      },
    });
    console.log(`Created problem: ${problem.title}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
