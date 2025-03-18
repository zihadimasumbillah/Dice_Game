"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dice = void 0;
class Dice {
    constructor(values, index) {
        this.values = values;
        this.index = index;
    }
    static fromString(str, index) {
        const values = str.split(',').map(Number);
        if (values.length !== 6 || values.some(v => !Number.isInteger(v))) {
            throw new Error(`Invalid dice #${index + 1}. Each dice must have 6 integer values.`);
        }
        return new Dice(values, index);
    }
    toString() {
        return this.values.join(',');
    }
}
exports.Dice = Dice;
