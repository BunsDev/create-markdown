'use client';

import { useTheme } from '../theme-context';
import { VERSION } from '../../../dist/index.js';
import { LogoMark } from './logo';

export interface FloatingActionsProps {
  onExport: () => void;
  onClear: () => void;
  blockCount: number;
}

export function FloatingActions({ onExport, onClear, blockCount }: FloatingActionsProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Top left - Logo and info */}
      <div className="floating-header">
        <a 
          href="https://github.com/BunsDev/create-markdown" 
          target="_blank" 
          rel="noopener noreferrer"
          className="floating-logo-link"
          title="View on GitHub"
        >
          <LogoMark size={20} />
          <span className="floating-logo-text">create-markdown</span>
        </a>
        <span className="floating-badge">v{VERSION}</span>
        <span className="floating-badge">{blockCount} blocks</span>
      </div>

      {/* Top right - Actions */}
      <div className="floating-actions">
        <button
          className="floating-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <button
          className="floating-btn"
          onClick={onClear}
          title="New document"
        >
          <PlusIcon />
        </button>
        <button
          className="floating-btn floating-btn-primary"
          onClick={onExport}
          title="Export as Markdown"
        >
          <DownloadIcon />
          <span>Export</span>
        </button>
      </div>
    </>
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

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default FloatingActions;
