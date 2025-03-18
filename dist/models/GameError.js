"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameError = void 0;
class GameError extends Error {
    constructor(message, example) {
        super([
            message,
            example ? `Example: ${example}` : undefined
        ].filter(Boolean).join('\n'));
    }
    static invalidDiceCount() {
        return new GameError('At least 3 dice are required.', '1,2,3,4,5,6 2,3,4,5,6,1 3,4,5,6,1,2');
    }
    static invalidDiceFormat(index) {
        return new GameError(`Invalid dice #${index + 1}. Each dice must have exactly 6 integer values.`, '1,2,3,4,5,6');
    }
}
exports.GameError = GameError;
