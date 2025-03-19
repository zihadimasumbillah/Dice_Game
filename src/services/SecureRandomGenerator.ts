import * as crypto from 'crypto';

export class SecureRandomGenerator {
    static generateValue(max: number): { value: number; hmac: string; key: string } {
        const key = crypto.randomBytes(32).toString('hex').toUpperCase();
        const value = crypto.randomInt(0, max);
        
        const hmac = crypto.createHmac('sha3-256', key)
            .update(value.toString())
            .digest('hex')
            .toUpperCase();
            
        return { value, hmac, key };
    }
}