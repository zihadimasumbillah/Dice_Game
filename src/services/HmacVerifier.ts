import * as crypto from 'crypto';

export class HmacVerifier {
    static verify(value: string, key: string, expectedHmac: string): boolean {
        const calculatedHmac = crypto.createHmac('sha3-256', key.toUpperCase())
            .update(value)
            .digest('hex')
            .toUpperCase();
        return calculatedHmac === expectedHmac.toUpperCase();
    }

    static displayChoice(value: string, key: string): void {
        console.log(`Computer's choice: ${value} (Key: ${key})`);
    }
}