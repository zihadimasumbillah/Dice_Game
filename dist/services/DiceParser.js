"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiceParser = void 0;
const Dice_1 = require("../models/Dice");
class DiceParser {
    static parse(diceStrings) {
        if (diceStrings.length < 3) {
            throw new Error('At least 3 dice required. Example: 1,2,3,4,5,6 2,3,4,5,6,1 3,4,5,6,1,2');
        }
        return diceStrings.map((str, index) => Dice_1.Dice.fromString(str, index));
    }
}
exports.DiceParser = DiceParser;
