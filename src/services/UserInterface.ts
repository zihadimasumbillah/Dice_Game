import * as readline from 'readline';
import chalk from 'chalk';

export class UserInterface {
    static async getUserInput(min: number, max: number, displayCallback?: () => void): Promise<number> {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            rl.question('Your selection: ', async (answer: string) => {
                rl.close();
                
                if (answer.toLowerCase() === 'x') {
                    console.log('\nGame ended by user.');
                    process.exit(0);
                }
                
                if (answer === '?' && displayCallback) {
                    displayCallback();
                    const result = await this.getUserInput(min, max, displayCallback);
                    resolve(result);
                    return;
                }
                
                const num = parseInt(answer);
                if (isNaN(num) || num < min || num > max) {
                    console.log(`\nInvalid input! Please enter a number between ${min} and ${max}`);
                    const result = await this.getUserInput(min, max, displayCallback);
                    resolve(result);
                    return;
                }
                
                resolve(num);
            });
        });
    }

    static displayMenu(options: string[], excludeIndex?: number): void {
        options.forEach((opt, i) => {
            if (excludeIndex === undefined || i !== excludeIndex) {
                console.log(`${i} - ${opt}`);
            }
        });
        if (!options.includes('Exit Game')) {
            console.log('X - exit');
        }
        console.log('? - help');
    }
}