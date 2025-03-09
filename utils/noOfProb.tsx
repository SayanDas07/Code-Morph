
import { algorithms } from './algorithmData';

export const getTotalProblemsCount = (): number => {
    return algorithms.reduce((total, algorithm) => {
        return total + algorithm.problems.length;
    }, 0);
};


export const getProblemsByDifficulty = (): Record<string, number> => {
    const counts = { Easy: 0, Medium: 0, Hard: 0 };

    algorithms.forEach(algorithm => {
        algorithm.problems.forEach(problem => {
            counts[problem.difficulty]++;
        });
    });

    return counts;
};