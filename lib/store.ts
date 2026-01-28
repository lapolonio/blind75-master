import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FilterOptions, Language, SortOption, ProgressStatus } from '@/types/problem';

interface EditorState {
  language: Language;
  code: Record<string, Record<Language, string>>; // problemSlug -> language -> code
  setLanguage: (language: Language) => void;
  setCode: (problemSlug: string, language: Language, code: string) => void;
  getCode: (problemSlug: string, language: Language, defaultCode: string) => string;
  resetCode: (problemSlug: string, language: Language, defaultCode: string) => void;
}

interface FilterState {
  filters: FilterOptions;
  sort: SortOption;
  setFilters: (filters: Partial<FilterOptions>) => void;
  setSort: (sort: SortOption) => void;
  resetFilters: () => void;
}

interface ProgressState {
  localProgress: Record<string, { status: ProgressStatus; attempts: number }>;
  setLocalProgress: (problemId: string, status: ProgressStatus, attempts: number) => void;
  getLocalProgress: (problemId: string) => { status: ProgressStatus; attempts: number } | undefined;
}

interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

interface UIState {
  sidebarOpen: boolean;
  editorFullscreen: boolean;
  activeTab: 'description' | 'solution' | 'discuss';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setEditorFullscreen: (fullscreen: boolean) => void;
  setActiveTab: (tab: 'description' | 'solution' | 'discuss') => void;
}

const defaultFilters: FilterOptions = {
  difficulty: 'all',
  category: 'all',
  pattern: 'all',
  status: 'all',
  search: '',
};

const defaultSort: SortOption = {
  field: 'order',
  direction: 'asc',
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      language: 'javascript',
      code: {},
      setLanguage: (language) => set({ language }),
      setCode: (problemSlug, language, code) =>
        set((state) => ({
          code: {
            ...state.code,
            [problemSlug]: {
              ...state.code[problemSlug],
              [language]: code,
            },
          },
        })),
      getCode: (problemSlug, language, defaultCode) => {
        const state = get();
        return state.code[problemSlug]?.[language] ?? defaultCode;
      },
      resetCode: (problemSlug, language, defaultCode) =>
        set((state) => ({
          code: {
            ...state.code,
            [problemSlug]: {
              ...state.code[problemSlug],
              [language]: defaultCode,
            },
          },
        })),
    }),
    {
      name: 'blind75-editor',
    }
  )
);

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      sort: defaultSort,
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      setSort: (sort) => set({ sort }),
      resetFilters: () => set({ filters: defaultFilters, sort: defaultSort }),
    }),
    {
      name: 'blind75-filters',
    }
  )
);

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      localProgress: {},
      setLocalProgress: (problemId, status, attempts) =>
        set((state) => ({
          localProgress: {
            ...state.localProgress,
            [problemId]: { status, attempts },
          },
        })),
      getLocalProgress: (problemId) => get().localProgress[problemId],
    }),
    {
      name: 'blind75-progress',
    }
  )
);

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'blind75-theme',
    }
  )
);

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  editorFullscreen: false,
  activeTab: 'description',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setEditorFullscreen: (fullscreen) => set({ editorFullscreen: fullscreen }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
