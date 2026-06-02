import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { email, amount, metadata } = await req.json();

        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                amount: Math.round(amount * 100), // Paystack expects amount in kobo
                metadata,
                callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://premiumvaluemarket.com'}/checkout/success`,
            }),
        });

        const data = await response.json();

        if (!data.status) {
            return NextResponse.json({ error: data.message }, { status: 400 });
        }

        return NextResponse.json(data.data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
