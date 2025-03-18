"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableGenerator = void 0;
class TableGenerator {
    static generateProbabilityTable(dice, probabilities) {
        const headerRow = ['Dice', ...dice.map(d => d.toString())];
        const maxWidth = Math.max(...headerRow.map(h => h.length));
        console.log('\n' + '='.repeat((maxWidth + 3) * (dice.length + 1)));
        console.log(headerRow.map(h => this.padCenter(h, maxWidth)).join(' | '));
        console.log('-'.repeat((maxWidth + 3) * (dice.length + 1)));
        for (let i = 0; i < dice.length; i++) {
            const row = [dice[i].toString()];
            for (let j = 0; j < dice.length; j++) {
                const prob = (probabilities[i][j] * 100).toFixed(1) + '%';
                row.push(this.padCenter(prob, maxWidth));
            }
            console.log(row.join(' | '));
        }
        console.log('='.repeat((maxWidth + 3) * (dice.length + 1)) + '\n');
    }
    static padCenter(str, width) {
        const padding = width - str.length;
        const leftPad = Math.floor(padding / 2);
        const rightPad = padding - leftPad;
        return ' '.repeat(leftPad) + str + ' '.repeat(rightPad);
    }
}
exports.TableGenerator = TableGenerator;
