import { TEAM } from './tasks.js';

export const TEAM_KEY = 'vibetracker.team';
export const TEAM_PROFILES_KEY = 'vibetracker.team-profiles';

export function validateProfile(profile) {
  if (!profile || typeof profile.email !== 'string' || typeof profile.gitlab !== 'string') throw new Error('Member details are invalid.');
  const email = profile.email.trim();
  const gitlab = profile.gitlab.trim();
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) throw new Error('Enter a valid email address.');
  if (gitlab) {
    let url;
    try { url = new URL(gitlab); } catch { throw new Error('Enter a valid GitLab profile URL.'); }
    if (url.protocol !== 'https:' || url.hostname !== 'gitlab.com' || url.pathname === '/' || url.username || url.password) throw new Error('Use an https://gitlab.com profile URL.');
  }
  return { email, gitlab };
}

export function loadProfiles(storage) {
  const raw = storage.getItem(TEAM_PROFILES_KEY);
  if (raw === null) return {};
  const data = JSON.parse(raw);
  if (!data || Array.isArray(data) || typeof data !== 'object') throw new Error('Saved member details are invalid.');
  return Object.fromEntries(Object.entries(data).map(([name, profile]) => [name, validateProfile(profile)]));
}

export function saveProfiles(storage, profiles) {
  const checked = Object.fromEntries(Object.entries(profiles).map(([name, profile]) => [name, validateProfile(profile)]));
  storage.setItem(TEAM_PROFILES_KEY, JSON.stringify(checked));
}

export function validateTeam(members) {
  if (!Array.isArray(members) || members.length === 0 || members.length > 50 || members.some(name => typeof name !== 'string' || name.trim() !== name || name.length < 2 || name.length > 60 || !name.trim()) || new Set(members.map(name => name.toLocaleLowerCase())).size !== members.length) {
    throw new Error('Saved team data is invalid.');
  }
  return members;
}

export function loadTeam(storage) {
  const raw = storage.getItem(TEAM_KEY);
  return raw === null ? [...TEAM] : validateTeam(JSON.parse(raw));
}

export function saveTeam(storage, members) {
  storage.setItem(TEAM_KEY, JSON.stringify(validateTeam(members)));
}
