@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base styles */
html {
  scroll-behavior: smooth;
}

body {
  @apply antialiased;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Font mono for numbers */
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
}

/* Glassmorphism effects */
.glass {
  @apply bg-white/10 backdrop-blur-xl border border-white/20;
}

/* Animations */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  background: linear-gradient(90deg, 
    rgba(255,255,255,0) 0%, 
    rgba(255,255,255,0.1) 50%, 
    rgba(255,255,255,0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* Recharts custom styles */
.recharts-cartesian-grid-horizontal line,
.recharts-cartesian-grid-vertical line {
  stroke: rgba(255, 255, 255, 0.05);
}

.recharts-tooltip-wrapper {
  outline: none !important;
}

/* Focus styles */
button:focus-visible,
a:focus-visible {
  @apply outline-none ring-2 ring-white/50 ring-offset-2 ring-offset-transparent;
}

/* Shadow utilities */
.shadow-glow {
  box-shadow: 0 0 40px -10px rgba(255, 255, 255, 0.15);
}
