"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInterface = void 0;
const readline = __importStar(require("readline"));
const chalk_1 = __importDefault(require("chalk"));
class UserInterface {
    static async getUserInput(min, max, displayCallback) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return new Promise((resolve) => {
            rl.question(chalk_1.default.cyan('Your selection: '), async (answer) => {
                rl.close();
                if (answer.toLowerCase() === 'x') {
                    console.log(chalk_1.default.yellow('\nGame ended by user.'));
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
                    console.log(chalk_1.default.red(`\nInvalid input! Please enter a number between ${min} and ${max}`));
                    const result = await this.getUserInput(min, max, displayCallback);
                    resolve(result);
                    return;
                }
                resolve(num);
            });
        });
    }
    static displayMenu(options, excludeIndex) {
        console.log('─'.repeat(40));
        options.forEach((opt, i) => {
            if (excludeIndex === undefined || i !== excludeIndex) {
                console.log(chalk_1.default.cyan(`${i} - ${opt}`));
            }
        });
        console.log(chalk_1.default.yellow('X - Exit Game'));
        console.log(chalk_1.default.blue('? - Show Help'));
        console.log('─'.repeat(40));
    }
}
exports.UserInterface = UserInterface;
