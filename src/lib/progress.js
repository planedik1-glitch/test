import { useState, useEffect } from 'react';
import { topics } from '../data/core';

function readArray(key) {
  try { const value = JSON.parse(localStorage.getItem(key) ?? '[]'); return Array.isArray(value) ? value : []; }
  catch { return []; }
}
function readCompleted() {
  const existing = readArray('astropath_lessons_v2');
  if (existing.length || localStorage.getItem('astropath_lessons_v2_migrated')) return existing;
  const old = new Set(readArray('astropath_lessons_v1'));
  return topics.flatMap(t => t.oldIndices?.flatMap((ids, i) => ids.length && ids.every(n => old.has(`${t.id}:${n}`)) ? [`${t.id}:${i}`] : []) ?? []);
}
export function usePersistentArray(key, getInitial) {
  const [value, setValue] = useState(() => getInitial ? getInitial() : readArray(key));
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.warn('Storage unavailable', e); } }, [key, value]);
  return [value, setValue];
}
export const initialCompleted = readCompleted;
export const totalLessons = topics.reduce((n, t) => n + t.points.length, 0);
export const allLessons = topics.flatMap(t => t.points.map((name, index) => ({name, index, id: t.id, section: t.name})));
export const lessonHref = item => `#lesson/${item.id}/g${item.index}`;
