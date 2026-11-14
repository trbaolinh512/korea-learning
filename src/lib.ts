import { useEffect, useState } from 'react';
import type { Card, Question } from './types';
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? initial; } catch { return initial; } });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage may be disabled. */ } }, [key, value]);
  return [value, setValue] as const;
}
export function makeQuestions(cards: Card[], kind = 'read'): Question[] {
  return shuffle(cards).map(c => ({ id: c.id, kind, question: kind === 'listen' ? 'Nghe và chọn nghĩa đúng' : 'Chọn nghĩa / cách đọc phù hợp', prompt: kind === 'listen' ? '' : c.char, audio: kind === 'listen' ? c.char : '', options: shuffle([c.viet, ...shuffle([...new Set(cards.map(w => w.viet))].filter(w => w !== c.viet)).slice(0, 3)]), answer: c.viet, explain: `${c.char} → ${c.viet}${c.desc ? ` · ${c.desc}` : ''}` }));
}
export const clockText = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(seconds % 60).padStart(2,'0')}`;
export const normalize = (text: string) => text.trim().normalize('NFC').replace(/[\s.,!?。！？]+/g, '');
export function sectionScore(questions: Question[], answers: Record<number,string>, kind: string) {
  const group = questions.map((q,i) => ({q,i})).filter(({q}) => q.kind === kind);
  return group.length ? Math.round(group.filter(({q,i}) => answers[i] === q.answer).length / group.length * 100) : 0;
}
