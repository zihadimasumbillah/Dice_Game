import * as crypto from 'crypto';

export class SecureRandomGenerator {
    static generateValue(max: number): { value: number; hmac: string; key: string } {

        const key = crypto.randomBytes(32).toString('hex').toUpperCase();
        
        const value = this.getUniformRandom(0, max - 1);
        
        const hmac = crypto.createHmac('sha3-256', key)
            .update(value.toString())
            .digest('hex')
            .toUpperCase();
            
        return { value, hmac, key };
    }

    private static getUniformRandom(min: number, max: number): number {
        const range = max - min + 1;
        const bitsNeeded = Math.ceil(Math.log2(range));
        const bytesNeeded = Math.ceil(bitsNeeded / 8);
        const maxValid = Math.pow(2, bitsNeeded) - (Math.pow(2, bitsNeeded) % range);
        
        let value: number;
        do {
            const bytes = crypto.randomBytes(bytesNeeded);
            value = bytes.reduce((acc, byte) => (acc << 8) + byte, 0);
        } while (value >= maxValid);
        
        return min + (value % range);
    }
}