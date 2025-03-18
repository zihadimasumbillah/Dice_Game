import { Dice } from '../models/Dice';
import chalk from 'chalk';

export class TableGenerator {
    static generateProbabilityTable(dice: Dice[], probabilities: number[][]): void {
        console.log('\nProbability of the win for the user:');
        
 
        const maxWidth = Math.max(
            13,  
            ...dice.map(d => d.toString().length + 2),
            'User dice v'.length + 2
        );
        
        const line = '+' + '─'.repeat(maxWidth) + 
            dice.map(() => '+' + '─'.repeat(maxWidth)).join('') + '+';
            

        console.log(line);
        const header = ['User dice v', ...dice.map(d => d.toString())]
            .map(text => this.padCenter(text, maxWidth))
            .join('|');
        console.log(`|${chalk.cyan(header)}|`);
        console.log(line);
        

        for (let i = 0; i < dice.length; i++) {
            const cells = [dice[i].toString()];
            for (let j = 0; j < dice.length; j++) {
                const prob = probabilities[i][j];
                const value = i === j ? 
                    `- (${(prob * 100).toFixed(4)})` : 
                    (prob * 100).toFixed(4);
                cells.push(value);
            }
            console.log('|' + cells.map(cell => this.padCenter(cell, maxWidth)).join('|') + '|');
            console.log(line);
        }
    }

    private static padCenter(text: string, width: number): string {
        const padding = width - text.length;
        const left = Math.floor(padding / 2);
        const right = padding - left;
        return ' '.repeat(left) + text + ' '.repeat(right);
    }

    static generateGameFlowTable(): void {
        console.log('\n=== Game Flow ===');
        const headers = ['Step', 'Computer', 'User'];
        const rows = [
            ['1', 'Generates random x ∈ {0..5}', ''],
            ['2', 'Generates secure key', ''],
            ['3', 'Shows HMAC(key, x)', ''],
            ['4', '', 'Picks y ∈ {0..5}'],
            ['5', 'Calculates (x + y) % 6', ''],
            ['6', 'Reveals x and key', '']
        ];

        const colWidths = [
            Math.max(...[headers[0], ...rows.map(r => r[0])].map(s => s.length)),
            Math.max(...[headers[1], ...rows.map(r => r[1])].map(s => s.length)),
            Math.max(...[headers[2], ...rows.map(r => r[2])].map(s => s.length))
        ];


        console.log('┌' + colWidths.map(w => '─'.repeat(w + 2)).join('┬') + '┐');
        console.log(
            '│' + 
            headers.map((h, i) => this.padCenter(h, colWidths[i] + 2)).join('│') +
            '│'
        );
        console.log('├' + colWidths.map(w => '─'.repeat(w + 2)).join('┼') + '┤');

 
        rows.forEach((row, idx) => {
            console.log(
                '│' + 
                row.map((cell, i) => this.padCenter(cell, colWidths[i] + 2)).join('│') +
                '│'
            );
            if (idx < rows.length - 1) {
                console.log('├' + colWidths.map(w => '─'.repeat(w + 2)).join('┼') + '┤');
            }
        });
        console.log('└' + colWidths.map(w => '─'.repeat(w + 2)).join('┴') + '┘\n');
    }
}