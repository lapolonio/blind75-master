'use client';

import { useEffect, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useEditorStore, useThemeStore } from '@/lib/store';
import { Language, StarterCode } from '@/types/problem';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

interface CodeEditorProps {
  problemSlug: string;
  starterCode: StarterCode;
  onCodeChange?: (code: string) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const languageConfig: Record<
  Language,
  { label: string; monacoLanguage: string }
> = {
  javascript: { label: 'JavaScript', monacoLanguage: 'javascript' },
  python: { label: 'Python', monacoLanguage: 'python' },
  typescript: { label: 'TypeScript', monacoLanguage: 'typescript' },
};

export function CodeEditor({
  problemSlug,
  starterCode,
  onCodeChange,
  isFullscreen = false,
  onToggleFullscreen,
}: CodeEditorProps) {
  const { language, setLanguage, getCode, setCode, resetCode } = useEditorStore();
  const { theme } = useThemeStore();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const currentCode = getCode(problemSlug, language, starterCode[language]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(problemSlug, language, value);
      onCodeChange?.(value);
    }
  };

  const handleReset = () => {
    resetCode(problemSlug, language, starterCode[language]);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  useEffect(() => {
    // When language changes, ensure code is loaded
    const code = getCode(problemSlug, language, starterCode[language]);
    onCodeChange?.(code);
  }, [language, problemSlug, starterCode, getCode, onCodeChange]);

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(languageConfig).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          {onToggleFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullscreen}
              className="h-8"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={languageConfig[language].monacoLanguage}
          value={currentCode}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 16, bottom: 16 },
            suggest: {
              showKeywords: true,
              showSnippets: true,
            },
          }}
        />
      </div>
    </div>
  );
}
