"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProbabilityCalculator = void 0;
class ProbabilityCalculator {
    static calculateWinProbabilities(dice) {
        const probabilities = [];
        for (let i = 0; i < dice.length; i++) {
            probabilities[i] = [];
            for (let j = 0; j < dice.length; j++) {
                if (i === j) {
                    probabilities[i][j] = this.calculateSameDiceProbability(dice[i]);
                    continue;
                }
                let wins = 0;
                const total = 36;
                for (const v1 of dice[i].values) {
                    for (const v2 of dice[j].values) {
                        if (v1 > v2)
                            wins++;
                    }
                }
                probabilities[i][j] = wins / total;
            }
        }
        return probabilities;
    }
    static calculateSameDiceProbability(dice) {
        let wins = 0;
        const total = 36;
        for (const v1 of dice.values) {
            for (const v2 of dice.values) {
                if (v1 > v2)
                    wins++;
            }
        }
        return wins / total;
    }
}
exports.ProbabilityCalculator = ProbabilityCalculator;
