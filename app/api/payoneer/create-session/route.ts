import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { orderId, amount, email } = await req.json();

        // 1. Get credentials from env
        const USERNAME = process.env.PAYONEER_API_USERNAME || 'placeholder_user';
        const TOKEN = process.env.PAYONEER_API_TOKEN || 'placeholder_token';
        const STORE_CODE = process.env.PAYONEER_STORE_CODE || 'placeholder_store';

        // 2. Determine environment (Live vs Sandbox)
        const isLive = process.env.NODE_ENV === 'production';
        const BASE_URL = isLive 
            ? 'https://checkout.payoneer.com/api/v1' 
            : 'https://checkout.sandbox.payoneer.com/api/v1';

        // 3. Create 'LIST' request to initialize session
        // Note: Payoneer requires Basic Auth (Username:Token)
        const auth = Buffer.from(`${USERNAME}:${TOKEN}`).toString('base64');

        const response = await fetch(`${BASE_URL}/lists`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                transactionId: orderId,
                country: 'US', // Default for Global
                division: STORE_CODE,
                integration: 'HOSTED_PAGE',
                customer: {
                    email: email,
                    number: '99', // External ID
                },
                payment: {
                    amount: amount,
                    currency: 'USD',
                },
                style: {
                    language: 'en_US',
                },
                callback: {
                    returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://premiumvaluemarket.com'}/checkout/success`,
                    cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://premiumvaluemarket.com'}/checkout`,
                    notificationUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://premiumvaluemarket.com'}/api/payoneer/webhook`
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Payoneer API Error:', data);
            return NextResponse.json({ error: data.resultInfo || 'Failed to initialize session' }, { status: response.status });
        }

        // Return the redirect URL (Hosted Page)
        // Usually, Payoneer returns a 'links' object with a redirect URL in 'redirect' or 'self'
        const redirectUrl = data.links?.redirect || data.links?.self;

        return NextResponse.json({ redirectUrl });

    } catch (error) {
        console.error('Internal Server Error (Payoneer):', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
