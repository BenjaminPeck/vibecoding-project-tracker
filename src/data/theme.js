export const THEME_KEY = 'vibecoding-theme';

export function loadTheme(storage) {
  try { return storage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'; }
  catch { return 'light'; }
}

export function saveTheme(storage, theme) {
  try { storage.setItem(THEME_KEY, theme); return true; }
  catch { return false; }
}

export function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}
