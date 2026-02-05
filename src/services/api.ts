import { EvaluateResponse, HistoryItem } from '../types/evaluation';

const API_BASE_URL = ''; // Android emulator localhost
// const API_BASE_URL = 'http://localhost:8000'; // iOS simulator

class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    async evaluate(questionImageBase64: string, answerImageBase64: string): Promise<EvaluateResponse> {
        const response = await fetch(`${this.baseUrl}/api/evaluate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question_image: questionImageBase64,
                answer_image: answerImageBase64,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(error.error || `API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform backend response to match frontend types
        return {
            evaluation_id: data.evaluation_id,
            summary: {
                total_questions: data.total_questions,
                incorrect_questions: data.incorrect_count,
            },
            incorrect_questions: data.tabs.map((tab: any) => ({
                question_id: tab.tab_id,
                question: tab.question,
                error_summary: tab.error_summary,
                error_explanation: tab.error_explanation,
                correct_solution: tab.correct_solution,
                final_answer: tab.final_answer,
                question_number: tab.title, // e.g., "Question 2"
            })),
        };
    }

    async getHistory(limit: number = 10): Promise<HistoryItem[]> {
        const response = await fetch(`${this.baseUrl}/api/evaluations?limit=${limit}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        return data.evaluations.map((e: any) => ({
            evaluation_id: e.evaluation_id,
            created_at: e.created_at,
            total_questions: e.total_questions,
            incorrect_count: e.incorrect_count,
        }));
    }

    async getEvaluation(evaluationId: string): Promise<EvaluateResponse> {
        const response = await fetch(`${this.baseUrl}/api/evaluations/${evaluationId}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        return {
            evaluation_id: data.evaluation_id,
            summary: {
                total_questions: data.total_questions,
                incorrect_questions: data.incorrect_count,
            },
            incorrect_questions: data.tabs.map((tab: any) => ({
                question_id: tab.tab_id,
                question: tab.question,
                error_summary: tab.error_summary,
                error_explanation: tab.error_explanation,
                correct_solution: tab.correct_solution,
                final_answer: tab.final_answer,
                question_number: tab.title, // e.g., "Question 2"
            })),
        };
    }
}

export const apiService = new ApiService();
