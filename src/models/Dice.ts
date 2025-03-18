export class Dice {
    constructor(
        public readonly values: number[],
        public readonly index: number
    ) {}

    static fromString(str: string, index: number): Dice {
        const values = str.split(',').map(Number);
        if (values.length !== 6 || values.some(v => !Number.isInteger(v))) {
            throw new Error(`Invalid dice #${index + 1}. Each dice must have 6 integer values.`);
        }
        return new Dice(values, index);
    }

    toString(): string {
        return this.values.join(',');
    }
}