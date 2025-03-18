# 🎲 Non-transitive Dice Game

A secure command-line implementation of a fascinating non-transitive dice game built with TypeScript. Experience fair play through cryptographic randomness and HMAC verification.


## 🌟 Overview

This game implements the intriguing concept of non-transitive dice, where dice A might beat dice B, B might beat C, but C might beat A - creating a rock-paper-scissors-like scenario with dice!

## 🎯 Key Features

- 🔒 **Cryptographic Security**
  - HMAC verification for move integrity
  - Secure random number generation
  - Tamper-proof gameplay mechanics

- 🎮 **Interactive Experience**
  - Colored console interface
  - Real-time probability calculations
  - Detailed game statistics

- 📊 **Analytics**
  - Win/loss tracking
  - Probability tables
  - Performance metrics

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Play with standard dice
npm start 1,2,3,4,5,6 2,3,4,5,6,1 3,4,5,6,1,2

# Try non-transitive set
npm start 2,2,4,4,9,9 1,1,6,6,8,8 3,3,5,5,7,7
```

## 🎮 Gameplay Guide

1. **Setup**: Choose from various dice configurations
2. **First Move**: Random determination of first player
3. **Dice Selection**: Players take turns choosing dice
4. **Rolling**: Secure random number generation for fair play
5. **Scoring**: Highest number wins the round
6. **Statistics**: View detailed stats with '?' command

## 💡 Special Commands

- `?` - Display probability tables
- `X` - Exit game
- `0-5` - Make selections during gameplay

## 🎲 Example Dice Sets

### Standard Set
```bash
npm start 1,2,3,4,5,6 1,2,3,4,5,6 1,2,3,4,5,6
```

### Non-transitive Set
```bash
npm start 2,2,4,4,9,9 1,1,6,6,8,8 3,3,5,5,7,7
```

### Four Dice Challenge
```bash
npm start 1,2,3,4,5,6 1,2,3,4,5,6 1,2,3,4,5,6 1,2,3,4,5,6
```

## 🔧 Technical Details

The game is built using modern TypeScript with several key components:

- `DiceParser`: Validates dice configurations
- `GameController`: Manages game flow
- `SecureRandomGenerator`: Ensures fair play
- `HmacVerifier`: Prevents tampering
- `ProbabilityCalculator`: Computes win chances

## 🔍 Error Handling

The game includes robust error handling for:
- Invalid dice configurations
- Incorrect parameter counts
- Non-integer values
- HMAC verification failures

## 📈 Probabilities

Access the probability table during gameplay by pressing '?' to see:
- Win rates between dice pairs
- Statistical advantages
- Strategic insights



