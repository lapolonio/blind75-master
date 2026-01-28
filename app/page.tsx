import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Code2,
  BarChart3,
  Lightbulb,
  Play,
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: Code2,
    title: 'Interactive Code Editor',
    description:
      'Write and test your solutions in JavaScript, Python, or TypeScript with syntax highlighting and auto-save.',
  },
  {
    icon: Play,
    title: 'Instant Test Runner',
    description:
      'Run your code against multiple test cases and see results instantly with detailed feedback.',
  },
  {
    icon: Lightbulb,
    title: 'Visual Explanations',
    description:
      'Understand algorithms through step-by-step visualizations that show how each solution works.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description:
      'Monitor your learning journey with detailed statistics, streaks, and pattern mastery tracking.',
  },
  {
    icon: Target,
    title: 'Pattern Recognition',
    description:
      'Learn to identify common patterns like two-pointers, sliding window, and dynamic programming.',
  },
  {
    icon: TrendingUp,
    title: 'Curated Curriculum',
    description:
      'Problems organized by difficulty and topic to build your skills progressively.',
  },
];

const stats = [
  { value: '75', label: 'Problems' },
  { value: '15+', label: 'Patterns' },
  { value: '3', label: 'Languages' },
  { value: '100%', label: 'Free Tier' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center bg-gradient-to-b from-background to-muted/30">
        <Badge variant="secondary" className="mb-4">
          <Zap className="h-3 w-3 mr-1" />
          Master coding interviews
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 max-w-3xl">
          Ace Your{' '}
          <span className="text-primary">Coding Interview</span>
          <br />
          with Blind 75
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          An interactive platform for mastering the 75 most essential LeetCode
          problems. Practice with visualizations, detailed explanations, and
          track your progress.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="/problems">
              Start Practicing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/signup">Create Free Account</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built by engineers, for engineers. Our platform provides all the
              tools you need to prepare for technical interviews.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg border bg-card hover:border-primary/50 transition-colors"
              >
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Start with the essentials</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Begin your journey with carefully curated problems that cover the
              most important patterns and data structures.
            </p>
          </div>

          <div className="grid gap-3 max-w-2xl mx-auto">
            {[
              { title: 'Two Sum', difficulty: 'easy', category: 'Array' },
              { title: 'Valid Parentheses', difficulty: 'easy', category: 'Stack' },
              { title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', category: 'Array' },
              { title: 'Contains Duplicate', difficulty: 'easy', category: 'Array' },
              { title: 'Valid Anagram', difficulty: 'easy', category: 'String' },
            ].map((problem) => (
              <div
                key={problem.title}
                className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{problem.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {problem.category}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={problem.difficulty as 'easy' | 'medium' | 'hard'}
                  className="capitalize"
                >
                  {problem.difficulty}
                </Badge>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/problems">
                View All 75 Problems
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who have mastered coding interviews
            with Blind75 Master. Start for free today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <span className="font-semibold">Blind75 Master</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for developers, by developers.
          </p>
        </div>
      </footer>
    </div>
  );
}
