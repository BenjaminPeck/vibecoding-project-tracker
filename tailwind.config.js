/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { primary: '#4338CA', accent: '#3730A3' },
        surface: { page: '#F8F7F4', card: '#FFFFFF', column: '#F0EFEB', hover: '#E8E6F2' },
        text: { primary: '#24232B', muted: '#625F6B' },
        border: { subtle: '#DEDCE2', control: '#807B89' },
        stage: { todo: '#EDE9FE', progress: '#DBEAFE', review: '#FEF3C7', done: '#DCFCE7' },
        type: { feature: '#5B21B6', 'feature-soft': '#F3E8FF', bug: '#9D174D', 'bug-soft': '#FCE7F3' },
        due: {
          safe: '#166534', 'safe-soft': '#F0FDF4',
          warning: '#854D0E', 'warning-soft': '#FEF9C3',
          overdue: '#991B1B', 'overdue-soft': '#FEE2E2',
          neutral: '#475569', 'neutral-soft': '#F1F5F9',
        },
        // Keep starter utility names compatible with the chosen type palette.
        feature: '#5B21B6',
        bug: '#9D174D',
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
