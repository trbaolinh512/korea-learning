export interface Card { id: string; char: string; viet: string; romaja?: string; romanizationSource?:'RR'; desc?: string; category?: string; speechText?: string }
export interface Question { id: string; kind: string; question: string; prompt: string; audio?: string; options: string[]; answer: string; explain: string }
export interface Attempt { id?: string; date: string; correct: number; total: number; label: string; score?: number }
export interface Progress { day: number; completed: number[]; learned: string[]; attempts: Attempt[]; writing: Record<string,string> }
export interface ExamSession { questions: Question[]; answers: Record<number,string>; index: number; endAt: number; submitted: boolean; submittedAt?: string; mode: string; contentVersion?: number }
