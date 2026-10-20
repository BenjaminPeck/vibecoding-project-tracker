/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { primary: 'var(--brand-primary)', accent: 'var(--brand-accent)', link: 'var(--brand-link)' },
        surface: { page: 'var(--surface-page)', card: 'var(--surface-card)', input: 'var(--surface-input)', column: 'var(--surface-column)', hover: 'var(--surface-hover)' },
        text: { primary: 'var(--text-primary)', muted: 'var(--text-muted)' },
        border: { subtle: 'var(--border-subtle)', control: 'var(--border-control)' },
        stage: { todo: 'var(--stage-todo)', progress: 'var(--stage-progress)', review: 'var(--stage-review)', done: 'var(--stage-done)' },
        type: { feature: 'var(--type-feature)', 'feature-soft': 'var(--type-feature-soft)', bug: 'var(--type-bug)', 'bug-soft': 'var(--type-bug-soft)' },
        due: {
          safe: 'var(--due-safe)', 'safe-soft': 'var(--due-safe-soft)',
          warning: 'var(--due-warning)', 'warning-soft': 'var(--due-warning-soft)',
          overdue: 'var(--due-overdue)', 'overdue-soft': 'var(--due-overdue-soft)',
          neutral: 'var(--due-neutral)', 'neutral-soft': 'var(--due-neutral-soft)',
        },
        danger: { button: '#B91C1C' },
        // Keep starter utility names compatible with the chosen type palette.
        feature: 'var(--type-feature)',
        bug: 'var(--type-bug)',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        heading: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
