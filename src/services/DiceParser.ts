import { Dice } from '../models/Dice';

export class DiceParser {
    static parse(diceStrings: string[]): Dice[] {
        if (diceStrings.length < 3) {
            throw new Error('At least 3 dice required. Example: 1,2,3,4,5,6 2,3,4,5,6,1 3,4,5,6,1,2');
        }
        return diceStrings.map((str, index) => Dice.fromString(str, index));
    }
}