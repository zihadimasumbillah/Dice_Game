import { Dice } from '../models/Dice';
import { SecureRandomGenerator } from './SecureRandomGenerator';
import { ProbabilityCalculator } from './ProbabilityCalculator';
import { TableGenerator } from './TableGenerator';
import { UserInterface } from './UserInterface';
import { HmacVerifier } from './HmacVerifier';
import { GameError } from '../models/GameError'; 

export class GameController {
    private gameStats = { computer: 0, player: 0 };

    constructor(private dice: Dice[]) {}

    async start(): Promise<void> {
        this.displayRules();
        await this.playMultipleRounds();
    }

    private displayRules(): void {
      console.log('\n╔════════════════════════════╗');
        console.log('║  Non-transitive Dice Game  ║');
        console.log('╠════════════════════════════╣');
        console.log('║ 1. Select your dice        ║');
        console.log('║ 2. Roll against computer   ║');
        console.log('║ 3. Highest number wins     ║');
        console.log('║ 4. ? - Show probabilities  ║');
        console.log('║ 5. X - Exit game           ║');
        console.log('╚════════════════════════════╝\n');
        
        TableGenerator.generateGameFlowTable();
    }

    private async determineFirstPlayer(): Promise<boolean> {
        console.log("Let's determine who makes the first move.");
        const computerMove = SecureRandomGenerator.generateValue(2);
        console.log(`I selected a random value in the range 0..1 (HMAC=${computerMove.hmac}).`);
        console.log('Try to guess my selection.');
        
        UserInterface.displayMenu(['0', '1']);
        const userChoice = await UserInterface.getUserInput(0, 1);
        
        console.log(`My selection: ${computerMove.value} (KEY=${computerMove.key}).`);
        
        if (!HmacVerifier.verify(computerMove.value.toString(), computerMove.key, computerMove.hmac)) {
            throw GameError.hmacVerificationFailed();
        }

        const userFirst = computerMove.value === userChoice;
        console.log(`${userFirst ? 'You' : 'I'} make the first move.`);
        return !userFirst;
    }

    private async selectDice(isComputer: boolean, excludeIndex?: number): Promise<Dice> {
        if (isComputer) {
            const available = this.dice.filter(d => d.index !== excludeIndex);
            const move = SecureRandomGenerator.generateValue(available.length);
            const selected = available[move.value];
            
            if (!HmacVerifier.verify(move.value.toString(), move.key, move.hmac)) {
                throw GameError.hmacVerificationFailed();
            }
            
            console.log(`I choose the [${selected.toString()}] dice.`);
            return selected;
        } else {
            console.log('Choose your dice:');
            const options = this.dice
                .filter(d => d.index !== excludeIndex)
                .map(d => d.toString());
                
            UserInterface.displayMenu(options);
            const availableDice = this.dice.filter(d => d.index !== excludeIndex);
            const index = await UserInterface.getUserInput(0, availableDice.length - 1, () => {
                const probs = ProbabilityCalculator.calculateWinProbabilities(this.dice);
                TableGenerator.generateProbabilityTable(this.dice, probs);
            });
            const selected = availableDice[index];
            
            console.log(`You choose the [${selected.toString()}] dice.`);
            return selected;
        }
    }

    private async makeThrow(isComputer: boolean): Promise<number> {
        console.log(`It's time for ${isComputer ? 'my' : 'your'} roll.`);
        const computerMove = SecureRandomGenerator.generateValue(6);
        console.log(`I selected a random value in the range 0..5 (HMAC=${computerMove.hmac}).`);
        console.log('Add your number modulo 6.');
        
        UserInterface.displayMenu(['0', '1', '2', '3', '4', '5']);
        const userMove = await UserInterface.getUserInput(0, 5);
        
        console.log(`My number is ${computerMove.value} (KEY=${computerMove.key}).`);
        const result = (computerMove.value + userMove) % 6;
        console.log(`The fair number generation result is ${computerMove.value} + ${userMove} = ${result} (mod 6).`);
        
        if (!HmacVerifier.verify(computerMove.value.toString(), computerMove.key, computerMove.hmac)) {
            throw GameError.hmacVerificationFailed();
        }
        
        return result;
    }

    private async playRound(): Promise<void> {
        const computerFirst = await this.determineFirstPlayer();
        
        const firstDice = await this.selectDice(computerFirst);
   
        const secondDice = await this.selectDice(!computerFirst, firstDice.index);

        const firstRoll = await this.makeThrow(computerFirst);
        const firstValue = firstDice.values[firstRoll];
        console.log(`${computerFirst ? 'My' : 'Your'} roll result is ${firstValue}.`);

        const secondRoll = await this.makeThrow(!computerFirst);
        const secondValue = secondDice.values[secondRoll];
        console.log(`${!computerFirst ? 'My' : 'Your'} roll result is ${secondValue}.`);

        if (firstValue > secondValue) {
            this.gameStats[computerFirst ? 'computer' : 'player']++;
            console.log(`${computerFirst ? 'I' : 'You'} win (${firstValue} > ${secondValue})!`);
        } else if (secondValue > firstValue) {
            this.gameStats[!computerFirst ? 'computer' : 'player']++;
            console.log(`${!computerFirst ? 'I' : 'You'} win (${secondValue} > ${firstValue})!`);
        } else {
            console.log(`It's a tie! (${firstValue} = ${secondValue})`);
        }
    }

    private async playMultipleRounds(): Promise<void> {
        let playAgain = true;
        while (playAgain) {
            await this.playRound();
            this.displayGameStats();
            playAgain = await this.askToPlayAgain();
        }
        this.displayFinalStats();
    }

    private async askToPlayAgain(): Promise<boolean> {
        console.log('\n=== Play Another Round? ===');
        console.log('Choose an option:');
        UserInterface.displayMenu(['Exit Game', 'Play Again']);
        
        const choice = await UserInterface.getUserInput(0, 1, () => {
            console.log('\n=== Current Game Statistics ===');
            this.displayDetailedStats();
            console.log('\n=== Play Another Round? ===');
            console.log('Choose an option:');
            UserInterface.displayMenu(['Exit Game', 'Play Again']);
        });
        
        if (choice === 0) {
            console.log('\nThanks for playing!');
            this.displayFinalStats();
            return false;
        }
        
        console.log('\n=== Starting New Round ===');
        return true;
    }

    private displayDetailedStats(): void {
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

    private displayFinalStats(): void {
        console.log('\n═══════════════════════════════');
        console.log('       FINAL STATISTICS         ');
        console.log('═══════════════════════════════');
        this.displayDetailedStats();
        console.log('═══════════════════════════════');
    }

    private displayGameStats(): void {
        console.log('\n=== Game Statistics ===');
        console.log(`Computer wins: ${this.gameStats.computer}`);
        console.log(`Player wins: ${this.gameStats.player}`);
        console.log(`Win ratio: ${(this.gameStats.player / 
            (this.gameStats.computer + this.gameStats.player || 1)).toFixed(2)}`);
    }
}