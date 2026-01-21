'use client';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 28, className = '' }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="create-markdown logo"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#6366f1' }} />
          <stop offset="100%" style={{ stopColor: '#a5b4fc' }} />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#818cf8' }} />
          <stop offset="100%" style={{ stopColor: '#c7d2fe' }} />
        </linearGradient>
      </defs>
      
      {/* Document shape with rounded corners */}
      <rect x="4" y="2" width="32" height="36" rx="4" fill="url(#logoGradient)" />
      
      {/* Folded corner effect */}
      <path d="M28 2L36 10L28 10L28 2Z" fill="#4f46e5" opacity="0.6" />
      
      {/* Markdown "M" stylized */}
      <path 
        d="M10 28V16L14 22L18 16V28" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Down arrow (markdown indicator) */}
      <path 
        d="M24 16V26M24 26L21 23M24 26L27 23" 
        stroke="url(#accentGradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Hash symbol hint (subtle) */}
      <rect x="8" y="10" width="6" height="1.5" rx="0.75" fill="white" opacity="0.5" />
      <rect x="8" y="13" width="10" height="1.5" rx="0.75" fill="white" opacity="0.3" />
    </svg>
  );
}

export function LogoMark({ size = 20, className = '' }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="create-markdown"
    >
      <defs>
        <linearGradient id="markGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#6366f1' }} />
          <stop offset="100%" style={{ stopColor: '#a5b4fc' }} />
        </linearGradient>
      </defs>
      
      {/* Rounded square base */}
      <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#markGradient)" />
      
      {/* Stylized "M" for markdown */}
      <path 
        d="M8 22V12L12 17L16 12V22" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Down arrow */}
      <path 
        d="M21 12V20M21 20L18.5 17.5M21 20L23.5 17.5" 
        stroke="rgba(255,255,255,0.8)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default Logo;
