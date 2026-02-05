import { EvaluationResult } from '../types/evaluation';

const STORAGE_KEY = 'EVALUATION_HISTORY';

export const saveEvaluation = async (evaluation: EvaluationResult) => {
    // Placeholder for storage logic (e.g., AsyncStorage)
    console.log('Saving evaluation:', evaluation);
};

export const getHistory = async (): Promise<EvaluationResult[]> => {
    // Placeholder for storage logic
    return [];
};
