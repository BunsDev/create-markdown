'use client';

import { useCallback } from 'react';
import { useTheme } from '../theme-context';
import { VERSION } from '../../../dist/index.js';
import { LogoMark } from './logo';

export type BlockTypeOption = 'paragraph' | 'h1' | 'h2' | 'h3' | 'bullet' | 'numbered' | 'quote' | 'code';

export interface ToolbarProps {
  onFormat: (format: 'bold' | 'italic' | 'code' | 'link') => void;
  onBlockType: (type: BlockTypeOption) => void;
  onExport: () => void;
  onClear: () => void;
  blockCount: number;
}

export function Toolbar({
  onFormat,
  onBlockType,
  onExport,
  onClear,
  blockCount,
}: ToolbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="toolbar">
      <div className="toolbar-left">
        <a 
          href="https://github.com/BunsDev/create-markdown" 
          target="_blank" 
          rel="noopener noreferrer"
          className="toolbar-logo-link"
          title="View on GitHub"
        >
          <LogoMark size={24} />
          <span className="toolbar-logo">create-markdown</span>
        </a>
        <span className="toolbar-version">v{VERSION}</span>
        <span className="toolbar-version">{blockCount} blocks</span>
      </div>

      <div className="toolbar-center">
        {/* Inline Formatting */}
        <ToolbarButton
          onClick={() => onFormat('bold')}
          title="Bold (Cmd+B)"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onFormat('italic')}
          title="Italic (Cmd+I)"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onFormat('code')}
          title="Inline Code"
        >
          {'</>'}
        </ToolbarButton>

        <div className="toolbar-divider" />

        {/* Block Types */}
        <ToolbarButton
          onClick={() => onBlockType('h1')}
          title="Heading 1"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onBlockType('h2')}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onBlockType('quote')}
          title="Quote"
        >
          &ldquo;
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onBlockType('bullet')}
          title="Bullet List"
        >
          &bull;
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onBlockType('code')}
          title="Code Block"
        >
          {'{ }'}
        </ToolbarButton>
      </div>

      <div className="toolbar-right">
        {/* Theme Toggle */}
        <ToolbarButton
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <SunIcon />
          ) : (
            <MoonIcon />
          )}
        </ToolbarButton>

        <div className="toolbar-divider" />

        {/* Actions */}
        <ToolbarButton
          onClick={onClear}
          title="New document"
          className="toolbar-btn-text"
        >
          New
        </ToolbarButton>
        <ToolbarButton
          onClick={onExport}
          title="Export as Markdown"
          className="toolbar-btn-text toolbar-btn-primary"
        >
          Export
        </ToolbarButton>
      </div>
    </header>
  );
}

interface ToolbarButtonProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

function ToolbarButton({ onClick, title, children, className = '', active }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`toolbar-btn ${className} ${active ? 'active' : ''}`}
    >
      {children}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default Toolbar;
