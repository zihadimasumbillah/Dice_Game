"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DiceParser_1 = require("./services/DiceParser");
const GameController_1 = require("./services/GameController");
async function main() {
    try {
        if (process.argv.length < 5) {
            throw new Error('At least 3 dice required. Example: npm start 1,2,3,4,5,6 2,3,4,5,6,1 3,4,5,6,1,2');
        }
        const args = process.argv.slice(2);
        const dice = DiceParser_1.DiceParser.parse(args);
        const game = new GameController_1.GameController(dice);
        await game.start();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        }
        else {
            console.error('An unexpected error occurred. Please try again.');
        }
        process.exit(1);
    }
}
main().catch((error) => {
    if (error instanceof Error) {
        console.error('Fatal error:', error.message);
    }
    else {
        console.error('Fatal error: Unknown error occurred');
    }
    process.exit(1);
});
