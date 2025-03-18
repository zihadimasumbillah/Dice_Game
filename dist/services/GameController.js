"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const SecureRandomGenerator_1 = require("./SecureRandomGenerator");
const ProbabilityCalculator_1 = require("./ProbabilityCalculator");
const TableGenerator_1 = require("./TableGenerator");
const UserInterface_1 = require("./UserInterface");
const HmacVerifier_1 = require("./HmacVerifier");
class GameController {
    constructor(dice) {
        this.dice = dice;
        this.gameStats = { computer: 0, player: 0 };
    }
    async start() {
        this.displayRules();
        await this.playMultipleRounds();
    }
    displayRules() {
        console.log('\n╔════════════════════════════╗');
        console.log('║  Non-transitive Dice Game   ║');
        console.log('╠════════════════════════════╣');
        console.log('║ 1. Select your dice        ║');
        console.log('║ 2. Roll against computer   ║');
        console.log('║ 3. Highest number wins     ║');
        console.log('║ 4. ? - Show probabilities  ║');
        console.log('║ 5. X - Exit game          ║');
        console.log('╚════════════════════════════╝\n');
    }
    async determineFirstPlayer() {
        // Computer generates its choice first and commits with HMAC
        const computerMove = SecureRandomGenerator_1.SecureRandomGenerator.generateValue(2);
        console.log(`\nHMAC: ${computerMove.hmac}`);
        console.log('\nMake your choice (0 or 1):');
        UserInterface_1.UserInterface.displayMenu(['0', '1']);
        const userChoice = await UserInterface_1.UserInterface.getUserInput(0, 1);
        console.log(`\nComputer's choice: ${computerMove.value} (Key: ${computerMove.key})`);
        if (!HmacVerifier_1.HmacVerifier.verify(computerMove.value.toString(), computerMove.key, computerMove.hmac)) {
            throw new Error('HMAC verification failed - possible tampering detected!');
        }
        const userFirst = (computerMove.value ^ userChoice) === 1;
        console.log(`\n${userFirst ? 'You' : 'Computer'} will choose first.\n`);
        return !userFirst;
    }
    async selectDice(isComputer, excludeIndex) {
        if (isComputer) {
            const available = this.dice.filter(d => d.index !== excludeIndex);
            const move = SecureRandomGenerator_1.SecureRandomGenerator.generateValue(available.length);
            const selected = available[move.value];
            console.log(`HMAC: ${move.hmac}`);
            console.log(`Computer selected: [${selected.toString()}]`);
            if (!HmacVerifier_1.HmacVerifier.verify(move.value.toString(), move.key, move.hmac)) {
                throw new Error('HMAC verification failed - possible tampering detected!');
            }
            return selected;
        }
        else {
            console.log('\nChoose your dice:');
            const options = this.dice.map(d => d.toString());
            UserInterface_1.UserInterface.displayMenu(options, excludeIndex);
            const index = await UserInterface_1.UserInterface.getUserInput(0, this.dice.length - 1, () => TableGenerator_1.TableGenerator.generateProbabilityTable(this.dice, ProbabilityCalculator_1.ProbabilityCalculator.calculateWinProbabilities(this.dice)));
            return this.dice[index];
        }
    }
    async makeThrow() {
        const computerMove = SecureRandomGenerator_1.SecureRandomGenerator.generateValue(6);
        console.log(`\nHMAC: ${computerMove.hmac}`);
        console.log('Enter your number (0-5):');
        UserInterface_1.UserInterface.displayMenu(['0', '1', '2', '3', '4', '5']);
        const userMove = await UserInterface_1.UserInterface.getUserInput(0, 5, () => {
            console.log('\nProbability Table:');
            TableGenerator_1.TableGenerator.generateProbabilityTable(this.dice, ProbabilityCalculator_1.ProbabilityCalculator.calculateWinProbabilities(this.dice));
            console.log('');
        });
        console.log(`Computer's choice: ${computerMove.value} (Key: ${computerMove.key})`);
        if (!HmacVerifier_1.HmacVerifier.verify(computerMove.value.toString(), computerMove.key, computerMove.hmac)) {
            throw new Error('HMAC verification failed - possible tampering detected!');
        }
        return (computerMove.value + userMove) % 6;
    }
    async playRound() {
        const computerFirst = await this.determineFirstPlayer();
        const firstDice = await this.selectDice(computerFirst);
        const secondDice = await this.selectDice(!computerFirst, firstDice.index);
        const firstThrow = await this.makeThrow();
        const secondThrow = await this.makeThrow();
        const firstValue = firstDice.values[firstThrow];
        const secondValue = secondDice.values[secondThrow];
        console.log(`\nFirst player rolled: ${firstValue}`);
        console.log(`Second player rolled: ${secondValue}`);
        if (firstValue > secondValue) {
            this.gameStats[computerFirst ? 'computer' : 'player']++;
            console.log(`${computerFirst ? 'Computer' : 'You'} win!`);
        }
        else if (secondValue > firstValue) {
            this.gameStats[computerFirst ? 'player' : 'computer']++;
            console.log(`${computerFirst ? 'You' : 'Computer'} win!`);
        }
        else {
            console.log("It's a tie!");
        }
    }
    async playMultipleRounds() {
        let playAgain = true;
        while (playAgain) {
            await this.playRound();
            this.displayGameStats();
            playAgain = await this.askToPlayAgain();
        }
        this.displayFinalStats();
    }
    async askToPlayAgain() {
        console.log('\n=== Play Another Round? ===');
        console.log('Choose an option:');
        UserInterface_1.UserInterface.displayMenu(['Exit Game', 'Play Again']);
        const choice = await UserInterface_1.UserInterface.getUserInput(0, 1, () => {
            console.log('\n=== Current Game Statistics ===');
            this.displayDetailedStats();
            console.log('\n=== Play Another Round? ===');
            console.log('Choose an option:');
            UserInterface_1.UserInterface.displayMenu(['Exit Game', 'Play Again']);
        });
        if (choice === 0) {
            console.log('\nThanks for playing!');
            this.displayFinalStats();
            return false;
        }
        console.log('\n=== Starting New Round ===');
        return true;
    }
    displayDetailedStats() {
        const total = this.gameStats.computer + this.gameStats.player;
        const ratio = this.gameStats.player / (total || 1);
        console.log('\nGame Statistics:');
        console.log('─'.repeat(40));
        console.log(`Total Games Played: ${total}`);
        console.log(`Computer Wins:      ${this.gameStats.computer}`);
        console.log(`Player Wins:        ${this.gameStats.player}`);
        console.log(`Win Ratio:          ${(ratio * 100).toFixed(1)}%`);
        console.log('─'.repeat(40));
    }
    displayFinalStats() {
        console.log('\n═══════════════════════════════');
        console.log('       FINAL STATISTICS         ');
        console.log('═══════════════════════════════');
        this.displayDetailedStats();
        console.log('═══════════════════════════════');
    }
    displayGameStats() {
        console.log('\n=== Game Statistics ===');
        console.log(`Computer wins: ${this.gameStats.computer}`);
        console.log(`Player wins: ${this.gameStats.player}`);
        console.log(`Win ratio: ${(this.gameStats.player /
            (this.gameStats.computer + this.gameStats.player || 1)).toFixed(2)}`);
    }
}
exports.GameController = GameController;
