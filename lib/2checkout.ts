import crypto from 'crypto';

/**
 * 2Checkout (Verifone) Utility for Secure Checkout
 */

const MERCHANT_CODE = process.env.TWO_CHECKOUT_MERCHANT_CODE;
const SECRET_KEY = process.env.TWO_CHECKOUT_SECRET_KEY;
const INS_SECRET = process.env.TWO_CHECKOUT_INS_SECRET;

/**
 * Generates a signature for 2Checkout ConvertPlus Buy-Links (Dynamic Products)
 * Uses HMAC-SHA256 with alphabetical sorting and length-prefix serialization
 */
export function generate2CheckoutSignature(params: Record<string, string>) {
    const signatureSecret = process.env.TWO_CHECKOUT_SECRET_KEY;
    if (!signatureSecret) throw new Error('TWO_CHECKOUT_SECRET_KEY is missing');

    // Remove 'merchant' and 'signature' from signing if present
    const { merchant, signature, ...signableParams } = params;

    const sortedKeys = Object.keys(signableParams).sort();
    let dataString = '';

    for (const key of sortedKeys) {
        const value = signableParams[key].toString();
        dataString += value.length + value;
    }

    return crypto
        .createHmac('sha256', signatureSecret)
        .update(dataString)
        .digest('hex');
}

/**
 * Constructs a secure ConvertPlus Buy-Link URL
 */
export function build2CheckoutUrl(orderId: string, total: number, currency: string = 'USD') {
    const merchantCode = process.env.TWO_CHECKOUT_MERCHANT_CODE;
    if (!merchantCode) throw new Error('TWO_CHECKOUT_MERCHANT_CODE is missing');

    const params: Record<string, string> = {
        'external-reference': orderId,
        'currency': currency,
        'prod': 'Order #' + orderId,
        'price': total.toString(),
        'qty': '1',
        'type': 'PRODUCT',
        'return-type': 'redirect',
        'return-url': process.env.NEXT_PUBLIC_SITE_URL + '/checkout/success'
    };

    const signature = generate2CheckoutSignature(params);

    const queryParams = new URLSearchParams({
        ...params,
        'merchant': merchantCode,
        'signature': signature
    });

    return `https://secure.2checkout.com/checkout/buy?${queryParams.toString()}`;
}

/**
 * Verifies the Instant Notification Service (INS) signature
 * 2Checkout sends a signature in the 'x-webhook-signature' header or similar
 * Default modern INS uses HMAC-SHA256 of the raw body
 */
export async function verify2CheckoutINS(rawBody: string, signature: string) {
    const insSecret = process.env.TWO_CHECKOUT_INS_SECRET || process.env.TWO_CHECKOUT_SECRET_KEY;
    if (!insSecret) return false;

    // Remove the 'sha256=' prefix if present
    const cleanSignature = signature.startsWith('sha256=') ? signature.split('=')[1] : signature;

    const computedSignature = crypto
        .createHmac('sha256', insSecret)
        .update(rawBody)
        .digest('hex');

    // Use constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
        Buffer.from(cleanSignature, 'hex'),
        Buffer.from(computedSignature, 'hex')
    );
}
