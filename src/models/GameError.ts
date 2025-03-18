export class GameError extends Error {
    protected constructor(
        message: string,
        public readonly example?: string
    ) {
        super([
            message,
            example && `Example: ${example}`
        ].filter(Boolean).join('\n'));
        this.name = 'GameError';
    }

    static invalidDiceCount(count: number): GameError {
        return new GameError(
            `Invalid number of dice: ${count}. At least 3 dice are required.`,
            '2,2,4,4,9,9 1,1,6,6,8,8 3,3,5,5,7,7'
        );
    }

    static invalidDiceFormat(diceIndex: number, values: string): GameError {
        return new GameError(
            `Invalid dice #${diceIndex + 1} format: ${values}\nEach dice must have exactly 6 integer values.`,
            '2,2,4,4,9,9'
        );
    }

    static nonIntegerValue(diceIndex: number, value: string): GameError {
        return new GameError(
            `Non-integer value found in dice #${diceIndex + 1}: ${value}\nAll values must be integers.`
        );
    }

    static hmacVerificationFailed(): GameError {
        return new GameError('HMAC verification failed - possible tampering detected!');
    }
}