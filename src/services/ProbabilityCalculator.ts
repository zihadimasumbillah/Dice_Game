import { Dice } from '../models/Dice';

export class ProbabilityCalculator {
    static calculateWinProbabilities(dice: Dice[]): number[][] {
        const probabilities: number[][] = [];
        
        for (let i = 0; i < dice.length; i++) {
            probabilities[i] = [];
            for (let j = 0; j < dice.length; j++) {
                if (i === j) {
                    probabilities[i][j] = 1/3; 
                    continue;
                }
                
                let wins = 0;
                const total = dice[i].values.length * dice[j].values.length;
                
                for (const v1 of dice[i].values) {
                    for (const v2 of dice[j].values) {
                        if (v1 > v2) wins++;
                    }
                }
                
                probabilities[i][j] = wins / total;
            }
        }
        return probabilities;
    }
}