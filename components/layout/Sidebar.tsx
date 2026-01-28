'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ListTodo,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/store';

const navItems = [
  {
    title: 'Problems',
    href: '/problems',
    icon: ListTodo,
  },
  {
    title: 'Progress',
    href: '/progress',
    icon: BarChart3,
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] border-r bg-background transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname === item.href || pathname.startsWith(item.href + '/')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5', sidebarOpen && 'mr-3')} />
              {sidebarOpen && <span>{item.title}</span>}
            </Link>
          ))}
        </div>

        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? (
              <>
                <ChevronLeft className="h-5 w-5 mr-3" />
                <span>Collapse</span>
              </>
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
