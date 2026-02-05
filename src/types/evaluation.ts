export type EvalLanguage = 'en' | 'hi';

// Backend response types
export interface IncorrectQuestion {
  question_id: string;
  question: string;
  error_summary: string;
  error_explanation: string;
  correct_solution: string;
  final_answer: string;
  question_number?: string; // e.g., "Question 2" from backend
}

export interface EvaluationSummary {
  total_questions: number;
  incorrect_questions: number;
}

export interface EvaluateResponse {
  evaluation_id: string;
  summary: EvaluationSummary;
  incorrect_questions: IncorrectQuestion[];
}

// History types
export interface HistoryItem {
  evaluation_id: string;
  created_at: string;
  total_questions: number;
  incorrect_count: number;
}
